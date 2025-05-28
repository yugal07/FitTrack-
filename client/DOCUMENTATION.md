# FitTrack Frontend Documentation

## Table of Contents

1. [Overview](#overview)
2. [Project Structure](#project-structure)  
3. [Technology Stack](#technology-stack)
4. [Development Setup](#development-setup)
5. [Configuration](#configuration)
6. [Component Architecture](#component-architecture)
7. [Routing](#routing)
8. [State Management](#state-management)
9. [Services](#services)
10. [Styling](#styling)
11. [Build & Deployment](#build--deployment)
12. [Code Quality](#code-quality)
13. [Testing Guidelines](#testing-guidelines)
14. [Contributing](#contributing)

## Overview

FitTrack is a comprehensive fitness tracking application built with React and Vite. The frontend provides users with tools to track workouts, monitor nutrition, set goals, view progress analytics, and manage their fitness journey. It features both user and admin interfaces with role-based access control.

### Key Features
- **User Dashboard**: Personalized fitness overview with stats and progress
- **Workout Management**: Create, schedule, and track workout sessions
- **Nutrition Tracking**: Log meals, track calories, and monitor nutritional goals
- **Goal Setting**: Set and track fitness goals with progress visualization
- **Progress Analytics**: Charts and reports showing fitness progress over time
- **Profile Management**: User profile with measurements and progress photos
- **Admin Panel**: Content management for exercises, workouts, and user administration
- **Notifications**: System for announcements and reminders
- **Responsive Design**: Mobile-first approach with dark/light theme support

## Project Structure

```
client/
├── public/                     # Static assets
├── src/
│   ├── App.jsx                # Main application component
│   ├── main.jsx              # Application entry point
│   ├── index.css             # Global styles
│   ├── App.css               # App-specific styles
│   ├── assets/               # Images, icons, and other assets
│   ├── components/           # Reusable UI components
│   │   ├── admin/           # Admin-specific components
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AdminLayout.jsx
│   │   │   ├── analytics/   # Admin analytics components
│   │   │   ├── content/     # Content management components
│   │   │   ├── notifications/ # Admin notification management
│   │   │   └── users/       # User management components
│   │   ├── auth/            # Authentication components
│   │   ├── dashboard/       # Main dashboard components
│   │   ├── goals/           # Goal management components
│   │   ├── layout/          # Layout components
│   │   ├── notifications/   # User notification components
│   │   ├── nutrition/       # Nutrition tracking components
│   │   ├── profile/         # User profile components
│   │   ├── progress/        # Progress tracking components
│   │   ├── ui/              # Reusable UI components
│   │   └── workout/         # Workout management components
│   ├── contexts/            # React Context providers
│   ├── routes/              # Route configurations
│   ├── services/            # API service functions
│   └── utils/               # Utility functions
├── Dockerfile.client        # Docker configuration
├── package.json            # Dependencies and scripts
├── tailwind.config.js      # Tailwind CSS configuration
├── vite.config.js          # Vite build configuration
└── eslint.config.js        # ESLint configuration
```

## Technology Stack

### Core Technologies
- **React 19.1.0**: UI library with hooks and modern features
- **Vite 6.3.5**: Fast build tool and development server
- **React Router DOM 7.5.3**: Client-side routing
- **Axios 1.9.0**: HTTP client for API calls

### UI & Styling
- **Tailwind CSS 3.4.1**: Utility-first CSS framework
- **Heroicons 2.2.0**: Icon library
- **Lucide React 0.511.0**: Additional icon set

### Data Visualization
- **Chart.js 4.4.9**: Chart library for analytics
- **Recharts 2.15.3**: React chart components
- **chartjs-adapter-date-fns 3.0.0**: Date handling for charts

### Forms & Validation
- **React Hook Form 7.56.4**: Performant form library

### Utilities
- **date-fns 4.1.0**: Date manipulation library
- **jsPDF 3.0.1**: PDF generation
- **jspdf-autotable 5.0.2**: Table generation for PDFs
- **canvas-confetti 1.9.3**: Celebration animations

### Development Tools
- **ESLint 9.27.0**: Code linting
- **Prettier 3.5.3**: Code formatting
- **TypeScript ESLint**: TypeScript linting support

## Development Setup

### Prerequisites
- Node.js (version 18 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd yugal07-fittrack-/client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the client directory:
   ```env
   VITE_API_URL=http://localhost:8001/api
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

### Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run lint`: Run ESLint
- `npm run lint:fix`: Fix ESLint issues automatically
- `npm run format`: Format code with Prettier
- `npm run format:check`: Check code formatting

## Configuration

### Vite Configuration
The application uses Vite for fast development and optimized builds. Configuration is minimal and focuses on React support.

### Tailwind CSS Configuration
Custom theme configuration includes:
- **Brand Colors**: Primary (indigo), secondary (teal), accent (amber)
- **Semantic Colors**: Success, error, warning variants
- **Typography**: Inter for body text, Montserrat for headings
- **Dark Mode**: Class-based dark mode support
- **Custom Breakpoints**: Additional xs and 3xl breakpoints

### ESLint Configuration
Comprehensive linting setup with:
- React-specific rules
- TypeScript support
- Prettier integration
- React Hooks linting
- Custom rules for code quality

## Component Architecture

### Component Organization

#### Admin Components (`/admin`)
- **AdminDashboard.jsx**: Main admin interface
- **AdminLayout.jsx**: Admin-specific layout wrapper
- **analytics/**: Admin analytics and reporting
- **content/**: Exercise, workout, and nutrition management
- **notifications/**: System notification management
- **users/**: User administration

#### Authentication (`/auth`)
- **Login.jsx**: User login form
- **Register.jsx**: User registration form
- **ForgotPassword.jsx**: Password reset request
- **ResetPassword.jsx**: Password reset form
- **ChangePassword.jsx**: Password change form
- **AuthGuard.jsx**: Route protection component

#### Dashboard (`/dashboard`)
- **Dashboard.jsx**: Main user dashboard
- **StatCard.jsx**: Reusable stat display component
- **ActivityTimeline.jsx**: Recent activity display
- **GoalProgress.jsx**: Goal progress visualization
- **NutritionSummary.jsx**: Daily nutrition overview
- **RecentMeasurements.jsx**: Latest body measurements
- **UpcomingWorkouts.jsx**: Scheduled workout preview
- **WorkoutSuggestion.jsx**: AI-powered workout recommendations

#### Goals (`/goals`)
- **Goals.jsx**: Main goals management interface
- **GoalList.jsx**: List of user goals
- **GoalWizard.jsx**: Step-by-step goal creation
- **GoalAchievement.jsx**: Goal completion celebration
- **GoalStatistics.jsx**: Goal progress analytics

#### Nutrition (`/nutrition`)
- **Nutrition.jsx**: Main nutrition tracking interface
- **DailyIntakeForm.jsx**: Daily food logging
- **MealPlanner.jsx**: Meal planning interface
- **MealsList.jsx**: Meal history display
- **NutritionGoals.jsx**: Nutritional goal setting
- **NutritionStats.jsx**: Nutrition analytics
- **WaterTracker.jsx**: Water intake tracking
- **WaterChart.jsx**: Water consumption visualization

#### Profile (`/profile`)
- **Profile.jsx**: Main profile interface
- **ProfileEditForm.jsx**: Profile editing form
- **ProfileInfo.jsx**: Profile information display
- **MeasurementsTracker.jsx**: Body measurement tracking
- **MeasurementForm.jsx**: Measurement input form
- **MeasurementChart.jsx**: Measurement progress charts
- **ProgressPhotos.jsx**: Progress photo management
- **PhotoForm.jsx**: Photo upload interface

#### Progress (`/progress`)
- **Progress.jsx**: Main progress tracking interface
- **ProgressReport.jsx**: Comprehensive progress reports
- **MeasurementTrends.jsx**: Long-term measurement analysis
- **MetricSummaryCard.jsx**: Key metric summaries
- **PhotoComparison.jsx**: Before/after photo comparisons
- **WorkoutHistory.jsx**: Historical workout data
- **charts/**: Specialized chart components for progress visualization

#### Workout (`/workout`)
- **Workouts.jsx**: Main workout interface
- **WorkoutList.jsx**: Available workout programs
- **WorkoutDetail.jsx**: Individual workout details
- **WorkoutForm.jsx**: Workout creation/editing
- **WorkoutLogger.jsx**: Active workout tracking
- **ExerciseForm.jsx**: Exercise creation/editing
- **ScheduledWorkoutList.jsx**: Upcoming workouts
- **ScheduledWorkoutForm.jsx**: Workout scheduling
- **ScheduledWorkoutDetail.jsx**: Scheduled workout details
- **AvailableWorkout.jsx**: Workout program display

#### UI Components (`/ui`)
- **Button.jsx**: Reusable button component
- **Card.jsx**: Card container component
- **Input.jsx**: Form input component
- **Alert.jsx**: Notification/alert component
- **ConfirmModal.jsx**: Confirmation dialog
- **ThemeToggle.jsx**: Dark/light mode toggle

### Component Design Patterns

#### Composition Pattern
Components are designed to be composable and reusable:
```jsx
<Card>
  <Card.Header>
    <Card.Title>Dashboard</Card.Title>
  </Card.Header>
  <Card.Content>
    <StatCard metric="calories" value={2150} />
  </Card.Content>
</Card>
```

#### Render Props Pattern
Used for data fetching and state sharing:
```jsx
<DataProvider>
  {({ data, loading, error }) => (
    loading ? <Spinner /> : <DataDisplay data={data} />
  )}
</DataProvider>
```

#### Custom Hooks
Reusable logic extracted into custom hooks:
```jsx
const useWorkoutData = () => {
  // Data fetching and state management logic
  return { workouts, loading, error, refetch };
};
```

## Routing

### Route Structure
The application uses React Router for client-side routing with the following structure:

```
/                           # Dashboard (protected)
/login                      # Login page
/register                   # Registration page
/forgot-password           # Password reset request
/reset-password/:token     # Password reset form
/profile                   # User profile (protected)
/workouts                  # Workout management (protected)
/nutrition                 # Nutrition tracking (protected)
/goals                     # Goal management (protected)
/progress                  # Progress analytics (protected)
/notifications             # User notifications (protected)
/admin/*                   # Admin routes (admin only)
```

### Route Protection
- **AuthGuard**: Protects routes requiring authentication
- **AdminRoutes**: Restricts admin-only sections
- **Role-based Access**: Different interfaces for users and admins

### Route Configuration
Routes are organized in separate files:
- `AuthRoutes.jsx`: Authentication-related routes
- `AdminRoutes.jsx`: Admin panel routes

## State Management

### Context Providers

#### AuthContext
Manages user authentication state:
```jsx
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

**Provides:**
- Current user information
- Authentication status
- Login/logout functions
- Token management

#### ThemeContext
Manages application theme (dark/light mode):
```jsx
const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  return context;
};
```

**Provides:**
- Current theme state
- Theme toggle function
- Persistent theme storage

#### ToastContext
Manages notification toasts:
```jsx
const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  return context;
};
```

**Provides:**
- Toast notification functions
- Toast queue management
- Auto-dismiss functionality

### Local State Management
Components use React hooks for local state:
- `useState`: Simple state management
- `useReducer`: Complex state logic
- `useEffect`: Side effects and lifecycle
- `useMemo`: Performance optimization
- `useCallback`: Function memoization

## Services

### API Service (`/services`)

#### Base API Configuration (`api.js`)
Centralized API configuration with Axios:
```javascript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
});

// Request interceptor for auth tokens
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

#### Service Modules

**authService.js**
- User authentication
- Token management
- Password reset functionality

**adminService.js**
- Admin-specific API calls
- User management
- System analytics

**notificationService.js**
- Notification management
- Real-time updates
- Push notification handling

**scheduledWorkoutService.js**
- Workout scheduling
- Calendar integration
- Reminder management

### Error Handling
Consistent error handling across all services:
```javascript
const handleApiError = (error) => {
  if (error.response?.status === 401) {
    // Handle unauthorized
    logout();
  }
  return Promise.reject(error);
};
```

## Styling

### Tailwind CSS Implementation

#### Custom Theme Configuration
The application extends Tailwind's default theme with:

**Brand Colors:**
- Primary: Indigo-based scale (50-900)
- Secondary: Teal-based scale (50-900)  
- Accent: Amber-based scale (50-900)

**Semantic Colors:**
- Success: Green variants
- Error: Red variants
- Warning: Orange variants

**Typography:**
- Sans: Inter font family
- Heading: Montserrat font family

#### Dark Mode Support
Implemented using Tailwind's class-based dark mode:
```jsx
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
  <h1 className="text-primary-600 dark:text-primary-400">Title</h1>
</div>
```

#### Responsive Design
Mobile-first approach with custom breakpoints:
- xs: 475px (extra small devices)
- sm: 640px (small devices)
- md: 768px (tablets)
- lg: 1024px (laptops)
- xl: 1280px (desktops)
- 2xl: 1536px (large desktops)
- 3xl: 1920px (ultra-wide)

#### Component Styling Patterns

**Card Components:**
```jsx
<div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
  {/* Card content */}
</div>
```

**Button Variants:**
```jsx
// Primary button
<button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md transition-colors">

// Secondary button  
<button className="bg-gray-200 hover:bg-gray-300 text-gray-900 px-4 py-2 rounded-md transition-colors">
```

**Form Elements:**
```jsx
<input className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
```

### CSS Organization
- `index.css`: Global styles and Tailwind imports
- `App.css`: Application-specific styles
- Component-level styles using Tailwind classes
- Custom animations and utilities in Tailwind config

## Build & Deployment

### Development Build
```bash
npm run dev
```
- Fast HMR (Hot Module Replacement)
- Source maps for debugging
- Development-optimized bundles

### Production Build
```bash
npm run build
```
- Minified and optimized bundles
- Tree shaking for smaller bundle sizes
- Asset optimization and compression
- Source map generation for debugging

### Docker Deployment

#### Multi-stage Dockerfile
```dockerfile
# Build stage
FROM node:19-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . ./
RUN npm run build

# Production stage  
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Docker Compose Integration
The client service is configured to work with the backend server through Docker Compose networking.

### Environment Variables
- `VITE_API_URL`: Backend API endpoint
- Production builds use relative URLs for Docker deployment

### Build Optimization
- **Code Splitting**: Automatic route-based code splitting
- **Tree Shaking**: Eliminates unused code
- **Asset Optimization**: Image and asset compression
- **Bundle Analysis**: Use `npm run build -- --analyze` for bundle size analysis

## Code Quality

### ESLint Configuration
Comprehensive linting with:
- React-specific rules
- TypeScript support (via parser)
- React Hooks linting
- Prettier integration
- Custom rules for code consistency

### Prettier Configuration
Consistent code formatting with:
- Single quotes for strings
- Semicolons required
- 2-space indentation
- 80-character line width
- Trailing commas in ES5 syntax

### Pre-commit Hooks
Husky configuration ensures:
- Linting before commits
- Format checking
- Test execution (when implemented)

### Code Standards

#### Component Structure
```jsx
// Component imports
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

// Type definitions (if using TypeScript)
interface ComponentProps {
  title: string;
  onSubmit: (data: FormData) => void;
}

// Component definition
const MyComponent = ({ title, onSubmit }) => {
  // Hooks
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  // Effects
  useEffect(() => {
    // Effect logic
  }, []);

  // Event handlers
  const handleSubmit = (data) => {
    setLoading(true);
    onSubmit(data);
    setLoading(false);
  };

  // Render
  return (
    <div className="component-container">
      {/* JSX content */}
    </div>
  );
};

export default MyComponent;
```

#### File Naming Conventions
- Components: PascalCase (e.g., `UserProfile.jsx`)
- Services: camelCase (e.g., `authService.js`)
- Utilities: camelCase (e.g., `dateUtils.js`)
- Constants: UPPER_SNAKE_CASE

#### Import Organization
```jsx
// 1. React and third-party imports
import React from 'react';
import axios from 'axios';

// 2. Internal components
import Button from '../ui/Button';
import Card from '../ui/Card';

// 3. Contexts and hooks
import { useAuth } from '../contexts/AuthContext';

// 4. Services and utilities
import { authService } from '../services/authService';
import { formatDate } from '../utils/dateUtils';
```

## Testing Guidelines

### Testing Strategy
While test files are not currently present in the structure, here are recommended testing approaches:

#### Unit Testing
- Test individual components in isolation
- Mock external dependencies
- Focus on component behavior, not implementation

#### Integration Testing  
- Test component interactions
- API service integration
- Context provider functionality

#### E2E Testing
- Critical user flows
- Authentication flows
- Data persistence

### Recommended Testing Stack
- **Jest**: Testing framework
- **React Testing Library**: Component testing utilities
- **MSW (Mock Service Worker)**: API mocking
- **Cypress**: E2E testing

### Testing Patterns
```jsx
// Component testing example
import { render, screen, fireEvent } from '@testing-library/react';
import { AuthProvider } from '../contexts/AuthContext';
import LoginForm from '../components/auth/LoginForm';

const renderWithAuth = (component) => {
  return render(
    <AuthProvider>
      {component}
    </AuthProvider>
  );
};

test('should submit login form with valid credentials', () => {
  renderWithAuth(<LoginForm />);
  
  fireEvent.change(screen.getByLabelText(/email/i), {
    target: { value: 'test@example.com' }
  });
  
  fireEvent.click(screen.getByRole('button', { name: /login/i }));
  
  expect(screen.getByText(/logging in/i)).toBeInTheDocument();
});
```

## Contributing

### Development Workflow

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/new-feature
   ```

2. **Make Changes**
   - Follow coding standards
   - Add/update tests
   - Update documentation

3. **Run Quality Checks**
   ```bash
   npm run lint
   npm run format:check
   npm run test # when tests are added
   ```

4. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

5. **Push and Create PR**
   ```bash
   git push origin feature/new-feature
   ```

### Commit Message Format
Follow conventional commit format:
- `feat:` New features
- `fix:` Bug fixes  
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test additions/changes
- `chore:` Maintenance tasks

### Pull Request Guidelines
- Provide clear description of changes
- Include screenshots for UI changes
- Ensure all checks pass
- Request appropriate reviewers
- Update documentation as needed

### Issue Reporting
Use the provided issue templates for:
- Bug reports
- Feature requests
- Custom issues

### Code Review Checklist
- [ ] Code follows style guidelines
- [ ] Components are properly documented
- [ ] No console.log statements in production code
- [ ] Error handling is implemented
- [ ] Performance considerations addressed
- [ ] Accessibility guidelines followed
- [ ] Mobile responsiveness verified

## Performance Considerations

### Optimization Strategies

#### Component Optimization
- Use `React.memo` for pure components
- Implement `useMemo` for expensive calculations
- Use `useCallback` for event handlers in child components

#### Bundle Optimization
- Lazy load routes with `React.lazy`
- Code splitting at route level
- Tree shaking for unused code elimination

#### Image Optimization
- Use appropriate image formats (WebP, AVIF)
- Implement lazy loading for images
- Responsive images with multiple sizes

#### Data Fetching
- Implement proper caching strategies
- Use loading states for better UX
- Debounce search inputs
- Pagination for large datasets

### Performance Monitoring
- Monitor bundle sizes with build analysis
- Use React DevTools Profiler
- Implement error boundaries
- Track Core Web Vitals

## Security Considerations

### Authentication Security
- JWT tokens stored securely
- Automatic token refresh
- Secure logout functionality
- Password strength requirements

### Data Protection
- Input validation and sanitization
- XSS prevention measures
- CSRF protection
- Secure API communication (HTTPS)

### Content Security
- Image upload restrictions
- File type validation
- Size limitations
- Malicious content prevention

## Accessibility

### WCAG Compliance
- Semantic HTML structure
- Proper ARIA labels
- Keyboard navigation support
- Color contrast compliance
- Screen reader compatibility

### Implementation
- Focus management for modals
- Alt text for images
- Form labels and validation
- Skip navigation links
- Responsive text sizing

## Browser Support

### Supported Browsers
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

### Progressive Enhancement
- Core functionality works without JavaScript
- Graceful degradation for older browsers
- Feature detection over browser detection

## Maintenance

### Regular Tasks
- Dependency updates
- Security patches
- Performance monitoring
- Code quality reviews
- Documentation updates

### Monitoring
- Error tracking (recommended: Sentry)
- Performance monitoring
- User analytics
- API usage tracking

---

This documentation serves as a comprehensive guide for developers working on the FitTrack frontend application. It should be updated regularly as the application evolves and new features are added.