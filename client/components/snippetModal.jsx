import { Box, Button, Modal, Typography } from "@mui/material";
import { Cancel, Save } from "@mui/icons-material";
import CodeMirror from "@uiw/react-codemirror";
import { githubLight, githubDark } from "@uiw/codemirror-theme-github";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import { html } from "@codemirror/lang-html";
import useThemeStore from "../utils/themeStore";
export default function SnippetModal({ modalOpen, closeModal, selectedSnippet, editedCode, setEditedCode, saveChanges, action, }) {
  const darkMode = useThemeStore((state) => state.darkMode);
  const getLanguageExtension = (language) => {
    const normalizedLang = language.toLowerCase();
    switch (normalizedLang) {
      case "javascript": return javascript();
      case "python": return python();
      case "java": return java();
      case "c++": return cpp();
      case "html": return html();
      default: return [];
    }
  };
  return (
    <Modal open={modalOpen} onClose={closeModal} sx={{
      backdropFilter: "blur(2.5px)",
      backgroundColor: "rgba(0, 0, 0, 0.3)",
    }} >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "90%",
          maxWidth: 800,
          height: "80vh",
          bgcolor: darkMode ? "#1e1e1e" : "#ffffff",
          boxShadow: 24,
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <Box sx={{ p: 3, borderBottom: "1px solid #ddd", position: "sticky", top: 0, bgcolor: darkMode ? "#1e1e1e" : "#ffffff", zIndex: 10 }}>
          <Typography variant="h6">{selectedSnippet?.title}</Typography>
        </Box>
        <Box sx={{ flex: 1, overflowY: "auto", p: 3 }}>
          <CodeMirror
            value={editedCode}
            extensions={[getLanguageExtension(selectedSnippet?.language || "")]}
            theme={darkMode ? githubDark : githubLight}
            editable={action === "edit"}
            onChange={(value) => setEditedCode(value)}
            basicSetup={{ lineNumbers: true, tabSize: 2, indentWithTabs: false }}
            style={{ fontSize: "0.875rem", borderRadius: 4, padding: "10px", minHeight: "300px" }}
          />
        </Box>
        <Box sx={{ p: 3, borderTop: "1px solid #ddd", display: "flex", justifyContent: "flex-end", bottom: 0, bgcolor: darkMode ? "#1e1e1e" : "#ffffff", zIndex: 10 }}>
          {action === 'view' && (
            <Button color="secondary" startIcon={<Cancel />} onClick={closeModal} sx={{ mr: 2 }}>
              Cancel
            </Button>
          )}
          {action === 'edit' && (
            <div>
              <Button color="secondary" startIcon={<Cancel />} onClick={closeModal} sx={{ mr: 2 }}>
                Cancel
              </Button>
              <Button color="primary" startIcon={<Save />} onClick={saveChanges}>
                Save
              </Button>
            </div>
          )}
        </Box>
      </Box>
    </Modal>
  );
}