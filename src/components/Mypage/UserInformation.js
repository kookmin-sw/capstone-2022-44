import { useEffect, useState } from "react";

import { auth } from '../Fbase'

import axios from 'axios';

import { Button, Grid, Typography } from "@mui/material"

import { onAuthStateChanged } from "firebase/auth";

const UserInformation = () => {
    const [userEmail, setUserEmail] = useState("");
    const [userName, setUserName] = useState("");
    const [userBusinessCard, setUserBusinessCard] = useState("");
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
                axios.get("https://eying.ga/user/search", {
                    params: {
                        email: user.email
                    }
                }).then(res => {
                    setUserName(res.data[0].username);
                    setUserBusinessCard(res.data[0].card);
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
            columns={{ xs: 12, sm: 12, md: 12 }}
            alignItems="flex-end"
            style={{ textAlign: "center", marginTop: 20 }}
        >
            <Grid item xs={12}>
                <Typography>????????? : {userEmail}</Typography>
            </Grid>
            <hr style={{width: "50%", marginTop: 20}} />
            <Grid item xs={12}>
                <Typography>?????? : {userName}</Typography>
            </Grid>
            <hr style={{width: "50%", marginTop: 20}} />
            <Grid item xs={12}>
                <Typography>??????</Typography>
                <img src={userBusinessCard} style={{ width: "50%", height: 300, marginTop: 20}} />
            </Grid>
            <hr style={{width: "50%", marginTop: 20}} />
            <Grid item xs={12}>
                <Typography>?????? : {userAge}</Typography>
            </Grid>
            <hr style={{width: "50%", marginTop: 20}} />
            <Grid item xs={12}>
                <Typography>?????? : {userGender}</Typography>
            </Grid>
            <hr style={{width: "50%", marginTop: 20}} />
            <Grid item xs={12}>
                <Typography>?????? : {userJobField}</Typography>
            </Grid>
            <hr style={{width: "50%", marginTop: 20}} />
            <Grid item xs={12}>
                <Typography>?????? : {userJob}</Typography>
            </Grid>
            <hr style={{width: "50%", marginTop: 20}} />
            <Grid item xs={12}>
                <Typography>?????? : {userPosition}</Typography>
            </Grid>
            <Grid item xs={12}>
            <hr style={{width: "50%", marginTop: 20}} />
                <Typography>PDF ????????? ??? : {userPdfCount}</Typography>
            </Grid>
            <hr style={{width: "50%", marginTop: 20}} />
            <Grid item xs={12}>
                <Typography>????????? : {userCredit}</Typography>
            </Grid>
            <hr style={{width: "50%", marginTop: 20}} />
            <Grid item xs={12}>
                <Button 
                    disabled
                    variant="outlined" 
                    onClick={onClickBuyPoint}
                >
                    ????????? ??????
                </Button>
            </Grid>
        </Grid>
    )
}
export default UserInformation;