import React, { useState, useEffect, useCallback } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    TablePagination, TableSortLabel, Checkbox, IconButton, TextField, Chip,
    LinearProgress, Tooltip, Button, Menu, MenuItem, Grid, Select, FormControl,
    InputLabel, Box, Typography, Slider, Dialog, DialogTitle, DialogContent,
    DialogActions, Snackbar
} from '@mui/material';
import { Edit, Delete, MoreVert, FilterList, Search, Add } from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';

const API_URL = 'http://localhost:3001/api';

const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations'];
const roles = ['Manager', 'Senior', 'Junior', 'Intern', 'Director', 'VP'];
const statuses = ['Active', 'On Leave', 'Terminated'];

const StyledPaper = styled(Paper)(({ theme }) => ({
    background: alpha(theme.palette.common.black, 0.87),
    backdropFilter: 'blur(10px)',
    borderRadius: theme.shape.borderRadius * 2,
    boxShadow: theme.shadows[10],
    color: theme.palette.common.white,
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
    '& .MuiTableCell-root': {
        borderBottomColor: alpha(theme.palette.common.white, 0.1),
        color: theme.palette.common.white,
    },
    '& .MuiTableCell-head': {
        backgroundColor: alpha(theme.palette.common.black, 0.95),
        color: theme.palette.common.white,
    },
    '& .MuiTableSortLabel-root': {
        color: theme.palette.common.white,
        '&:hover': {
            color: theme.palette.primary.main,
        },
        '&.Mui-active': {
            color: theme.palette.primary.main,
        },
    },
    '& .MuiTableSortLabel-icon': {
        color: `${theme.palette.common.white} !important`,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: alpha(theme.palette.common.white, 0.05),
    },
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.1),
    },
    transition: 'background-color 0.3s',
}));

