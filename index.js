import logo from './logo.svg';
import './App.css';
import WizardForm from "./WizzardForm";
import MultiStepForm from "./WizzardForm1";
import Charts from "./Charts";
import InteractiveChart from "./InteractiveChart";
import Table from "./Table";
import LandingPage from "./LandingPage";

import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    TablePagination, TableSortLabel, Checkbox, IconButton, TextField, Chip,
    LinearProgress, Tooltip, Button, Menu, MenuItem
} from '@mui/material';
import { Edit, Delete, MoreVert } from '@mui/icons-material';
import React, {useEffect, useRef} from "@types/react";
import * as d3 from "d3";

// Generate random data
const createData = (id, name, role, department, salary, performance, tasks, status) => ({
    id, name, role, department, salary, performance, tasks, status
});

const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations'];
const roles = ['Manager', 'Senior', 'Junior', 'Intern', 'Director', 'VP'];
const statuses = ['Active', 'On Leave', 'Terminated'];

const generateRandomData = (count) => {
    return Array.from({ length: count }, (_, index) => createData(
        index + 1,
        `Employee ${index + 1}`,
        roles[Math.floor(Math.random() * roles.length)],
        departments[Math.floor(Math.random() * departments.length)],
        Math.floor(Math.random() * 100000) + 30000,
        Math.random(),
        Math.floor(Math.random() * 10) + 1,
        statuses[Math.floor(Math.random() * statuses.length)]
    ));
};

const rows = generateRandomData(1000); // Generate 1000 rows of data

