# ClaimSutra Project Documentation

## Overview

ClaimSutra is an insurance services application designed to help users manage insurance claims, access legal advice, and connect with insurance experts. The application follows a client-server architecture with a React frontend and Express.js backend, using MongoDB for data persistence.

## Tech Stack

- **Frontend**: 
  - React with Wouter for routing
  - React Query for data fetching
  - Shadcn UI components
  - Tailwind CSS for styling

- **Backend**: 
  - Express.js with Passport.js for authentication
  - MongoDB with Mongoose for data storage
  - WebSocket for real-time notifications

- **Development Tools**:
  - TypeScript for type safety
  - Vite for frontend development and building
  - ESBuild for backend bundling

## Project Structure

### Root Directory

- **`.env` Files**: Environment configuration files for different environments (development, production, test)
- **`package.json`**: Defines project dependencies and scripts
- **`tsconfig.json`**: TypeScript configuration
- **`tailwind.config.ts`**: Tailwind CSS configuration
- **`drizzle.config.ts`**: Drizzle ORM configuration (Note: The project appears to use both Mongoose and Drizzle)
- **`vite.config.ts`**: Vite bundler configuration

### Server Directory (`/server`)

The server directory contains the backend Express.js application with the following structure:

#### Core Files

- **`index.ts`**: Entry point that bootstraps the server application
  - Connects to MongoDB
  - Sets up Express app with middleware
  - Configures WebSocket server
  - Registers API routes
  - Handles server startup and shutdown

- **`server.ts`**: Contains server configuration logic
- **`routes.ts`**: Defines all API endpoints for the application
- **`auth.ts`**: Handles user authentication using Passport.js
- **`admin-auth.ts`**: Handles admin authentication
- **`storage.ts`**: Interface for data storage operations
- **`storage-mongo.ts`**: MongoDB implementation of the storage interface
- **`websocket.ts`**: WebSocket server implementation for real-time notifications

#### Subdirectories

- **`/config`**: Configuration files
  - `server-config.ts`: Express server configuration
  - `env.ts`: Environment variable validation and access

- **`/db`**: Database connection and utilities
  - `mongodb-connection.ts`: MongoDB connection setup

- **`/middleware`**: Express middleware
  - `admin-auth.ts`: Admin authentication middleware
  - `rate-limit.ts`: Rate limiting for API endpoints

- **`/models`**: Mongoose data models
  - `User.ts`: User account model with authentication methods
  - `AdminUser.ts`: Admin user model
  - `Complaint.ts`: User complaints model
  - `BlogPost.ts`: Blog content model
  - `Category.ts`: Service categories
  - `Subcategory.ts`: Service subcategories
  - `Service.ts`: Insurance services
  - `Ticket.ts`: Support tickets
  - `Task.ts`: Tasks related to tickets
  - `OTP.ts`: One-time password for authentication

- **`/routes`**: Route handlers organized by feature
  - `password-auth.ts`: Password authentication routes

- **`/services`**: Business logic services
  - `otp-service.ts`: OTP generation and validation

- **`/utils`**: Utility functions

### Client Directory (`/client`)

The client directory contains the React frontend application with the following structure:

#### Core Files

- **`index.html`**: HTML entry point
- **`src/main.tsx`**: JavaScript entry point
- **`src/App.tsx`**: Main React component that defines the application routes

#### Subdirectories

- **`/src/components`**: Reusable UI components
  - `/ui`: Shadcn UI components
  - `/layout`: Layout components (navbar, footer, etc.)
  - `/admin`: Admin dashboard components
  - `/home`: Homepage components
  - `/ticket`: Ticket management components
  - `/vakilsutra`: Legal advice components

- **`/src/pages`**: Page components for each route
  - `/home`: Homepage
  - `/complaint`: Complaint submission page
  - `/admin-dashboard`: Admin dashboard pages
  - `/ticket`: Ticket management pages
  - `/service`: Service detail pages
  - `/more`: Additional pages (about, careers, etc.)

- **`/src/hooks`**: Custom React hooks
  - `use-admin-auth.ts`: Admin authentication hook
  - `use-tickets.ts`: Ticket management hook
  - `use-task-notifications.ts`: Task notification hook

- **`/src/providers`**: React context providers
  - `AuthProvider.tsx`: Authentication context
  - `NotificationProvider.tsx`: Notification context
  - `loading-provider.tsx`: Loading state management

- **`/src/lib`**: Utility libraries
  - `queryClient.ts`: React Query configuration
  - `protected-route.tsx`: Route protection for authenticated users
  - `admin-protected-route.tsx`: Route protection for admin users

- **`/src/data`**: Static data and data fetching utilities
- **`/src/stores`**: State management stores
- **`/src/utils`**: Utility functions

### Shared Directory (`/shared`)

- **`schema.ts`**: Shared validation schemas using Zod

## Key Features and Functionality

### Authentication System

The application supports three authentication methods:
- OTP-based authentication (preferred)
- Google OAuth authentication
- Password-based authentication (being phased out)

Authentication is implemented using:
- Passport.js for authentication middleware
- Express sessions stored in MongoDB
- JWT for admin authentication
- Google OAuth 2.0 for Google authentication

### Google Authentication

