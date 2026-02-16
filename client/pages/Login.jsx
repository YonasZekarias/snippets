import { Box, Typography, TextField, Button, Link, Fade, CircularProgress, Alert } from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import useAuthStore from "../utils/authStore";
import { useEffect } from "react";
function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((state) => state.login);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // useEffect(() => {
  //   if (isAuthenticated) {
  //     navigate("/snippets"); // Updated to match new route
  //   }
  // }, [isAuthenticated, navigate]);

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const username = e.target.username.value;
    const password = e.target.password.value;

    try {
      const result = await login(username, password);
      if (result.success) {
        navigate("/snippets"); // Changed from "/dashboard" to "/home"
      } else {
        setError(result.message || "Invalid username or password");
      }
    } catch (err) {
      setError("An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#f4f6f8" }}>
      <Box sx={{ width: 360, p: 4, borderRadius: 2, boxShadow: 3, bgcolor: "white" }}>
        <form onSubmit={handleOnSubmit}>
          <Typography variant="h4" fontWeight={700} gutterBottom sx={{ textAlign: "center", color: "#333" }}>Login</Typography>
          <Typography variant="body1" sx={{ color: "#666", textAlign: "center", mb: 2 }}>Access your snippets.</Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <TextField required label="Username" name="username" fullWidth margin="dense" />
          <TextField required label="Password" type="password" name="password" fullWidth margin="dense" />
          <Box sx={{ display: 'flex', justifyContent: 'center', height: 40, mt: 2 }}>
            {loading && <Fade in={loading}><CircularProgress /></Fade>}
          </Box>
          <Button variant="contained" type="submit" fullWidth sx={{ mt: 2, py: 1.2, fontWeight: "bold", bgcolor: "#1976d2", "&:hover": { bgcolor: "#1565c0" } }}>
            {loading ? "Logging in" : "Login"}
          </Button>
          <Typography variant="body2" sx={{ textAlign: "center", mt: 2, color: "#444" }}>
            New user?
            <Link component={RouterLink} to="/signup" sx={{ ml: 0.5, fontWeight: "bold", color: "#1976d2", textDecoration: "none", "&:hover": { textDecoration: "underline" } }}>Sign Up</Link>
          </Typography>
        </form>
      </Box>
    </Box>
  );
}

export default Login;