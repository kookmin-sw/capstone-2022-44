<<<<<<< HEAD
import { Box, Button, Container, FormControlLabel, Grid, TextField, FormControl, FormHelperText } from "@mui/material"
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
=======
import { useState } from "react";

import axios from 'axios';

import { useNavigate } from "react-router-dom"

import { Box, Button, Container, Grid, TextField } from "@mui/material"
>>>>>>> 62a1e659b432f23bb257c4399425403a85de315e
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
<<<<<<< HEAD
import FormLabel from '@mui/material/FormLabel';
import { useState } from "react";
=======

import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';

>>>>>>> 62a1e659b432f23bb257c4399425403a85de315e
import { createUserWithEmailAndPassword } from "firebase/auth";

import { auth } from "./Fbase";

const jobs = ["중학생", "고등학생", "대학생", "직장인"];
const middleHighStudent = ["1학년", "2학년", "3학년"];
const collegeStudent = ["1학년", "2학년", "3학년", "4학년", "졸업예정자", "취준생"];
// 계급 종류
const salary = [
    "인턴", 
    "사원", 
    "주임", 
    "대리", 
    "과장", 
    "차장", 
    "부장", 
    "이사", 
    "상무", 
    "전무", 
    "부사장", 
    "사장", 
    "부회장", 
    "회장"
];
// 업계 종류
const jobFields = [
    "Art",
    "Education",
    "Fashion", 
    "Food", 
    "Insurance", 
    "IT", 
    "Law", 
    "Marketing", 
    "Medical", 
    "Sports", 
    "Student", 
    "Other"
];

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

