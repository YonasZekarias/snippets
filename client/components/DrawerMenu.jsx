import { memo, useCallback, useMemo } from "react";
import { Box } from "@mui/system";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  IconButton,
} from "@mui/material";
import { Home, Code, Add, Settings, Menu } from "@mui/icons-material";
import useDrawerStore from "../utils/drawerStore";
import useAuthStore from "../utils/authStore";
const drawerWidth = 220;
const compressedWidth = 60;

const DrawerMenu = (({ theme, isMobile }) => {
  const { drawerOpen, handleDrawerToggle } = useDrawerStore();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.user); 

  const menuItems = [
    { text: "Home", icon: <Home />, route: "/snippets" },
    { text: "My Snippets", icon: <Code />, route: "/mysnippets" },
    { text: "Create New", icon: <Add />, route: "/create" },
    { text: "Settings", icon: <Settings />, route: "/settings" },
  ];

  const activeItem = useMemo(() => 
    menuItems.find((item) => location.pathname.startsWith(item.route))?.text || "Home",
    [location.pathname]
  );

  const handleNavigation = useCallback((route) => {
    navigate(route);
    if (isMobile) handleDrawerToggle();
  }, [navigate, isMobile, handleDrawerToggle]);

  return (
    <Drawer
      variant={isMobile ? "temporary" : "permanent"}
      open={drawerOpen}
      onClose={handleDrawerToggle}
      sx={{
        width: drawerOpen ? drawerWidth : compressedWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerOpen ? drawerWidth : compressedWidth,
          transition: "width 0.3s ease-in-out",
          overflowX: "hidden",
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          borderRight: `1px solid ${theme.palette.divider}`,
          boxShadow: isMobile ? theme.shadows[4] : "none",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          minHeight: "100vh",
        },
      }}
    >
      <List sx={{ paddingTop: 0.5 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: drawerOpen ? "space-between" : "center",
            padding: 2,
          }}
        >
          {drawerOpen && (
            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: "bold",
                color: theme.palette.primary.main,
                textTransform: "uppercase",
              }}
              pr={2}
            >
              {`WELCOME ${user}`}
            </Typography>
          )}
          <IconButton
            onClick={handleDrawerToggle}
            sx={{ color: theme.palette.text.primary }}
          >
            <Menu />
          </IconButton>
        </Box>
        {menuItems.map((item) => (
          <ListItem
            key={item.text}
            onClick={() => handleNavigation(item.route)}
            sx={{
              cursor: "pointer",
              borderBottom: `1px solid ${theme.palette.divider}`,
              padding: "14px 20px",
              transition:
                "background-color 0.2s ease-in-out, transform 0.1s ease-in-out",
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: drawerOpen ? "12px" : 0,
              fontSize: "16px",
              fontWeight: 500,
              color:
                activeItem === item.text
                  ? theme.palette.primary.main
                  : theme.palette.text.primary,
              "&:hover": {
                backgroundColor: theme.palette.action.hover,
                transform: "translateX(2px)",
              },
              "&:active": {
                backgroundColor: theme.palette.action.selected,
              },
              "&:last-child": {
                borderBottom: "none",
              },
            }}
          >
            <ListItemIcon
              sx={{
                color:
                  activeItem === item.text
                    ? theme.palette.primary.main
                    : theme.palette.text.secondary,
                minWidth: "auto",
                fontSize: "20px",
                mr: drawerOpen ? 1 : "auto",
                justifyContent: "center",
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.text}
              sx={{
                display: drawerOpen ? "block" : "none",
                fontSize: "15px",
                fontWeight: activeItem === item.text ? "bold" : "normal",
              }}
            />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
});

export default memo(DrawerMenu);