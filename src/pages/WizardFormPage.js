import React, { Fragment, useState } from 'react';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import {
    Button, Stepper, Step, StepLabel, Typography, Container, TextField,
    Radio, RadioGroup, FormControlLabel, FormControl, FormLabel,
    Checkbox, Select, MenuItem, InputLabel, Grid, Paper, Slider,
    Switch, Autocomplete, Chip, Box, Rating, IconButton,
    List, ListItem, ListItemText, ListItemIcon,
    Card, CardContent, Accordion, AccordionSummary, AccordionDetails
} from '@mui/material';
import {CloudUpload, Delete, ExpandMore, AutoFixHigh} from '@mui/icons-material';
import '../styles/WizzardFormPage.css'; // Import the CSS file

const skills = ['React', 'JavaScript', 'TypeScript', 'Node.js', 'Python', 'Java', 'C++', 'SQL', 'GraphQL', 'Docker'];

const generateRandomString = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length }, () => characters.charAt(Math.floor(Math.random() * characters.length))).join('');
};

const generateRandomDate = (start, end) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const Step1 = ({ control, setValue }) => {
    const autofillStep1 = () => {
        setValue('firstName', generateRandomString(8));
        setValue('lastName', generateRandomString(10));
        setValue('email', `${generateRandomString(8)}@${generateRandomString(5)}.com`);
        setValue('phone', `+1${Math.floor(Math.random() * 10000000000)}`);
        setValue('gender', ['male', 'female', 'other'][Math.floor(Math.random() * 3)]);
        setValue('birthDate', generateRandomDate(new Date(1950, 0, 1), new Date(2000, 0, 1)));

        [...Array(44)].forEach((_, index) => {
            setValue(`additional${index}`, generateRandomString(15));
        });
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<AutoFixHigh />}
                    onClick={autofillStep1}
                >
                    Autofill Step 1
                </Button>
            </Grid>
            <Grid item xs={12}>
                <Typography variant="h6">Step 1: Personal Information</Typography>
            </Grid>
            <Grid item xs={6}>
                <Controller name="firstName" control={control} defaultValue="" render={({ field }) => <TextField {...field} label="First Name" fullWidth />} />
            </Grid>
            <Grid item xs={6}>
                <Controller name="lastName" control={control} defaultValue="" render={({ field }) => <TextField {...field} label="Last Name" fullWidth />} />
            </Grid>
            <Grid item xs={12}>
                <Controller name="email" control={control} defaultValue="" render={({ field }) => <TextField {...field} label="Email" type="email" fullWidth />} />
            </Grid>
            <Grid item xs={12}>
                <Controller name="phone" control={control} defaultValue="" render={({ field }) => <TextField {...field} label="Phone" type="tel" fullWidth />} />
            </Grid>
            <Grid item xs={12}>
                <FormControl component="fieldset">
                    <FormLabel component="legend">Gender</FormLabel>
                    <Controller
                        name="gender"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <RadioGroup row {...field}>
                                <FormControlLabel value="female" control={<Radio />} label="Female" />
                                <FormControlLabel value="male" control={<Radio />} label="Male" />
                                <FormControlLabel value="other" control={<Radio />} label="Other" />
                            </RadioGroup>
                        )}
                    />
                </FormControl>
            </Grid>

            {[...Array(44)].map((_, index) => (
                <Grid item xs={6} key={`additional${index}`}>
                    <Controller
                        name={`additional${index}`}
                        control={control}
                        defaultValue=""
                        render={({ field }) => <TextField {...field} label={`Additional Info ${index + 1}`} fullWidth />}
                    />
                </Grid>
            ))}
        </Grid>
    );
};

