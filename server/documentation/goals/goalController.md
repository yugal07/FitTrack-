# Goals API Documentation

This document outlines the API endpoints for managing fitness goals in the application. The Goals API allows users to create, read, update, and delete their personal fitness goals.

## File Directory

```
server/
├── documentation/
│   └── goals/
│       └── README.md (this file)
```

## Base URL

```
/api/goals
```

## Authentication

All endpoints in the Goals API require authentication. Include a valid JWT token in the `Authorization` header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

## Endpoints Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/goals` | Retrieve all goals for the authenticated user |
| POST | `/api/goals` | Create a new goal |
| GET | `/api/goals/:id` | Retrieve a specific goal |
| PUT | `/api/goals/:id` | Update a specific goal |
| DELETE | `/api/goals/:id` | Delete a specific goal |
| PATCH | `/api/goals/:id/progress` | Update progress for a specific goal |

## Detailed Endpoints

### Get All Goals

Retrieves all goals for the authenticated user.

**Request:**
```
GET /api/goals
```

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "60d21b4667d0d8992e610c85",
      "type": "weight",
      "targetValue": 75,
      "currentValue": 80,
      "unit": "kg",
      "startDate": "2025-04-10T00:00:00.000Z",
      "targetDate": "2025-07-10T00:00:00.000Z",
      "status": "active"
    },
    {
      "_id": "60d21b4667d0d8992e610c86",
      "type": "steps",
      "targetValue": 10000,
      "currentValue": 8500,
      "unit": "steps",
      "startDate": "2025-04-15T00:00:00.000Z",
      "targetDate": "2025-05-15T00:00:00.000Z",
      "status": "active"
    }
  ]
}
```

**Error Responses:**

- Profile Not Found (404):
```json
{
  "success": false,
  "error": {
    "code": "PROFILE_NOT_FOUND",
    "message": "Profile not found"
  }
}
```

- Server Error (500):
```json
{
  "success": false,
  "error": {
    "code": "SERVER_ERROR",
    "message": "Server error"
  }
}
```

### Create Goal

Creates a new goal for the authenticated user.

**Request:**
```
POST /api/goals
```

**Request Body:**
```json
{
  "type": "weight",
  "targetValue": 70,
  "currentValue": 80,
  "unit": "kg",
  "targetDate": "2025-08-10T00:00:00.000Z"
}
```

**Required Fields:**
- `type`: The type of goal (e.g., "weight", "steps", "distance")
- `targetValue`: The target value to achieve
- `targetDate`: The date by which to achieve the goal

**Optional Fields:**
- `currentValue`: The current progress value (defaults to 0)
- `unit`: The unit of measurement (e.g., "kg", "steps", "km")

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "60d21b4667d0d8992e610c87",
    "type": "weight",
    "targetValue": 70,
    "currentValue": 80,
    "unit": "kg",
    "startDate": "2025-05-10T00:00:00.000Z",
    "targetDate": "2025-08-10T00:00:00.000Z",
    "status": "active"
  },
  "message": "Goal created successfully"
}
```

**Error Responses:**

- Invalid Data (400):
```json
{
  "success": false,
  "error": {
    "code": "INVALID_DATA",
    "message": "Type, target value, and target date are required"
  }
}
```

- Profile Not Found (404):
```json
{
  "success": false,
  "error": {
    "code": "PROFILE_NOT_FOUND",
    "message": "Profile not found"
  }
}
```

- Server Error (500):
```json
{
  "success": false,
  "error": {
    "code": "SERVER_ERROR",
    "message": "Server error"
  }
}
```

### Get Specific Goal

Retrieves details for a specific goal.

**Request:**
```
GET /api/goals/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "60d21b4667d0d8992e610c85",
    "type": "weight",
    "targetValue": 75,
    "currentValue": 80,
    "unit": "kg",
    "startDate": "2025-04-10T00:00:00.000Z",
    "targetDate": "2025-07-10T00:00:00.000Z",
    "status": "active"
  }
}
```

**Error Responses:**

- Profile Not Found (404):
```json
{
  "success": false,
  "error": {
    "code": "PROFILE_NOT_FOUND",
    "message": "Profile not found"
  }
}
```

- Goal Not Found (404):
```json
{
  "success": false,
  "error": {
    "code": "GOAL_NOT_FOUND",
    "message": "Goal not found"
  }
}
```

- Server Error (500):
```json
{
  "success": false,
  "error": {
    "code": "SERVER_ERROR",
    "message": "Server error"
  }
}
```

### Update Goal

Updates an existing goal.

