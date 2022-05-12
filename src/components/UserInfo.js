import { useEffect, useState } from "react";
import { sendPasswordResetEmail, signOut } from "firebase/auth";
import { auth } from './Fbase'
import axios from 'axios';
import { Box, Button, Container, Grid, Typography } from "@mui/material"
import { useNavigate } from "react-router-dom"


const UserInfo = () => {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();


    useEffect(() => {

        const user = auth.currentUser;
        async function getUserInfo() {
            await axios.get('http://52.78.89.78:8000/user/search/', { params: { email: user.email } })
                .then(function (response) {
                    console.log(response.data);
                    setUsers(response.data);
                })
                .catch((error) => {
                    console.log(error);
                });

        }
        getUserInfo();

    }, []);

    const onClickPassword = () => {
        const user = auth.currentUser;
        if (user) {
            sendPasswordResetEmail(auth, user.email)
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

    return (
        <Container component="main" maxWidth="xs">
            <Box sx={{ marginTop: 5, display: 'flex', flexDirection: 'column', alignItems: 'left', height: '90vh' }}>
                <Typography variant="h3" gutterBottom component="div">
                    회원 정보
                </Typography>
                <p>
                    <div>
                        {users.map(user => {
                            return (<div key={user.id}>
                                email : {user.email}
                                <br />
                                username : {user.username}
                                <br />
                                age : {user.age}
                                <br />
                                gender : {user.gender}
                                <br />
                                job_field : {user.job_field}
                                <br />
                                position : {user.position}
                            </div>)
                        })}
                    </div>
                    <br />
                </p>
                <Grid container spacing={{ md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                    <Button
                        variant="outlined"
                        style={{ marginTop: 5, color: "black", xs: 3 }}
                        onClick={onClickPassword}
                    >
                        비밀번호변경
                    </Button>
                </Grid>
            </Box>
        </Container >

    )
}
export default UserInfo;