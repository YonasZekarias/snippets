import { useState, } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, Fade, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';
import { Link as RouterLink } from 'react-router-dom';
export default function Signup() {
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate()
    const handleOnSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        const formData = {
            username: e.target.username.value.trim(),
            email: e.target.email.value.trim(),
            password: e.target.password.value,
        };

        if (e.target.password.value !== e.target.confirmPassword.value) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/users/', formData);
            setSuccessMessage('Account created successfully! You can now log in.');
            e.target.reset();
            if (response.status === 201) {
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            }
        } catch (err) {
            setError(err.response?.data?.detail || 'Signup failed. Please try again.');
            console.log(err);
        } finally {
            setLoading(false);
            setTimeout(() => {
                setSuccessMessage(null);
                setError(null);
            }, 2000);
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', justifyContent: 'center', bgcolor: '#f4f6f8' }}>
            <Box sx={{ width: 350, p: 4, borderRadius: 2, boxShadow: 3, bgcolor: 'white' }}>
                <Typography variant="h4" fontWeight={700} gutterBottom sx={{ textAlign: 'center', color: '#333' }}>Sign Up</Typography>
                <Typography variant="body1" sx={{ color: '#666', textAlign: 'center', mb: 2 }}>Create your account quickly and securely.</Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}

                <form onSubmit={handleOnSubmit}>
                    <TextField required label="Username" name="username" autoComplete="username" fullWidth margin="dense" />
                    <TextField required label="Email" type="email" name="email" autoComplete="email" fullWidth margin="dense" />
                    <TextField required label="Password" type="password" name="password" autoComplete="new-password" fullWidth margin="dense" />
                    <TextField required label="Confirm Password" type="password" name="confirmPassword" fullWidth margin="dense" />

                    <Box sx={{ display: 'flex', justifyContent: 'center', height: 40, mt: 2 }}>
                        {loading && <Fade in={loading}><CircularProgress /></Fade>}
                    </Box>

                    <Button variant="contained" type="submit" fullWidth sx={{ mt: 2, py: 1.2, fontWeight: 'bold', bgcolor: '#1976d2', '&:hover': { bgcolor: '#1565c0' } }} disabled={loading}>
                        {loading ? 'Signing Up...' : 'Sign Up'}
                    </Button>
                </form>

                <Typography variant="body2" sx={{ textAlign: 'center', mt: 2, color: '#444' }}>
                    Already have an account?
                    <Button component={RouterLink} to="/login" sx={{ fontWeight: 'bold', color: '#1976d2', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                        Login
                    </Button>
                </Typography>
            </Box>
        </Box>
    );
}
