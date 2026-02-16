import { Box, CssBaseline } from "@mui/material";
import { ThemeProvider, createTheme, styled } from "@mui/material/styles";
import Navbar from "./Navbar";
import DrawerMenu from "./DrawerMenu";
import { Outlet } from "react-router-dom";
import useThemeStore from "../utils/themeStore";
import useDrawerStore from "../utils/drawerStore";
import useMediaQuery from "@mui/material/useMediaQuery";

const drawerWidth = 240;

export default function Layout({ snackbarOpen, snackbarMessage, handleSnackbarClose, showSnackbar }) {
  const isMobile = useMediaQuery("(max-width:480px)");
  const { drawerOpen, handleDrawerToggle } = useDrawerStore();
  const darkMode = useThemeStore((state) => state.darkMode);

  const Main = styled("main", {
    shouldForwardProp: (prop) => prop !== "open" && prop !== "isMobile",
  })(({ theme, open, isMobile }) => ({
    flexGrow: 1,
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  }));

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: { main: "#1976d2" },
      background: {
        default: darkMode ? "#121212" : "#f4f6f8",
        paper: darkMode ? "#1e1e1e" : "white",
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex" }}>
        {/* Navbar */}
        <Navbar drawerOpen={drawerOpen} handleDrawerToggle={handleDrawerToggle} />

        {/* DrawerMenu */}
        <DrawerMenu
          drawerOpen={drawerOpen}
          handleDrawerToggle={handleDrawerToggle}
          isMobile={isMobile}
          theme={theme}
        />

        {/* Main Content */}
        <Main open={drawerOpen} isMobile={isMobile}>
          <Outlet context={{ showSnackbar }} />
        </Main>
      </Box>
    </ThemeProvider>
  );
}