import { useState, useEffect, useMemo, useCallback } from "react";
import { Box, Toolbar, Backdrop, Alert, AlertTitle } from "@mui/material";
import { CheckCircle } from "@mui/icons-material";
import { useLocation } from "react-router-dom";
import api from "../utils/axiosConfig";
import SnippetListContent from "./SnippetListContent";
import SnippetModal from "./snippetModal";
import SearchBar from "./SearchBar";
import Loading from "./Loading";

let hasFetched = false;

export default function SnippetsView() {
  const location = useLocation();
  const Base_URL = "/snippets/";
  const API_URL = useMemo(
    () =>
      location.pathname.toLowerCase().includes("/mysnippets")
        ? "/snippets/mySnippets/"
        : "/snippets/",
    [location.pathname]
  );

  const [snippets, setSnippets] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [filterBy, setFilterBy] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snippetToDelete, setSnippetToDelete] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSnippet, setSelectedSnippet] = useState(null);
  const [editedCode, setEditedCode] = useState("");
  const [action, setAction] = useState("view");
  const [errors, setErrors] = useState({});
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");
  const showAlert = (msg, severity = "success") => {
    setAlertMessage(msg);
    setAlertSeverity(severity);
    setAlertOpen(true);
    setTimeout(() => {
      setAlertOpen(false);
    }, 2000);
  };
  

  const validateForm = () => {
    const newErrors = {};
    if (!editedCode.trim()) newErrors.code = "Code cannot be empty";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchSnippets = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get(API_URL);
      setSnippets(data);
    } catch (err) {
      showAlert("Failed to fetch snippets");
    } finally {
      setIsLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    hasFetched = false;
  }, [API_URL]);

  useEffect(() => {
    if (hasFetched) return;
    hasFetched = true;
    fetchSnippets().catch(() => {
      setAlertSeverity("error");
      showAlert("Failed to fetch snippets", "error");
    });
  }, [fetchSnippets]);

  const confirmDelete = useCallback(async () => {
    try {
      await api.delete(`${Base_URL}${snippetToDelete}/`);
      setSnippets((prev) => prev.filter((s) => s.id !== snippetToDelete));
      showAlert("Snippet deleted successfully!");
    } catch (err) {
      setAlertSeverity("error");
      showAlert("Failed to delete snippet either because it is not yours or it does not exist");
    } finally {
      setDialogOpen(false);
      setSnippetToDelete(null);
      setAlertSeverity("success");
    }
  }, [API_URL, snippetToDelete]);

  const handleOpenModal = (snippet = null, actionType = "create") => {
    setSelectedSnippet(snippet);
    setEditedCode(snippet?.code || "");
    setAction(actionType);
    setErrors({});
    setModalOpen(true);
  };

  const handleSaveChanges = useCallback(async () => {
    if (!validateForm()) return;
    setIsSaving(true);
    try {
      const updated = { ...selectedSnippet, code: editedCode };
      if (action === "edit") {
        await api.put(`${API_URL}${selectedSnippet.id}/`, updated);
        setSnippets((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
        showAlert("Snippet updated successfully!");
      } else {
        await handleCreateSnippet(updated);
      }
      setModalOpen(false);
    } catch (err) {
      setAlertSeverity("error");
      showAlert("Failed to save snippet");
    } finally {
      setIsSaving(false);
      setAlertSeverity("success");
    }
  }, [API_URL, editedCode, selectedSnippet, action]);

  const filteredSnippets = useMemo(
    () =>
      snippets
        .filter(
          (s) =>
            s.title.toLowerCase().includes(search.toLowerCase()) &&
            (filterBy ? s.language.toLowerCase() === filterBy.toLowerCase() : true)
        )
        .sort((a, b) => {
          if (sortBy === "title") return a.title.localeCompare(b.title);
          if (sortBy === "language") return a.language.localeCompare(b.language);
          return 0;
        }),
    [snippets, search, filterBy, sortBy]
  );

  const handleCopy = useCallback(async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      showAlert("Code copied to clipboard!");
    } catch {
      showAlert("Failed to copy code");
    }
  }, [showAlert]);

  const handleDelete = useCallback((id) => {
    setSnippetToDelete(id);
    setDialogOpen(true);
  }, []);

  if (isLoading) return <Loading />;

  return (
    <>
      <Backdrop
        open={alertOpen}
        sx={{ zIndex: (theme) => theme.zIndex.modal + 1, backdropFilter: "blur(4px)" }}>
        <Alert
          icon={<CheckCircle fontSize="inherit" />}
          variant="filled"
          sx={{ minWidth: 300 }}>
          <AlertTitle>{alertMessage}</AlertTitle>
        </Alert>
      </Backdrop>

      <Box sx={{ width: "100%", p: 3 }}>
        <Toolbar />
        <SearchBar
          search={search}
          setSearch={setSearch}
          sortBy={sortBy}
          setSortBy={setSortBy}
          filterBy={filterBy}
          setFilterBy={setFilterBy}/>

        <SnippetListContent
          snippets={filteredSnippets}
          openModal={handleOpenModal}
          handleCopy={handleCopy}
          handleDelete={handleDelete}
          dialogOpen={dialogOpen}
          setDialogOpen={setDialogOpen}
          confirmDelete={confirmDelete}/>

        <SnippetModal
          modalOpen={modalOpen}
          closeModal={() => setModalOpen(false)}
          selectedSnippet={selectedSnippet}
          editedCode={editedCode}
          setEditedCode={setEditedCode}
          saveChanges={handleSaveChanges}
          action={action}
          isSaving={isSaving}
          errors={errors}/>
      </Box>
    </>
  );
}
