// src/theme.js
import { createTheme, alpha } from '@mui/material/styles';

const primaryColor = '#6200EA';
const secondaryColor = '#00E5FF';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: primaryColor,
            light: alpha(primaryColor, 0.8),
            dark: alpha(primaryColor, 1.2),
        },
        secondary: {
            main: secondaryColor,
            light: alpha(secondaryColor, 0.8),
            dark: alpha(secondaryColor, 1.2),
        },
        background: {
            default: '#121212',
            paper: '#1E1E1E',
        },
        text: {
            primary: '#ffffff',
            secondary: alpha('#ffffff', 0.7),
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontSize: '2.5rem',
            fontWeight: 700,
            letterSpacing: '-0.01562em',
        },
        h2: {
            fontSize: '2rem',
            fontWeight: 600,
            letterSpacing: '-0.00833em',
        },
        h3: {
            fontSize: '1.75rem',
            fontWeight: 600,
            letterSpacing: '0em',
        },
        body1: {
            fontSize: '1rem',
            letterSpacing: '0.00938em',
        },
        button: {
            textTransform: 'none',
            fontWeight: 600,
        },
    },
    shape: {
        borderRadius: 8,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '20px',
                    padding: '8px 16px',
                },
                containedPrimary: {
                    background: `linear-gradient(45deg, ${primaryColor} 30%, ${secondaryColor} 90%)`,
                    '&:hover': {
                        background: `linear-gradient(45deg, ${primaryColor} 50%, ${secondaryColor} 100%)`,
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    backgroundColor: alpha('#1E1E1E', 0.8),
                    backdropFilter: 'blur(10px)',
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    background: `linear-gradient(90deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    backgroundImage: `linear-gradient(to bottom, ${alpha(primaryColor, 0.7)}, ${alpha(secondaryColor, 0.7)})`,
                    backdropFilter: 'blur(20px)',
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    borderBottom: `1px solid ${alpha('#ffffff', 0.1)}`,
                },
            },
        },
    },
});

export default theme;