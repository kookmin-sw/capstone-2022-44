import { Box, Grid, Typography } from "@mui/material";
import { useState } from "react";
// import { EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
// import { auth } from './Fbase'
// import axios from 'axios';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import UserInfo from './UserInfo'



const Mypage = () => {
    const [value, setValue] = useState(0);
    // const [currentPassword] = useState("");
    // const [newpassword] = useState("");
    // const [users, setUsers] = useState([]);


    const handleChange = (event, newValue) => {
        setValue(newValue);
    };


    // useEffect(() => {

    //     const user = auth.currentUser;

    //     async function getUserInfo() {
    //         const result = await axios.get('http://3.36.117.66:8000/user/search/', { params: { email: user.email } })
    //             .then(function (response) {
    //                 console.log(response.data);
    //                 setUsers(response.data);
    //             })
    //             .catch((error) => {
    //                 console.log(error);
    //             });

    //     }
    //     getUserInfo();

    // }, []);

    // const reauthenticate = (currentPassword) => {
    //     let user = auth.currentUser;
    //     let cred = EmailAuthProvider.credential(user.email, currentPassword);
    //     return user.reauthenticateWithCredential(cred);
    // }

    // const onChangePassword = () => {
    //     reauthenticate(currentPassword)
    //         .then(() => {
    //             const user = auth.currentUser;
    //             user.updatePassword(newpassword)
    //                 .then(() => {

    //                 });
    //         })
    //         .catch((error) => {
    //             console.log(error);
    //         })
    // }

    function TabPanel(props) {
        const { children, value, index, ...other } = props;

        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`vertical-tabpanel-${index}`}
                aria-labelledby={`vertical-tab-${index}`}
                {...other}
            >
                {value === index && (
                    <Box sx={{ p: 3 }}>
                        <Typography>{children}</Typography>
                    </Box>
                )}
            </div>
        );
    }

    TabPanel.propTypes = {
        children: PropTypes.node,
        index: PropTypes.number.isRequired,
        value: PropTypes.number.isRequired,
    };

    function a11yProps(index) {
        return {
            id: `vertical-tab-${index}`,
            'aria-controls': `vertical-tabpanel-${index}`,
        };
    }
    return (
        <>
            <Box
                sx={{
                    width: '100%',
                    height: '100vh',
                    display: 'flex',
                    background: '#ecebe9',
                    flexGrow: 1,
                }}
            >
                <Grid container columns={{ xs: 3, sm: 6, md: 12 }} style={{ marginTop: 50 }}>
                    <Tabs
                        orientation="vertical"
                        variant="scrollable"
                        value={value}
                        onChange={handleChange}
                        aria-label="Vertical tabs example"
                        sx={{ borderRight: 1, borderColor: 'divider' }}
                    >
                        <Tab label="회원정보 변경" {...a11yProps(0)} />
                        <Tab label="내 PDF" {...a11yProps(1)} />
                    </Tabs>
                    <TabPanel value={value} index={0}>
                        <UserInfo />
                    </TabPanel>
                    <TabPanel value={value} index={1} style={{ textAlign: "center", width: "90%" }}>
                        <img src="/img/s.png" style={{ width: "60%", height: 500, minWidth: 500 }} />
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                        Item Three
                    </TabPanel>
                    <TabPanel value={value} index={3}>
                        Item Four
                    </TabPanel>
                    <TabPanel value={value} index={4}>
                        Item Five
                    </TabPanel>
                    <TabPanel value={value} index={5}>
                        Item Six
                    </TabPanel>
                    <TabPanel value={value} index={6}>
                        Item Seven
                    </TabPanel>
                </Grid>
            </Box>
        </>
    )
}

export default Mypage;