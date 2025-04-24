# FitTrack - Fitness Tracking Application

FitTrack is a comprehensive fitness tracking application built with the MERN stack (MongoDB, Express, React, Node.js). It helps users monitor their workouts, nutrition, and overall fitness progress in one centralized platform.

## Features

- **User Authentication**: Secure registration and login system with JWT
- **Workout Tracking**: Log and monitor workout sessions
- **Exercise Library**: Access to a comprehensive database of exercises
- **Nutrition Logging**: Track daily meals and nutritional intake
- **Progress Visualization**: View fitness progress through charts and metrics
- **Goal Setting**: Set and track fitness goals
- **Profile Management**: Customize user profile and preferences
- **Dark Mode**: Toggle between light and dark themes

## Tech Stack

### Frontend
- React (with Vite)
- Material-UI (MUI)
- React Router
- Context API for state management
- Axios for API requests

### Backend
- Node.js
- Express
- MongoDB with Mongoose
- JWT for authentication
- Multer for file uploads

## Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn
- MongoDB (local instance or Atlas connection)

### Installation and Setup

#### Backend Setup
1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/fittrack.git
   cd fittrack
   ```

2. Install backend dependencies
   ```bash
   cd server
   npm install
   ```

3. Create a `.env` file in the server directory with the following variables:
   ```
   PORT=8001
   MONGODB_URI=mongodb://localhost:27017/fittrack
   JWT_SECRET=your_jwt_secret_key
   REFRESH_TOKEN_SECRET=your_refresh_token_secret_key
   ```

4. Seed the database with initial data (optional)
   ```bash
   npm run seed
   ```

5. Start the backend server
   ```bash
   npm run dev
   ```

#### Frontend Setup
1. Install frontend dependencies
   ```bash
   cd client
   npm install
   ```

2. Create a `.env` file in the client directory:
   ```
   VITE_API_URL=http://localhost:8001/api
   ```

3. Start the frontend development server
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to http://localhost:5173

## Project Structure

```
fittrack/
├── server/                  # Backend code
│   ├── config/              # Configuration files
│   ├── controllers/         # API controllers
│   ├── middleware/          # Express middleware
│   ├── models/              # Mongoose models
│   ├── routes/              # API routes
│   ├── services/            # Business logic services
│   ├── utils/               # Utility functions
│   └── seeder/              # Database seed data
│
└── client/                  # Frontend code
    ├── public/              # Static files
    └── src/
        ├── assets/          # Images, icons, etc.
        ├── components/      # Reusable UI components
        ├── context/         # React Context providers
        ├── hooks/           # Custom hooks
        ├── pages/           # Page components
        ├── services/        # API service functions
        ├── styles/          # Global styles and themes
        └── utils/           # Utility functions
```

## Available Scripts

### Backend
- `npm start`: Start the production server
- `npm run dev`: Start the development server with nodemon
- `npm run seed`: Seed the database with initial data
- `npm run seed:destroy`: Remove all seeded data

### Frontend
- `npm run dev`: Start the development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build locally
- `npm run lint`: Run linter

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Material-UI](https://mui.com/) for the UI components
- [MongoDB](https://www.mongodb.com/) for the database
- [Express](https://expressjs.com/) for the backend framework
- [React](https://reactjs.org/) for the frontend framework
- [Node.js](https://nodejs.org/) for the runtime environment