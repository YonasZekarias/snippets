import { AppBar, Toolbar, IconButton, Button, Box, Typography, Modal } from "@mui/material";
import { Menu, Logout, Cancel } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import MaterialUISwitch from "../utils/MaterialUISwitch";
import useAuthStore from "../utils/authStore";
import { useState } from "react";
import useThemeStore from "../utils/themeStore";
import useDrawerStore from "../utils/drawerStore";

const AppBarStyled = styled(AppBar)(({ theme }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  backgroundColor: theme.palette.primary.main,
  color: "white",
  width: "100%",
}));

export default function Navbar() {
  const drawerOpen = useDrawerStore((state) => state.drawerOpen);
  const handleDrawerToggle = useDrawerStore((state) => state.handleDrawerToggle);
  const { logout } = useAuthStore();
  const [open, setOpen] = useState(false);
  const darkMode = useThemeStore((state) => state.darkMode);
  const toggleDarkMode = useThemeStore((state) => state.toggleDarkMode);

  function handleClose() { setOpen(false); }
  function handleOnClick() { setOpen(true); }

  return (
    <>
      <AppBarStyled position="fixed" elevation={4}>
        <Toolbar sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {!drawerOpen && <IconButton color="inherit" onClick={handleDrawerToggle} edge="start"><Menu /></IconButton>}
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <MaterialUISwitch checked={darkMode} onChange={() => toggleDarkMode(!darkMode)} />
            <Button color="inherit" startIcon={<Logout />} onClick={handleOnClick}>Logout</Button>
          </Box>
        </Toolbar>
      </AppBarStyled>

      <Modal open={open} onClose={handleClose}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', p: 4, borderRadius: 2, boxShadow: 24 }}>
          <Typography variant="h6" mb={2}>Are you sure you want to logout?</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button onClick={handleClose} startIcon={<Cancel />}>Cancel</Button>
            <Button onClick={logout} startIcon={<Logout />} color="error">Logout</Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
