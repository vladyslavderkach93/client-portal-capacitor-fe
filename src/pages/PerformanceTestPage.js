
import React, { useState, useEffect, useRef } from 'react';
import {
    Button, Typography, Paper, Grid, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, LinearProgress, Box, Tooltip
} from '@mui/material';
import '../styles/PerformancePage.css';

const PerformanceTestPage = () => {
    const [results, setResults] = useState({});
    const [running, setRunning] = useState(false);
    const [activeTest, setActiveTest] = useState(null);
    const canvasRef = useRef(null);

    const tests = [
        {
            name: 'Array Operations',
            func: arrayOperations,
            description: 'Filters, maps, and reduces an array of 1 million elements.'
        },
        {
            name: 'Object Manipulations',
            func: objectManipulations,
            description: 'Creates an object with 1 million properties and sums their values.'
        },
        {
            name: 'String Concatenation',
            func: stringConcatenation,
            description: 'Concatenates a string 1 million times.'
        },
        {
            name: 'Math Calculations',
            func: mathCalculations,
            description: 'Performs complex math operations in a loop of 1 million iterations.'
        },
        {
            name: 'DOM Manipulation',
            func: domManipulation,
            description: 'Creates and appends 10,000 DOM elements.'
        },
        {
            name: 'Recursive Fibonacci',
            func: recursiveFibonacci,
            description: 'Calculates the 40th Fibonacci number recursively.'
        },
        {
            name: 'Prime Number Generation',
            func: primeNumberGeneration,
            description: 'Finds all prime numbers up to 100,000.'
        },
        {
            name: 'JSON Parse and Stringify',
            func: jsonParseAndStringify,
            description: 'Stringifies and parses a large JSON object with 100,000 items.'
        },
        {
            name: 'Async Operations',
            func: asyncOperations,
            description: 'Performs 100 asynchronous operations with a small delay.'
        },
        {
            name: 'Canvas Drawing',
            func: canvasDrawing,
            description: 'Draws 10,000 randomly colored circles on a canvas.'
        },
    ];
    const runTest = async (test) => {
        setRunning(true);
        setActiveTest(test.name);
        const startTime = performance.now();
        await test.func();
        const endTime = performance.now();
        const duration = endTime - startTime;
        setResults(prev => ({ ...prev, [test.name]: duration.toFixed(2) }));
        setRunning(false);
        setActiveTest(null);
    };

    const runAllTests = async () => {
        setRunning(true);
        for (let test of tests) {
            await runTest(test);
        }
        setRunning(false);
    };
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const particles = [];
        for (let i = 0; i < 50; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 2 + 1,
                color: 'rgba(52, 152, 219, 0.5)',
                vx: Math.random() * 1 - 0.5,
                vy: Math.random() * 1 - 0.5
            });
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(particle => {
                particle.x += particle.vx;
                particle.y += particle.vy;

                if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
                if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                ctx.fillStyle = particle.color;
                ctx.fill();
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <Box className="performance-test-container">
            <canvas ref={canvasRef} className="background-canvas" />
            <Paper elevation={3} className="content-paper">
                <Typography variant="h4" className="title-text">Performance Tests</Typography>
                <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            onClick={runAllTests}
                            disabled={running}
                            className="run-all-button"
                            fullWidth
                        >
                            Run All Tests
                        </Button>
                    </Grid>
                    {tests.map((test) => (
                        <Grid item key={test.name} xs={12} sm={6} md={4}>
                            <Tooltip title={test.description} arrow>
                                <Button
                                    variant="contained"
                                    onClick={() => runTest(test)}
                                    disabled={running}
                                    fullWidth
                                    className="test-button"
                                >
                                    Run {test.name}
                                </Button>
                            </Tooltip>
                        </Grid>
                    ))}
                </Grid>
                <TableContainer component={Paper} className="results-table">
                    <Table>
                        <TableHead>
                            <TableRow className="table-header">
                                <TableCell>Test Name</TableCell>
                                <TableCell align="right">Execution Time (ms)</TableCell>
                                <TableCell align="right">Visualization</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody className="table-body">
                            {tests.map((test) => (
                                <TableRow key={test.name} className="table-row">
                                    <TableCell component="th" scope="row">
                                        {test.name}
                                        {activeTest === test.name && <span className="pulse"></span>}
                                    </TableCell>
                                    <TableCell align="right">{results[test.name] || '-'}</TableCell>
                                    <TableCell align="right">
                                        {results[test.name] && (
                                            <Box className="result-bar-container">
                                                <Box
                                                    className="result-bar"
                                                    sx={{ width: `${Math.min(100, results[test.name] / 10)}%` }}
                                                />
                                            </Box>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    );
};


// Test functions
function arrayOperations() {
    const arr = Array(1000000).fill(0).map((_, i) => i);
    return arr.filter(n => n % 2 === 0).map(n => n * 2).reduce((a, b) => a + b, 0);
}

function objectManipulations() {
    const obj = {};
    for (let i = 0; i < 1000000; i++) {
        obj[`key${i}`] = i;
    }
    return Object.values(obj).reduce((a, b) => a + b, 0);
}

function stringConcatenation() {
    let result = '';
    for (let i = 0; i < 1000000; i++) {
        result += i.toString();
    }
    return result.length;
}

function mathCalculations() {
    let result = 0;
    for (let i = 0; i < 1000000; i++) {
        result += Math.sqrt(i) * Math.sin(i) * Math.cos(i);
    }
    return result;
}

function domManipulation() {
    const div = document.createElement('div');
    for (let i = 0; i < 10000; i++) {
        const child = document.createElement('p');
        child.textContent = `Paragraph ${i}`;
        div.appendChild(child);
    }
    return div.children.length;
}

function recursiveFibonacci(n = 40) {
    if (n <= 1) return n;
    return recursiveFibonacci(n - 1) + recursiveFibonacci(n - 2);
}

function primeNumberGeneration() {
    const isPrime = num => {
        for (let i = 2, s = Math.sqrt(num); i <= s; i++) {
            if (num % i === 0) return false;
        }
        return num > 1;
    };

    const primes = [];
    for (let i = 2; i < 100000; i++) {
        if (isPrime(i)) primes.push(i);
    }
    return primes.length;
}

function jsonParseAndStringify() {
    const obj = { data: Array(100000).fill(0).map((_, i) => ({ id: i, value: `value${i}` })) };
    const json = JSON.stringify(obj);
    return JSON.parse(json).data.length;
}

async function asyncOperations() {
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    for (let i = 0; i < 100; i++) {
        await delay(10);
    }
}

function canvasDrawing() {
    const canvas = document.createElement('canvas');
    canvas.width = 1000;
    canvas.height = 1000;
    const ctx = canvas.getContext('2d');
    for (let i = 0; i < 10000; i++) {
        ctx.beginPath();
        ctx.arc(Math.random() * 1000, Math.random() * 1000, 5, 0, 2 * Math.PI);
        ctx.fillStyle = `rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255})`;
        ctx.fill();
    }
    return canvas.toDataURL().length;
}

export default PerformanceTestPage;