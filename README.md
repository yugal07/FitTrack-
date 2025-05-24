# FitTrack - Comprehensive Fitness Tracking Application

[![Node.js](https://img.shields.io/badge/Node.js-16+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green.svg)](https://www.mongodb.com/)

> A modern, full-stack fitness tracking application built with the MERN stack (MongoDB, Express.js, React, Node.js) that helps users monitor their workouts, nutrition, and overall fitness progress in one centralized platform.

## 🌟 Features

### 🏋️ Workout Management

- **Exercise Library**: Comprehensive database of exercises with detailed instructions and muscle group targeting
- **Workout Creation**: Create custom workout routines or choose from pre-built templates
- **Workout Logging**: Track completed workouts with sets, reps, weights, and duration
- **Progress Tracking**: Monitor workout frequency, intensity, and improvements over time
- **Smart Recommendations**: AI-powered workout suggestions based on fitness level and preferences

### 🥗 Nutrition Tracking

- **Meal Logging**: Track daily meals with detailed nutritional information
- **Calorie Counting**: Monitor daily caloric intake and macronutrient distribution
- **Water Intake**: Keep track of daily hydration levels
- **Nutrition Statistics**: Comprehensive reports on eating habits and nutritional goals
- **Food Database**: Extensive nutrition database with common foods and custom entries

### 🎯 Goal Setting & Achievement

- **SMART Goals**: Set specific, measurable fitness and nutrition goals
- **Progress Monitoring**: Real-time tracking of goal completion
- **Achievement Notifications**: Automated alerts when goals are reached
- **Goal Analytics**: Detailed insights into goal performance and trends

### 📊 Progress Visualization

- **Interactive Charts**: Visual representation of fitness progress over time
- **Progress Photos**: Before/after photo comparisons with timeline view
- **Body Measurements**: Track weight, body fat percentage, and body measurements
- **Performance Analytics**: Detailed statistics on workout performance and nutrition

### 🔔 Smart Notifications

- **Workout Reminders**: Automated daily workout notifications
- **Nutrition Alerts**: Reminders to log meals and stay hydrated
- **Goal Milestones**: Celebrations when fitness goals are achieved
- **System Announcements**: Important updates and tips from administrators

### 👤 User Management

- **Profile Customization**: Personalized user profiles with preferences
- **Dark/Light Mode**: Theme switching for optimal user experience
- **Measurement Units**: Support for both metric and imperial units
- **Privacy Controls**: Granular notification and privacy settings

### 🛡️ Admin Dashboard

- **User Management**: Monitor and manage user accounts
- **Content Management**: Add/edit exercises, workouts, and nutrition items
- **Analytics Dashboard**: Platform-wide statistics and user engagement metrics
- **System Announcements**: Send targeted notifications to user groups

## 🚀 Tech Stack

### Frontend

- **React 19.1.0**: Modern UI library with hooks and context
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **React Router**: Client-side routing and navigation
- **Chart.js**: Interactive data visualization
- **Axios**: HTTP client for API requests
- **Vite**: Fast build tool and development server

### Backend

- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database for flexible data storage
- **Mongoose**: MongoDB object modeling for Node.js
- **JWT**: JSON Web Tokens for secure authentication
- **bcrypt**: Password hashing and security
- **Multer**: File upload handling
- **node-cron**: Scheduled task automation

### DevOps & Tools

- **Docker**: Containerization for consistent deployments
- **ESLint**: Code linting and quality assurance
- **Prettier**: Code formatting standardization
- **Husky**: Git hooks for pre-commit checks
- **Morgan**: HTTP request logging

## 📁 Project Structure

```
fittrack/
├── client/                      # React frontend application
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── admin/           # Admin-specific components
│   │   │   ├── auth/            # Authentication components
│   │   │   ├── dashboard/       # Dashboard widgets
│   │   │   ├── goals/           # Goal management
│   │   │   ├── nutrition/       # Nutrition tracking
│   │   │   ├── profile/         # User profile management
│   │   │   ├── progress/        # Progress visualization
│   │   │   ├── ui/              # Shared UI components
│   │   │   └── workout/         # Workout management
│   │   ├── contexts/            # React Context providers
│   │   ├── services/            # API service functions
│   │   └── utils/               # Utility functions
│   ├── public/                  # Static assets
│   └── package.json             # Frontend dependencies
│
├── server/                      # Node.js backend application
│   ├── controllers/             # Request handlers and business logic
│   ├── models/                  # Mongoose database models
│   ├── routes/                  # API route definitions
│   ├── middleware/              # Custom middleware functions
│   ├── services/                # Background services and schedulers
│   ├── utils/                   # Server utility functions
│   ├── seeder/                  # Database seeding scripts
│   ├── uploads/                 # File upload storage
│   └── documentation/           # API and technical documentation
│
├── docker-compose.yml           # Docker container orchestration
└── README.md                    # Project documentation
```

## 🛠️ Installation & Setup

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas)
- **Git**

### 🔧 Development Setup

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/fittrack.git
   cd fittrack
   ```

2. **Install Root Dependencies**

   ```bash
   # Install root dependencies (Husky, lint-staged, etc.)
   npm install
   ```

3. **Backend Setup**

   ```bash
   cd server
   npm install
   ```

4. **Environment Configuration**

   Create a `.env` file in the server directory:

   ```env
   PORT=8001
   MONGODB_URI=mongodb://localhost:27017/fittrack
   JWT_SECRET=your_super_secure_jwt_secret_key_here
   REFRESH_TOKEN_SECRET=your_refresh_token_secret_key_here
   NODE_ENV=development
   ```

5. **Database Seeding** (Optional)

   ```bash
   # Seed database with sample data
   npm run seed

   # Reset all seed data
   npm run seed:destroy
   ```

6. **Start Backend Server**

   ```bash
   # Development mode with auto-reload
   npm run dev

   # Production mode
   npm start
   ```

7. **Frontend Setup**

   ```bash
   cd ../client
   npm install
   ```

8. **Frontend Environment Configuration**

   Create a `.env` file in the client directory:

   ```env
   VITE_API_URL=http://localhost:8001/api
   ```

9. **Start Frontend Development Server**

   ```bash
   npm run dev
   ```

10. **Access the Application**
    - Frontend: http://localhost:5173
    - Backend API: http://localhost:8001/api

### 🐳 Docker Setup

For a containerized setup using Docker:

```bash
# Build and start all services
docker-compose up --build

# Run in detached mode
docker-compose up -d

# Stop all services
docker-compose down
```

The application will be available at http://localhost:80

## 🔐 Default Login Credentials

After seeding the database, you can use these credentials:

**Admin Account:**

- Email: `admin@fittrack.com`
- Password: `password123`

**Test User Accounts:**

- Email: `john@example.com` | Password: `password123`
- Email: `jane@example.com` | Password: `password123`

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh-token` - Token refresh
- `GET /api/auth/me` - Get current user

### Core Features

- **Workouts**: `/api/workouts` - CRUD operations for workouts
- **Exercises**: `/api/exercises` - Exercise library management
- **Nutrition**: `/api/nutrition` - Nutrition logging and tracking
- **Goals**: `/api/goals` - Goal setting and progress tracking
- **Profile**: `/api/profiles` - User profile and measurements
- **Notifications**: `/api/notifications` - Notification management

### Admin Features

- **User Management**: `/api/admin/users` - User administration
- **Analytics**: `/api/admin/analytics` - Platform statistics
- **Content Management**: Various admin endpoints for content

For detailed API documentation, see the [API Documentation](server/documentation/Routes/Routes.md).

## 🧪 Testing

```bash
# Run backend tests
cd server
npm test

# Run frontend tests
cd client
npm test

# Run linting
npm run lint

# Format code
npm run format
```

## 🚀 Deployment

### Production Build

**Backend:**

```bash
cd server
npm run build
npm start
```

**Frontend:**

```bash
cd client
npm run build
npm run preview
```

### Environment Variables for Production

Ensure the following environment variables are set in production:

```env
NODE_ENV=production
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_production_jwt_secret
REFRESH_TOKEN_SECRET=your_production_refresh_secret
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the Repository**
2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make Your Changes**
4. **Commit Your Changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
5. **Push to the Branch**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style and linting rules
- Write comprehensive tests for new features
- Update documentation for API changes
- Use meaningful commit messages
- Ensure all tests pass before submitting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - Frontend framework
- [Express.js](https://expressjs.com/) - Backend framework
- [MongoDB](https://www.mongodb.com/) - Database
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Chart.js](https://www.chartjs.org/) - Data visualization

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/fittrack/issues) page
2. Create a new issue with detailed information
3. Join our community discussions

## 🔮 Roadmap

- [ ] Mobile application (React Native)
- [ ] Social features and community
- [ ] Integration with fitness wearables
- [ ] Advanced AI-powered recommendations
- [ ] Meal planning and recipe suggestions
- [ ] Workout video integration
- [ ] Multi-language support

---

**Built with ❤️ by the FitTrack Team**

_Start your fitness journey today with FitTrack - where every workout counts!_
