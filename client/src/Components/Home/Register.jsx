import React from 'react';
import { makeStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import TextField from '@material-ui/core/TextField';
import { Formik } from 'formik';
import * as Yup from 'yup';

import history from '../../Utilities/history';
import { useRegister } from '../../Services/authenticationService';
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";

const useStyles = makeStyles(theme => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    form: {
        width: '100%',
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

const Register = props => {
    const register = useRegister();

    const classes = useStyles();

    return (
        <div className={classes.paper}>
            <Grid container>
                <Grid item>
                    <Typography component="h1" variant="h5" align="center">
                        Register
                    </Typography>
                    <Formik
                        initialValues={{
                            name: '',
                            username: '',
                            password: '',
                            password2: '',
                            description: '',
                            nativeLanguage: '',
                            targetLanguage: '',
                        }}
                        validationSchema={Yup.object().shape({
                            name: Yup.string()
                                .required('Name is required')
                                .max(40, 'Too Long!'),
                            username: Yup.string()
                                .required('Username is required')
                                .max(40, 'Username address too long'),
                            password: Yup.string()
                                .required('Password is Required')
                                .max(100, 'Password too long')
                                .min(6, 'Password should be at least 6 characters long'),
                            password2: Yup.string().oneOf(
                                [Yup.ref('password'), null],
                                'Passwords do not match'),
                            description: Yup.string()
                                .required('Description is Required')
                                .max(500, 'Description is too long'),
                            nativeLanguage: Yup.string()
                                .required('Native language is required'),
                            targetLanguage: Yup.string()
                                .required('Target language is required'),
                        })}
                        onSubmit={(
                            { name, username, password, password2, description, nativeLanguage, targetLanguage },
                            { setStatus, setSubmitting }
                        ) => {
                            setStatus();
                            register(name, username, password, password2, description, nativeLanguage, targetLanguage).then(
                                user => {
                                    const { from } = history.location.state || {
                                        from: { pathname: '/chat' },
                                    };
                                    history.push(from);
                                },
                                error => {
                                    setSubmitting(false);
                                    setStatus(error);
                                }
                            );
                        }}
                        validateOnChange={false}
                        validateOnBlur={false}
                    >
                        {({
                            handleSubmit,
                            handleChange,
                            values,
                            touched,
                            isValid,
                            errors,
                        }) => (
                            <form
                                onSubmit={handleSubmit}
                                className={classes.form}
                            >
                                <TextField
                                    id="name"
                                    className={classes.textField}
                                    name="name"
                                    label="Name"
                                    fullWidth={true}
                                    variant="outlined"
                                    margin="normal"
                                    required={true}
                                    helperText={touched.name ? errors.name : ''}
                                    error={touched.name && Boolean(errors.name)}
                                    value={values.name}
                                    onChange={handleChange}
                                />

                                <TextField
                                    id="username"
                                    className={classes.textField}
                                    name="username"
                                    label="Username"
                                    fullWidth={true}
                                    variant="outlined"
                                    margin="normal"
                                    required={true}
                                    helperText={
                                        touched.username ? errors.username : ''
                                    }
                                    error={
                                        touched.username &&
                                        Boolean(errors.username)
                                    }
                                    value={values.username}
                                    onChange={handleChange}
                                />

                                <TextField
                                    id="password"
                                    className={classes.textField}
                                    name="password"
                                    label="Password"
                                    fullWidth={true}
                                    variant="outlined"
                                    margin="normal"
                                    required={true}
                                    helperText={
                                        touched.password ? errors.password : ''
                                    }
                                    error={
                                        touched.password &&
                                        Boolean(errors.password)
                                    }
                                    value={values.password}
                                    onChange={handleChange}
                                    type="password"
                                />

                                <TextField
                                    id="password2"
                                    className={classes.textField}
                                    name="password2"
                                    label="Confirm Password"
                                    fullWidth={true}
                                    variant="outlined"
                                    margin="normal"
                                    required={true}
                                    helperText={
                                        touched.password2
                                            ? errors.password2
                                            : ''
                                    }
                                    error={
                                        touched.password2 &&
                                        Boolean(errors.password2)
                                    }
                                    value={values.password2}
                                    onChange={handleChange}
                                    type="password"
                                />

                                <TextField
                                    id="description"
                                    className={classes.textField}
                                    name="description"
                                    label="Description of yourself"
                                    fullWidth={true}
                                    variant="outlined"
                                    margin="normal"
                                    required={true}
                                    helperText={touched.description ? errors.description : ''}
                                    error={touched.description && Boolean(errors.description)}
                                    value={values.description}
                                    onChange={handleChange}
                                />

                                <FormControl
                                    fullWidth={true}
                                    className={classes.formControl}
                                    margin="normal"
                                >
                                    <InputLabel id="native-language-select-label">Native Language</InputLabel>
                                    <Select
                                        id="nativeLanguage"
                                        name="nativeLanguage"
                                        labelId="native-language-select-label"
                                        variant="outlined"
                                        required={true}
                                        helperText={touched.nativeLanguage ? errors.nativeLanguage : ''}
                                        error={touched.nativeLanguage && Boolean(errors.nativeLanguage)}
                                        value={values.nativeLanguage}
                                        onChange={handleChange}
                                    >
                                        <MenuItem value={"english"}>English</MenuItem>
                                        <MenuItem value={"tamil"}>Tamil</MenuItem>
                                        <MenuItem value={"sinhala"}>Sinhala</MenuItem>
                                    </Select>
                                </FormControl>

                                <FormControl
                                    fullWidth={true}
                                    className={classes.formControl}
                                    margin="normal"
                                >
                                    <InputLabel id="target-language-select-label">Target Language</InputLabel>
                                    <Select
                                        id="targetLanguage"
                                        name="targetLanguage"
                                        labelId="target-language-select-label"
                                        variant="outlined"
                                        required={true}
                                        helperText={touched.targetLanguage ? errors.targetLanguage : ''}
                                        error={touched.targetLanguage && Boolean(errors.targetLanguage)}
                                        value={values.targetLanguage}
                                        onChange={handleChange}
                                    >
                                        <MenuItem value={"english"}>English</MenuItem>
                                        <MenuItem value={"tamil"}>Tamil</MenuItem>
                                        <MenuItem value={"sinhala"}>Sinhala</MenuItem>
                                    </Select>
                                </FormControl>

                                <Button
                                    type="submit"
                                    fullWidth={true}
                                    variant="contained"
                                    color="primary"
                                    className={classes.submit}
                                >
                                    Register
                                </Button>
                            </form>
                        )}
                    </Formik>
                </Grid>
                <Grid item xs={9}>
                    <Typography>
                        <Link
                            onClick={() => props.handleClick('login')}
                            href="#"
                        >
                            Already have an account?
                        </Link>
                    </Typography>
                </Grid>
            </Grid>
        </div>
    );
};

export default Register;
