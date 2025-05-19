
/**
 * Pagination helper for MongoDB queries
 * @param {Object} req - Express request object
 * @param {Object} query - Mongoose query object
 * @param {Object} options - Additional options
 * @returns {Object} Pagination data and query modifiers
 */
exports.getPagination = (req, query = {}, options = {}) => {
          // Get pagination parameters from request query
          const page = parseInt(req.query.page, 10) || 1;
          const limit = parseInt(req.query.limit, 10) || options.defaultLimit || 10;
          
          // Calculate indices
          const startIndex = (page - 1) * limit;
          const endIndex = page * limit;
        
          // Build pagination result object
          const pagination = {
            page,
            limit,
            startIndex,
            endIndex
          };
        
          // Add next page if available
          if (endIndex < options.totalDocs) {
            pagination.next = {
              page: page + 1,
              limit
            };
          }
        
          // Add previous page if available
          if (startIndex > 0) {
            pagination.prev = {
              page: page - 1,
              limit
            };
          }
        
          // Add total information if provided
          if (options.totalDocs !== undefined) {
            pagination.total = options.totalDocs;
            pagination.pages = Math.ceil(options.totalDocs / limit);
          }
        
          return pagination;
        };
        
        /**
         * Apply pagination to a Mongoose query
         * @param {Object} query - Mongoose query
         * @param {Object} pagination - Pagination data from getPagination
         * @returns {Object} Modified query with pagination
         */
        exports.applyPagination = (query, pagination) => {
          return query.skip(pagination.startIndex).limit(pagination.limit);
        };
        
        /**
         * Complete pagination handler - combining count, pagination and query in one function
         * @param {Object} req - Express request
         * @param {Object} Model - Mongoose model
         * @param {Object} query - Query conditions
         * @param {Object} options - Additional options
         * @returns {Promise<Object>} Full pagination result
         */
        exports.paginateResults = async (req, Model, query = {}, options = {}) => {
          try {
            // Count total documents
            const totalDocs = await Model.countDocuments(query);
            
            // Calculate pagination
            const pagination = exports.getPagination(req, query, {
              ...options,
              totalDocs
            });
            
            // Apply basic pagination to query
            let resultQuery = Model.find(query);
            
            // Apply sort if provided in options
            if (options.sort) {
              resultQuery = resultQuery.sort(options.sort);
            }
            
            // Apply population if provided in options
            if (options.populate) {
              if (Array.isArray(options.populate)) {
                options.populate.forEach(field => {
                  resultQuery = resultQuery.populate(field);
                });
              } else {
                resultQuery = resultQuery.populate(options.populate);
              }
            }
            
            // Apply pagination
            resultQuery = exports.applyPagination(resultQuery, pagination);
            
            // Execute query
            const results = await resultQuery;
            
            return {
              success: true,
              count: results.length,
              pagination: {
                ...pagination,
                total: totalDocs,
                pages: Math.ceil(totalDocs / pagination.limit)
              },
              data: results
            };
          } catch (error) {
            console.error('Pagination error:', error);
            throw error;
          }
        };