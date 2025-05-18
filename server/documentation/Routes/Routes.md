# Fitness App API Documentation

This document provides comprehensive information about the available endpoints in the Fitness App API.

## Table of Contents
- [Authentication](#authentication)
- [User Management](#user-management)
- [Admin](#admin)
- [Workouts](#workouts)
- [Workout Sessions](#workout-sessions)
- [Exercises](#exercises)
- [Goals](#goals)
- [Nutrition](#nutrition)
- [Nutrition Database](#nutrition-database)
- [Profile](#profile)
- [Uploads](#uploads)
- [Notifications](#notifications)

## Authentication

Authentication routes for user registration, login, and account management.

| Method | Endpoint | Authentication | Description |
|--------|----------|----------------|-------------|
| `POST` | `/api/auth/register` | Public | Register a new user |
| `POST` | `/api/auth/login` | Public | Login an existing user |
| `POST` | `/api/auth/forgot-password` | Public | Request password reset |
| `POST` | `/api/auth/refresh-token` | Public | Refresh authentication token |
| `GET` | `/api/auth/me` | Protected | Get current user information |
| `PUT` | `/api/auth/password` | Protected | Update password |

## User Management

Routes for managing user profile and preferences.

| Method | Endpoint | Authentication | Description |
|--------|----------|----------------|-------------|
| `GET` | `/api/users` | Protected | Get user profile |
| `PUT` | `/api/users` | Protected | Update user profile |
| `DELETE` | `/api/users` | Protected | Delete user account |
| `PATCH` | `/api/users/preferences` | Protected | Update user preferences |

## Admin

Routes for administrative functions (admin access only).

| Method | Endpoint | Authentication | Description |
|--------|----------|----------------|-------------|
| `GET` | `/api/admin/stats` | Admin | Get admin dashboard statistics |
| `GET` | `/api/admin/users` | Admin | Get all users |
| `GET` | `/api/admin/users/:id` | Admin | Get specific user |
| `PUT` | `/api/admin/users/:id` | Admin | Update user |
| `DELETE` | `/api/admin/users/:id` | Admin | Delete user |
| `GET` | `/api/admin/overview` | Admin | Get system overview |
| `GET` | `/api/admin/analytics` | Admin | Get analytics data |
| `POST` | `/api/admin/announcements` | Admin | Send announcement to users |
| `GET` | `/api/admin/notifications` | Admin | Get administrative notifications |

## Workouts

Routes for workout management.

| Method | Endpoint | Authentication | Description |
|--------|----------|----------------|-------------|
| `GET` | `/api/workouts` | Protected | Get all workouts |
| `POST` | `/api/workouts` | Protected | Create new workout |
| `GET` | `/api/workouts/recommended` | Protected | Get recommended workouts |
| `GET` | `/api/workouts/:id` | Protected | Get specific workout |
| `PUT` | `/api/workouts/:id` | Protected | Update workout |
| `DELETE` | `/api/workouts/:id` | Protected | Delete workout |
| `POST` | `/api/workouts/:id/ratings` | Protected | Rate a workout |

## Workout Sessions

Routes for tracking completed workout sessions.

| Method | Endpoint | Authentication | Description |
|--------|----------|----------------|-------------|
| `GET` | `/api/workout-sessions` | Protected | Get all workout sessions |
| `POST` | `/api/workout-sessions` | Protected | Log new workout session |
| `GET` | `/api/workout-sessions/stats` | Protected | Get workout statistics |
| `GET` | `/api/workout-sessions/:id` | Protected | Get specific workout session |
| `PUT` | `/api/workout-sessions/:id` | Protected | Update workout session |
| `DELETE` | `/api/workout-sessions/:id` | Protected | Delete workout session |

## Exercises

Routes for exercise management.

| Method | Endpoint | Authentication | Description |
|--------|----------|----------------|-------------|
| `GET` | `/api/exercises` | Protected | Get all exercises |
| `POST` | `/api/exercises` | Admin | Create new exercise |
| `GET` | `/api/exercises/muscle-groups/:group` | Protected | Get exercises by muscle group |
| `GET` | `/api/exercises/:id` | Protected | Get specific exercise |
| `PUT` | `/api/exercises/:id` | Admin | Update exercise |
| `DELETE` | `/api/exercises/:id` | Admin | Delete exercise |
| `POST` | `/api/exercises/:id/ratings` | Protected | Rate an exercise |

## Goals

Routes for user fitness goals.

| Method | Endpoint | Authentication | Description |
|--------|----------|----------------|-------------|
| `GET` | `/api/goals` | Protected | Get all goals |
| `POST` | `/api/goals` | Protected | Create new goal |
| `GET` | `/api/goals/:id` | Protected | Get specific goal |
| `PUT` | `/api/goals/:id` | Protected | Update goal |
| `DELETE` | `/api/goals/:id` | Protected | Delete goal |
| `PATCH` | `/api/goals/:id/progress` | Protected | Update goal progress |

## Nutrition

Routes for nutrition tracking.

| Method | Endpoint | Authentication | Description |
|--------|----------|----------------|-------------|
| `GET` | `/api/nutrition/logs` | Protected | Get all nutrition logs |
| `POST` | `/api/nutrition/logs` | Protected | Create nutrition log |
| `GET` | `/api/nutrition/logs/:id` | Protected | Get specific nutrition log |
| `PUT` | `/api/nutrition/logs/:id` | Protected | Update nutrition log |
| `DELETE` | `/api/nutrition/logs/:id` | Protected | Delete nutrition log |
| `POST` | `/api/nutrition/logs/:id/meals` | Protected | Add meal to nutrition log |
| `PUT` | `/api/nutrition/logs/:id/meals/:mealId` | Protected | Update meal in nutrition log |
| `DELETE` | `/api/nutrition/logs/:id/meals/:mealId` | Protected | Delete meal from nutrition log |
| `PATCH` | `/api/nutrition/water` | Protected | Update water intake |
| `GET` | `/api/nutrition/stats` | Protected | Get nutrition statistics |

## Nutrition Database

Routes for managing nutrition items (admin only).

| Method | Endpoint | Authentication | Description |
|--------|----------|----------------|-------------|
| `GET` | `/api/admin/nutrition` | Admin | Get all nutrition items |
| `POST` | `/api/admin/nutrition` | Admin | Create nutrition item |
| `GET` | `/api/admin/nutrition/:id` | Admin | Get specific nutrition item |
| `PUT` | `/api/admin/nutrition/:id` | Admin | Update nutrition item |
| `DELETE` | `/api/admin/nutrition/:id` | Admin | Delete nutrition item |

## Profile

Routes for user profile measurements and progress photos.

| Method | Endpoint | Authentication | Description |
|--------|----------|----------------|-------------|
| `GET` | `/api/profile/measurements` | Protected | Get all measurements |
| `POST` | `/api/profile/measurements` | Protected | Add new measurement |
| `PUT` | `/api/profile/measurements/:id` | Protected | Update measurement |
| `DELETE` | `/api/profile/measurements/:id` | Protected | Delete measurement |
| `GET` | `/api/profile/progress-photos` | Protected | Get all progress photos |
| `POST` | `/api/profile/progress-photos` | Protected | Upload progress photo |
| `DELETE` | `/api/profile/progress-photos/:id` | Protected | Delete progress photo |
| `GET` | `/api/profile/progress-photos/comparison` | Protected | Compare progress photos |

## Uploads

Routes for file uploads.

| Method | Endpoint | Authentication | Description |
|--------|----------|----------------|-------------|
| `POST` | `/api/uploads/progress-photo` | Protected | Upload progress photo |
| `POST` | `/api/uploads/profile-picture` | Protected | Upload profile picture |
| `DELETE` | `/api/uploads/progress-photo/:id` | Protected | Delete progress photo |
| `GET` | `/api/uploads/:folder/:filename` | Public | Serve uploaded files |

## Notifications

Routes for user notifications.

| Method | Endpoint | Authentication | Description |
|--------|----------|----------------|-------------|
| `GET` | `/api/notifications` | Protected | Get all notifications |
| `PATCH` | `/api/notifications/:id/read` | Protected | Mark notification as read |
| `PATCH` | `/api/notifications/read-all` | Protected | Mark all notifications as read |
| `DELETE` | `/api/notifications/:id` | Protected | Delete notification |
| `PUT` | `/api/notifications/preferences` | Protected | Update notification preferences |

## Authentication Types

- **Public**: No authentication required
- **Protected**: User authentication required (JWT token)
- **Admin**: Admin privileges required (authenticated user with admin role)

## Error Responses

All API endpoints follow a consistent error response format:

```json
{
  "error": {
    "message": "Error message description",
    "code": "ERROR_CODE"
  }
}
```

## Success Responses

Success responses will include a status indicator and the requested data:

```json
{
  "success": true,
  "data": { ... }
}
```

## Pagination

Endpoints that return multiple items support pagination with the following query parameters:

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

Example: `/api/workouts?page=2&limit=20`

## Filtering and Sorting

Many collection endpoints support filtering and sorting:

- Filtering: `/api/exercises?muscleGroup=chest`
- Sorting: `/api/workouts?sort=createdAt:desc`

## Rate Limiting

The API implements rate limiting to prevent abuse. Excessive requests will result in a 429 (Too Many Requests) response.