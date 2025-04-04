import { WebSocket, WebSocketServer } from 'ws';
import { Server } from 'http';
import { parse } from 'url';
import env from './config/env';
import { IncomingMessage } from 'http';
import { parse as parseCookies } from 'cookie';
import { storage } from './storage';

interface AuthenticatedWebSocket extends WebSocket {
  userId?: string;
  isAlive: boolean;
  isAuthenticated: boolean;
}

interface ExtendedIncomingMessage extends IncomingMessage {
  session?: any;
}

// Map to track which users are connected to allow targeted notifications
const userConnections = new Map<string, Set<AuthenticatedWebSocket>>();

/**
 * WebSocket server setup following SOLID principles
 * - Single Responsibility: Only handles real-time communication
 * - Open/Closed: Can be extended without modifying core functionality
 * - Liskov Substitution: Uses proper interfaces for WebSocket types
 * - Interface Segregation: Defines specific interfaces for WebSocket needs
 * - Dependency Inversion: Depends on abstractions not concrete implementations
 */
export function setupWebSocketServer(server: Server) {
  console.log('Setting up WebSocket server...');
  const wss = new WebSocketServer({ noServer: true });

  // Handle WebSocket upgrade requests
  server.on('upgrade', (request: ExtendedIncomingMessage, socket, head) => {
    console.log('Upgrade request received:');
    console.log('- URL:', request.url);
    
    const { pathname } = parse(request.url || '');
    console.log('- Pathname:', pathname);

    if (pathname === '/api/notifications') {
      // Get cookies from request header
      const cookiesHeader = request.headers.cookie || '';
      const cookies = parseCookies(cookiesHeader);
      console.log('Parsed cookies:', cookies);
      
      // Get session ID
      const sessionId = cookies['connect.sid'];
      console.log('Session ID:', sessionId);

      if (!sessionId) {
        console.log('No session ID found, rejecting connection');
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
        socket.destroy();
        return;
      }

      // Additional session validation could be added here
      // For example, verify the session in your session store

      wss.handleUpgrade(request, socket, head, (ws) => {
        console.log('Upgrade successful, establishing WebSocket connection');
        const authenticatedWs = ws as AuthenticatedWebSocket;
        authenticatedWs.isAlive = true;
        authenticatedWs.isAuthenticated = false;
        
        wss.emit('connection', authenticatedWs, request);
      });
    } else {
      console.log('Invalid pathname, ignoring upgrade request');
      socket.write('HTTP/1.1 404 Not Found\r\n\r\n');
      socket.destroy();
    }
  });

  // Set up connection handling
  wss.on('connection', (ws: AuthenticatedWebSocket) => {
    console.log('New client connected');
    console.log('Total connected clients:', wss.clients.size);

    // Set up ping-pong for connection health check
    ws.on('pong', () => {
      console.log('Received pong from client');
      ws.isAlive = true;
    });

    // Handle client messages
    ws.on('message', async (message) => {
      try {
        const data = JSON.parse(message.toString());
        console.log('Received message from client:', data);
        
        // Handle authentication message
        if (data.type === 'AUTH' && data.userId) {
          ws.userId = data.userId;
          ws.isAuthenticated = true;
          console.log('Client authenticated as user:', data.userId);
          
          // Add this connection to the user's connections map
          if (!userConnections.has(data.userId)) {
            userConnections.set(data.userId, new Set());
          }
          userConnections.get(data.userId)?.add(ws);
          
          // Send a confirmation message back to the client
          ws.send(JSON.stringify({
            type: 'AUTH_SUCCESS',
            message: 'Authentication successful'
          }));
          
          // Send any pending notifications or updates
          try {
            // Use getTickets instead of getUserTickets which doesn't exist
            const ticketsResponse = await storage.getTickets(data.userId);
            // Check if ticketsResponse has a tickets array property
            if (ticketsResponse && 'tickets' in ticketsResponse && 
                Array.isArray(ticketsResponse.tickets) && ticketsResponse.tickets.length > 0) {
              ws.send(JSON.stringify({
                type: 'TICKETS_UPDATE',
                message: 'Your tickets are available',
                count: ticketsResponse.tickets.length
              }));
            }
          } catch (error) {
            console.error('Error fetching user tickets:', error);
          }
        }
      } catch (error) {
        console.error('Error processing message:', error);
        console.error('Raw message:', message.toString());
      }
    });

    // Handle client disconnection
    ws.on('close', (code, reason) => {
      console.log('Client disconnected');
      console.log('Close code:', code);
      console.log('Close reason:', reason.toString());
      console.log('Remaining connected clients:', wss.clients.size);
      
      if (ws.userId) {
        console.log('User disconnected:', ws.userId);
        // Remove from the user connections map
        const userWs = userConnections.get(ws.userId);
        if (userWs) {
          userWs.delete(ws);
          if (userWs.size === 0) {
            userConnections.delete(ws.userId);
          }
        }
      }
    });
  });

  // Set up periodic health checks
  const interval = setInterval(() => {
    console.log('Running health check. Connected clients:', wss.clients.size);
    wss.clients.forEach((ws) => {
      const client = ws as AuthenticatedWebSocket;
      if (client.isAlive === false) {
        console.log('Terminating inactive client');
        
        // If userId exists, remove from connection map
        if (client.userId) {
          const userWs = userConnections.get(client.userId);
          if (userWs) {
            userWs.delete(client);
            if (userWs.size === 0) {
              userConnections.delete(client.userId);
            }
          }
        }
        
        return client.terminate();
      }
      
      client.isAlive = false;
      client.ping();
    });
  }, 30000);

  wss.on('close', () => {
    console.log('WebSocket server closing');
    clearInterval(interval);
  });

  /**
   * Broadcasts notification to all connected clients
   * Follows Single Responsibility Principle by handling only notification broadcasting
   */
  function broadcastNotification(notification: {
    type: string;
    message: string;
    notificationType?: 'info' | 'success' | 'warning' | 'error';
    taskId?: string;
    ticketId?: string;
    task?: any;
  }) {
    console.log('Broadcasting notification:', notification);
    console.log('Number of connected clients:', wss.clients.size);
    
    // If notification has ticketId, try to send to specific users who own that ticket
    if (notification.ticketId) {
      // Find users who should receive this notification based on ticketId
      // This requires additional logic to determine which users are associated with the ticket
      // For now, broadcast to all as a fallback
    }
    
    // Broadcast to all connected clients
    wss.clients.forEach((client) => {
      const authClient = client as AuthenticatedWebSocket;
      if (authClient.readyState === WebSocket.OPEN && authClient.isAuthenticated) {
        console.log('Sending notification to client');
        client.send(JSON.stringify(notification));
      } else {
        console.log('Client not ready or not authenticated:', 
          'State:', authClient.readyState, 
          'Authenticated:', authClient.isAuthenticated);
      }
    });
  }

  return {
    wss,
    broadcastNotification,
  };
}