The application supports Google OAuth 2.0 for user authentication. This allows users to sign in using their Google accounts. The implementation follows these principles:

1. **Single Responsibility Principle (SRP)**: Google authentication is implemented in its own service class (`google-auth-service.ts`) that handles only Google OAuth functionality.

2. **Open/Closed Principle (OCP)**: The authentication system is extended to support Google login without modifying the existing OTP and password authentication methods.

3. **Interface Segregation Principle (ISP)**: Google authentication routes are separated into their own module (`google-auth.ts`).

4. **Dependency Inversion Principle (DIP)**: The Google authentication service depends on abstractions rather than concrete implementations.

To configure Google authentication, the following environment variables must be set:
- `GOOGLE_CLIENT_ID`: OAuth 2.0 client ID from Google Cloud Console
- `GOOGLE_CLIENT_SECRET`: OAuth 2.0 client secret from Google Cloud Console
- `GOOGLE_CALLBACK_BASE_URL`: Base URL for the OAuth callback (e.g., `http://localhost:3000` for development)

### Admin Dashboard

The admin dashboard provides management capabilities for:
- User management
- Category and subcategory management
- Service management
- Ticket management
- Task assignment and tracking

Admin routes are protected with dedicated middleware that verifies admin privileges.

### Complaint Management

Users can submit insurance-related complaints through a form. The system:
- Validates complaint data using Zod schemas
- Stores complaints in MongoDB
- Allows admins to view and manage complaints

### Ticket System

The application includes a support ticket system where:
- Users can create support tickets
- Admins can assign tickets to staff
- Tasks can be created for tickets
- Real-time notifications are sent for ticket updates

### Real-time Notifications

The application uses WebSockets to provide real-time notifications for:
- Ticket updates
- Task assignments
- System announcements

### Service Directory

The application provides an insurance service directory with:
- Categories and subcategories
- Detailed service information
- Search functionality

## Database Models

### User Model
- Username (unique)
- Authentication method preference (OTP/password)
- Admin status
- Device information
- Last login timestamp
- Migration status (for authentication method transition)

### Complaint Model
- User information
- Complaint details
- Status
- Timestamps

### Ticket Model
- User reference
- Title and description
- Status
- Priority
- Assigned staff
- Related tasks

### Category and Subcategory Models
- Name and description
- Hierarchy relationship
- Associated services

### Service Model
- Name and description
- Category and subcategory references
- Pricing information
- Features

## API Endpoints

### Authentication
- `/api/auth/password`: Password authentication routes
- `/api/admin-auth`: Admin authentication routes
- `/api/google-auth`: Google authentication routes

### User Management
- `/api/users`: User CRUD operations
- `/api/users/me`: Current user information

### Complaint Management
- `/api/complaints`: Complaint submission and retrieval

### Category Management
- `/api/categories`: Category CRUD operations
- `/api/admin/categories`: Admin category management

### Subcategory Management
- `/api/subcategories`: Subcategory retrieval
- `/api/admin/subcategories`: Admin subcategory management

### Service Management
- `/api/services`: Service retrieval
- `/api/admin/services`: Admin service management

### Ticket Management
- `/api/tickets`: Ticket CRUD operations
- `/api/admin/tickets`: Admin ticket management
- `/api/tickets/:id/tasks`: Task management for tickets

### Blog Management
- `/api/blog-posts`: Blog post retrieval
- `/api/admin/blog-posts`: Admin blog post management

## Development Workflow

### Running the Application
1. Install dependencies: `npm install`
2. Set up environment variables by copying `.env.example` to `.env.development`
3. Seed the database: `npm run db:seed`
4. Start the development server: `npm run dev`

### Building for Production
1. Build the application: `npm run build`
2. Start the production server: `npm run start`

### Database Operations
- Push schema changes: `npm run db:push`
- Seed the database: `npm run db:seed`
- Create admin user: `npm run seed-admin`

## SOLID Principles Implementation

The application follows SOLID principles:

### Single Responsibility Principle (SRP)
- Each model handles a specific data entity
- Routes are organized by feature
- Storage interface separates data access from business logic

### Open/Closed Principle (OCP)
- Storage interface allows for different implementations without modifying consumers
- Authentication system supports multiple methods through a common interface

### Liskov Substitution Principle (LSP)
- Storage implementations can be swapped without affecting the rest of the application

### Interface Segregation Principle (ISP)
- API routes are organized by feature and responsibility
- Authentication methods are separated into distinct modules

### Dependency Inversion Principle (DIP)
- Business logic depends on storage interface, not concrete implementation
- Authentication depends on strategy interfaces, not concrete implementations

## Security Considerations

- Environment variables for sensitive configuration
- Password hashing using bcrypt
- Rate limiting for authentication attempts
- Session management with secure cookies
- Input validation using Zod schemas
- MongoDB connection with proper authentication

## Deployment

The application is designed to be deployed to a production environment with:
- MongoDB Atlas for database
- Node.js runtime for the server
- Static file serving for the client build

## Future Enhancements

Potential areas for future development:
- Complete migration from password to OTP authentication
- Enhanced admin analytics dashboard
- Mobile application integration
- Additional payment gateway integrations
- Document management system improvements
