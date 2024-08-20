import React, { useEffect, useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation, Pagination, Autoplay, EffectCube } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-cube';
import { Typography, Box, Container, Grid, Card, CardMedia, CardContent, Button, CircularProgress, LinearProgress } from '@mui/material';
import { styled } from '@mui/system';
import { useInView } from 'react-intersection-observer';
import 'swiper/swiper-bundle.css';
import '../styles/LandingPage.css';

SwiperCore.use([Navigation, Pagination, Autoplay, EffectCube]);

const StyledSection = styled(Box)(({ theme }) => ({
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    padding: theme.spacing(4),
    color: theme.palette.common.white,
}));

const ParallaxBackground = styled(Box)({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: -1,
});

const LandingPage = () => {
    const [scrollY, setScrollY] = useState(0);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const parallaxRef = useRef(null);
    const [parallaxOffset, setParallaxOffset] = useState(0);

    const [ref1, inView1] = useInView({ threshold: 0.1, triggerOnce: true });
    const [ref2, inView2] = useInView({ threshold: 0.1, triggerOnce: true });
    const [ref3, inView3] = useInView({ threshold: 0.1, triggerOnce: true });
    const [ref4, inView4] = useInView({ threshold: 0.1, triggerOnce: true });
    const [ref5, inView5] = useInView({ threshold: 0.1, triggerOnce: true });

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
            if (parallaxRef.current) {
                const rect = parallaxRef.current.getBoundingClientRect();
                const scrollPercentage = (window.innerHeight - rect.top) / window.innerHeight;
            }
        };

        const handleMouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };


        const timer = setTimeout(() => {
            setLoading(false);
        }, 3000);

        const interval = setInterval(() => {
            setProgress((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress + 10));
        }, 800);

        return () => {
            clearTimeout(timer);
            clearInterval(interval);
        };
    }, []);

    const bannerImages = Array.from({ length: 12 }, (_, i) => `https://random-image-pepebigotes.vercel.app/api/random-image`);

    const gridItems = Array.from({ length: 6 }, (_, i) => ({
        type: i % 3 === 0 ? 'video' : 'image',
        src: i % 3 === 0 ? `https://www.youtube.com/embed/dQw4w9WgXcQ?start=${i}` : `https://random-image-pepebigotes.vercel.app/api/random-image`,
    }));

    const renderSection = (title, content, ref, inView) => (
        <StyledSection className={`content-section image-bg-2 ${inView ? 'fade-in' : ''}`} ref={ref}>
            <Typography variant="h2" className="animated-title">{title}</Typography>
            <Typography variant="body1" className="animated-text">
                {content}
            </Typography>
            <Button variant="contained" color="primary" className="animated-button">
                Learn More
            </Button>
        </StyledSection>
    );

    if (loading) {
        return (
            <div className="loading-screen">
                <CircularProgress />
                <LinearProgress variant="determinate" value={progress} />
            </div>
        );
    }

    return (
        <Box className="landing-page">
            <div className="fancy-gradient-background"></div>
            <div className="geometric-figures">
                <div className="geometric-figure circle"></div>
                <div className="geometric-figure square"></div>
                <div className="geometric-figure triangle"></div>
                <div className="geometric-figure pentagon"></div>
                <div className="geometric-figure hexagon"></div>
                <div className="geometric-figure star"></div>
                <div className="geometric-figure oval"></div>
                <div className="geometric-figure trapezoid"></div>
                <div className="geometric-figure parallelogram"></div>
                <div className="geometric-figure diamond"></div>
                <div className="geometric-figure cross"></div>

            </div>
            <StyledSection className="hero-section image-bg-1">
                <ParallaxBackground ref={parallaxRef} className="parallax-bg" />
                <Typography variant="h1" className="animated-title">
                    Welcome to End Client Portal
                </Typography>
                <Typography variant="h4" className="animated-subtitle">
                    Prepare for an intense visual journey!
                </Typography>
            </StyledSection>

            <Container>

                <StyledSection className="features-section" ref={ref2}>
                    <Typography variant="h2" className="section-title">
                        Our Features
                    </Typography>
                    <Grid container spacing={3} className="feature-grid">
                        {gridItems.map((item, index) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                                <Card className={`feature-item ${inView2 ? 'fade-in' : ''}`} style={{ animationDelay: `${index * 0.05}s` }}>
                                    {item.type === 'image' ? (
                                        <CardMedia
                                            component="img"
                                            height="200"
                                            image={item.src}
                                            alt={`Grid item ${index + 1}`}
                                        />
                                    ) : (
                                        <CardMedia
                                            component="iframe"
                                            height="200"
                                            src={item.src}
                                            title={`YouTube video ${index + 1}`}
                                        />
                                    )}
                                    <CardContent>
                                        <Typography variant="h6">Feature {index + 1}</Typography>
                                        <Typography variant="body2">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </StyledSection>

                <div className="parallax-section" ref={parallaxRef}>
                    <div
                        className="parallax-bg"
                        style={{ transform: `translateY(${parallaxOffset}px)` }}
                    ></div>
                    <div className="parallax-content">
                        <Typography variant="h2">Parallax Effect</Typography>
                        <Typography variant="body1">Scroll to see the magic happen!</Typography>
                    </div>
                </div>

                {renderSection("About Us", "We are a team of passionate individuals committed to pushing the boundaries of what's possible in web development. Our goal is to create immersive and unforgettable online experiences.", ref3, inView3)}

                <StyledSection className="cta-section image-bg-3">
                    <Typography variant="h2" className="section-title">
                        Get Started Today
                    </Typography>
                    <Typography variant="h5" className="cta-text">
                        Join thousands of satisfied users and transform your experience
                    </Typography>
                    <button className="cta-button">Sign Up Now</button>
                </StyledSection>
            </Container>

            <footer className="footer">
                <Container>
                    <Typography variant="h6">Contact Us</Typography>
                    <Typography variant="body2">Email: info@example.com</Typography>
                    <Typography variant="body2">Phone: (123) 456-7890</Typography>
                </Container>
            </footer>
        </Box>
    );
};

export default LandingPage;