const OverloadedTable = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('id');
    const [selected, setSelected] = useState([]);
    const [filterName, setFilterName] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            setSelected(rows.map((row) => row.id));
        } else {
            setSelected([]);
        }
    };

    const handleClick = (id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleFilterNameChange = (event) => {
        setFilterName(event.target.value);
        setPage(0);
    };

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const filteredRows = rows.filter((row) =>
        row.name.toLowerCase().includes(filterName.toLowerCase())
    );

    const sortedRows = filteredRows.sort((a, b) => {
        if (b[orderBy] < a[orderBy]) {
            return order === 'asc' ? 1 : -1;
        }
        if (b[orderBy] > a[orderBy]) {
            return order === 'asc' ? -1 : 1;
        }
        return 0;
    });

    const visibleRows = sortedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TextField
                label="Filter by Name"
                variant="outlined"
                value={filterName}
                onChange={handleFilterNameChange}
                sx={{ m: 2 }}
            />
            <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    indeterminate={selected.length > 0 && selected.length < rows.length}
                                    checked={rows.length > 0 && selected.length === rows.length}
                                    onChange={handleSelectAllClick}
                                />
                            </TableCell>
                            {['ID', 'Name', 'Role', 'Department', 'Salary', 'Performance', 'Tasks', 'Status', 'Actions'].map((headCell) => (
                                <TableCell key={headCell}>
                                    <TableSortLabel
                                        active={orderBy === headCell.toLowerCase()}
                                        direction={orderBy === headCell.toLowerCase() ? order : 'asc'}
                                        onClick={() => handleRequestSort(headCell.toLowerCase())}
                                    >
                                        {headCell}
                                    </TableSortLabel>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {visibleRows.map((row) => {
                            const isItemSelected = selected.indexOf(row.id) !== -1;
                            return (
                                <TableRow
                                    hover
                                    onClick={() => handleClick(row.id)}
                                    role="checkbox"
                                    aria-checked={isItemSelected}
                                    tabIndex={-1}
                                    key={row.id}
                                    selected={isItemSelected}
                                >
                                    <TableCell padding="checkbox">
                                        <Checkbox checked={isItemSelected} />
                                    </TableCell>
                                    <TableCell>{row.id}</TableCell>
                                    <TableCell>{row.name}</TableCell>
                                    <TableCell>{row.role}</TableCell>
                                    <TableCell>{row.department}</TableCell>
                                    <TableCell>${row.salary.toLocaleString()}</TableCell>
                                    <TableCell>
                                        <Tooltip title={`${(row.performance * 100).toFixed(1)}%`}>
                                            <LinearProgress variant="determinate" value={row.performance * 100} />
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell>{row.tasks}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={row.status}
                                            color={row.status === 'Active' ? 'success' : row.status === 'On Leave' ? 'warning' : 'error'}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <IconButton size="small"><Edit /></IconButton>
                                        <IconButton size="small"><Delete /></IconButton>
                                        <IconButton size="small" onClick={handleMenuOpen}><MoreVert /></IconButton>
                                        <Menu
                                            anchorEl={anchorEl}
                                            open={Boolean(anchorEl)}
                                            onClose={handleMenuClose}
                                        >
                                            <MenuItem onClick={handleMenuClose}>View Details</MenuItem>
                                            <MenuItem onClick={handleMenuClose}>Send Message</MenuItem>
                                            <MenuItem onClick={handleMenuClose}>Generate Report</MenuItem>
                                        </Menu>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={filteredRows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
};

const Charts = () => {
    const barChartRef = useRef();
    const lineChartRef = useRef();
    const scatterPlotRef = useRef();
    const pieChartRef = useRef();

    // Generate a large amount of random dummy data
    const generateDummyData = (numItems) => {
        return Array.from({ length: numItems }, (_, i) => ({
            x: i + 1,
            y: Math.floor(Math.random() * 1000) + 1,
        }));
    };

    const largeDataSet = generateDummyData(1000);

    useEffect(() => {
        // Bar Chart
        const barSvg = d3.select(barChartRef.current)
            .attr('width', 1200)
            .attr('height', 500);

        const xScaleBar = d3.scaleBand()
            .domain(largeDataSet.map(d => d.x))
            .range([0, 1200])
            .padding(0.1);

        const yScaleBar = d3.scaleLinear()
            .domain([0, d3.max(largeDataSet, d => d.y)])
            .nice()
            .range([500, 0]);

        barSvg.selectAll(".bar")
            .data(largeDataSet)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", d => xScaleBar(d.x))
            .attr("y", d => yScaleBar(d.y))
            .attr("width", xScaleBar.bandwidth())
            .attr("height", d => 500 - yScaleBar(d.y))
            .attr("fill", "steelblue");

        barSvg.append("g")
            .attr("transform", "translate(0,500)")
            .call(d3.axisBottom(xScaleBar).tickValues(xScaleBar.domain().filter(function(d, i){ return !(i % 100); })));

        barSvg.append("g")
            .call(d3.axisLeft(yScaleBar));

        // Line Chart
        const lineSvg = d3.select(lineChartRef.current)
            .attr('width', 1200)
            .attr('height', 500);

        const xScaleLine = d3.scaleLinear()
            .domain(d3.extent(largeDataSet, d => d.x))
            .range([0, 1200]);

        const yScaleLine = d3.scaleLinear()
            .domain([0, d3.max(largeDataSet, d => d.y)])
            .nice()
            .range([500, 0]);

        const line = d3.line()
            .x(d => xScaleLine(d.x))
            .y(d => yScaleLine(d.y));

        lineSvg.append("path")
            .datum(largeDataSet)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("d", line);

        lineSvg.append("g")
            .attr("transform", "translate(0,500)")
            .call(d3.axisBottom(xScaleLine));

        lineSvg.append("g")
            .call(d3.axisLeft(yScaleLine));

        // Scatter Plot
        const scatterSvg = d3.select(scatterPlotRef.current)
            .attr('width', 1200)
            .attr('height', 500);

        const xScaleScatter = d3.scaleLinear()
            .domain([0, d3.max(largeDataSet, d => d.x)])
            .nice()
            .range([0, 1200]);

        const yScaleScatter = d3.scaleLinear()
            .domain([0, d3.max(largeDataSet, d => d.y)])
            .nice()
            .range([500, 0]);

        scatterSvg.selectAll(".dot")
            .data(largeDataSet)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("cx", d => xScaleScatter(d.x))
            .attr("cy", d => yScaleScatter(d.y))
            .attr("r", 3)
            .attr("fill", "steelblue");

        scatterSvg.append("g")
            .attr("transform", "translate(0,500)")
            .call(d3.axisBottom(xScaleScatter));

        scatterSvg.append("g")
            .call(d3.axisLeft(yScaleScatter));

        // Pie Chart
        const pieSvg = d3.select(pieChartRef.current)
            .attr('width', 600)
            .attr('height', 600)
            .append('g')
            .attr('transform', 'translate(300,300)');

        const pieData = d3.pie().value(d => d.y)(largeDataSet.slice(0, 10));

        const arc = d3.arc()
            .innerRadius(0)
            .outerRadius(250);

        pieSvg.selectAll("path")
            .data(pieData)
            .enter().append("path")
            .attr("d", arc)
            .attr("fill", (d, i) => d3.schemeCategory10[i]);

        pieSvg.selectAll("text")
            .data(pieData)
            .enter().append("text")
            .attr("transform", d => `translate(${arc.centroid(d)})`)
            .attr("dy", "0.35em")
            .attr("text-anchor", "middle")
            .text(d => d.data.x);
    }, []);

    return (
        <div>
            <h1>D3.js Charts with Large Dummy Data</h1>
            <div>
                <h2>Bar Chart</h2>
                <svg ref={barChartRef}></svg>
            </div>
            <div>
                <h2>Line Chart</h2>
                <svg ref={lineChartRef}></svg>
            </div>
            <div>
                <h2>Scatter Plot</h2>
                <svg ref={scatterPlotRef}></svg>
            </div>
            <div>
                <h2>Pie Chart</h2>
                <svg ref={pieChartRef}></svg>
            </div>
        </div>
    );
};

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const InteractiveCanvasChart = () => {
    const canvasRef = useRef();
    const tooltipRef = useRef();
    const [numDataPoints, setNumDataPoints] = useState(5000);
    const [colorScheme, setColorScheme] = useState('steelblue');

    const generateDummyData = (numItems) => {
        return Array.from({ length: numItems }, () => ({
            x: Math.random() * 1000,
            y: Math.random() * 1000,
            r: Math.random() * 5 + 3,
        }));
    };

    const data = generateDummyData(numDataPoints);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        const xScale = d3.scaleLinear().domain([0, 1000]).range([0, width]);
        const yScale = d3.scaleLinear().domain([0, 1000]).range([height, 0]);

        context.clearRect(0, 0, width, height);

        data.forEach(d => {
            context.beginPath();
            context.arc(xScale(d.x), yScale(d.y), d.r, 0, 2 * Math.PI);
            context.fillStyle = colorScheme;
            context.fill();
            context.stroke();
        });

        // Handle zooming
        const zoom = d3.zoom().scaleExtent([1, 10]).on('zoom', (event) => {
            context.clearRect(0, 0, width, height);
            const transform = event.transform;

            data.forEach(d => {
                context.beginPath();
                context.arc(transform.applyX(xScale(d.x)), transform.applyY(yScale(d.y)), d.r, 0, 2 * Math.PI);
                context.fillStyle = colorScheme;
                context.fill();
                context.stroke();
            });
        });

        d3.select(canvas).call(zoom);

        return () => {
            d3.select(canvas).on('.zoom', null);
        };
    }, [data, colorScheme]);

    return (
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label>
                    Number of Data Points:
                    <input
                        type="range"
                        min="1000"
                        max="10000"
                        step="1000"
                        value={numDataPoints}
                        onChange={(e) => setNumDataPoints(+e.target.value)}
                    />
                    {numDataPoints}
                </label>
                <label>
                    Color Scheme:
                    <select value={colorScheme} onChange={(e) => setColorScheme(e.target.value)}>
                        <option value="steelblue">Steel Blue</option>
                        <option value="green">Green</option>
                        <option value="red">Red</option>
                        <option value="purple">Purple</option>
                    </select>
                </label>
            </div>
            <canvas ref={canvasRef} width={1200} height={600} style={{ width: '100%', height: '80vh', backgroundColor: '#f0f0f0' }}></canvas>
            <div ref={tooltipRef}
                 style={{
                     position: 'absolute',
                     backgroundColor: '#fff',
                     border: '1px solid #000',
                     padding: '5px',
                     borderRadius: '5px',
                     pointerEvents: 'none',
                     opacity: 0
                 }}></div>
        </div>
    );
};
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
    Button, TextField, Stepper, Step, StepLabel, Box, Grid, MenuItem, FormControl, InputLabel, Select,
    RadioGroup, FormControlLabel, Radio, Checkbox, FormGroup, FormLabel
} from '@mui/material';
import { DatePicker } from '@mui/lab';

const steps = ['Personal Information', 'Contact Details', 'Preferences'];

const Step1 = ({ control }) => (
    <Grid container spacing={3}>
        {[...Array(25)].map((_, i) => (
            <Grid item xs={12} md={6} key={`first-name-${i}`}>
                <Controller
                    name={`firstName${i}`}
                    control={control}
                    defaultValue=""
                    render={({ field }) => <TextField {...field} label={`First Name ${i + 1}`} variant="outlined" fullWidth />}
                />
            </Grid>
        ))}
        {[...Array(25)].map((_, i) => (
            <Grid item xs={12} md={6} key={`last-name-${i}`}>
                <Controller
                    name={`lastName${i}`}
                    control={control}
                    defaultValue=""
                    render={({ field }) => <TextField {...field} label={`Last Name ${i + 1}`} variant="outlined" fullWidth />}
                />
            </Grid>
        ))}
    </Grid>
);

const Step2 = ({ control }) => (
    <Grid container spacing={3}>
        {[...Array(25)].map((_, i) => (
            <Grid item xs={12} md={6} key={`email-${i}`}>
                <Controller
                    name={`email${i}`}
                    control={control}
                    defaultValue=""
                    render={({ field }) => <TextField {...field} label={`Email ${i + 1}`} variant="outlined" fullWidth />}
                />
            </Grid>
        ))}
        {[...Array(25)].map((_, i) => (
            <Grid item xs={12} md={6} key={`phone-${i}`}>
                <Controller
                    name={`phone${i}`}
                    control={control}
                    defaultValue=""
                    render={({ field }) => <TextField {...field} label={`Phone ${i + 1}`} variant="outlined" fullWidth />}
                />
            </Grid>
        ))}
    </Grid>
);

const Step3 = ({ control }) => (
    <Grid container spacing={3}>
        {[...Array(10)].map((_, i) => (
            <Grid item xs={12} md={6} key={`color-${i}`}>
                <FormControl component="fieldset">
                    <FormLabel component="legend">Favorite Color Group {i + 1}</FormLabel>
                    <Controller
                        name={`favoriteColors${i}`}
                        control={control}
                        defaultValue={[]}
                        render={({ field }) => (
                            <FormGroup>
                                <FormControlLabel
                                    control={<Checkbox
                                        {...field}
                                        value="red"
                                        checked={Array.isArray(field.value) && field.value.includes('red')}
                                        onChange={(e) => {
                                            const newValue = e.target.checked
                                                ? [...field.value, 'red']
                                                : field.value.filter((value) => value !== 'red');
                                            field.onChange(newValue);
                                        }}
                                    />}
                                    label="Red"
                                />
                                <FormControlLabel
                                    control={<Checkbox
                                        {...field}
                                        value="green"
                                        checked={Array.isArray(field.value) && field.value.includes('green')}
                                        onChange={(e) => {
                                            const newValue = e.target.checked
                                                ? [...field.value, 'green']
                                                : field.value.filter((value) => value !== 'green');
                                            field.onChange(newValue);
                                        }}
                                    />}
                                    label="Green"
                                />
                                <FormControlLabel
                                    control={<Checkbox
                                        {...field}
                                        value="blue"
                                        checked={Array.isArray(field.value) && field.value.includes('blue')}
                                        onChange={(e) => {
                                            const newValue = e.target.checked
                                                ? [...field.value, 'blue']
                                                : field.value.filter((value) => value !== 'blue');
                                            field.onChange(newValue);
                                        }}
                                    />}
                                    label="Blue"
                                />
                                <FormControlLabel
                                    control={<Checkbox
                                        {...field}
                                        value="yellow"
                                        checked={Array.isArray(field.value) && field.value.includes('yellow')}
                                        onChange={(e) => {
                                            const newValue = e.target.checked
                                                ? [...field.value, 'yellow']
                                                : field.value.filter((value) => value !== 'yellow');
                                            field.onChange(newValue);
                                        }}
                                    />}
                                    label="Yellow"
                                />
                            </FormGroup>
                        )}
                    />
                </FormControl>
            </Grid>
        ))}
        {[...Array(10)].map((_, i) => (
            <Grid item xs={12} md={6} key={`preferredContactMethod-${i}`}>
                <FormControl component="fieldset">
                    <FormLabel component="legend">Preferred Contact Method Group {i + 1}</FormLabel>
                    <Controller
                        name={`preferredContactMethod${i}`}
                        control={control}
                        defaultValue="email"
                        render={({ field }) => (
                            <RadioGroup {...field} aria-label="preferredContactMethod">
                                <FormControlLabel value="email" control={<Radio />} label="Email" />
                                <FormControlLabel value="phone" control={<Radio />} label="Phone" />
                                <FormControlLabel value="mail" control={<Radio />} label="Mail" />
                            </RadioGroup>
                        )}
                    />
                </FormControl>
            </Grid>
        ))}
        {[...Array(10)].map((_, i) => (
            <Grid item xs={12} key={`newsletter-${i}`}>
                <Controller
                    name={`newsletter${i}`}
                    control={control}
                    defaultValue={false}
                    render={({ field }) => (
                        <FormControlLabel
                            control={<Checkbox {...field} checked={field.value} />}
                            label={`Subscribe to Newsletter ${i + 1}`}
                        />
                    )}
                />
            </Grid>
        ))}
    </Grid>
);

const getStepContent = (step, control) => {
    switch (step) {
        case 0:
            return <Step1 control={control} />;
        case 1:
            return <Step2 control={control} />;
        case 2:
            return <Step3 control={control} />;
        default:
            return 'Unknown step';
    }
};

const MultiStepForm = () => {
    const [activeStep, setActiveStep] = useState(0);
    const { control, handleSubmit } = useForm();

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const onSubmit = (data) => {
        if (activeStep === steps.length - 1) {
            console.log('Form Data:', data);
        } else {
            handleNext();
        }
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Stepper activeStep={activeStep}>
                {steps.map((label, index) => (
                    <Step key={index}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            <Box sx={{ mt: 2 }}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    {getStepContent(activeStep, control)}
                    <Box sx={{ mt: 2 }}>
                        <Button
                            disabled={activeStep === 0}
                            onClick={handleBack}
                            sx={{ mr: 1 }}
                        >
                            Back
                        </Button>
                        <Button variant="contained" type="submit">
                            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                        </Button>
                    </Box>
                </form>
            </Box>
        </Box>
    );
};


import React, { useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    TablePagination, TableSortLabel, Checkbox, IconButton, TextField, Chip,
    LinearProgress, Tooltip, Button, Menu, MenuItem
} from '@mui/material';
import { Edit, Delete, MoreVert } from '@mui/icons-material';

// Generate random data
const createData = (id, name, role, department, salary, performance, tasks, status) => ({
    id, name, role, department, salary, performance, tasks, status
});

const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations'];
const roles = ['Manager', 'Senior', 'Junior', 'Intern', 'Director', 'VP'];
const statuses = ['Active', 'On Leave', 'Terminated'];

const generateRandomData = (count) => {
    return Array.from({ length: count }, (_, index) => createData(
        index + 1,
        `Employee ${index + 1}`,
        roles[Math.floor(Math.random() * roles.length)],
        departments[Math.floor(Math.random() * departments.length)],
        Math.floor(Math.random() * 100000) + 30000,
        Math.random(),
        Math.floor(Math.random() * 10) + 1,
        statuses[Math.floor(Math.random() * statuses.length)]
    ));
};

const rows = generateRandomData(1000); // Generate 1000 rows of data

const OverloadedTable = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('id');
    const [selected, setSelected] = useState([]);
    const [filterName, setFilterName] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            setSelected(rows.map((row) => row.id));
        } else {
            setSelected([]);
        }
    };

    const handleClick = (id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleFilterNameChange = (event) => {
        setFilterName(event.target.value);
        setPage(0);
    };

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const filteredRows = rows.filter((row) =>
        row.name.toLowerCase().includes(filterName.toLowerCase())
    );

    const sortedRows = filteredRows.sort((a, b) => {
        if (b[orderBy] < a[orderBy]) {
            return order === 'asc' ? 1 : -1;
        }
        if (b[orderBy] > a[orderBy]) {
            return order === 'asc' ? -1 : 1;
        }
        return 0;
    });

    const visibleRows = sortedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TextField
                label="Filter by Name"
                variant="outlined"
                value={filterName}
                onChange={handleFilterNameChange}
                sx={{ m: 2 }}
            />
            <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    indeterminate={selected.length > 0 && selected.length < rows.length}
                                    checked={rows.length > 0 && selected.length === rows.length}
                                    onChange={handleSelectAllClick}
                                />
                            </TableCell>
                            {['ID', 'Name', 'Role', 'Department', 'Salary', 'Performance', 'Tasks', 'Status', 'Actions'].map((headCell) => (
                                <TableCell key={headCell}>
                                    <TableSortLabel
                                        active={orderBy === headCell.toLowerCase()}
                                        direction={orderBy === headCell.toLowerCase() ? order : 'asc'}
                                        onClick={() => handleRequestSort(headCell.toLowerCase())}
                                    >
                                        {headCell}
                                    </TableSortLabel>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {visibleRows.map((row) => {
                            const isItemSelected = selected.indexOf(row.id) !== -1;
                            return (
                                <TableRow
                                    hover
                                    onClick={() => handleClick(row.id)}
                                    role="checkbox"
                                    aria-checked={isItemSelected}
                                    tabIndex={-1}
                                    key={row.id}
                                    selected={isItemSelected}
                                >
                                    <TableCell padding="checkbox">
                                        <Checkbox checked={isItemSelected} />
                                    </TableCell>
                                    <TableCell>{row.id}</TableCell>
                                    <TableCell>{row.name}</TableCell>
                                    <TableCell>{row.role}</TableCell>
                                    <TableCell>{row.department}</TableCell>
                                    <TableCell>${row.salary.toLocaleString()}</TableCell>
                                    <TableCell>
                                        <Tooltip title={`${(row.performance * 100).toFixed(1)}%`}>
                                            <LinearProgress variant="determinate" value={row.performance * 100} />
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell>{row.tasks}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={row.status}
                                            color={row.status === 'Active' ? 'success' : row.status === 'On Leave' ? 'warning' : 'error'}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <IconButton size="small"><Edit /></IconButton>
                                        <IconButton size="small"><Delete /></IconButton>
                                        <IconButton size="small" onClick={handleMenuOpen}><MoreVert /></IconButton>
                                        <Menu
                                            anchorEl={anchorEl}
                                            open={Boolean(anchorEl)}
                                            onClose={handleMenuClose}
                                        >
                                            <MenuItem onClick={handleMenuClose}>View Details</MenuItem>
                                            <MenuItem onClick={handleMenuClose}>Send Message</MenuItem>
                                            <MenuItem onClick={handleMenuClose}>Generate Report</MenuItem>
                                        </Menu>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={filteredRows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
};


function App() {
    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                    Edit <code>src/App.js</code> and save to reload.
                    <p className={'pacifico-regular'}>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem delectus deleniti deserunt distinctio esse est excepturi, exercitationem fugiat inventore laboriosam libero neque nihil odit quae quo rerum, veniam voluptate voluptatum! Accusantium alias, at culpa cumque eos, exercitationem explicabo fuga illum perspiciatis quos sed suscipit temporibus, unde? A optio sunt voluptatum.</p>
                </p>



                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
            </header>
            <div className={'containerx'}>
                <LandingPage/>
                <InteractiveChart/>
                <Charts/>
                <Table/>
                <WizardForm/>
                <MultiStepForm/>
            </div>
        </div>
    );
}

export default App;
