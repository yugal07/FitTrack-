# Query and Pagination Utils Documentation

## Overview

The Query and Pagination Utils are essential utility modules for handling database queries, filtering, searching, sorting, and pagination in the MERN stack application. These utilities provide a standardized and efficient way to process client requests and interact with MongoDB through Mongoose.

## Modules

### 1. paginationUtils.js
Handles pagination logic for MongoDB queries with support for counting, page navigation, and result limiting.

### 2. queryUtils.js
Provides query building utilities for filtering, searching, sorting, and combining MongoDB queries based on request parameters.

---

## Pagination Utils (`paginationUtils.js`)

### Core Functions

#### `getPagination(req, query, options)`

Creates pagination metadata from request parameters.

**Parameters:**
- `req` (Object): Express request object containing query parameters
- `query` (Object): Mongoose query object (optional, defaults to `{}`)
- `options` (Object): Additional configuration options

**Options:**
- `defaultLimit` (Number): Default number of items per page (default: 10)
- `totalDocs` (Number): Total document count for navigation calculations

**Returns:**
```javascript
{
  page: Number,           // Current page number
  limit: Number,          // Items per page
  startIndex: Number,     // Starting index for current page
  endIndex: Number,       // Ending index for current page
  next: {                 // Next page info (if available)
    page: Number,
    limit: Number
  },
  prev: {                 // Previous page info (if available)
    page: Number,
    limit: Number
  },
  total: Number,          // Total documents (if totalDocs provided)
  pages: Number           // Total pages (if totalDocs provided)
}
```

**Example:**
```javascript
const pagination = getPagination(req, {}, { defaultLimit: 20, totalDocs: 150 });
// Result for page=2, limit=20:
// { page: 2, limit: 20, startIndex: 20, endIndex: 40, prev: { page: 1, limit: 20 }, next: { page: 3, limit: 20 }, total: 150, pages: 8 }
```

#### `applyPagination(query, pagination)`

Applies pagination to a Mongoose query using skip and limit.

**Parameters:**
- `query` (Object): Mongoose query object
- `pagination` (Object): Pagination data from `getPagination`

**Returns:** Modified Mongoose query with skip and limit applied

**Example:**
```javascript
const query = User.find({ active: true });
const paginatedQuery = applyPagination(query, pagination);
// Equivalent to: query.skip(20).limit(20)
```

#### `paginateResults(req, Model, query, options)`

Complete pagination solution that handles counting, pagination, and query execution in one function.

**Parameters:**
- `req` (Object): Express request object
- `Model` (Object): Mongoose model
- `query` (Object): Query conditions (default: `{}`)
- `options` (Object): Additional options

**Options:**
- `sort` (String|Object): Sort criteria
- `populate` (String|Array|Object): Fields to populate
- `defaultLimit` (Number): Default pagination limit

**Returns:**
```javascript
{
  success: Boolean,
  count: Number,          // Number of results in current page
  pagination: {
    page: Number,
    limit: Number,
    startIndex: Number,
    endIndex: Number,
    next: Object,         // Next page info
    prev: Object,         // Previous page info
    total: Number,        // Total documents
    pages: Number         // Total pages
  },
  data: Array             // Query results
}
```

**Example:**
```javascript
const result = await paginateResults(req, User, 
  { active: true }, 
  { 
    sort: '-createdAt',
    populate: 'profile',
    defaultLimit: 15
  }
);
```

---

## Query Utils (`queryUtils.js`)

### Core Functions

#### `buildFilterQuery(reqQuery, allowedFilters, specialFilters)`

Builds a MongoDB filter query from request query parameters with security filtering.

**Parameters:**
- `reqQuery` (Object): Express request.query object
- `allowedFilters` (Array): Whitelist of allowed filter fields
- `specialFilters` (Object): Custom filter functions for complex filtering

**Returns:** MongoDB filter query object

**Security Features:**
- Automatically excludes pagination/system parameters (`page`, `sort`, `limit`, `fields`, `search`)
- Whitelist filtering - only allows specified fields
- Custom filter processing for complex queries

**Example:**
```javascript
const allowedFilters = ['status', 'category', 'userId'];
const specialFilters = {
  dateRange: (value) => {
    const [start, end] = value.split(',');
    return {
      createdAt: {
        $gte: new Date(start),
        $lte: new Date(end)
      }
    };
  }
};

const filterQuery = buildFilterQuery(req.query, allowedFilters, specialFilters);
// Input: ?status=active&category=fitness&dateRange=2024-01-01,2024-12-31&page=1
// Output: { status: 'active', category: 'fitness', createdAt: { $gte: Date, $lte: Date } }
```

