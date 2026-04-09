"use client";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
  IconButton,
  AppBar,
  Toolbar,
  Divider,
  Button,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import WorkIcon from "@mui/icons-material/Work";
import SchoolIcon from "@mui/icons-material/School";
import BusinessIcon from "@mui/icons-material/Business";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

const DRAWER_WIDTH = 240;

// Replace the navItems array with this:
const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: <DashboardIcon /> },
  { label: "My JNFs", href: "/dashboard/jnfs", icon: <WorkIcon /> },
  { label: "My INFs", href: "/dashboard/infs", icon: <SchoolIcon /> },
  {
    label: "Company Profile",
    href: "/dashboard/company",
    icon: <BusinessIcon />,
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/auth/login");
  };

  const drawer = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Logo */}
      <Box
        sx={{
          p: 3,
          background: "linear-gradient(135deg, #001028, #003366)",
          display: "flex",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            overflow: "hidden", // Ensures nothing spills out
            boxShadow: "0 0 0 2px rgba(255,255,255,0.1)", // Subtle outer ring
          }}
        >
          <Box
            component="img"
            src="/logo.webp"
            alt="IIT ISM Logo"
            sx={{
              width: "85%", // Increased breathing room
              height: "85%",
              objectFit: "contain",
            }}
          />
        </Box>
        <Box>
          <Typography
            sx={{
              fontFamily: '"Playfair Display", serif',
              fontWeight: 700,
              fontSize: "0.85rem",
              color: "white",
              lineHeight: 1.2,
            }}
          >
            IIT (ISM) Dhanbad
          </Typography>
          <Typography
            sx={{
              fontSize: "0.65rem",
              color: "#C8922A",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            CDC Portal
          </Typography>
        </Box>
      </Box>

      {/* Nav Links */}
      <List sx={{ flex: 1, px: 1.5, pt: 2 }}>
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <ListItem key={item.label} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => router.push(item.href)}
                sx={{
                  borderRadius: 2,
                  background: active ? "rgba(0,51,102,0.1)" : "transparent",
                  color: active ? "#003366" : "text.secondary",
                  "&:hover": { background: "rgba(0,51,102,0.07)" },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: active ? "#003366" : "text.secondary",
                    minWidth: 40,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: "0.9rem",
                    fontWeight: active ? 600 : 400,
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}

        {["admin", "superadmin"].includes(session?.user?.role ?? "") && (
          <ListItem disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              onClick={() => router.push("/admin")}
              sx={{
                borderRadius: 2,
                background:
                  pathname === "/admin" ? "rgba(0,51,102,0.1)" : "transparent",
                color: pathname === "/admin" ? "#003366" : "text.secondary",
                "&:hover": { background: "rgba(0,51,102,0.07)" },
              }}
            >
              <ListItemIcon
                sx={{
                  color: pathname === "/admin" ? "#003366" : "text.secondary",
                  minWidth: 40,
                }}
              >
                {/* Add this import at the top: import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'; */}
                <AdminPanelSettingsIcon />
              </ListItemIcon>
              <ListItemText
                primary="Admin Panel"
                primaryTypographyProps={{
                  fontSize: "0.9rem",
                  fontWeight: pathname === "/admin" ? 600 : 400,
                }}
              />
            </ListItemButton>
          </ListItem>
        )}
      </List>

      <Divider />

      {/* User info + logout */}
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
          <Avatar
            sx={{
              width: 36,
              height: 36,
              background: "#003366",
              fontSize: "0.85rem",
            }}
          >
            {session?.user?.name?.[0]?.toUpperCase()}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: "0.85rem",
                fontWeight: 600,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {session?.user?.name}
            </Typography>
            <Typography sx={{ fontSize: "0.72rem", color: "text.secondary" }}>
              {session?.user?.role}
            </Typography>
          </Box>
        </Box>
        <Button
          fullWidth
          variant="outlined"
          size="small"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{ borderColor: "rgba(0,0,0,0.15)", color: "text.secondary" }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Mobile AppBar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          display: { md: "none" },
          background: "#003366",
          width: "100%",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            sx={{
              fontFamily: '"Playfair Display", serif',
              fontWeight: 700,
              fontSize: "1rem",
              ml: 1,
            }}
          >
            CDC Portal
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Desktop Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          width: DRAWER_WIDTH,
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            border: "none",
            boxShadow: "2px 0 16px rgba(0,0,0,0.08)",
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { width: DRAWER_WIDTH },
        }}
      >
        {drawer}
      </Drawer>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          // ml: { md: `${DRAWER_WIDTH}px` },
          mt: { xs: "64px", md: 0 },
          background: "#F8F7F3",
          minHeight: "100vh",
          p: { xs: 2, md: 6 },
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