const Enroll = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [age, setAge] = useState(0);
    const [sex, setSex] = useState("");
    const [userJob, setUserJob] = useState([]);
    const [confirmpassword, setConfirmPassword] = useState("");
    const [position, setPosition] = useState([]);
    const [image, setImage] = useState("");
    const [username, setUsername] = useState("");
    const [fields, setFields] = useState([]);
    const [emailError, setEmailError] = useState('');
    const [passwordState, setPasswordState] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const navigate = useNavigate();

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

    const onClickEnroll = async () => {
        var enfrm = new FormData();
        enfrm.append("username", username);
        enfrm.append("job_field", fields)
        enfrm.append("email", email);
        enfrm.append("password", password);
        enfrm.append("age", age);
        enfrm.append("gender", sex);
        enfrm.append("job", userJob);
        enfrm.append("position", position);
        enfrm.append('card', image);

<<<<<<< HEAD
        const res = await axios.post('http://52.78.89.78:8000/user/', enfrm)
            .then(function (response) {
                console.log(response);
                createUserWithEmailAndPassword(auth, email, password)
                    .then(() => {
                        console.log('crew')
                        alert("정상적으로 회원가입이 완료되었습니다.")
                        navigate("/home");

                    })
                    .catch((error) => {
                        console.error(error);
                        alert("정보를 다시 확인해주세요");
                    });
            })
            .catch(function (error) {
                if (error.response) {
                    console.log(error.response.data);
                    console.log(error.response.status);
                    console.error(error);

                    alert(JSON.stringify(error.response.data.error_message));


                }
                else if (error.request) {
                    // 요청이 이루어 졌으나 응답을 받지 못했습니다.
                    // `error.request`는 브라우저의 XMLHttpRequest 인스턴스 또는
                    // Node.js의 http.ClientRequest 인스턴스입니다.
                    console.log(error.request);
                }
                else {
                    // 오류를 발생시킨 요청을 설정하는 중에 문제가 발생했습니다.
                    console.log('Error', error.message);
                }
                console.log(error.config);
            })

        return res;
    }



    const onClickEnroll = (e) => {
        e.preventDefault();
        // 이메일 유효성 체크
        const emailRegex = /([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;

        if (!emailRegex.test(email)) {
            setEmailError('올바른 이메일 형식이 아닙니다.');
        } else {
            setEmailError('');
        }

        // 비밀번호 유효성 체크
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/;
        if (!passwordRegex.test(password)) {
            setPasswordState('숫자+영문자+특수문자 조합으로 8자리 이상 입력해주세요!');
        } else {
            setPasswordState('');
        }

        // 비밀번호 같은지 체크
        if (password !== confirmpassword) {
            setPasswordError('비밀번호가 일치하지 않습니다.');
        } else {
            setPasswordError('');
        }

        if (
            emailRegex.test(email) &&
            passwordRegex.test(password) &&
            password === confirmpassword
        ) {
            postinfo();
        }
=======
        await axios.post('http://3.39.228.6:8000/user/', enfrm).then(() => {
            createUserWithEmailAndPassword(auth, email, password).then(() => {
                alert("정상적으로 회원가입이 완료되었습니다.");
                navigate("/home");
            }).catch(error => {
                alert(error);
            });
        }).catch(error => {
            alert(error.response.data.error_message);
        });
>>>>>>> 62a1e659b432f23bb257c4399425403a85de315e
    }

    var type = null;
    var options = null;

    if (userJob === "중학생" || userJob === "고등학생") {
        type = middleHighStudent;
    } else if (userJob === "직장인") {
        type = salary;
<<<<<<< HEAD
    } else if (personJob === "대학생") {
        type = student2;
    }

    function getStylesSelect(job, personJob, theme) {
        return {
            fontWeight:
                personJob.indexOf(job) === -1
                    ? theme.typography.fontWeightRegular
                    : theme.typography.fontWeightMedium,
        };
    }

    function getStylesSelect2(el, type, theme) {
        return {
            fontWeight:
                type.indexOf(el) === -1
                    ? theme.typography.fontWeightRegular
                    : theme.typography.fontWeightMedium,
        };
    }

    function getStylesSelect3(field, fields, theme) {
        return {
            fontWeight:
                fields.indexOf(field) === -1
                    ? theme.typography.fontWeightRegular
                    : theme.typography.fontWeightMedium,
        };
    }

    const theme = useTheme();


    const handleChangeJob = (event) => {
        setPersonJob(event.target.value)
    };

    const handleChangeSelect = (event) => {
        setSelected(event.target.value)
=======
    } else if (userJob === "대학생") {
        type = collegeStudent;
    }

    const handleChange = (event) => {
        setUserJob(event.target.value)
    };

    const handleChange2 = (event) => {
        setPosition(event.target.value)
>>>>>>> 62a1e659b432f23bb257c4399425403a85de315e
    };

    const handleChangeField = (event) => {
        setFields(event.target.value)
    };

    const onLoadFile = (event) => {
<<<<<<< HEAD
        const image = event.target.files[0];
        console.log(image);
        setImage(image);
    }

=======
        setImage(event.target.files[0]);
    }
>>>>>>> 62a1e659b432f23bb257c4399425403a85de315e

    if (type) {
        options = type.map((el) => (
            <MenuItem
                key={el}
                value={el}
<<<<<<< HEAD
                style={getStylesSelect2(el, type, theme)}
=======
>>>>>>> 62a1e659b432f23bb257c4399425403a85de315e
            >
                {el}
            </MenuItem>
        ))
    }

<<<<<<< HEAD
    return (
        <Container component="main" maxWidth="xs">
            <Box component="form" noValidate sx={{ marginTop: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '90vh' }} >
                <FormControl component="fieldset" variant="standard">
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                required
                                autoFocus
                                fullWidth
                                name="email"
                                label="Email Address"
                                // autoComplete="email"
                                onChange={onChange}
                                error={emailError !== '' || false}
=======
    function componentDidMount() {
        // custom rule will have name 'isPasswordMatch'
        ValidatorForm.addValidationRule('isPasswordMatch', (value) => {
            if (value !== password) {
                return false;
            }
            return true;
        });
    }

    const onKeyUp = (event) => {
        if (event.keycode === '9') {
            componentDidMount();
        }
    }

    const onClickBack = () => {
        navigate("/login")
    }

    const handleSubmit = () => {

    }

    const handleSexChange = (event) => {
        setSex(event.target.value);
    }

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{ marginTop: 5, display: 'flex', height: '90vh' }} >
                <ValidatorForm noValidate onSubmit={handleSubmit} component="form" sx={{ mt: 3 }} >
                    <Grid container columns={{ xs: 12, sm: 12, md: 12 }} spacing={2} direction="row" justifyContent="space-between">
                        <Grid item xs={12}>
                            <TextField
                                name="email"
                                label="Email Address"
                                onChange={onChange}
                                style={{ width: "100%" }}
>>>>>>> 62a1e659b432f23bb257c4399425403a85de315e
                            />
                        </Grid>
                        <FormHelperText>{emailError}</FormHelperText>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                label="Password(숫자+영문자+특수문자 8자리 이상)"
                                name="password"
                                type="password"
                                // autoComplete="current-password"
                                value={password}
                                onChange={onChange}
                                error={passwordState !== '' || false}
                            />
                        </Grid>
                        <FormHelperText>{passwordState}</FormHelperText>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                name="confirmpassword"
                                label="Repeat Password"
                                type="password"
<<<<<<< HEAD
                                // autoComplete="repeat-password"
                                value={confirmpassword}
                                onChange={onChange}
                                error={passwordError !== '' || false}
=======
                                autoComplete="repeat-password"
                                onChange={onChange}
                                validators={['isPasswordMatch', 'required']}
                                errorMessages={['비밀번호가 일치하지 않습니다.', 'this field is required']}
                                onClick={componentDidMount}
                                onKeyUp={onKeyUp}
                                value={confirmpassword}
>>>>>>> 62a1e659b432f23bb257c4399425403a85de315e
                            />
                        </Grid>
                        <FormHelperText>{passwordError}</FormHelperText>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                name="username"
                                label="User Name"
                                autoComplete="usernmae"
                                onChange={onChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                name="age"
                                label="Age"
                                onChange={onChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel id="sex-label">Sex</InputLabel>
                                <Select
                                    labelId="sex-label"
                                    id="sex"
                                    value={sex}
                                    label="Sex"
                                    onChange={handleSexChange}
                                >
                                    <MenuItem value={10}>Male</MenuItem>
                                    <MenuItem value={20}>Female</MenuItem>
                                    <MenuItem value={30}>Other</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel id="job-field-label">Job Field</InputLabel>
                                <Select
                                    labelId="job-field-label"
                                    id="job-field"
                                    value={fields}
                                    onChange={handleChange3}
                                    input={<OutlinedInput label="Job_Field" />}
                                    MenuProps={MenuProps}
                                    defaultValue={""}
                                >
                                    {jobFields.map((field) => (
                                        <MenuItem
                                            key={field}
                                            value={field}
                                        >
                                            {field}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl style={{ width: "50%" }}>
                                <InputLabel id="demo-multiple-job-label">Job</InputLabel>
                                <Select
                                    labelId="demo-multiple-job-label"
                                    id="demo-multiple-job"
<<<<<<< HEAD
                                    value={personJob}
                                    onChange={handleChangeJob}
=======
                                    value={userJob}
                                    onChange={handleChange}
>>>>>>> 62a1e659b432f23bb257c4399425403a85de315e
                                    input={<OutlinedInput label="Job" />}
                                    MenuProps={MenuProps}
                                    defaultValue={""}
                                >
                                    {jobs.map((job) => (
                                        <MenuItem
                                            key={job}
                                            value={job}
<<<<<<< HEAD
                                            style={getStylesSelect(job, personJob, theme)}
=======
>>>>>>> 62a1e659b432f23bb257c4399425403a85de315e
                                        >
                                            {job}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl sx={{ width: "50%" }}>
                                <InputLabel id="demo-multiple-sub-label">Grade</InputLabel>
                                <Select
                                    labelId="demo-multiple-sub-label"
                                    id="demo-multiple-sub"
<<<<<<< HEAD
                                    value={selected}
                                    onChange={handleChangeSelect}
=======
                                    value={position}
                                    onChange={handleChange2}
>>>>>>> 62a1e659b432f23bb257c4399425403a85de315e
                                    input={<OutlinedInput label="Sub" />}
                                    MenuProps={MenuProps}
                                    defaultValue={""}
                                >
                                    {options}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
<<<<<<< HEAD
                            <FormControl sx={{ minWidth: 300 }}>
                                <InputLabel id="demo-multiple-field-label">Job Field</InputLabel>
                                <Select
                                    labelId="demo-multiple-field-label"
                                    id="demo-multiple-field"
                                    value={fields}
                                    onChange={handleChangeField}
                                    input={<OutlinedInput label="Job_Field" />}
                                    MenuProps={MenuProps}
                                    defaultValue={""}
                                >
                                    {job_fields.map((field) => (
                                        <MenuItem
                                            key={field}
                                            value={field}
                                            style={getStylesSelect3(field, fields, theme)}
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
=======
                            {image ? (
>>>>>>> 62a1e659b432f23bb257c4399425403a85de315e
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    disabled
                                >
                                    업로드 완료
                                </Button>
                            ) : (
                                    <>
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
                                                fullWidth
                                                variant="outlined"
                                                component="span"
                                                style={{ marginTop: 5, color: "black", borderColor: "#a8a9a8" }}
                                            >
                                                명함 업로드
                                            </Button>
                                        </label>
                                    </>
                                )
                            }
                        </Grid>
                        <Grid item xs={6}>
                            <Button
<<<<<<< HEAD
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                onClick={onClickEnroll}
=======
                                variant="outlined"
                                sx={{ mt: 2 }}
                                onClick={onClickBack}
                                style={{ color: "black", borderColor: "#a8a9a8", width: 100 }}
                            >
                                돌아가기
                                </Button>
                        </Grid>
                        <Grid item xs={6} style={{ textAlign: "end" }}>
                            <Button
                                variant="outlined"
                                sx={{ mt: 2 }}
                                onClick={onClickEnroll}
                                style={{ color: "black", borderColor: "#a8a9a8", width: 100 }}
>>>>>>> 62a1e659b432f23bb257c4399425403a85de315e
                            >
                                회원가입
                                </Button>
                        </Grid>
                    </Grid>
                </FormControl>
            </Box>
        </Container >
    )
}

export default Enroll;