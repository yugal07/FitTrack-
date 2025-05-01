// src/pages/admin/UserList.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Button,
  Menu,
  MenuItem,
  Avatar,
  Tooltip,
  CircularProgress,
  alpha,
  useTheme,
  Divider
} from '@mui/material';
import {
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  FilterList as FilterListIcon,
  PersonAdd as PersonAddIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
  Block as BlockIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';

// Mock data for users
const mockUsers = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    role: 'user',
    status: 'active',
    fitnessLevel: 'intermediate',
    lastLogin: '2025-04-30T15:30:45.000Z',
    createdAt: '2025-01-15T10:20:30.000Z'
  },
  {
    id: 2,
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@example.com',
    role: 'user',
    status: 'active',
    fitnessLevel: 'beginner',
    lastLogin: '2025-04-29T09:15:20.000Z',
    createdAt: '2025-02-10T14:25:10.000Z'
  },
  {
    id: 3,
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@fittrack.com',
    role: 'admin',
    status: 'active',
    fitnessLevel: 'advanced',
    lastLogin: '2025-05-01T08:45:30.000Z',
    createdAt: '2025-01-01T00:00:00.000Z'
  },
  {
    id: 4,
    firstName: 'Michael',
    lastName: 'Brown',
    email: 'michael@example.com',
    role: 'user',
    status: 'inactive',
    fitnessLevel: 'intermediate',
    lastLogin: '2025-03-15T16:40:20.000Z',
    createdAt: '2025-02-28T11:35:40.000Z'
  },
  {
    id: 5,
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah@example.com',
    role: 'user',
    status: 'active',
    fitnessLevel: 'advanced',
    lastLogin: '2025-04-28T12:20:15.000Z',
    createdAt: '2025-01-20T09:10:35.000Z'
  },
  {
    id: 6,
    firstName: 'David',
    lastName: 'Wilson',
    email: 'david@example.com',
    role: 'user',
    status: 'blocked',
    fitnessLevel: 'beginner',
    lastLogin: '2025-02-10T10:30:45.000Z',
    createdAt: '2025-01-25T13:45:50.000Z'
  },
  {
    id: 7,
    firstName: 'Emily',
    lastName: 'Davis',
    email: 'emily@example.com',
    role: 'user',
    status: 'active',
    fitnessLevel: 'intermediate',
    lastLogin: '2025-04-29T14:50:30.000Z',
    createdAt: '2025-03-05T16:55:10.000Z'
  },
  {
    id: 8,
    firstName: 'Robert',
    lastName: 'Martinez',
    email: 'robert@example.com',
    role: 'user',
    status: 'active',
    fitnessLevel: 'beginner',
    lastLogin: '2025-04-25T11:40:20.000Z',
    createdAt: '2025-02-15T08:30:25.000Z'
  },
  {
    id: 9,
    firstName: 'Jessica',
    lastName: 'Taylor',
    email: 'jessica@example.com',
    role: 'user',
    status: 'active',
    fitnessLevel: 'advanced',
    lastLogin: '2025-04-30T09:25:15.000Z',
    createdAt: '2025-03-10T13:15:40.000Z'
  },
  {
    id: 10,
    firstName: 'Daniel',
    lastName: 'Anderson',
    email: 'daniel@example.com',
    role: 'user',
    status: 'inactive',
    fitnessLevel: 'intermediate',
    lastLogin: '2025-04-10T15:20:30.000Z',
    createdAt: '2025-02-20T10:05:15.000Z'
  }
];

