// pages/Home.jsx
import { Box } from "@mui/material";
import SnippetList from "../components/SnippetList";
import SearchBar from "../components/SearchBar";
import { useOutletContext } from "react-router-dom";
import useSnippets from "../hooks/useSnippets";

export default function Home() {
  const {
    search, setSearch,
    sortBy, setSortBy,
    filterBy, setFilterBy,
    isMobile
  } = useOutletContext();

  const { 
    filteredSnippets, 
    dialogOpen, setDialogOpen, 
    handleCopy, handleEdit, handleDelete, 
    handleCodeChange, confirmDelete 
  } = useSnippets();

  return (
    <>
      <SearchBar 
        search={search} 
        setSearch={setSearch} 
        sortBy={sortBy} 
        setSortBy={setSortBy} 
        filterBy={filterBy} 
        setFilterBy={setFilterBy} 
        isMobile={isMobile} 
      />
      <Box sx={{ width: "100%" }}>
        <SnippetList 
          dialogOpen={dialogOpen} 
          setDialogOpen={setDialogOpen} 
          snippets={filteredSnippets} 
          handleCopy={handleCopy} 
          handleEdit={handleEdit} 
          handleDelete={handleDelete} 
          handleCodeChange={handleCodeChange}
          confirmDelete={confirmDelete} 
        />
      </Box>
    </>
  );
}