// src/components/Layout.js
import React from 'react';
import { Box, Toolbar } from '@mui/material';
import Menu from './Menu';

const Layout = ({ children }) => {
    return (
        <Box sx={{ display: 'flex' }}>
            <Menu />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar /> {/* This is to offset the fixed AppBar */}
                {children}
            </Box>
        </Box>
    );
};

export default Layout;