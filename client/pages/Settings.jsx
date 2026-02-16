import { useEffect, useState } from "react";
import {
  Box, TextField, Typography, Button, CircularProgress, Avatar, Snackbar, Alert
} from "@mui/material";
import api from "../utils/axiosConfig"; 
import useThemeStore from "../utils/themeStore";

export default function Settings() {
  const darkMode = useThemeStore((state) => state.darkMode);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    profile_img_url: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    api.get("/users/me/")
      .then((res) => {
        setFormData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching user:", err);
        setSnackbar({ open: true, message: "Failed to load user data.", severity: "error" });
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await api.put("/users/me/", formData);
      setFormData(res.data);
      setSnackbar({ open: true, message: "Profile updated successfully!", severity: "success" });
    } catch (err) {
      console.error("Error saving user data:", err);
      setSnackbar({ open: true, message: "Failed to update profile.", severity: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 5, p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ color: darkMode ? "#eee" : "#222" }}>
        Account Settings
      </Typography>

      {formData.profile_img_url && (
        <Avatar
          src={formData.profile_img_url}
          alt="Profile"
          sx={{ width: 100, height: 100, mb: 2 }}
        />
      )}

      <TextField
        label="First Name"
        name="first_name"
        value={formData.first_name}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Last Name"
        name="last_name"
        value={formData.last_name}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Phone Number"
        name="phone_number"
        value={formData.phone_number || ""}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Profile Image URL"
        name="profile_img_url"
        value={formData.profile_img_url || ""}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />

      <Button
        variant="contained"
        color="primary"
        onClick={handleSave}
        disabled={saving}
        sx={{ mt: 3 }}
      >
        {saving ? "Saving..." : "Save Changes"}
      </Button>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
