// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from './Layout';
import LandingPage from './pages/LandingPage';
import InteractiveChartPage from './pages/InteractiveChartPage';
import ChartsPage from './pages/ChartsPage';
import TablePage from './pages/TablePage';
import WizardFormPage from './pages/WizardFormPage';
import AnimationsPage from './pages/AnimationsPage';
import PerformanceTestPage from './pages/PerformanceTestPage';
import theme from './theme';

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <Layout>
                    <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/interactive-chart" element={<InteractiveChartPage />} />
                        <Route path="/charts" element={<ChartsPage />} />
                        <Route path="/table" element={<TablePage />} />
                        <Route path="/wizard-form" element={<WizardFormPage />} />
                        <Route path="/animation-page" element={<AnimationsPage />} />
                        <Route path="/performance-page" element={<PerformanceTestPage />} />
                    </Routes>
                </Layout>
            </Router>
        </ThemeProvider>
    );
}

export default App;