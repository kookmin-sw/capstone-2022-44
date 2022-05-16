import { Button, Grid, TextField, Typography, InputLabel, FormControl, OutlinedInput, FormHelperText } from "@mui/material"
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { useState, useEffect } from "react";
import { updateEmail, onAuthStateChanged, sendPasswordResetEmail, signOut } from "firebase/auth";
import { auth } from "../Fbase";
import axios from 'axios';
import { useNavigate } from "react-router-dom"


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
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + 8,
            width: 250,
        },
    },
};

// var userUpdateEmail = "";

const ChangeUserInformation = () => {
    const [userEmail, setUserEmail] = useState("");
    const [userUpdateEmail, setUserUpdateEmail] = useState("")
    const [userName, setUserName] = useState("");
    const [userUpdateName, setUserUpdateName] = useState("");
    const [userAge, setUserAge] = useState();
    const [userUpdateAge, setUserUpdateAge] = useState();
    const [userJob, setUserJob] = useState("");
    const [job, setJob] = useState("");
    const [position, setPosition] = useState("");
    const [userPosition, setUserPosition] = useState("");
    const [image, setImage] = useState("");
    const [fields, setFields] = useState("");
    const [userJobField, setUserJobField] = useState("");
    const navigate = useNavigate();

    const onChange = (event) => {
        const { target: { name, value } } = event;
        if (name === "email") {
            setUserUpdateEmail(value);
        } else if (name === "age") {
            setUserUpdateAge(value)
        } else if (name === "name") {
            setUserUpdateName(value)
        }
    }


    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserEmail(user.email);
                axios.get('http://13.125.233.170:8000/user/search/', {
                    params: {
                        email: user.email
                    }
                }).then(res => {
                    console.log(res);
                    setUserName(res.data[0].username);
                    setUserAge(res.data[0].age);
                    setUserJobField(res.data[0].job_field);
                    setJob(res.data[0].job);
                    setUserPosition(res.data[0].position);
                }).catch((error) => {
                    console.log(error);
                });
            }
        });

    }, []);

    const onClickChangeEmail = () => {
        const user = auth.currentUser;
        updateEmail(user, userUpdateEmail).then(() => {
            axios.put('http://13.125.233.170:8000/user/', {
                email: userEmail,
                new_email: userUpdateEmail
            })
        }).catch((error) => {
            alert("재로그인 후 시도해주세요.")
        })
    }

    const onClickChangePassword = () => {
        const user = auth.currentUser;
        if (user) {
            sendPasswordResetEmail(auth, user.email, { url: 'http://localhost:3000/login' })
                .then(() => {
                    console.log('success')
                    alert('비밀번호 재설정 이메일을 보냈습니다. 비밀번호를 재설정후 다시 로그인해주세요')
                    signOut(auth)
                        .then(() => {
                            navigate("/login");
                        })
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.log(errorMessage);
                    console.log(errorCode);
                });
        }
    }

    const onClickChangeUsername = () => {

        axios.put('http://13.125.233.170:8000/user/', { email: userEmail, username: userUpdateName })
            .then(() => {
                alert("이름이 수정되었습니다.");
            }).catch(error => {
                console.log(error)
            })
    }

    const onClickChangeAge = () => {

        axios.put('http://13.125.233.170:8000/user/', { email: userEmail, age: userUpdateAge })
            .then(() => {
                alert("나이가 수정되었습니다.");
            }).catch(error => {
                console.log(error)
            })
    }

    const onClickChangeJob = () => {

        axios.put('http://13.125.233.170:8000/user/', { email: userEmail, job: userJob, position: position, job_field: fields })
            .then(() => {
                alert("직업 수정되었습니다.");
            }).catch(error => {
                console.log(error)
            })
    }

    var type = null;
    var options = null;
    if (userJob === "중학생" || userJob === "고등학생") {
        type = middleHighStudent;
    } else if (userJob === "직장인") {
        type = salary;
    } else if (userJob === "대학생") {
        type = collegeStudent;
    }


    const handleChangeJob = (event) => {
        setUserJob(event.target.value)
    };

    const handleChangePosition = (event) => {
        setPosition(event.target.value)
    };

    const handleChangeField = (event) => {
        setFields(event.target.value)
    };

    const onLoadFile = (event) => {
        setImage(event.target.files[0]);
    }

    if (type) {
        options = type.map((el) => (
            <MenuItem
                key={el}
                value={el}
            >
                {el}
            </MenuItem>
        ))
    }

    return (
        <Grid container columns={{ xs: 3, sm: 6, md: 12 }}>
            <Grid item xs={3} style={{ marginTop: 50 }}>
                <Typography>이메일</Typography>
            </Grid>
            <Grid item xs={3} style={{ marginTop: 50 }}>
                {userEmail}
            </Grid>
            <Grid item xs={3} style={{ marginTop: 30 }}>
                <TextField
                    variant="standard"
                    helperText="변경할 이메일 주소를 입력해주세요"
                    name="email"
                    label="Email"
                    value={userUpdateEmail}
                    onChange={onChange}
                />
            </Grid>
            <Grid item xs={3} style={{ marginTop: 50 }}>
                <Button
                    variant="outlined"
                    onClick={onClickChangeEmail}
                    style={{ color: "black", borderColor: "#a8a9a8" }}
                >
                    변경하기
                </Button>
            </Grid>
            <Grid item xs={3} style={{ marginTop: 50 }}>
                <Typography>이름</Typography>
            </Grid>
            <Grid item xs={3} style={{ marginTop: 50 }}>
                {userName}
            </Grid>
            <Grid item xs={3} style={{ marginTop: 30 }}>
                <TextField
                    variant="standard"
                    name="name"
                    label="Name"
                    value={userUpdateName}
                    onChange={onChange}
                />
            </Grid>
            <Grid item xs={3} style={{ marginTop: 50 }}>
                <Button
                    variant="outlined"
                    onClick={onClickChangeUsername}
                    style={{ color: "black", borderColor: "#a8a9a8" }}
                >
                    변경하기
                </Button>
            </Grid>
            <Grid item xs={3} style={{ marginTop: 50 }}>
                <Typography>나이</Typography>
            </Grid>
            <Grid item xs={3} style={{ marginTop: 50 }}>
                {userAge}
            </Grid>
            <Grid item xs={3} style={{ marginTop: 30 }}>
                <TextField
                    variant="standard"
                    name="age"
                    label="Age"
                    value={userUpdateAge}
                    onChange={onChange}
                />
            </Grid>
            <Grid item xs={3} style={{ marginTop: 50 }}>
                <Button
                    variant="outlined"
                    onClick={onClickChangeAge}
                    style={{ color: "black", borderColor: "#a8a9a8" }}
                >
                    변경하기
                </Button>
            </Grid>
            <Grid item xs={3} style={{ marginTop: 50 }}>
                <Typography>분야</Typography>
            </Grid>
            <Grid item xs={3} style={{ marginTop: 50 }}>
                {userJobField}
            </Grid>
            <Grid item xs={3} style={{ marginTop: 30 }}>
                <FormControl style={{ minWidth: 210 }}>
                    <InputLabel id="job-field-label">Job Field</InputLabel>
                    <Select
                        labelId="job-field-label"
                        id="job-field"
                        value={fields}
                        onChange={handleChangeField}
                        input={<OutlinedInput label="Job_Field" />}
                        MenuProps={MenuProps}
                        defaultValue=""
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
            <Grid item xs={3} style={{ marginTop: 40 }}>
                <Button
                    variant="outlined"
                    onClick={onClickChangeJob}
                    style={{ color: "black", borderColor: "#a8a9a8" }}
                >
                    변경하기
                </Button>
            </Grid>
            <Grid item xs={3} style={{ marginTop: 60 }}>
                <Typography>직업</Typography>
            </Grid>
            <Grid item xs={3} style={{ marginTop: 60 }}>
                {job}
            </Grid>
            <Grid item xs={3} style={{ marginTop: 50 }}>
                <FormControl style={{ minWidth: 210 }}>
                    <InputLabel id="demo-multiple-job-label">Job</InputLabel>
                    <Select
                        labelId="demo-multiple-job-label"
                        id="demo-multiple-job"
                        value={userJob}
                        onChange={handleChangeJob}
                        input={<OutlinedInput label="Job" />}
                        MenuProps={MenuProps}
                        defaultValue=""
                    >
                        {jobs.map((job) => (
                            <MenuItem
                                key={job}
                                value={job}
                            >
                                {job}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={3} style={{ marginTop: 60 }}>
                <Button
                    variant="outlined"
                    onClick={onClickChangeJob}
                    style={{ color: "black", borderColor: "#a8a9a8" }}
                >
                    변경하기
                </Button>
            </Grid>
            <Grid item xs={3} style={{ marginTop: 60 }}>
                <Typography>계급</Typography>
            </Grid>
            <Grid item xs={3} style={{ marginTop: 60 }}>
                {userPosition}
            </Grid>
            <Grid item xs={3} style={{ marginTop: 50 }}>
                <FormControl style={{ minWidth: 180 }}>
                    <InputLabel id="demo-multiple-sub-label">Grade</InputLabel>
                    <Select
                        labelId="demo-multiple-sub-label"
                        id="demo-multiple-sub"
                        value={position}
                        onChange={handleChangePosition}
                        input={<OutlinedInput label="Sub" />}
                        MenuProps={MenuProps}
                        defaultValue=""
                    >
                        {options}
                    </Select>
                    <FormHelperText>계급을 변경하려면 직업을 선택하세요</FormHelperText>
                </FormControl>
            </Grid>
            <Grid item xs={3} style={{ marginTop: 60 }}>
                <Button
                    variant="outlined"
                    onClick={onClickChangeJob}
                    style={{ color: "black", borderColor: "#a8a9a8" }}
                >
                    변경하기
                </Button>
            </Grid>
            <Grid item xs={6} style={{ marginTop: 60 }}>
                {image ? (
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
            <Grid item xs={6} style={{ marginTop: 60 }}>
                <Button
                    variant="outlined"
                    onClick={onClickChangePassword}
                    style={{ color: "black", borderColor: "#a8a9a8" }}
                >
                    비밀번호변경
                </Button>
            </Grid>
        </Grid >
    )
}

export default ChangeUserInformation;