import { Box, Button, Container, FormControlLabel, Grid, TextField } from "@mui/material"
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import FormLabel from '@mui/material/FormLabel';
import { useState } from "react";
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./Fbase";

const Enroll = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [age, setAge] = useState(0);
    const [sex, setSex] = useState("");
    const [personJob, setPersonJob] = useState([]);
    const [confirmpassword, setConfirmPassword] = useState("");

    const onChange = (event) => {
        const { target: { name, value } } = event;
        if (name === "email") {
            setEmail(value)
        } else if (name === "password") {
            setPassword(value)
        } else if (name === "age") {
            setAge(value)
        } else if (name === "sex") {
            setSex(event.target.value)
        } else if (name === "confirmpassword") {
            setConfirmPassword(value)
        }
    }

    const onClickEnroll = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            // fetch("hhttp://3.36.60.4:8000/pdf/", {
            //     method: "POST",
            //     headers: {
            //         "Content-Type": "application/json",
            //     },
            //     body: JSON.stringify({
            //         title: "Test",
            //         body: "I am testing!",
            //         userId: 1,
            //     }),
            // })
            //     .then((response) => response.json())
            //     .then((data) => console.log(data))
            alert("정상적으로 회원가입이 완료되었습니다.")
            window.location.replace("http://localhost:3000/home");
        } catch (error) {
            alert(error.message);
        }
    }

    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
            },
        },
    };

    const jobs = [
        '중학생',
        '고등학생',
        '대학생',
        '취준생',
        '직장인',
        '무직',
    ];

    function getStyles(job, personJob, theme) {
        return {
            fontWeight:
                personJob.indexOf(job) === -1
                    ? theme.typography.fontWeightRegular
                    : theme.typography.fontWeightMedium,
        };
    }

    const theme = useTheme();


    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        setPersonJob(event.target.value)
    };

    function componentDidMount() {
        // custom rule will have name 'isPasswordMatch'
        ValidatorForm.addValidationRule('isPasswordMatch', (value) => {
            if (value !== password) {
                return false;
            }
            return true;
        });
    }


    return (
        <Container component="main" maxWidth="xs">
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '79vh' }} >
                <ValidatorForm component="form" sx={{ mt: 3 }} >
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                name="email"
                                label="Email Address"
                                autoComplete="email"
                                onChange={onChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextValidator
                                fullWidth
                                label="Password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                onChange={onChange}
                                validators={['required']}
                                errorMessages={['this field is required']}
                                value={password}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextValidator
                                fullWidth
                                name="confirmpassword"
                                label="Repeat password"
                                type="password"
                                autoComplete="repeat-password"
                                onChange={onChange}
                                validators={['isPasswordMatch', 'required']}
                                errorMessages={['password mismatch', 'this field is required']}
                                value={confirmpassword}
                                onClick={componentDidMount}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                name="age"
                                label="age"
                                autoComplete="age"
                                onChange={onChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl>
                                <FormLabel id="demo-row-radio-buttons-group-label">Gender</FormLabel>
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    name="sex"
                                    onChange={onChange}
                                >
                                    <FormControlLabel value="female" control={<Radio />} label="Female" />
                                    <FormControlLabel value="male" control={<Radio />} label="Male" />
                                    <FormControlLabel value="other" control={<Radio />} label="Other" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl sx={{ width: 300 }}>
                                <InputLabel id="demo-multiple-job-label">Job</InputLabel>
                                <Select
                                    labelId="demo-multiple-job-label"
                                    id="demo-multiple-job"
                                    value={personJob}
                                    onChange={handleChange}
                                    input={<OutlinedInput label="Job" />}
                                    MenuProps={MenuProps}
                                >
                                    {jobs.map((job) => (
                                        <MenuItem
                                            key={job}
                                            value={job}
                                            style={getStyles(job, personJob, theme)}
                                        >
                                            {job}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                onClick={onClickEnroll}>
                                회원가입
                            </Button>
                        </Grid>
                    </Grid>
                </ValidatorForm>
            </Box>
        </Container >
    )
}

export default Enroll;