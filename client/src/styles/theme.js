// src/styles/theme.js
import { createTheme } from '@mui/material/styles';

// Common theme settings
const commonSettings = {
  typography: {
    fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 16px',
          boxShadow: 'none',
          textTransform: 'none',
          fontWeight: 600,
          '&:hover': {
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
          },
        },
        containedPrimary: {
          '&:hover': {
            boxShadow: '0px 6px 12px rgba(0, 120, 255, 0.2)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
        elevation1: {
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
        },
        elevation2: {
          boxShadow: '0px 8px 30px rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          overflow: 'hidden',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          minWidth: 'auto',
          padding: '12px 16px',
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          height: 3,
          borderRadius: '3px 3px 0 0',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '4px 8px',
          padding: '10px 12px',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
        },
      },
    },
  },
};

// New color palette
const lightPalette = {
  primary: {
    main: '#4361ee', // Vibrant blue
    light: '#738efd',
    dark: '#2541b9',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#fb8500', // Energetic orange
    light: '#ffa53f',
    dark: '#c65d00',
    contrastText: '#ffffff',
  },
  error: {
    main: '#ef476f', // Vibrant pink-red
    light: '#ff7996',
    dark: '#b80046',
    contrastText: '#ffffff',
  },
  warning: {
    main: '#ffd166', // Bright yellow
    light: '#ffff99',
    dark: '#c9a030',
    contrastText: '#000000',
  },
  info: {
    main: '#118ab2', // Fresh teal
    light: '#59bae6',
    dark: '#005d82',
    contrastText: '#ffffff',
  },
  success: {
    main: '#06d6a0', // Mint green
    light: '#6effcf',
    dark: '#00a473',
    contrastText: '#000000',
  },
  background: {
    default: '#f9f9fb',
    paper: '#ffffff',
  },
  text: {
    primary: '#2b2d42',
    secondary: '#686d88',
  },
  divider: 'rgba(0, 0, 0, 0.08)',
};

const darkPalette = {
  primary: {
    main: '#738efd', // Lighter blue for dark mode
    light: '#a1bdff',
    dark: '#4361ee',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#ffa53f', // Lighter orange for dark mode
    light: '#ffd580',
    dark: '#fb8500',
    contrastText: '#000000',
  },
  error: {
    main: '#ff7996', // Lighter pink-red for dark mode
    light: '#ffa8c0',
    dark: '#ef476f',
    contrastText: '#000000',
  },
  warning: {
    main: '#ffe066', // Lighter yellow for dark mode
    light: '#ffff99',
    dark: '#ffd166',
    contrastText: '#000000',
  },
  info: {
    main: '#59bae6', // Lighter teal for dark mode
    light: '#8debff',
    dark: '#118ab2',
    contrastText: '#000000',
  },
  success: {
    main: '#70edbe', // Lighter mint green for dark mode
    light: '#a5ffef',
    dark: '#06d6a0',
    contrastText: '#000000',
  },
  background: {
    default: '#131a2a',
    paper: '#1c2333',
  },
  text: {
    primary: '#e2e7ff',
    secondary: '#a3aed0',
  },
  divider: 'rgba(255, 255, 255, 0.08)',
};

// Light theme
const lightTheme = createTheme({
  palette: {
    mode: 'light',
    ...lightPalette,
  },
  ...commonSettings,
});

// Dark theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    ...darkPalette,
  },
  ...commonSettings,
});

export { lightTheme, darkTheme };