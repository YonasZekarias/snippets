import React, { memo } from "react";
import { Paper, Typography, Box, IconButton, Dialog, Button, DialogTitle, DialogActions, DialogContent } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { ContentCopy, Edit, Delete, Visibility, Cancel } from "@mui/icons-material";
import CodeMirror from "@uiw/react-codemirror";
import useThemeStore from "../utils/themeStore";
import { githubLight, githubDark } from "@uiw/codemirror-theme-github";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import { html } from "@codemirror/lang-html";

const SnippetListContent = (({ snippets, openModal, handleCopy, handleDelete, confirmDelete, dialogOpen, setDialogOpen }) => {
  const darkMode = useThemeStore((state) => state.darkMode);
  

  const handleClose = () => {
    setDialogOpen(false);
  };

  const getLanguageExtension = (language) => {
    const normalizedLang = language.toLowerCase();
    switch (normalizedLang) {
      case "javascript":
        return javascript();
      case "python":
        return python();
      case "java":
        return java();
      case "c++":
        return cpp();
      case "html":
        return html();
      default:
        return [];
    }
  };

  return (
    <>
      <Grid container spacing={4} sx={{ px: 2, height: "100vh", boxSizing: "border-box", display: "flex", justifyContent: "center", alignItems: "flex-start" }}>
        {snippets.map((snippet) => (
          <Grid key={snippet.id}>
            <Paper
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                p: 2,
                width: "260px",
                height: "260px",
                borderRadius: 2,
                boxShadow: 3,
                bgcolor: darkMode ? "#1e1e1e" : "#ffffff",
                transition: "transform 0.5s ease, boxShadow 0.3s ease",
                "&:hover": {
                  transform: "scale(1.075)",
                  boxShadow: 4,
                },
              }}
            >
              <Typography variant="h6" sx={{ mb: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {snippet.title}
              </Typography>
              <Typography variant="body2" color="primary" sx={{ mb: 2, textTransform: "capitalize" }}>
                {snippet.language}
              </Typography>
              <Box sx={{ bgcolor: darkMode ? "#333" : "#F2F9FF", borderRadius: 1, maxHeight: 80, overflowY: "auto", whiteSpace: "pre-wrap" }}>
                <CodeMirror
                  value={
                    snippet.code.split("\n").slice(0, 4).join("\n") +
                    (snippet.code.split("\n").length > 5 ? "\n..." : "")
                  }
                  extensions={[getLanguageExtension(snippet.language)]}
                  theme={darkMode ? githubDark : githubLight}
                  editable={false}
                  basicSetup={{ lineNumbers: true, tabSize: 2, indentWithTabs: false }}
                  style={{ fontSize: "0.875rem", borderRadius: 4 }}
                />
              </Box>
              <Box display="flex" justifyContent="space-between" mt={2}>
                <IconButton color="primary" onClick={() => handleCopy(snippet.code)}>
                  <ContentCopy />
                </IconButton>
                <IconButton color="primary" onClick={() => openModal(snippet, "view")}>
                  <Visibility />
                </IconButton>
                <IconButton color="primary" onClick={() => openModal(snippet, "edit")}>
                  <Edit />
                </IconButton>
                <IconButton
                  color="primary"
                  onClick={() => {
                    handleDelete(snippet.id);
                  }}
                >
                  <Delete />
                </IconButton>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <SimpleDialog open={dialogOpen} handleClose={handleClose} confirmDelete={confirmDelete} />
    </>
  );
});

export default memo(SnippetListContent);

function SimpleDialog({ open, handleClose, confirmDelete }) {
  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
        sx={{
          backdropFilter: "blur(2.5px)",
          backgroundColor: "rgba(0, 0, 0, 0.3)",
        }}
      >
        <DialogTitle id="delete-dialog-title">Are You Sure You Want to Delete This Snippet?</DialogTitle>
        <DialogContent>
          <Typography id="delete-dialog-description" variant="body2" color="textSecondary">
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "space-between" }}>
          <Button onClick={handleClose} color="primary" startIcon={<Cancel />}>
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained" startIcon={<Delete />}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}