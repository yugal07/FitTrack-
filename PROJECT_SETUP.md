# FitTrack Project Setup Guide

This document provides detailed instructions for setting up and configuring the FitTrack application for development.

## Development Environment Setup

### Prerequisites

Before starting, ensure you have the following installed:
- Node.js (v16+)
- npm or yarn
- MongoDB (local or Atlas)
- Git
- Code editor (VS Code recommended)

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/fittrack.git
cd fittrack
```

## Backend Setup

### 2. Install Dependencies

```bash
cd server
npm install
```

### 3. Environment Configuration

Create a `.env` file in the server directory with the following variables:

```
PORT=8001
MONGODB_URI=mongodb://localhost:27017/fittrack
JWT_SECRET=your_jwt_secret_key
REFRESH_TOKEN_SECRET=your_refresh_token_secret_key
```

Notes:
- For production, use strong, randomly generated strings for the secret keys
- You can use a local MongoDB instance or Atlas connection string

### 4. Database Setup

To seed the database with initial data (exercises, sample workouts):

```bash
npm run seed
```

To remove all seeded data:

```bash
npm run seed:destroy
```

### 5. Running the Backend

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will run on `http://localhost:8001` (or the PORT specified in your .env file).

### 6. API Documentation

The backend provides the following API endpoints:

#### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh-token` - Refresh authentication token
- `GET /api/auth/me` - Get current user
- `POST /api/auth/forgot-password` - Request password reset

#### Users
- `GET /api/users` - Get user profile
- `PUT /api/users` - Update user profile
- `PATCH /api/users/preferences` - Update user preferences
- `DELETE /api/users` - Delete user account

#### Workouts
- `GET /api/workouts` - Get all workouts
- `POST /api/workouts` - Create a workout
- `GET /api/workouts/:id` - Get a specific workout
- `PUT /api/workouts/:id` - Update a workout
- `DELETE /api/workouts/:id` - Delete a workout
- `POST /api/workouts/:id/ratings` - Rate a workout
- `GET /api/workouts/recommended` - Get recommended workouts

#### Exercises
- `GET /api/exercises` - Get all exercises
- `GET /api/exercises/:id` - Get a specific exercise
- `GET /api/exercises/muscle-groups/:group` - Get exercises by muscle group

#### Workout Sessions
- `GET /api/workout-sessions` - Get workout history
- `POST /api/workout-sessions` - Log a workout session
- `GET /api/workout-sessions/:id` - Get a specific workout session
- `PUT /api/workout-sessions/:id` - Update a workout session
- `DELETE /api/workout-sessions/:id` - Delete a workout session
- `GET /api/workout-sessions/stats` - Get workout statistics

#### Nutrition
- `GET /api/nutrition/logs` - Get nutrition logs
- `POST /api/nutrition/logs` - Create a nutrition log
- `GET /api/nutrition/logs/:id` - Get a specific nutrition log
- `PUT /api/nutrition/logs/:id` - Update a nutrition log
- `POST /api/nutrition/logs/:id/meals` - Add a meal to a nutrition log
- `GET /api/nutrition/stats` - Get nutrition statistics

#### Goals
- `GET /api/goals` - Get all goals
- `POST /api/goals` - Create a goal
- `GET /api/goals/:id` - Get a specific goal
- `PUT /api/goals/:id` - Update a goal
- `DELETE /api/goals/:id` - Delete a goal
- `PATCH /api/goals/:id/progress` - Update goal progress

## Frontend Setup

### 7. Install Dependencies

```bash
cd client
npm install
```

### 8. Environment Configuration

Create a `.env` file in the client directory:

```
VITE_API_URL=http://localhost:8001/api
```

### 9. Running the Frontend

Development mode:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

The development server will run on `http://localhost:5173` by default.

## Project Structure

### Frontend Structure

```
client/
├── public/              # Static files
└── src/
    ├── assets/          # Images, icons, etc.
    ├── components/      # Reusable UI components
    │   ├── common/      # Shared components
    │   ├── layout/      # Layout components
    │   ├── auth/        # Authentication components
    │   ├── workouts/    # Workout-related components
    │   ├── nutrition/   # Nutrition-related components
    │   └── profile/     # Profile-related components
    ├── context/         # React Context providers
    ├── hooks/           # Custom hooks
    ├── pages/           # Page components
    ├── services/        # API service functions
    ├── styles/          # Global styles and theme
    └── utils/           # Utility functions
```

### Key Frontend Components

- **Auth Context**: Manages authentication state (`src/context/AuthContext.jsx`)
- **API Service**: Handles API requests with Axios (`src/services/api.js`)
- **Theme Configuration**: Configures MUI themes (`src/styles/theme.js`)
- **Protected Routes**: Guards routes based on auth state (`src/components/auth/ProtectedRoute.jsx`)
- **Layout Components**: Defines page layouts (`src/components/layout/`)

## Styling and UI Framework

The project uses Material-UI (MUI) for UI components and styling.

### Theme Customization

The theme is defined in `src/styles/theme.js` with both light and dark mode variants. To customize:

1. Edit color palette in the theme files
2. Add or modify component overrides in the theme configuration
3. Use MUI's `sx` prop for component-specific styling

## State Management

The application uses React Context API for state management:

- **AuthContext**: Manages user authentication state
- **ThemeContext**: Manages theme preferences (light/dark mode)

## Development Workflow

1. **Backend Tasks**: Work in the `server` directory
   - Create controllers in `controllers/`
   - Define models in `models/`
   - Add routes in `routes/`

2. **Frontend Tasks**: Work in the `client/src` directory
   - Create components in `components/`
   - Define pages in `pages/`
   - Add API services in `services/`

3. **Running Both**: Use two terminal windows to run both frontend and backend concurrently

## Common Issues and Solutions

### CORS Errors
If you encounter CORS errors during development, ensure:
- Backend has CORS middleware enabled
- Frontend API URLs are correctly pointing to the backend
- Check for protocol mismatches (http vs https)

### Authentication Issues
- Ensure JWT tokens are properly stored in localStorage
- Check that token refresh mechanism is working
- Verify the token is included in the Authorization header for API requests

### Database Connection
- Check MongoDB connection string in the .env file
- Ensure MongoDB service is running
- Try connecting with MongoDB Compass to verify credentials

## Deployment Considerations

### Backend Deployment
- Set production environment variables
- Configure proper error handling
- Add rate limiting for production
- Use a process manager like PM2

### Frontend Deployment
- Build the frontend with `npm run build`
- Configure environment variables for production
- Consider using a CDN for static assets
- Implement code splitting for performance

### Continuous Integration
- Set up GitHub Actions for automated testing
- Configure deployment pipelines for staging/production

## Additional Resources

- [Material-UI Documentation](https://mui.com/material-ui/getting-started/)
- [React Router Documentation](https://reactrouter.com/docs/en/v6)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Documentation](https://expressjs.com/)