// src/components/Menu.js
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    IconButton,
    Typography,
    useTheme,
    useMediaQuery,
    Box,
    AppBar,
    Toolbar,
} from '@mui/material';
import {
    Menu as MenuIcon,
    Home,
    BarChart,
    TableChart,
    Assignment,
    List as ListIcon,
    ChevronLeft, LockClockRounded,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const drawerWidth = 240;

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

const StyledDrawer = styled(Drawer)(({ theme }) => ({
    width: drawerWidth,
    flexShrink: 0,
    '& .MuiDrawer-paper': {
        width: drawerWidth,
        boxSizing: 'border-box',
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
    },
}));

const StyledListItem = styled(ListItem)(({ theme, selected }) => ({
    margin: theme.spacing(1, 0),
    borderRadius: theme.shape.borderRadius,
    '&:hover': {
        backgroundColor: theme.palette.primary.dark,
    },
    ...(selected && {
        backgroundColor: theme.palette.primary.dark,
    }),
}));

const menuItems = [
    { text: 'Home', icon: <Home />, path: '/' },
    { text: 'Canvas Chart', icon: <BarChart />, path: '/interactive-chart' },
    { text: 'Charts', icon: <BarChart />, path: '/charts' },
    { text: 'Table', icon: <TableChart />, path: '/table' },
    { text: 'Account Opening', icon: <Assignment />, path: '/wizard-form' },
    { text: 'Animation page', icon: <ListIcon />, path: '/animation-page' },
    {text: 'Performance page', icon: <LockClockRounded />, path: 'performance-page'}
];

const Menu = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const drawer = (
        <>
            <DrawerHeader>
                <IconButton onClick={handleDrawerToggle} sx={{ color: 'inherit' }}>
                    <ChevronLeft />
                </IconButton>
            </DrawerHeader>
            <List>
                {menuItems.map((item) => (
                    <StyledListItem
                        button
                        key={item.text}
                        component={Link}
                        to={item.path}
                        selected={location.pathname === item.path}
                        onClick={isMobile ? handleDrawerToggle : undefined}
                    >
                        <ListItemIcon sx={{ color: 'inherit' }}>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.text} />
                    </StyledListItem>
                ))}
            </List>
        </>
    );

    return (
        <>
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        End Client Portal
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box sx={{ display: 'flex' }}>
                {isMobile ? (
                    <Drawer
                        variant="temporary"
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                        ModalProps={{
                            keepMounted: true, // Better open performance on mobile.
                        }}
                        sx={{
                            display: { xs: 'block', sm: 'none' },
                            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                        }}
                    >
                        {drawer}
                    </Drawer>
                ) : (
                    <StyledDrawer variant="permanent" open>
                        {drawer}
                    </StyledDrawer>
                )}
            </Box>
        </>
    );
};

export default Menu;