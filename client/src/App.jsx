import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import CreateSnippets from "./pages/CreateSnippets";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./utils/ProtectedRoute";
import useAuthStore from "./utils/authStore";
import { useEffect, useState, useCallback } from "react";
import { GlobalStyles } from "@mui/material";
import Layout from './components/Layout.jsx';
import SnippetsView from "./components/SnippetsView";
import Settings from "./pages/Settings.jsx";
function App() {
  const { checkAuth } = useAuthStore();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleSnackbarClose = useCallback(() => {
    setSnackbarOpen(false);
  }, []);

  const showSnackbar = useCallback((message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Router>
      <GlobalStyles
        styles={{
          "html, body": {
            margin: 0,
            padding: 0,
            height: "100%",
            scrollBehavior: "smooth",
          },
          "#root": {
            height: "100%",
          },
          a: {
            textDecoration: "none",
            color: "inherit",
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout
            snackbarOpen={snackbarOpen}
            snackbarMessage={snackbarMessage}
            handleSnackbarClose={handleSnackbarClose}
            showSnackbar={showSnackbar}
          />}>
            <Route path="/snippets" element={<SnippetsView showSnackbar={showSnackbar} />} />
            <Route path="/create" element={<CreateSnippets showSnackbar={showSnackbar} />} />
            <Route path="/mysnippets" element={<SnippetsView showSnackbar={showSnackbar} />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;