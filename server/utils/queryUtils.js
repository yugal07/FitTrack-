// server/utils/queryUtils.js
/**
 * Build a MongoDB filter query from request query parameters
 * @param {Object} reqQuery - Express request.query object
 * @param {Array} allowedFilters - Array of allowed filter fields
 * @param {Object} specialFilters - Object mapping field names to special filter functions
 * @returns {Object} MongoDB filter query
 */
exports.buildFilterQuery = (reqQuery, allowedFilters = [], specialFilters = {}) => {
          // Create a copy of the request query
          const queryObj = { ...reqQuery };
          
          // Fields to exclude from filtering (pagination, sorting, etc.)
          const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
          excludedFields.forEach(field => delete queryObj[field]);
          
          // Filter out any fields not in allowedFilters
          Object.keys(queryObj).forEach(key => {
            if (!allowedFilters.includes(key) && !specialFilters[key]) {
              delete queryObj[key];
            }
          });
          
          // Process special filters
          Object.keys(specialFilters).forEach(key => {
            if (queryObj[key] !== undefined) {
              const filterValue = queryObj[key];
              const filterFunction = specialFilters[key];
              
              // Replace the original filter with the processed one
              delete queryObj[key];
              
              // Apply the special filter
              const specialFilter = filterFunction(filterValue);
              
              // Merge the result into the query
              Object.assign(queryObj, specialFilter);
            }
          });
          
          return queryObj;
        };
        
        /**
         * Build a MongoDB search query from a search term
         * @param {string} searchTerm - The search term
         * @param {Array} searchFields - Array of fields to search in
         * @returns {Object} MongoDB search query ($or clause)
         */
        exports.buildSearchQuery = (searchTerm, searchFields = []) => {
          if (!searchTerm || !searchFields.length) {
            return {};
          }
          
          return {
            $or: searchFields.map(field => ({
              [field]: { $regex: searchTerm, $options: 'i' }
            }))
          };
        };
        
        /**
         * Parse sorting parameter and return MongoDB sort object
         * @param {string} sortString - Comma-separated sort fields (prefix with - for desc)
         * @param {string} defaultSort - Default sort if none provided
         * @returns {Object} MongoDB sort object
         */
        exports.parseSortQuery = (sortString, defaultSort = '-createdAt') => {
          if (!sortString) {
            return defaultSort;
          }
          
          return sortString.split(',').join(' ');
        };
        
        /**
         * Combine filter and search queries
         * @param {Object} filterQuery - MongoDB filter query
         * @param {Object} searchQuery - MongoDB search query
         * @returns {Object} Combined query
         */
        exports.combineQueries = (filterQuery, searchQuery) => {
          if (Object.keys(searchQuery).length === 0) {
            return filterQuery;
          }
          
          if (Object.keys(filterQuery).length === 0) {
            return searchQuery;
          }
          
          return { $and: [filterQuery, searchQuery] };
        };
        
        /**
         * Process request query and build a complete MongoDB query
         * @param {Object} req - Express request
         * @param {Object} options - Query options
         * @returns {Object} Query processing result
         */
        exports.processQuery = (req, options = {}) => {
          const {
            allowedFilters = [],
            searchFields = [],
            defaultSort = '-createdAt',
            specialFilters = {}
          } = options;
          
          // Build filter query
          const filterQuery = exports.buildFilterQuery(req.query, allowedFilters, specialFilters);
          
          // Build search query if search term is provided
          const searchQuery = exports.buildSearchQuery(req.query.search, searchFields);
          
          // Combine filter and search queries
          const query = exports.combineQueries(filterQuery, searchQuery);
          
          // Parse sort parameter
          const sort = exports.parseSortQuery(req.query.sort, defaultSort);
          
          return {
            query,
            sort,
            page: parseInt(req.query.page, 10) || 1,
            limit: parseInt(req.query.limit, 10) || 10
          };
        };