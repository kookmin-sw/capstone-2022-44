import { useEffect, useState } from "react";

import { auth } from '../Fbase'

import axios from 'axios';

import { Button, Grid, Typography } from "@mui/material"

import { onAuthStateChanged } from "firebase/auth";

const UserInformation = () => {
    const [userEmail, setUserEmail] = useState("");
    const [userName, setUserName] = useState("");
    const [userAge, setUserAge] = useState();
    const [userGender, setUserGender] = useState("");
    const [userJobField, setUserJobField] = useState("");
    const [userJob, setUserJob] = useState("");
    const [userPosition, setUserPosition] = useState("");
    const [userPdfCount, setUserPdfCount] = useState("");
    const [userCredit, setUserCredit] = useState();
    
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserEmail(user.email);
                axios.get('http://13.125.233.170:8000/user/search/', {
                    params: {
                        email: user.email
                    }
                }).then(res => {
                    setUserName(res.data[0].username);
                    setUserAge(res.data[0].age);
                    setUserGender(res.data[0].gender);
                    setUserJobField(res.data[0].job_field);
                    setUserJob(res.data[0].job);
                    setUserPosition(res.data[0].position);
                    setUserPdfCount(res.data[0].upload_count);
                    setUserCredit(res.data[0].credit);
                }).catch((error) => {
                    console.log(error);
                });
            }
        });
    }, []);

    const onClickBuyPoint = () => {
        console.log("Buy Point");
    }

    return (
        <Grid 
            container 
            rowSpacing={{ xs: 3, sm: 3, md: 3}}
            columns={{ xs: 12, sm: 12, md: 12 }}
            alignItems="flex-end"
            style={{ textAlign: "center", marginTop: 20 }}
        >
            <Grid item xs={12}>
                <Typography>이메일 : {userEmail}</Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography>이름 : {userName}</Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography>나이 : {userAge}</Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography>성별 : {userGender}</Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography>분야 : {userJobField}</Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography>직업 : {userJob}</Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography>계급 : {userPosition}</Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography>PDF 업로드 수 : {userPdfCount}</Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography>포인트 : {userCredit}</Typography>
            </Grid>
            <Grid item xs={12}>
                <Button 
                    variant="outlined" 
                    onClick={onClickBuyPoint}
                    style={{ color: "black", borderColor: "#a8a9a8" }}
                >
                    포인트 구매
                </Button>
            </Grid>
        </Grid>
    )
}
export default UserInformation;