const Step2 = ({ control, setValue }) => {
    const autofillStep2 = () => {
        setValue('occupation', ['developer', 'designer', 'manager', 'other'][Math.floor(Math.random() * 4)]);
        setValue('experience', Math.floor(Math.random() * 21));
        setValue('skills', skills.slice(0, Math.floor(Math.random() * skills.length)));

        [...Array(12)].forEach((_, index) => {
            setValue(`jobTitle${index}`, generateRandomString(10));
            setValue(`company${index}`, generateRandomString(12));
            setValue(`duration${index}`, [
                generateRandomDate(new Date(2000, 0, 1), new Date(2010, 0, 1)),
                generateRandomDate(new Date(2010, 0, 1), new Date())
            ]);
        });
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<AutoFixHigh />}
                    onClick={autofillStep2}
                >
                    Autofill Step 2
                </Button>
            </Grid>
            <Grid item xs={12}>
                <Typography variant="h6">Step 2: Professional Information</Typography>
            </Grid>
            <Grid item xs={12}>
                <Controller
                    name="occupation"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                        <FormControl fullWidth>
                            <InputLabel>Occupation</InputLabel>
                            <Select {...field} label="Occupation">
                                <MenuItem value="developer">Developer</MenuItem>
                                <MenuItem value="designer">Designer</MenuItem>
                                <MenuItem value="manager">Manager</MenuItem>
                                <MenuItem value="other">Other</MenuItem>
                            </Select>
                        </FormControl>
                    )}
                />
            </Grid>
            <Grid item xs={12}>
                <Controller
                    name="experience"
                    control={control}
                    defaultValue={0}
                    render={({ field }) => (
                        <Box>
                            <Typography gutterBottom>Years of Experience</Typography>
                            <Slider {...field} valueLabelDisplay="auto" step={1} marks min={0} max={20} />
                        </Box>
                    )}
                />
            </Grid>
            <Grid item xs={12}>
                <Controller
                    name="skills"
                    control={control}
                    defaultValue={[]}
                    render={({ field }) => (
                        <Autocomplete
                            {...field}
                            multiple
                            options={skills}
                            renderTags={(value, getTagProps) =>
                                value.map((option, index) => (
                                    <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                                ))
                            }
                            renderInput={(params) => (
                                <TextField {...params} variant="outlined" label="Skills" placeholder="Skills" />
                            )}
                            onChange={(_, data) => field.onChange(data)}
                        />
                    )}
                />
            </Grid>
            {[...Array(12)].map((_, index) => (
                <Grid item xs={12} sm={6} md={4} key={`job${index}`}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Job {index + 1}</Typography>
                            <Controller
                                name={`jobTitle${index}`}
                                control={control}
                                defaultValue=""
                                render={({ field }) => <TextField {...field} label="Job Title" fullWidth margin="normal" />}
                            />
                            <Controller
                                name={`company${index}`}
                                control={control}
                                defaultValue=""
                                render={({ field }) => <TextField {...field} label="Company" fullWidth margin="normal" />}
                            />
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

const Step3 = ({ control, setValue }) => {
    const autofillStep3 = () => {
        [...Array(10)].forEach((_, index) => {
            setValue(`preference${index}`, generateRandomString(20));
            setValue(`rating${index}`, Math.floor(Math.random() * 6));
            setValue(`importance${index}`, Math.floor(Math.random() * 101));
            setValue(`mustHave${index}`, Math.random() > 0.5);
        });
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<AutoFixHigh />}
                    onClick={autofillStep3}
                >
                    Autofill Step 3
                </Button>
            </Grid>
            <Grid item xs={12}>
                <Typography variant="h6">Step 3: Preferences and Ratings</Typography>
            </Grid>
            {[...Array(10)].map((_, index) => (
                <Grid item xs={12} key={`pref${index}`}>
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                            <Typography>Preference Group {index + 1}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Controller
                                        name={`preference${index}`}
                                        control={control}
                                        defaultValue=""
                                        render={({ field }) => (
                                            <TextField {...field} label={`Preference ${index + 1}`} fullWidth />
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Controller
                                        name={`rating${index}`}
                                        control={control}
                                        defaultValue={0}
                                        render={({ field }) => (
                                            <Box>
                                                <Typography component="legend">Rating</Typography>
                                                <Rating
                                                    {...field}
                                                    onChange={(_, value) => field.onChange(value)}
                                                />
                                            </Box>
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Controller
                                        name={`importance${index}`}
                                        control={control}
                                        defaultValue={50}
                                        render={({ field }) => (
                                            <Box>
                                                <Typography gutterBottom>Importance</Typography>
                                                <Slider {...field} valueLabelDisplay="auto" min={0} max={100} />
                                            </Box>
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControlLabel
                                        control={
                                            <Controller
                                                name={`mustHave${index}`}
                                                control={control}
                                                defaultValue={false}
                                                render={({ field }) => <Switch {...field} />}
                                            />
                                        }
                                        label="Must Have"
                                    />
                                </Grid>
                            </Grid>
                        </AccordionDetails>
                    </Accordion>
                </Grid>
            ))}
        </Grid>
    );
};

const Step4 = ({ control, setValue }) => {
    const autofillStep4 = () => {
        [...Array(10)].forEach((_, index) => {
            setValue(`infoText${index}`, generateRandomString(25));
            setValue(`infoSelect${index}`, ['option1', 'option2', 'option3'][Math.floor(Math.random() * 3)]);
            setValue(`infoCheckbox${index}`, Math.random() > 0.5);
            setValue(`infoTime${index}`, new Date(2023, 0, 1, Math.floor(Math.random() * 24), Math.floor(Math.random() * 60)));
        });
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<AutoFixHigh />}
                    onClick={autofillStep4}
                >
                    Autofill Step 4
                </Button>
            </Grid>
            <Grid item xs={12}>
                <Typography variant="h6">Step 4: Additional Information</Typography>
            </Grid>
            {[...Array(10)].map((_, index) => (
                <Grid item xs={12} sm={6} md={4} key={`info${index}`}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Info Group {index + 1}</Typography>
                            <Controller
                                name={`infoText${index}`}
                                control={control}
                                defaultValue=""
                                render={({ field }) => <TextField {...field} label="Text Input" fullWidth margin="normal" />}
                            />
                            <Controller
                                name={`infoSelect${index}`}
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <FormControl fullWidth margin="normal">
                                        <InputLabel>Select Option</InputLabel>
                                        <Select {...field} label="Select Option">
                                            <MenuItem value="option1">Option 1</MenuItem>
                                            <MenuItem value="option2">Option 2</MenuItem>
                                            <MenuItem value="option3">Option 3</MenuItem>
                                        </Select>
                                    </FormControl>
                                )}
                            />
                            <Controller
                                name={`infoCheckbox${index}`}
                                control={control}
                                defaultValue={false}
                                render={({ field }) => (
                                    <FormControlLabel
                                        control={<Checkbox {...field} />}
                                        label="Checkbox Option"
                                    />
                                )}
                            />

                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

const Step5 = ({ control, setValue }) => {
    const [images, setImages] = useState([]);

    const handleImageUpload = (event) => {
        const files = Array.from(event.target.files);
        setImages([...images, ...files]);
    };

    const handleImageDelete = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const autofillStep5 = () => {
        [...Array(10)].forEach((_, index) => {
            setValue(`finalDetail${index}`, generateRandomString(100));
        });
        // Create dummy image objects that mimic File objects
        const dummyImages = [...Array(5)].map((_, index) => ({
            name: `dummy_image_${index + 1}.jpg`,
            type: 'image/jpeg',
            // Add a dummy size (in bytes)
            size: Math.floor(Math.random() * 1000000) + 500000,
            // Add a dummy lastModified timestamp
            lastModified: Date.now() - Math.floor(Math.random() * 10000000),
        }));
        setImages(dummyImages);
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<AutoFixHigh />}
                    onClick={autofillStep5}
                >
                    Autofill Step 5
                </Button>
            </Grid>
            <Grid item xs={12}>
                <Typography variant="h6">Step 5: Image Upload and Final Details</Typography>
            </Grid>
            <Grid item xs={12}>
                <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="raised-button-file"
                    multiple
                    type="file"
                    onChange={handleImageUpload}
                />
                <label htmlFor="raised-button-file">
                    <Button variant="contained" component="span" startIcon={<CloudUpload />}>
                        Upload Images
                    </Button>
                </label>
            </Grid>
            <Grid item xs={12}>
                <List>
                    {images.map((image, index) => (
                        <ListItem key={index}>
                            <ListItemIcon>
                                {image instanceof File ? (
                                    <img src={URL.createObjectURL(image)} alt={`Uploaded ${index}`} style={{ width: 50, height: 50, objectFit: 'cover' }} />
                                ) : (
                                    <Box width={50} height={50} bgcolor="grey.300" display="flex" alignItems="center" justifyContent="center">
                                        <Typography variant="caption">No preview</Typography>
                                    </Box>
                                )}
                            </ListItemIcon>
                            <ListItemText primary={image.name} secondary={`Size: ${(image.size / 1024).toFixed(2)} KB`} />
                            <IconButton edge="end" aria-label="delete" onClick={() => handleImageDelete(index)}>
                                <Delete />
                            </IconButton>
                        </ListItem>
                    ))}
                </List>
            </Grid>
            {[...Array(10)].map((_, index) => (
                <Grid item xs={12} key={`final${index}`}>
                    <Controller
                        name={`finalDetail${index}`}
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label={`Final Detail ${index + 1}`}
                                fullWidth
                                multiline
                                rows={3}
                                variant="outlined"
                            />
                        )}
                    />
                </Grid>
            ))}
        </Grid>
    );
};

const steps = [
    'Personal Information',
    'Professional Information',
    'Preferences and Ratings',
    'Additional Information',
    'Image Upload and Final Details'
];

const WizardFormPage = () => {
    const [activeStep, setActiveStep] = useState(0);
    const methods = useForm();

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleSubmit = (data) => {
        console.log(data);
        // Handle form submission
    };

    const renderStepContent = (step) => {
        switch (step) {
            case 0: return <Step1 control={methods.control} setValue={methods.setValue} />;
            case 1: return <Step2 control={methods.control} setValue={methods.setValue} />;
            case 2: return <Step3 control={methods.control} setValue={methods.setValue} />;
            case 3: return <Step4 control={methods.control} setValue={methods.setValue} />;
            case 4: return <Step5 control={methods.control} setValue={methods.setValue} />;
            default: return null;
        }
    };

    return (
        <div className="wizard-form-container">
            <Paper className="wizard-form-paper" elevation={3}>
                <FormProvider {...methods}>
                    <form onSubmit={methods.handleSubmit(handleSubmit)}>
                        <Stepper className="wizard-form-stepper" activeStep={activeStep} alternativeLabel>
                            {steps.map((label) => (
                                <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                        <div className="wizard-form-step">
                            {renderStepContent(activeStep)}
                        </div>
                        <div className="wizard-form-button-container">
                            {activeStep > 0 && (
                                <Button className="wizard-form-button" onClick={handleBack} variant="outlined">
                                    Back
                                </Button>
                            )}
                            {activeStep < steps.length - 1 ? (
                                <Button className="wizard-form-button" variant="contained" color="primary" onClick={handleNext}>
                                    Next
                                </Button>
                            ) : (
                                <Button className="wizard-form-button" type="submit" variant="contained" color="primary">
                                    Submit
                                </Button>
                            )}
                        </div>
                    </form>
                </FormProvider>
            </Paper>
        </div>
    );
};

export default WizardFormPage;