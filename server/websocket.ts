import { WebSocket, WebSocketServer } from 'ws';
import { Server } from 'http';
import { parse } from 'url';
import env from './config/env';

interface AuthenticatedWebSocket extends WebSocket {
  userId?: string;
  isAlive: boolean;
}

export function setupWebSocketServer(server: Server) {
  const wss = new WebSocketServer({ noServer: true });

  // Handle WebSocket upgrade requests
  server.on('upgrade', (request, socket, head) => {
    const { pathname } = parse(request.url || '');

    if (pathname === '/api/notifications') {
      // Get session ID from cookie
      const cookies = request.headers.cookie?.split(';')
        .map(cookie => cookie.trim())
        .reduce((acc: { [key: string]: string }, cookie) => {
          const [key, value] = cookie.split('=');
          acc[key] = value;
          return acc;
        }, {});

      const sessionId = cookies?.['connect.sid'];

      if (!sessionId) {
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
        socket.destroy();
        return;
      }

      wss.handleUpgrade(request, socket, head, (ws) => {
        const authenticatedWs = ws as AuthenticatedWebSocket;
        authenticatedWs.isAlive = true;
        wss.emit('connection', authenticatedWs, request);
      });
    }
  });

  // Set up connection handling
  wss.on('connection', (ws: AuthenticatedWebSocket) => {
    console.log('Client connected');

    // Set up ping-pong for connection health check
    ws.on('pong', () => {
      ws.isAlive = true;
    });

    // Handle client messages
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        console.log('Received:', data);
      } catch (error) {
        console.error('Error processing message:', error);
      }
    });

    // Handle client disconnection
    ws.on('close', () => {
      console.log('Client disconnected');
    });
  });

  // Set up periodic health checks
  const interval = setInterval(() => {
    wss.clients.forEach((ws) => {
      const client = ws as AuthenticatedWebSocket;
      if (client.isAlive === false) {
        return client.terminate();
      }
      client.isAlive = false;
      client.ping();
    });
  }, 30000);

  wss.on('close', () => {
    clearInterval(interval);
  });

  // Helper function to broadcast notifications
  function broadcastNotification(notification: {
    type: 'notification';
    message: string;
    notificationType: 'info' | 'success' | 'warning' | 'error';
    taskId?: string;
  }) {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(notification));
      }
    });
  }

  return {
    wss,
    broadcastNotification,
  };
} 