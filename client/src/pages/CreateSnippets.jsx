import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {Box,TextField,Toolbar,Typography,Select,MenuItem,FormControl,InputLabel,Button,Alert,AlertTitle,Snackbar,} from "@mui/material";
import useThemeStore from "../utils/themeStore";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import api from "../utils/axiosConfig";

const LANGUAGE_OPTIONS = [
  { value: "PY", label: "Python" },
  { value: "JS", label: "JavaScript" },
  { value: "C", label: "C" },
  { value: "CPP", label: "C++" },
  { value: "D", label: "Dart" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "java", label: "Java" },
  { value: "go", label: "Go" },
  { value: "rb", label: "Ruby" },
  { value: "php", label: "PHP" },
  { value: "swift", label: "Swift" },
  { value: "ts", label: "TypeScript" },
  { value: "kotlin", label: "Kotlin" },
  { value: "rust", label: "Rust" },
  { value: "r", label: "R" },
  { value: "sql", label: "SQL" },
  { value: "bash", label: "Bash" },
  { value: "json", label: "JSON" },
  { value: "other", label: "Other" },
];

export default function CreateSnippets() {
  const navigate = useNavigate();
  const darkMode = useThemeStore((state) => state.darkMode);
  const [errors, setErrors] = useState({});
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");

  const showAlert = (msg, severity = "success") => {
    setAlertMessage(msg);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };

  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState("JS"); 
  const [code, setCode] = useState("");

  const getLanguageExtension = (lang) => {
    switch (lang) {
      case "PY": return python();
      case "JS": return javascript();
      case "java": return java();
      case "CPP": return cpp();
      case "html": return html();
      case "css": return css();
      case "sql": return sql();
      case "php": return php();
      case "rust": return rust();
      case "json": return json();
      default: return javascript(); 
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Title cannot be empty";
    if (!code.trim()) newErrors.code = "Code cannot be empty";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      showAlert("Please fill in all required fields.", "error");
      return;
    }

    try {
      const response = await api.post("/snippets/", {
        title,
        code,
        language,
      });
      if (response.status === 201) {
        showAlert("Snippet created successfully!");
        setTitle("");
        setLanguage("JS");
        setCode("");
        setErrors({});
        setTimeout(() => navigate("/snippets"), 2000);
      } else {
        showAlert("Failed to create snippet. Please try again.", "error");
      }
    } catch (error) {
      showAlert("Failed to create snippet. Please try again.", "error");
      setErrors({ server: "Server error while creating snippet." });
      console.error("Error creating snippet:", error);
    }
  };

  const handleAlertClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAlertOpen(false);
  };

  return (
    <>
      <Toolbar />
      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        sx={{display: 'flex',justifyContent: 'center',alignItems: 'center',}}>
        <Alert 
          severity={alertSeverity} 
          onClose={handleAlertClose}
          sx={{ width: '100%',maxWidth: '400px',}}>
          <AlertTitle>
            {alertSeverity === "error" ? "Error" : "Success"}
          </AlertTitle>
          {alertMessage}
        </Alert>
      </Snackbar>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{display: "flex",flexDirection: "column",alignItems: "center",minHeight: "100vh",justifyContent: "center",bgcolor: darkMode ? "#121212" : "#f4f6f8", px: 2,}} aria-labelledby="create-snippet-title">
        <Box sx={{ width: "100%", maxWidth: 600, pb: 5 }}>
          <Typography
            id="create-snippet-title"
            variant="h4"
            fontWeight={700}
            gutterBottom
            textAlign="center"
            color={darkMode ? "#eee" : "#333"}>
            Create a New Snippet
          </Typography>
          <Typography
            variant="body1"
            textAlign="center"
            color={darkMode ? "#aaa" : "#666"}>
            Fill out the details below to create your snippet.
          </Typography>

          <Box mt={4} component="section" aria-label="Snippet form">
            <TextField
              required
              label="Title"
              variant="outlined"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              margin="dense"
              error={!!errors.title}
              helperText={errors.title}
              sx={{mb: 2,input: { color: darkMode ? "#eee" : "#000" },label: { color: darkMode ? "#aaa" : undefined },
              }} aria-required="true"/>

            <FormControl fullWidth margin="dense" sx={{ mb: 3 }}>
              <InputLabel id="language-select-label">Language</InputLabel>
              <Select
                labelId="language-select-label"
                id="language-select"
                value={language}
                label="Language"
                onChange={(e) => setLanguage(e.target.value)}
                sx={{color: darkMode ? "#eee" : "#000",
                  ".MuiOutlinedInput-notchedOutline": {borderColor: darkMode ? "#444" : "#ccc",},}}aria-required="true">
                {LANGUAGE_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>))}
              </Select>
            </FormControl>

            <Typography variant="body2" sx={{ mb: 1, color: darkMode ? "#aaa" : "#666" }} id="code-snippet-label">
              Code Snippet
            </Typography>
            <Box sx={{border: `1px solid ${darkMode ? "#444" : "#ccc"}`,borderRadius: 2,overflow: "hidden",mb: 2,}}aria-labelledby="code-snippet-label">
              <CodeMirror
                value={code}
                height="200px"
                theme={darkMode ? "dark" : "light"}
                extensions={[getLanguageExtension(language)]}
                onChange={(value) => setCode(value)}
                style={{backgroundColor: darkMode ? "#2a2a2a" : "#fff",color: darkMode ? "#eee" : "#000",}}aria-label="Code editor"/>
            </Box>

            <Button 
              type="submit" 
              variant="contained" 
              fullWidth 
              sx={{ mt: 2 }}
              aria-label="Save snippet">
              Save Snippet
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
}