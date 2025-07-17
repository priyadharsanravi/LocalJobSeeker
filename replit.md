# JobSpot - Job Board Application

## Overview

JobSpot is a modern, mobile-first job board application built with a full-stack TypeScript architecture. The application provides a comprehensive platform for job seekers to browse, search, save, and apply for jobs, while also allowing employers to post job listings. The system features a clean, intuitive interface with real-time functionality and responsive design.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development patterns
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management and caching
- **UI Framework**: Radix UI primitives with shadcn/ui components for consistent, accessible design
- **Styling**: Tailwind CSS with CSS custom properties for theming and responsive design
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js for the REST API server
- **Language**: TypeScript for type safety across the entire stack
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Database Provider**: Neon serverless PostgreSQL for scalable cloud hosting
- **Session Management**: PostgreSQL-based session storage with connect-pg-simple
- **Data Storage**: DatabaseStorage class replacing in-memory storage for persistent data

### Mobile-First Design
- **Responsive Layout**: Mobile-optimized interface with bottom navigation
- **Progressive Enhancement**: Works seamlessly across all device sizes
- **Touch-Friendly**: Optimized for mobile interactions and gestures

## Key Components

### Database Schema
- **Companies**: Store employer information (id, name, logo, location, description)
- **Jobs**: Core job listings with full details (title, description, company reference, location, salary, type, category, skills, posting date, active status)
- **Applications**: Track job applications (job reference, applicant details, cover letter, status, timestamp)
- **Saved Jobs**: User favorites system (job reference, user ID, timestamp)
- **Relations**: Fully modeled with Drizzle relations for companies-jobs, jobs-applications, and jobs-savedJobs

### API Endpoints
- **Jobs Management**: CRUD operations for job listings with filtering capabilities
- **Company Management**: Basic company information handling
- **Applications**: Application submission and tracking
- **Saved Jobs**: Personal job bookmarking system

### User Interface Components
- **Job Cards**: Rich job display with company info, location, salary, and interaction buttons
- **Search Interface**: Text search with location filtering
- **Category Navigation**: Visual job category browsing
- **Application Modals**: In-app job application forms
- **Bottom Navigation**: Mobile-first navigation pattern

## Data Flow

### Job Discovery Flow
1. Users browse jobs on the home page with optional category filtering
2. Search functionality allows text and location-based filtering
3. Real-time data fetching with TanStack Query for smooth user experience
4. Jobs are displayed with complete company information through database joins

### Application Process
1. Users click apply on job cards to open application modal
2. Form submission creates application records in the database
3. Success feedback provided through toast notifications
4. Application status tracking for future features

### Job Management
1. Employers can post new jobs through the dedicated form
2. Job data is validated using Zod schemas before database insertion
3. Real-time updates to job listings across the application

## External Dependencies

### Core Libraries
- **@neondatabase/serverless**: Serverless PostgreSQL database connection
- **drizzle-orm**: Type-safe database ORM with PostgreSQL support
- **@tanstack/react-query**: Server state management and caching
- **wouter**: Lightweight React router

### UI Libraries
- **@radix-ui/***: Comprehensive set of accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Modern icon library
- **date-fns**: Date manipulation and formatting

### Development Tools
- **tsx**: TypeScript execution for development
- **vite**: Build tool and development server
- **esbuild**: Fast JavaScript bundler for production

## Deployment Strategy

### Development Environment
- **Hot Reloading**: Vite development server with React Fast Refresh
- **Type Checking**: Real-time TypeScript compilation and error reporting
- **Database Migrations**: Drizzle Kit for schema management

### Production Build
- **Frontend**: Vite builds optimized React application to static assets
- **Backend**: esbuild bundles Express server into single JavaScript file
- **Database**: Drizzle push for schema deployment to production database

### Environment Configuration
- **Database URL**: Environment variable for PostgreSQL connection string
- **Session Storage**: PostgreSQL-backed session management for scalability
- **Static Assets**: Bundled frontend served by Express in production

### Scalability Considerations
- **Serverless Database**: Neon PostgreSQL provides automatic scaling
- **Stateless Server**: Session data stored in database for horizontal scaling
- **CDN Ready**: Static assets can be easily moved to CDN for global distribution
- **API Rate Limiting**: Ready for implementation with Express middleware