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
- **Smart Recommendations**: workout suggestions based on fitness level and preferences

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

### 🔐 Authentication & Security

- **Secure Registration**: Multi-step user registration with email verification
- **JWT Authentication**: Token-based authentication with refresh tokens
- **Password Reset**: Secure password reset via email with time-limited tokens
- **Email Notifications**: Professional HTML email templates for password reset and confirmations
- **Account Security**: Password strength validation and secure password hashing

### 👤 User Management

- **Profile Customization**: Personalized user profiles with preferences
- **Dark/Light Mode**: Theme switching for optimal user experience
- **Measurement Units**: Support for both metric and imperial units
- **Privacy Controls**: Granular notification and privacy settings
- **Password Management**: Change password functionality with current password verification

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
- **React Hook Form**: Performant forms with easy validation
- **Chart.js**: Interactive data visualization
- **Axios**: HTTP client for API requests
- **Vite**: Fast build tool and development server
- **Lucide React**: Modern icon library

### Backend

- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database for flexible data storage
- **Mongoose**: MongoDB object modeling for Node.js
- **JWT**: JSON Web Tokens for secure authentication
- **bcrypt**: Password hashing and security
- **Nodemailer**: Email sending for password reset functionality
- **Multer**: File upload handling
- **node-cron**: Scheduled task automation
- **crypto**: Secure token generation for password reset

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
├── .env.example                 # Environment variables template
└── README.md                    # Project documentation
```

## 🛠️ Installation & Setup

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas)
- **Git**
- **Gmail Account** (for email functionality, optional for development)

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

   ```bash
   # Copy the example environment file
   cp .env.example .env
   ```

   Edit the `.env` file with your configuration:

   ```env
   # Server Configuration
   PORT=8001
   NODE_ENV=development

   # Database
   MONGODB_URI=mongodb://localhost:27017/fittrack

   # JWT Secrets (Generate secure random strings for production)
   JWT_SECRET=your_super_secure_jwt_secret_key_here
   REFRESH_TOKEN_SECRET=your_refresh_token_secret_key_here

   # Email Configuration (Optional for development)
   EMAIL_SERVICE=gmail
   EMAIL_FROM=your-email@gmail.com
   EMAIL_PASSWORD=your-gmail-app-password
   FROM_NAME=FitTrack Pro

   # Client URL for password reset links
   CLIENT_URL=http://localhost:5173
   ```

5. **Email Setup (Optional)**

   For password reset functionality with real emails:

   - Enable 2-Factor Authentication on your Gmail account
   - Generate an App Password in Google Account settings
   - Use the App Password (not your regular password) in `EMAIL_PASSWORD`

   For development without real emails, the system will use Ethereal Email for testing.

6. **Database Seeding** (Optional)

   ```bash
   # Seed database with sample data
   npm run seed

   # Reset all seed data
   npm run seed:destroy
   ```

7. **Start Backend Server**

   ```bash
   # Development mode with auto-reload
   npm run dev

   # Production mode
   npm start
   ```

8. **Frontend Setup**

   ```bash
   cd ../client
   npm install
   ```

9. **Frontend Environment Configuration**

   Create a `.env` file in the client directory:

   ```env
   VITE_API_URL=http://localhost:8001/api
   ```

10. **Start Frontend Development Server**

    ```bash
    npm run dev
    ```

11. **Access the Application**
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
- `PUT /api/auth/password` - Change password (authenticated users)
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/verify-reset-token` - Verify reset token
- `POST /api/auth/reset-password` - Reset password with token

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

## 🔧 Key Features Implemented

### Password Reset Flow

1. **Request Reset**: User enters email on forgot password page
2. **Email Sent**: System sends professional HTML email with reset link
3. **Token Verification**: Frontend verifies token before showing reset form
4. **Password Reset**: User sets new password with validation
5. **Confirmation**: Confirmation email sent after successful reset

### Email System

- **Professional Templates**: Beautiful HTML email templates
- **Development Testing**: Ethereal Email for development testing
- **Production Ready**: Gmail SMTP for production use
- **Security**: Time-limited tokens (10 minutes expiry)
- **Error Handling**: Graceful fallbacks and detailed logging

### Authentication Security

- **Password Hashing**: bcrypt with salt rounds
- **JWT Tokens**: Access and refresh token system
- **Token Validation**: Comprehensive token verification
- **Password Strength**: Client and server-side validation
- **Secure Reset**: Cryptographically secure reset tokens

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

# Test password reset flow
# 1. Register a new user
# 2. Use forgot password feature
# 3. Check email (or console logs for Ethereal)
# 4. Complete password reset
# 5. Login with new password
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
EMAIL_SERVICE=sendgrid
SENDGRID_USERNAME=apikey
SENDGRID_PASSWORD=your_sendgrid_api_key
CLIENT_URL=https://your-production-domain.com
```

### Email Service for Production

For production, consider using:

- **SendGrid**: Reliable email delivery service
- **AWS SES**: Amazon's email service
- **Mailgun**: Developer-friendly email API
- **Postmark**: Transactional email service

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
- Test email functionality with both Ethereal and real email services

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - Frontend framework
- [Express.js](https://expressjs.com/) - Backend framework
- [MongoDB](https://www.mongodb.com/) - Database
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Chart.js](https://www.chartjs.org/) - Data visualization
- [Nodemailer](https://nodemailer.com/) - Email sending
- [React Hook Form](https://react-hook-form.com/) - Form handling

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yugal07/FitTrack-/issues) page
2. Create a new issue with detailed information
3. Join our community discussions

## 🔮 Roadmap

- [x] Password reset functionality with email
- [x] Professional email templates
- [x] Multi-step user registration
- [ ] Mobile application (React Native)
- [ ] Social features and community
- [ ] Integration with fitness wearables
- [ ] Advanced AI-powered recommendations
- [ ] Meal planning and recipe suggestions
- [ ] Workout video integration
- [ ] Multi-language support
- [ ] Two-factor authentication
- [ ] Social login (Google, Facebook)

---

**Built with ❤️ by the FitTrack Team**

_Start your fitness journey today with FitTrack - where every workout counts and every goal is achievable!_
