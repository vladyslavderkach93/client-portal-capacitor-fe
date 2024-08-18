import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import '../styles/AnimationsPage.css';

const AnimationsPage = () => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCount((prevCount) => (prevCount + 1) % 1000);
        }, 16); // ~60 FPS

        return () => clearInterval(timer);
    }, []);

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>Advanced CSS Animations</Typography>
            <Grid container spacing={2}>
                {/* 1. Particle System */}
                <Grid item xs={12} md={6} lg={4}>
                    <Box className="animation-container">
                        <Typography variant="h6">Particle System</Typography>
                        <div className="particle-system">
                            {[...Array(100)].map((_, i) => (
                                <div key={i} className="particle" />
                            ))}
                        </div>
                    </Box>
                </Grid>

                {/* 2. 3D Cube */}
                <Grid item xs={12} md={6} lg={4}>
                    <Box className="animation-container">
                        <Typography variant="h6">3D Cube</Typography>
                        <div className="cube-container">
                            <div className="cube">
                                <div className="cube-face front">Front</div>
                                <div className="cube-face back">Back</div>
                                <div className="cube-face right">Right</div>
                                <div className="cube-face left">Left</div>
                                <div className="cube-face top">Top</div>
                                <div className="cube-face bottom">Bottom</div>
                            </div>
                        </div>
                    </Box>
                </Grid>

                {/* 3. Fractal Tree */}
                <Grid item xs={12} md={6} lg={4}>
                    <Box className="animation-container">
                        <Typography variant="h6">Fractal Tree</Typography>
                        <div className="fractal-tree">
                            <div className="branch">
                                <div className="branch">
                                    <div className="branch" />
                                    <div className="branch" />
                                </div>
                                <div className="branch">
                                    <div className="branch" />
                                    <div className="branch" />
                                </div>
                            </div>
                        </div>
                    </Box>
                </Grid>

                {/* 4. Neon Text */}
                <Grid item xs={12} md={6} lg={4}>
                    <Box className="animation-container">
                        <Typography variant="h6">Neon Text</Typography>
                        <div className="neon-text">NEON</div>
                    </Box>
                </Grid>

                {/* 5. Ripple Effect */}
                <Grid item xs={12} md={6} lg={4}>
                    <Box className="animation-container">
                        <Typography variant="h6">Ripple Effect</Typography>
                        <div className="ripple-container">
                            <div className="ripple" />
                        </div>
                    </Box>
                </Grid>

                {/* 6. Animated Gradient */}
                <Grid item xs={12} md={6} lg={4}>
                    <Box className="animation-container">
                        <Typography variant="h6">Animated Gradient</Typography>
                        <div className="animated-gradient" />
                    </Box>
                </Grid>

                {/* 7. Infinite Loader */}
                <Grid item xs={12} md={6} lg={4}>
                    <Box className="animation-container">
                        <Typography variant="h6">Infinite Loader</Typography>
                        <div className="infinite-loader" />
                    </Box>
                </Grid>

                {/* 8. Morphing Shapes */}
                <Grid item xs={12} md={6} lg={4}>
                    <Box className="animation-container">
                        <Typography variant="h6">Morphing Shapes</Typography>
                        <div className="morphing-shape" />
                    </Box>
                </Grid>

                {/* 9. Parallax Scrolling */}
                <Grid item xs={12} md={6} lg={4}>
                    <Box className="animation-container">
                        <Typography variant="h6">Parallax Scrolling</Typography>
                        <div className="parallax-container">
                            <div className="parallax-layer layer-1" />
                            <div className="parallax-layer layer-2" />
                            <div className="parallax-layer layer-3" />
                        </div>
                    </Box>
                </Grid>

                {/* 10. CPU Counter */}
                <Grid item xs={12} md={6} lg={4}>
                    <Box className="animation-container">
                        <Typography variant="h6">CPU Counter</Typography>
                        <div className="cpu-counter">
                            {count.toString().padStart(3, '0')}
                        </div>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AnimationsPage;