**Request:**
```
PUT /api/goals/:id
```

**Request Body:**
```json
{
  "type": "weight",
  "targetValue": 72,
  "currentValue": 76,
  "unit": "kg",
  "targetDate": "2025-08-15T00:00:00.000Z",
  "status": "active"
}
```

**Optional Fields:**
All fields are optional. Only include the fields you want to update.
- `type`: The type of goal
- `targetValue`: The target value to achieve
- `currentValue`: The current progress value
- `unit`: The unit of measurement
- `targetDate`: The date by which to achieve the goal
- `status`: The status of the goal ("active", "completed", "abandoned")

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "60d21b4667d0d8992e610c85",
    "type": "weight",
    "targetValue": 72,
    "currentValue": 76,
    "unit": "kg",
    "startDate": "2025-04-10T00:00:00.000Z",
    "targetDate": "2025-08-15T00:00:00.000Z",
    "status": "active"
  },
  "message": "Goal updated successfully"
}
```

**Note:** If `currentValue` is updated to be greater than or equal to `targetValue`, the status will automatically be set to "completed".

**Error Responses:**

- Profile Not Found (404):
```json
{
  "success": false,
  "error": {
    "code": "PROFILE_NOT_FOUND",
    "message": "Profile not found"
  }
}
```

- Goal Not Found (404):
```json
{
  "success": false,
  "error": {
    "code": "GOAL_NOT_FOUND",
    "message": "Goal not found"
  }
}
```

- Server Error (500):
```json
{
  "success": false,
  "error": {
    "code": "SERVER_ERROR",
    "message": "Server error"
  }
}
```

### Delete Goal

Deletes a specific goal.

**Request:**
```
DELETE /api/goals/:id
```

**Response:**
```json
{
  "success": true,
  "message": "Goal deleted successfully"
}
```

**Error Responses:**

- Profile Not Found (404):
```json
{
  "success": false,
  "error": {
    "code": "PROFILE_NOT_FOUND",
    "message": "Profile not found"
  }
}
```

- Goal Not Found (404):
```json
{
  "success": false,
  "error": {
    "code": "GOAL_NOT_FOUND",
    "message": "Goal not found"
  }
}
```

- Server Error (500):
```json
{
  "success": false,
  "error": {
    "code": "SERVER_ERROR",
    "message": "Server error"
  }
}
```

### Update Goal Progress

Updates the progress of a specific goal.

**Request:**
```
PATCH /api/goals/:id/progress
```

**Request Body:**
```json
{
  "currentValue": 78
}
```

**Required Fields:**
- `currentValue`: The new current value for the goal

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "60d21b4667d0d8992e610c85",
    "type": "weight",
    "targetValue": 75,
    "currentValue": 78,
    "unit": "kg",
    "startDate": "2025-04-10T00:00:00.000Z",
    "targetDate": "2025-07-10T00:00:00.000Z",
    "status": "active"
  },
  "message": "Goal progress updated successfully"
}
```

**Note:** If `currentValue` becomes greater than or equal to `targetValue`, the status will automatically be set to "completed". If the goal was previously completed but the `currentValue` is now less than `targetValue`, the status will be set back to "active".

**Error Responses:**

- Invalid Data (400):
```json
{
  "success": false,
  "error": {
    "code": "INVALID_DATA",
    "message": "Current value is required"
  }
}
```

- Profile Not Found (404):
```json
{
  "success": false,
  "error": {
    "code": "PROFILE_NOT_FOUND",
    "message": "Profile not found"
  }
}
```

- Goal Not Found (404):
```json
{
  "success": false,
  "error": {
    "code": "GOAL_NOT_FOUND",
    "message": "Goal not found"
  }
}
```

- Server Error (500):
```json
{
  "success": false,
  "error": {
    "code": "SERVER_ERROR",
    "message": "Server error"
  }
}
```

## Goal Object Structure

| Field | Type | Description |
|-------|------|-------------|
| _id | String | Unique identifier for the goal |
| type | String | Type of goal (e.g., "weight", "steps", "distance") |
| targetValue | Number | Target value to achieve |
| currentValue | Number | Current progress value |
| unit | String | Unit of measurement (e.g., "kg", "steps", "km") |
| startDate | Date | Date when the goal was created |
| targetDate | Date | Date by which to achieve the goal |
| status | String | Status of the goal ("active", "completed", "abandoned") |

## Status Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Resource created successfully |
| 400 | Bad request / Invalid data |
| 401 | Unauthorized / Invalid authentication |
| 404 | Resource not found |
| 500 | Server error |