const TablePage = () => {
    const [employees, setEmployees] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('id');
    const [selected, setSelected] = useState([]);
    const [filterName, setFilterName] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const [filterRole, setFilterRole] = useState('');
    const [filterDepartment, setFilterDepartment] = useState('');
    const [filterSalary, setFilterSalary] = useState([30000, 130000]);
    const [filterPerformance, setFilterPerformance] = useState([0, 100]);
    const [showFilters, setShowFilters] = useState(true);
    const [totalCount, setTotalCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [currentEmployee, setCurrentEmployee] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '' });

    const fetchEmployees = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const queryParams = new URLSearchParams({
                page: page + 1,
                limit: rowsPerPage,
                name: filterName,
                role: filterRole,
                department: filterDepartment,
                minSalary: filterSalary[0],
                maxSalary: filterSalary[1],
                minPerformance: filterPerformance[0] / 100,
                maxPerformance: filterPerformance[1] / 100,
                sortBy: orderBy,
                sortOrder: order
            });

            const response = await fetch(`${API_URL}/employees?${queryParams}`);
            if (!response.ok) throw new Error('Failed to fetch employees');
            const data = await response.json();
            setEmployees(data.employees);
            setTotalCount(data.totalCount);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [page, rowsPerPage, filterName, filterRole, filterDepartment, filterSalary, filterPerformance, orderBy, order]);

    useEffect(() => {
        fetchEmployees();
    }, [fetchEmployees]);

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            setSelected(employees.map((employee) => employee.id));
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

    const handleFilterRoleChange = (event) => {
        setFilterRole(event.target.value);
        setPage(0);
    };

    const handleFilterDepartmentChange = (event) => {
        setFilterDepartment(event.target.value);
        setPage(0);
    };

    const handleFilterSalaryChange = (event, newValue) => {
        setFilterSalary(newValue);
        setPage(0);
    };

    const handleFilterPerformanceChange = (event, newValue) => {
        setFilterPerformance(newValue);
        setPage(0);
    };

    const handleOpenDialog = (employee = null) => {
        setCurrentEmployee(employee);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setCurrentEmployee(null);
    };

    const handleSaveEmployee = async (employeeData) => {
        try {
            let response;
            if (employeeData.id) {
                response = await fetch(`${API_URL}/employees/${employeeData.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(employeeData),
                });
            } else {
                response = await fetch(`${API_URL}/employees`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(employeeData),
                });
            }

            if (!response.ok) throw new Error('Failed to save employee');

            setSnackbar({ open: true, message: `Employee ${employeeData.id ? 'updated' : 'created'} successfully` });
            handleCloseDialog();
            fetchEmployees();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDeleteEmployee = async (id) => {
        try {
            const response = await fetch(`${API_URL}/employees/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete employee');
            setSnackbar({ open: true, message: 'Employee deleted successfully' });
            fetchEmployees();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <StyledPaper sx={{ width: '100%', overflow: 'hidden', p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Employee Database
                </Typography>
                <Box>
                    <Button
                        variant="contained"
                        startIcon={<FilterList />}
                        onClick={() => setShowFilters(!showFilters)}
                        sx={{ mr: 1 }}
                    >
                        {showFilters ? 'Hide Filters' : 'Show Filters'}
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => handleOpenDialog()}
                    >
                        Add Employee
                    </Button>
                </Box>
            </Box>

            {showFilters && (
                <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <TextField
                            fullWidth
                            label="Filter by Name"
                            variant="outlined"
                            value={filterName}
                            onChange={handleFilterNameChange}
                            InputProps={{
                                startAdornment: <Search />,
                            }}
                            sx={{
                                input: { color: 'white' },
                                label: { color: 'white' },
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': { borderColor: 'white' },
                                    '&:hover fieldset': { borderColor: 'white' },
                                    '&.Mui-focused fieldset': { borderColor: 'white' },
                                },
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <FormControl fullWidth>
                            <InputLabel sx={{ color: 'white' }}>Role</InputLabel>
                            <Select
                                value={filterRole}
                                onChange={handleFilterRoleChange}
                                label="Role"
                                sx={{ color: 'white', '.MuiOutlinedInput-notchedOutline': { borderColor: 'white' } }}
                            >
                                <MenuItem value="">All</MenuItem>
                                {roles.map((role) => (
                                    <MenuItem key={role} value={role}>{role}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <FormControl fullWidth>
                            <InputLabel sx={{ color: 'white' }}>Department</InputLabel>
                            <Select
                                value={filterDepartment}
                                onChange={handleFilterDepartmentChange}
                                label="Department"
                                sx={{ color: 'white', '.MuiOutlinedInput-notchedOutline': { borderColor: 'white' } }}
                            >
                                <MenuItem value="">All</MenuItem>
                                {departments.map((dept) => (
                                    <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography gutterBottom>Salary Range</Typography>
                        <Slider
                            value={filterSalary}
                            onChange={handleFilterSalaryChange}
                            valueLabelDisplay="auto"
                            min={30000}
                            max={130000}
                            step={5000}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography gutterBottom>Performance Range</Typography>
                        <Slider
                            value={filterPerformance}
                            onChange={handleFilterPerformanceChange}
                            valueLabelDisplay="auto"
                            min={0}
                            max={100}
                        />
                    </Grid>
                </Grid>
            )}

            {isLoading && <LinearProgress />}
            {error && <Typography color="error">{error}</Typography>}

            <StyledTableContainer sx={{ maxHeight: 600 }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    indeterminate={selected.length > 0 && selected.length < employees.length}
                                    checked={employees.length > 0 && selected.length === employees.length}
                                    onChange={handleSelectAllClick}
                                    sx={{ color: 'white' }}
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
                        {employees.map((row) => {
                            const isItemSelected = selected.indexOf(row.id) !== -1;
                            return (
                                <StyledTableRow
                                    hover
                                    onClick={() => handleClick(row.id)}
                                    role="checkbox"
                                    aria-checked={isItemSelected}
                                    tabIndex={-1}
                                    key={row.id}
                                    selected={isItemSelected}
                                >
                                    <TableCell padding="checkbox">
                                        <Checkbox checked={isItemSelected} sx={{ color: 'white' }} />
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
                                        <IconButton size="small" sx={{ color: 'white' }} onClick={() => handleOpenDialog(row)}><Edit /></IconButton>
                                        <IconButton size="small" sx={{ color: 'white' }} onClick={() => handleDeleteEmployee(row.id)}><Delete /></IconButton>
                                        <IconButton size="small" onClick={handleMenuOpen} sx={{ color: 'white' }}><MoreVert /></IconButton>
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
                                </StyledTableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </StyledTableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 50, 100]}
                component="div"
                count={totalCount}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{ color: 'white' }}
            />

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>{currentEmployee ? 'Edit Employee' : 'Add New Employee'}</DialogTitle>
                <DialogContent>
                    <EmployeeForm
                        employee={currentEmployee}
                        onSave={handleSaveEmployee}
                        onCancel={handleCloseDialog}
                    />
                </DialogContent>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                message={snackbar.message}
            />
        </StyledPaper>
    );
};

// EmployeeForm component
const EmployeeForm = ({ employee, onSave, onCancel }) => {
    const [formData, setFormData] = useState(employee || {
        name: '',
        role: '',
        department: '',
        salary: 30000,
        performance: 0,
        tasks: 0,
        status: 'Active'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <TextField
                fullWidth
                margin="normal"
                name="name"
                label="Name"
                value={formData.name}
                onChange={handleChange}
                required
            />
            <FormControl fullWidth margin="normal">
                <InputLabel>Role</InputLabel>
                <Select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                >
                    {roles.map(role => (
                        <MenuItem key={role} value={role}>{role}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
                <InputLabel>Department</InputLabel>
                <Select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                >
                    {departments.map(dept => (
                        <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <TextField
                fullWidth
                margin="normal"
                name="salary"
                label="Salary"
                type="number"
                value={formData.salary}
                onChange={handleChange}
                required
            />
            <TextField
                fullWidth
                margin="normal"
                name="performance"
                label="Performance"
                type="number"
                inputProps={{ min: 0, max: 1, step: 0.01 }}
                value={formData.performance}
                onChange={handleChange}
                required
            />
            <TextField
                fullWidth
                margin="normal"
                name="tasks"
                label="Tasks"
                type="number"
                value={formData.tasks}
                onChange={handleChange}
                required
            />
            <FormControl fullWidth margin="normal">
                <InputLabel>Status</InputLabel>
                <Select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                >
                    {statuses.map(status => (
                        <MenuItem key={status} value={status}>{status}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <DialogActions>
                <Button onClick={onCancel}>Cancel</Button>
                <Button type="submit" variant="contained" color="primary">Save</Button>
            </DialogActions>
        </form>
    );
};

export default TablePage;