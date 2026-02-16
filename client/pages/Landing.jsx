import { Box, Container, CssBaseline, Typography, Button, List, ListItem, ListItemText } from "@mui/material";
import { Link } from "react-router-dom";
import useAuthStore from "../utils/authStore";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
function LandingPage() {
  const navigate = useNavigate();
  const {isAuthenticated} = useAuthStore();
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/snippets");
    }
  }, [isAuthenticated, navigate]);
  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", bgcolor: "#f4f6f8" }}>
      <CssBaseline />

      {/* Main Content */}
      <Container component="main" maxWidth="md" sx={{ flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        
        {/* Hero Section */}
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography variant="h3" fontWeight={700} gutterBottom sx={{ color: "#333" }}>Welcome to Snippets App</Typography>
          <Typography variant="h6" sx={{ color: "#666", mb: 3 }}>Your one-stop solution for managing and sharing code snippets efficiently.</Typography>

          <Button component={Link} to="/login" variant="contained" size="large" sx={{ px: 4, py: 1.3, fontSize: "1rem", borderRadius: "25px", boxShadow: "0px 4px 10px rgba(0,0,0,0.2)", bgcolor: "#1976d2", "&:hover": { bgcolor: "#1565c0" } }}>
            Get Started
          </Button>
        </Box>

        {/* Features Section */}
        <Box sx={{ p: 4, borderRadius: 2, boxShadow: 2, bgcolor: "white", textAlign: "center" }}>
          <Typography variant="h4" fontWeight={600} gutterBottom sx={{ color: "#444" }}>Features</Typography>
          <List sx={{ maxWidth: 500, margin: "auto", textAlign: "left" }}>
            {["Organize your code snippets easily", "Search and filter snippets in seconds", "Share snippets securely with your team"].map((feature, index) => (
              <ListItem key={index} sx={{ borderBottom: "1px solid #ddd", py: 1 }}>
                <ListItemText primary={feature} sx={{ color: "#555" }} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Container>

      {/* Footer */}
      <Box sx={{ py: 2, bgcolor: "#222", textAlign: "center" }}>
        <Typography variant="body2" color="white">&copy; {new Date().getFullYear()} Snippets App. All rights reserved.</Typography>
      </Box>
    </Box>
  );
}

export default LandingPage;
