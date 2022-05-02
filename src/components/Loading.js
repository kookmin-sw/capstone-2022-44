import { Box, CircularProgress } from '@mui/material';

const Loading = () => {
    return (
        <Box
            sx={{
                width: '100vw',
                height: '100vh',
                background: '#ecebe9',
                flexGrow: 1,
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <CircularProgress size={300} style={{ marginTop: "15%" }} />
            </div>
        </Box>
    )
}

export default Loading;