#### `buildSearchQuery(searchTerm, searchFields)`

Creates a MongoDB search query using regex for text searching across multiple fields.

**Parameters:**
- `searchTerm` (String): The search term
- `searchFields` (Array): Fields to search in

**Returns:** MongoDB `$or` query for text searching

**Features:**
- Case-insensitive search (`$options: 'i'`)
- Multi-field search with OR logic
- Regex-based partial matching

**Example:**
```javascript
const searchQuery = buildSearchQuery('john', ['name', 'email', 'username']);
// Output: {
//   $or: [
//     { name: { $regex: 'john', $options: 'i' } },
//     { email: { $regex: 'john', $options: 'i' } },
//     { username: { $regex: 'john', $options: 'i' } }
//   ]
// }
```

#### `parseSortQuery(sortString, defaultSort)`

Parses sorting parameters and converts them to MongoDB sort format.

**Parameters:**
- `sortString` (String): Comma-separated sort fields (prefix with `-` for descending)
- `defaultSort` (String): Default sort if none provided (default: `-createdAt`)

**Returns:** MongoDB sort string

**Sort Syntax:**
- `name` - Ascending sort by name
- `-name` - Descending sort by name
- `name,-createdAt` - Sort by name ascending, then createdAt descending

**Example:**
```javascript
const sort = parseSortQuery('name,-createdAt,status');
// Output: 'name -createdAt status'
// MongoDB equivalent: { name: 1, createdAt: -1, status: 1 }
```

#### `combineQueries(filterQuery, searchQuery)`

Combines filter and search queries using MongoDB `$and` operator when both exist.

**Parameters:**
- `filterQuery` (Object): MongoDB filter query
- `searchQuery` (Object): MongoDB search query

**Returns:** Combined MongoDB query

**Logic:**
- If only filter exists: returns filter query
- If only search exists: returns search query
- If both exist: returns `{ $and: [filterQuery, searchQuery] }`

**Example:**
```javascript
const combined = combineQueries(
  { status: 'active' },
  { $or: [{ name: { $regex: 'john', $options: 'i' } }] }
);
// Output: {
//   $and: [
//     { status: 'active' },
//     { $or: [{ name: { $regex: 'john', $options: 'i' } }] }
//   ]
// }
```

#### `processQuery(req, options)`

Complete query processing function that combines all query utilities.

**Parameters:**
- `req` (Object): Express request object
- `options` (Object): Configuration options

**Options:**
- `allowedFilters` (Array): Whitelist of filterable fields
- `searchFields` (Array): Fields available for text search
- `defaultSort` (String): Default sort criteria
- `specialFilters` (Object): Custom filter functions

**Returns:**
```javascript
{
  query: Object,    // Combined MongoDB query
  sort: String,     // MongoDB sort string
  page: Number,     // Current page number
  limit: Number     // Items per page
}
```

**Example:**
```javascript
const queryResult = processQuery(req, {
  allowedFilters: ['status', 'category'],
  searchFields: ['name', 'description'],
  defaultSort: '-updatedAt',
  specialFilters: {
    priceRange: (value) => {
      const [min, max] = value.split(',').map(Number);
      return { price: { $gte: min, $lte: max } };
    }
  }
});
```

---

## Usage Examples

### Basic Pagination

```javascript
const { paginateResults } = require('../utils/paginationUtils');

// In your controller
exports.getUsers = async (req, res) => {
  try {
    const result = await paginateResults(
      req,
      User,
      { active: true },
      {
        sort: '-createdAt',
        populate: 'profile',
        defaultLimit: 20
      }
    );
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

### Advanced Query Processing

```javascript
const { processQuery } = require('../utils/queryUtils');
const { paginateResults } = require('../utils/paginationUtils');

