import { Box, CircularProgress } from '@mui/material';
const Loading = () => {
    return (
        <Box
            sx={{
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'background.zdefault',}}>
            <CircularProgress size={60} thickness={4} />
        </Box>
    );
}

export default Loading;