const UserList = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setUsers(mockUsers);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Handle row menu open
  const handleMenuOpen = (event, userId) => {
    setAnchorEl(event.currentTarget);
    setSelectedUserId(userId);
  };

  // Handle row menu close
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUserId(null);
  };

  // Handle filter menu
  const handleFilterMenuOpen = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterMenuClose = () => {
    setFilterAnchorEl(null);
  };

  // Handle status filter change
  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    handleFilterMenuClose();
  };

  // Handle role filter change
  const handleRoleFilterChange = (role) => {
    setRoleFilter(role);
    handleFilterMenuClose();
  };

  // Filter users based on search query and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      searchQuery === '' || 
      user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesStatus && matchesRole;
  });

  // Reset filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setRoleFilter('all');
    handleFilterMenuClose();
  };

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Get status chip color and icon
  const getStatusChip = (status) => {
    switch (status) {
      case 'active':
        return { 
          color: 'success', 
          icon: <ActiveIcon fontSize="small" />,
          label: 'Active'
        };
      case 'inactive':
        return { 
          color: 'warning', 
          icon: <InactiveIcon fontSize="small" />,
          label: 'Inactive'
        };
      case 'blocked':
        return { 
          color: 'error', 
          icon: <BlockIcon fontSize="small" />,
          label: 'Blocked'
        };
      default:
        return { 
          color: 'default', 
          icon: null,
          label: status
        };
    }
  };

  // Simulate user action handlers
  const handleEditUser = (userId) => {
    console.log(`Edit user with ID: ${userId}`);
    handleMenuClose();
  };

  const handleDeleteUser = (userId) => {
    console.log(`Delete user with ID: ${userId}`);
    handleMenuClose();
  };

  const handleChangeStatus = (userId, newStatus) => {
    console.log(`Change status of user ${userId} to ${newStatus}`);
    // In a real app, you would call an API to update the user status
    // and then refresh the user list
    setUsers(users.map(user => 
      user.id === userId ? { ...user, status: newStatus } : user
    ));
    handleMenuClose();
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          User Management
        </Typography>
        
        <Button 
          variant="contained" 
          startIcon={<PersonAddIcon />}
        >
          Add New User
        </Button>
      </Box>

      <Paper sx={{ mb: 3, p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <TextField
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            variant="outlined"
            size="small"
            sx={{ mr: 2, flex: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          
          <Button 
            startIcon={<FilterListIcon />}
            onClick={handleFilterMenuOpen}
            endIcon={
              statusFilter !== 'all' || roleFilter !== 'all' 
                ? <Chip 
                    label={statusFilter !== 'all' && roleFilter !== 'all' 
                      ? '2' 
                      : '1'} 
                    size="small" 
                    color="primary" 
                  /> 
                : null
            }
          >
            Filters
          </Button>
          
          <Menu
            anchorEl={filterAnchorEl}
            open={Boolean(filterAnchorEl)}
            onClose={handleFilterMenuClose}
            PaperProps={{
              elevation: 2,
              sx: { width: 250, p: 1 }
            }}
          >
            <Typography variant="subtitle2" sx={{ px: 2, py: 1 }}>
              Filter by Status
            </Typography>
            <MenuItem 
              onClick={() => handleStatusFilterChange('all')}
              selected={statusFilter === 'all'}
            >
              All Statuses
            </MenuItem>
            <MenuItem 
              onClick={() => handleStatusFilterChange('active')}
              selected={statusFilter === 'active'}
            >
              <ActiveIcon sx={{ mr: 1, color: theme.palette.success.main }} />
              Active
            </MenuItem>
            <MenuItem 
              onClick={() => handleStatusFilterChange('inactive')}
              selected={statusFilter === 'inactive'}
            >
              <InactiveIcon sx={{ mr: 1, color: theme.palette.warning.main }} />
              Inactive
            </MenuItem>
            <MenuItem 
              onClick={() => handleStatusFilterChange('blocked')}
              selected={statusFilter === 'blocked'}
            >
              <BlockIcon sx={{ mr: 1, color: theme.palette.error.main }} />
              Blocked
            </MenuItem>
            
            <Divider sx={{ my: 1 }} />
            
            <Typography variant="subtitle2" sx={{ px: 2, py: 1 }}>
              Filter by Role
            </Typography>
            <MenuItem 
              onClick={() => handleRoleFilterChange('all')}
              selected={roleFilter === 'all'}
            >
              All Roles
            </MenuItem>
            <MenuItem 
              onClick={() => handleRoleFilterChange('user')}
              selected={roleFilter === 'user'}
            >
              User
            </MenuItem>
            <MenuItem 
              onClick={() => handleRoleFilterChange('admin')}
              selected={roleFilter === 'admin'}
            >
              Admin
            </MenuItem>
            
            <Divider sx={{ my: 1 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 1 }}>
              <Button 
                startIcon={<RefreshIcon />}
                onClick={handleResetFilters}
                size="small"
              >
                Reset Filters
              </Button>
            </Box>
          </Menu>
        </Box>
        
        <Typography variant="body2" color="text.secondary">
          {filteredUsers.length} users found
        </Typography>
      </Paper>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Fitness Level</TableCell>
                <TableCell>Joined</TableCell>
                <TableCell>Last Login</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user) => {
                  const statusChip = getStatusChip(user.status);
                  
                  return (
                    <TableRow key={user.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar sx={{ mr: 2, bgcolor: user.role === 'admin' ? theme.palette.primary.main : undefined }}>
                            {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                          </Avatar>
                          <Typography>
                            {user.firstName} {user.lastName}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Chip 
                          label={user.role === 'admin' ? 'Admin' : 'User'} 
                          color={user.role === 'admin' ? 'primary' : 'default'} 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          icon={statusChip.icon}
                          label={statusChip.label} 
                          color={statusChip.color} 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell sx={{ textTransform: 'capitalize' }}>
                        {user.fitnessLevel}
                      </TableCell>
                      <TableCell>{formatDate(user.createdAt)}</TableCell>
                      <TableCell>{formatDate(user.lastLogin)}</TableCell>
                      <TableCell align="right">
                        <Tooltip title="User actions">
                          <IconButton
                            aria-label="user actions"
                            onClick={(e) => handleMenuOpen(e, user.id)}
                          >
                            <MoreVertIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Row action menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 2,
          sx: { width: 200 }
        }}
      >
        <MenuItem onClick={() => handleEditUser(selectedUserId)}>
          <EditIcon fontSize="small" sx={{ mr: 2 }} />
          Edit
        </MenuItem>
        
        <MenuItem onClick={() => handleChangeStatus(selectedUserId, 'active')}>
          <ActiveIcon fontSize="small" sx={{ mr: 2, color: theme.palette.success.main }} />
          Set Active
        </MenuItem>
        
        <MenuItem onClick={() => handleChangeStatus(selectedUserId, 'inactive')}>
          <InactiveIcon fontSize="small" sx={{ mr: 2, color: theme.palette.warning.main }} />
          Set Inactive
        </MenuItem>
        
        <MenuItem onClick={() => handleChangeStatus(selectedUserId, 'blocked')}>
          <BlockIcon fontSize="small" sx={{ mr: 2, color: theme.palette.error.main }} />
          Block User
        </MenuItem>
        
        <Divider />
        
        <MenuItem onClick={() => handleDeleteUser(selectedUserId)} sx={{ color: theme.palette.error.main }}>
          <DeleteIcon fontSize="small" sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default UserList;