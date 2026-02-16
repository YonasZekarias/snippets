import { Box, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";

export default function SearchBar({ search, setSearch, sortBy, setSortBy, filterBy, setFilterBy }) {
  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilterBy(event.target.value);
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", mb: 3, width: "100%", flexWrap: "wrap", px: { xs: 2, sm: 3, md: 4 } }}>
      <TextField
        fullWidth
        label="Search snippets..."
        variant="outlined"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ flex: 1, mb: { xs: 2, sm: 0 }, minWidth: "160px" }} />
      <Box>
        <FormControl variant="outlined" sx={{ width: "30%", minWidth: 120, mx: 1, mb: { xs: 2, sm: 0 } }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortBy}
            onChange={handleSortChange}
            label="Sort By">
            <MenuItem value=""><em>None</em></MenuItem>
            <MenuItem value="title">Title</MenuItem>
            <MenuItem value="language">Language</MenuItem>
          </Select>
        </FormControl>
        <FormControl variant="outlined" sx={{ width: "30%", minWidth: 120, mb: { xs: 2, sm: 0 }, ml: "auto" }}>
          <InputLabel>Filter By</InputLabel>
          <Select
            value={filterBy}
            onChange={handleFilterChange}
            label="Filter By">
            <MenuItem value=""><em>None</em></MenuItem>
            <MenuItem value="PY">Python</MenuItem>
                <MenuItem value="JS">JavaScript</MenuItem>
                <MenuItem value="C">C</MenuItem>
                <MenuItem value="CPP">C++</MenuItem>
                <MenuItem value="D">Dart</MenuItem>
                <MenuItem value="html">HTML</MenuItem>
                <MenuItem value="css">CSS</MenuItem>
                <MenuItem value="java">Java</MenuItem>
                <MenuItem value="go">Go</MenuItem>
                <MenuItem value="rb">Ruby</MenuItem>
                <MenuItem value="php">PHP</MenuItem>
                <MenuItem value="swift">Swift</MenuItem>
                <MenuItem value="ts">TypeScript</MenuItem>
                <MenuItem value="kotlin">Kotlin</MenuItem>
                <MenuItem value="rust">Rust</MenuItem>
                <MenuItem value="r">R</MenuItem>
                <MenuItem value="sql">SQL</MenuItem>
                <MenuItem value="bash">Bash</MenuItem>
                <MenuItem value="json">JSON</MenuItem>
                <MenuItem value="other">Other</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
}