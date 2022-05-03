import { useEffect, useState } from 'react';

import axios from 'axios';

import { Box, Button, Grid } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import AliceCarousel from 'react-alice-carousel';
import "react-alice-carousel/lib/alice-carousel.css";

import { onAuthStateChanged } from 'firebase/auth';

import Loading from "./Loading";
import IsLoggedIn from "./IsLoggedIn";
import { auth } from './Fbase';

const columns = [
    { field: 'pdf_name', headerName: '제목', flex: 1, align: 'center', headerAlign: "center" },
    { field: 'job_field', headerName: '업종', width: 150, align: 'right', headerAlign: "center" },
    { field: 'user_name', headerName: '작성자', width: 150, align: 'right', headerAlign: "center" },
    { field: 'upload_at', headerName: '등록일', width: 160, align: 'right', headerAlign: "center" },
    { field: 'deadline', headerName: '마감일', width: 160, align: 'right', headerAlign: "center" },
    { field: 'views', headerName: '조회수', width: 90, align: 'right', headerAlign: "center" },
];

const Track = () => {
    const webgazer = window.webgazer; // webgazer instance
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isTracking, setIsTracking] = useState(false);

    const [selectionModel, setSelectionModel] = useState();
    const [userEmail, setUserEmail] = useState(""); // 유저 이메일
    const [ownerEmail, setOwnerEmail] = useState("");
    const [pdfs, setPdfs] = useState([]); // 전체 pdf
    const [imgsUrl, setImgsUrl] = useState([]); // pdf image url 배열
    const [pdfId, setPdfId] = useState(0); // pdf 고유 아이디 값
    const [pageNum, setPageNum] = useState(0); // pdf 현재 페이지
    var dimensionArr = []; // webgazer x, y 좌표가 담길 배열

    useEffect(() => {
        // 유저 정보 가져오는 함수
        try {
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    setUserEmail(user.email);
                    setIsLoggedIn(true);
                    // 유저가 로그인했을 때 서버에서 데이터를 가져온다.
                    axios.get('http://3.36.95.29:8000/pdf/').then(res => {
                        if (res.status === 200) {
                            console.log(res.status);
                            setPdfs(res.data);
                        }
                    })
                }
                setIsLoading(false);
            });
        } catch (error) {
            console.log(error);
        }
    }, []);

    // PDF를 고르고 Track 버튼 누른 경우
    const onClickTrack = async () => {
        setIsTracking(true);
        setIsLoading(true);
        await axios.get('http://3.36.95.29:8000/pdf/search', {
            params: {
                pdf_id: selectionModel[0]
            }
        }).then(res => {
            if (res.status === 200) {
                console.log(res.data[0]);
                setImgsUrl(res.data[0].imgs_url);
                setPdfId(res.data[0].id);
                setOwnerEmail(res.data[0].user_email);
            }
            setIsLoading(false);
        });
    };

    const onClickStart = () => {
        webgazer.setGazeListener(function (data) {
            if (data == null) {
                return;
            }
            dimensionArr.push([Math.floor(data.x), Math.floor(data.y)]);
        }).begin();
    };

    // webgazer 종료 함수
    const onClickEnd = async () => {
        // 서버에 dataset 보내는 함수
        await axios.post("http://3.36.95.29:8000/eyetracking/", {
            'user_email': userEmail,
            'owner_email': ownerEmail,
            'rating_time': '00:00:00',
            'page_number': pageNum,
            'pdf_id': pdfId,
            'coordinate': dimensionArr
        }).then(() => {
            webgazer.end();
            webgazer.showPredictionPoints(false);
            dimensionArr = [];
            setIsTracking(false);
            window.location.reload();
        });
    };

    const onClickBack = () => {
        window.location.replace("track");
    };

    // Before swipe slide, post data to server
    const onSlideChange = async () => {
        await axios.post("http://3.36.95.29:8000/eyetracking/", {
            'user_email': userEmail,
            'owner_email': ownerEmail,
            'rating_time': '00:00:00',
            'page_number': pageNum,
            'pdf_id': pdfId,
            'coordinate': dimensionArr,
        }).then(() => {
            dimensionArr = [];
        });
    };

    // After swipe silde, update pageNum
    const onSlideChanged = (e) => {
        setPageNum(e.item);
    };

    // 로딩 중일 때 보여줄 화면
    if (isLoading) return (
        <Loading />
    )

    // 로그인 안 됐을 때 보여줄 화면
    else if (!isLoggedIn) return (
        <IsLoggedIn />
    )

    // Track 버튼 눌렀을 때 보여줄 화면
    else if (isTracking) return (
        <Box
            sx={{
                width: '100vw',
                height: '100vh',
                display: 'column',
                background: '#ecebe9',
                flexGrow: 1,
            }}
        >
            <Grid container columns={{ xs: 12, sm: 12, md: 12 }} style={{ textAlign: "center" }}>
                <Grid item xs={12}>
                    <AliceCarousel
                        animationDuration={1}
                        keyboardNavigation={true}
                        onSlideChange={onSlideChange}
                        onSlideChanged={onSlideChanged}
                        disableButtonsControls={true}
                    >
                        {/* <img src="/img/s.png" style={{ width: "100%", height: 500 }}> 
                            </img>
                            <img src="/img/example2.png" style={{ width: "100%", height: 500 }}> 
                            </img> */}
                        {imgsUrl && imgsUrl.map((e, index) => (
                            <img key={index} src={e} style={{ width: "90%", height: "80vh" }} />

                        ))}
                    </AliceCarousel>
                    <Button onClick={onClickStart}>
                        Start
                        </Button>
                    <Button onClick={onClickEnd}>
                        End
                        </Button>
                    <Button onClick={onClickBack}>
                        Back
                        </Button>
                </Grid>
            </Grid>
        </Box>
    )

    // 전체 PDF 데이터
    else return (
        <>
            <Button style={{ marginTop: 100, marginLeft: 100 }} onClick={onClickTrack}>
                CONTINUE
            </Button>
            <div style={{ height: 400, width: '80%', margin: "auto" }}>
                <DataGrid
                    rows={pdfs}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    onSelectionModelChange={(newSelectionModel) => {
                        setSelectionModel(newSelectionModel);
                        console.log(newSelectionModel)
                    }}
                    selectionModel={selectionModel}
                    style={{ align: "center" }}
                />
            </div>
        </>
    )
}

export default Track;