exports.searchWorkouts = async (req, res) => {
  try {
    const queryOptions = {
      allowedFilters: ['difficulty', 'type', 'duration'],
      searchFields: ['name', 'description', 'tags'],
      defaultSort: '-popularity',
      specialFilters: {
        durationRange: (value) => {
          const [min, max] = value.split(',').map(Number);
          return {
            duration: { $gte: min, $lte: max }
          };
        }
      }
    };

    const { query, sort } = processQuery(req, queryOptions);

    const result = await paginateResults(
      req,
      Workout,
      query,
      { sort, defaultLimit: 12 }
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

### Custom Filter Examples

```javascript
const specialFilters = {
  // Date range filtering
  dateRange: (value) => {
    const [start, end] = value.split(',');
    return {
      createdAt: {
        $gte: new Date(start),
        $lte: new Date(end)
      }
    };
  },

  // Price range filtering
  priceRange: (value) => {
    const [min, max] = value.split(',').map(Number);
    return {
      price: { $gte: min, $lte: max }
    };
  },

  // Location-based filtering
  nearLocation: (value) => {
    const [lat, lng, radius] = value.split(',').map(Number);
    return {
      location: {
        $geoWithin: {
          $centerSphere: [[lng, lat], radius / 3963.2] // radius in miles
        }
      }
    };
  },

  // Array field filtering
  hasSkills: (value) => {
    const skills = value.split(',');
    return {
      skills: { $in: skills }
    };
  }
};
```

---

## API Query Format

### Request URL Examples

```bash
# Basic pagination
GET /api/users?page=2&limit=20

# Filtering
GET /api/workouts?difficulty=beginner&type=cardio

# Searching
GET /api/users?search=john

# Sorting
GET /api/workouts?sort=name,-createdAt

# Combined query
GET /api/workouts?search=yoga&difficulty=intermediate&sort=-rating&page=1&limit=15

# Special filters
GET /api/workouts?durationRange=30,60&dateRange=2024-01-01,2024-12-31
```

### Response Format

```javascript
{
  "success": true,
  "count": 15,
  "pagination": {
    "page": 2,
    "limit": 15,
    "startIndex": 15,
    "endIndex": 30,
    "prev": {
      "page": 1,
      "limit": 15
    },
    "next": {
      "page": 3,
      "limit": 15
    },
    "total": 127,
    "pages": 9
  },
  "data": [
    // ... results array
  ]
}
```

---

## Best Practices

### Security Considerations

1. **Always use allowedFilters whitelist** to prevent NoSQL injection
2. **Validate special filter inputs** to prevent malicious queries
3. **Limit maximum page size** to prevent resource exhaustion
4. **Sanitize search terms** for security

```javascript
const allowedFilters = ['status', 'category']; // Whitelist only
const maxLimit = 100; // Prevent large queries

const limit = Math.min(parseInt(req.query.limit) || 10, maxLimit);
```

### Performance Optimization

1. **Use indexes** on frequently filtered/sorted fields
2. **Implement field selection** to reduce data transfer
3. **Consider caching** for expensive queries
4. **Use aggregation** for complex queries

```javascript
// Add indexes for better performance
db.users.createIndex({ "status": 1, "createdAt": -1 });
db.workouts.createIndex({ "difficulty": 1, "type": 1 });

// Field selection example
const result = Model.find(query).select('name email status');
```

### Error Handling

```javascript
exports.getUsers = async (req, res) => {
  try {
    // Validate pagination parameters
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));

    const result = await paginateResults(req, User, query, options);
    res.json(result);
  } catch (error) {
    console.error('Query error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch data',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
```

---

## Testing

### Unit Test Examples

```javascript
const { buildFilterQuery, buildSearchQuery } = require('../utils/queryUtils');

describe('Query Utils', () => {
  test('should build filter query with allowed fields', () => {
    const reqQuery = { status: 'active', category: 'fitness', page: 1 };
    const allowedFilters = ['status', 'category'];
    
    const result = buildFilterQuery(reqQuery, allowedFilters);
    
    expect(result).toEqual({ status: 'active', category: 'fitness' });
    expect(result.page).toBeUndefined();
  });

  test('should build search query', () => {
    const result = buildSearchQuery('test', ['name', 'description']);
    
    expect(result.$or).toHaveLength(2);
    expect(result.$or[0].name.$regex).toBe('test');
    expect(result.$or[0].name.$options).toBe('i');
  });
});
```

### Integration Test Examples

```javascript
const request = require('supertest');
const app = require('../app');

describe('Pagination Integration', () => {
  test('should return paginated results', async () => {
    const response = await request(app)
      .get('/api/users?page=1&limit=5')
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.pagination.page).toBe(1);
    expect(response.body.pagination.limit).toBe(5);
    expect(response.body.data).toHaveLength(5);
  });
});
```

---

## Troubleshooting

### Common Issues

1. **Memory Usage**: Large skip values can be inefficient
   - **Solution**: Use cursor-based pagination for large datasets

2. **Query Performance**: Complex queries with multiple filters
   - **Solution**: Create compound indexes, use aggregation pipeline

3. **Invalid Parameters**: Non-numeric page/limit values
   - **Solution**: Add parameter validation and default values

4. **Security**: Unfiltered query parameters
   - **Solution**: Always use allowedFilters whitelist

### Debug Tips

```javascript
// Enable query debugging
mongoose.set('debug', true);

// Log processed queries
console.log('Processed query:', JSON.stringify(query, null, 2));
console.log('Sort criteria:', sort);
console.log('Pagination:', pagination);
```