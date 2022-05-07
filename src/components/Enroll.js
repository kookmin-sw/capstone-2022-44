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
import axios from 'axios';

const Enroll = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [age, setAge] = useState(0);
    const [sex, setSex] = useState("");
    const [personJob, setPersonJob] = useState([]);
    const [confirmpassword, setConfirmPassword] = useState("");
    const [selected, setSelected] = useState([]);
    const [image, setImage] = useState("");
    const [username, setUsername] = useState("");
    const [fields, setFields] = useState([]);


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
        } else if (name === "username") {
            setUsername(value)
        }
    }



    const onClickEnroll = async (event) => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            let enfrm = new FormData();
            enfrm.append("username", username);
            enfrm.append("job_field", fields)
            enfrm.append("email", email);
            enfrm.append("password", password);
            enfrm.append("age", age);
            enfrm.append("gender", sex);
            enfrm.append("job", personJob);
            enfrm.append("position", selected);
            enfrm.append("credit", '0');
            enfrm.append('card', image);

            for (let key of enfrm.keys()) {
                console.log(`${key}: $[enfrm.get(key)}]`);
            }
            await axios.post('http://3.36.117.66:8000/user/', enfrm);

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

    const jobs = ["중학생", "고등학생", "대학생", "직장인",];
    const student = ["1학년", "2학년", "3학년", "4학년",];
    const salary = ["인턴", "사원", "대리", "과장", "차장", "부장",];
    const job_fields = ["IT", "ART", "SPORTS", "ETC",];


    let type = null;
    let options = null;

    if (personJob === "중학생" || personJob === "고등학생" || personJob === "대학생") {
        type = student;
    } else if (personJob === "직장인") {
        type = salary;
    }

    function getStyles(job, personJob, theme) {
        return {
            fontWeight:
                personJob.indexOf(job) === -1
                    ? theme.typography.fontWeightRegular
                    : theme.typography.fontWeightMedium,
        };
    }

    function getStyles2(el, type, theme) {
        return {
            fontWeight:
                type.indexOf(el) === -1
                    ? theme.typography.fontWeightRegular
                    : theme.typography.fontWeightMedium,
        };
    }

    function getStyles3(field, fields, theme) {
        return {
            fontWeight:
                fields.indexOf(field) === -1
                    ? theme.typography.fontWeightRegular
                    : theme.typography.fontWeightMedium,
        };
    }

    const theme = useTheme();


    const handleChange = (event) => {
        setPersonJob(event.target.value)
    };

    const handleChange2 = (event) => {
        setSelected(event.target.value)
    };

    const handleChange3 = (event) => {
        setFields(event.target.value)
    };



    const onLoadFile = (event) => {
        const image = event.target.files[0];
        console.log(image);
        setImage(image);
    }

    const handleSubmit = () => {

    }

    if (type) {
        options = type.map((el) => (
            <MenuItem
                key={el}
                value={el}
                style={getStyles2(el, type, theme)}
            >
                {el}
            </MenuItem>
        ))
    }

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
            <Box 
                sx={{ 
                    marginTop: 5, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    height: '90vh' 
                }} 
            >
                <ValidatorForm noValidate onSubmit={handleSubmit} component="form" sx={{ mt: 3 }} >
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
                                name="username"
                                label="User Name"
                                value={username}
                                autoComplete="usernmae"
                                onChange={onChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                name="age"
                                label="age"
                                value={age}
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
                                    value={sex}
                                    onChange={onChange}
                                >
                                    <FormControlLabel value="female" control={<Radio />} label="Female" />
                                    <FormControlLabel value="male" control={<Radio />} label="Male" />
                                    <FormControlLabel value="other" control={<Radio />} label="Other" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl sx={{ minWidth: 150 }}>
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
                            <FormControl sx={{ minWidth: 150 }}>
                                <InputLabel id="demo-multiple-sub-label">Sub</InputLabel>
                                <Select
                                    labelId="demo-multiple-sub-label"
                                    id="demo-multiple-sub"
                                    value={selected}
                                    onChange={handleChange2}
                                    input={<OutlinedInput label="Sub" />}
                                    MenuProps={MenuProps}
                                >
                                    {options}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl sx={{ minWidth: 300 }}>
                                <InputLabel id="demo-multiple-field-label">Job Field</InputLabel>
                                <Select
                                    labelId="demo-multiple-field-label"
                                    id="demo-multiple-field"
                                    value={fields}
                                    onChange={handleChange3}
                                    input={<OutlinedInput label="Job_Field" />}
                                    MenuProps={MenuProps}
                                >
                                    {job_fields.map((field) => (
                                        <MenuItem
                                            key={field}
                                            value={field}
                                            style={getStyles3(field, fields, theme)}
                                        >
                                            {field}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <input
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                id="upload-button-file"
                                multiple
                                onChange={onLoadFile}
                            />
                            <label htmlFor="upload-button-file">
                                <Button
                                    variant="outlined"
                                    component="span"
                                    style={{ marginTop: 5, color: "black" }}
                                >
                                    명함 Upload
                                </Button>
                            </label>
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