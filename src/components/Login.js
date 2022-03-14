import React, { useState } from 'react';
import { auth } from "./Fbase";
import { signInWithEmailAndPassword, setPersistence, browserSessionPersistence } from "firebase/auth";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Link } from 'react-router-dom';


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onChange = (event) => {
        const { target: { name, value } } = event;
        if (name === "email") {
            setEmail(value)
        } else if (name === "password") {
            setPassword(value)
        }
    }

    const onClickLogin = () => {
        setPersistence(auth, browserSessionPersistence).then(() => {
            return signInWithEmailAndPassword(auth, email, password).then(() => {
                window.location.replace("http://localhost:3000/home");
            });
        }).catch((error) => {
            alert(error.message);
        });
    }

    const signInWithGoogle = () => {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });
        signInWithPopup(auth, provider)
            .then((result) => {
                window.location.replace("http://localhost:3000/home");
            }).catch((error) => {
                console.log(error);
            })
    }





    const theme = createTheme();

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign In
                    </Typography>
                    <Box component="form" noValidate sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    value={email}
                                    onChange={onChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="new-password"
                                    value={password}
                                    onChange={onChange}
                                />
                            </Grid>
                        </Grid>
                        <Button
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            onClick={onClickLogin}
                        >
                            로그인
                        </Button>
                        <Button
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            onClick={signInWithGoogle}
                        >
                            Continue with Google
                        </Button>
                        <Button
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            <Link to="enroll" style={{ textDecoration: 'none', textTransform: 'none', color: "white" }}>
                                회원가입
                            </Link>
                        </Button>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
};
export default Login;