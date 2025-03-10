import { createServer } from 'http';
import express from 'express';
import { createApp, startServer } from './config/server-config';
import { connectToMongoDB, closeMongoDB } from './db/mongodb-connection';
import { registerRoutes } from './routes';
import { setupVite, serveStatic } from './vite';
import { env, validateEnv } from './config/env';

async function bootstrap() {
  try {
    // Validate environment variables
    validateEnv();
    
    // Connect to MongoDB database
    await connectToMongoDB();
    
    // Create and configure Express app with basic middleware
    const app = createApp();
    
    // Create HTTP server
    const server = createServer(app);
    
    // Register all API routes
    await registerRoutes(app);
    
    // In development mode, use Vite to serve the client app
    if (!env.isProduction) {
      console.log('Setting up Vite middleware for development mode...');
      await setupVite(app, server);
    } else {
      // In production, serve the static files
      console.log('Serving static files in production mode...');
      serveStatic(app);
    }
    
    // Start server with dynamic port handling
    const PORT = env.server.port;
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Visit http://${env.server.host}:${PORT} in your browser`);
    });
    
    // Handle graceful shutdown
    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
    
    async function shutdown() {
      console.log('Shutting down server...');
      await closeMongoDB();
      process.exit(0);
    }
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the application
bootstrap().catch(err => {
  console.error('Unhandled error during bootstrap:', err);
  process.exit(1);
});