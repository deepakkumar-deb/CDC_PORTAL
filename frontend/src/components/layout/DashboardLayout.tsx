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

const DRAWER_WIDTH = 280; // Increased from 240


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
          pt: 4,
          pb: 2,
          px: 2.5,
          background: "linear-gradient(135deg, #001028 0%, #003366 100%)",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          gap: 2,
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.05,
            backgroundImage: `radial-gradient(#ffffff 0.5px, transparent 0.5px)`,
            backgroundSize: "10px 10px",
          },
        }}
      >
        <Box
          sx={{
            width: 54, // Increased from 48
            height: 54,
            borderRadius: "12px", // Changed from 50% for a more modern boxy look
            background: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            zIndex: 1,
          }}
        >
          <Box
            component="img"
            src="/logo.webp"
            alt="IIT ISM Logo"
            sx={{
              width: "80%",
              height: "80%",
              objectFit: "contain",
            }}
          />
        </Box>
        <Box sx={{ minWidth: 0, zIndex: 1 }}>
          <Typography
            sx={{
              fontFamily: '"Outfit", sans-serif',
              fontWeight: 700,
              fontSize: "1.1rem", // Slightly larger
              color: "white",
              lineHeight: 1.2,
              letterSpacing: "0.01em",
            }}
          >
            IIT (ISM) Dhanbad
          </Typography>
          <Typography
            sx={{
              fontFamily: '"Outfit", sans-serif',
              fontSize: "0.75rem",
              color: "#C8922A",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              fontWeight: 700,
              mt: 0.5,
            }}
          >
            CDC Portal
          </Typography>
        </Box>
      </Box>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

      {/* Nav Links */}
      <List sx={{ flex: 1, px: 1.5, pt: 2 }}>
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <ListItem key={item.label} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => router.push(item.href)}
                sx={{
                  borderRadius: "12px",
                  py: 1,
                  px: 2,
                  background: active 
                    ? "linear-gradient(90deg, rgba(0,51,102,0.08) 0%, rgba(0,51,102,0.02) 100%)" 
                    : "transparent",
                  color: active ? "#003366" : "#5F6368",
                  position: "relative",
                  "&:hover": { 
                    background: "rgba(0,51,102,0.04)",
                    "& .MuiListItemIcon-root": {
                      transform: "translateX(2px)",
                    }
                  },
                  transition: "all 0.2s ease-in-out",
                }}
              >
                {active && (
                  <Box
                    sx={{
                      position: "absolute",
                      left: 0,
                      top: "20%",
                      bottom: "20%",
                      width: 4,
                      bgcolor: "#003366",
                      borderRadius: "0 4px 4px 0",
                    }}
                  />
                )}
                <ListItemIcon
                  sx={{
                    color: active ? "#003366" : "#5F6368",
                    minWidth: 44,
                    transition: "transform 0.2s ease-in-out",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontFamily: '"Outfit", sans-serif',
                    fontSize: "1rem",
                    fontWeight: active ? 700 : 500,
                    letterSpacing: "0.01em",
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
                borderRadius: "12px",
                py: 1,
                px: 2,
                background:
                  pathname === "/admin" 
                    ? "linear-gradient(90deg, rgba(0,51,102,0.08) 0%, rgba(0,51,102,0.02) 100%)" 
                    : "transparent",
                color: pathname === "/admin" ? "#003366" : "#5F6368",
                position: "relative",
                "&:hover": { 
                  background: "rgba(0,51,102,0.04)",
                  "& .MuiListItemIcon-root": {
                    transform: "translateX(2px)",
                  }
                },
                transition: "all 0.2s ease-in-out",
              }}
            >
              {pathname === "/admin" && (
                <Box
                  sx={{
                    position: "absolute",
                    left: 0,
                    top: "20%",
                    bottom: "20%",
                    width: 4,
                    bgcolor: "#003366",
                    borderRadius: "0 4px 4px 0",
                  }}
                />
              )}
              <ListItemIcon
                sx={{
                  color: pathname === "/admin" ? "#003366" : "#5F6368",
                  minWidth: 44,
                  transition: "transform 0.2s ease-in-out",
                }}
              >
                <AdminPanelSettingsIcon />
              </ListItemIcon>
              <ListItemText
                primary="Admin Panel"
                primaryTypographyProps={{
                  fontFamily: '"Outfit", sans-serif',
                  fontSize: "1rem",
                  fontWeight: pathname === "/admin" ? 700 : 500,
                  letterSpacing: "0.01em",
                }}
              />
            </ListItemButton>
          </ListItem>
        )}
      </List>

      <Divider />

      {/* User info + logout */}
      <Box sx={{ p: 2.5, bgcolor: "rgba(0,0,0,0.02)" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <Avatar
            sx={{
              width: 42,
              height: 42,
              background: "linear-gradient(135deg, #003366 0%, #001f3f 100%)",
              fontSize: "1rem",
              fontWeight: 700,
              boxShadow: "0 2px 8px rgba(0,51,102,0.2)",
            }}
          >
            {session?.user?.name?.[0]?.toUpperCase()}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              sx={{
                fontFamily: '"Outfit", sans-serif',
                fontSize: "0.95rem",
                fontWeight: 700,
                color: "#1A1C1E",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {session?.user?.name}
            </Typography>
            <Typography 
              sx={{ 
                fontFamily: '"Outfit", sans-serif',
                fontSize: "0.75rem", 
                color: "text.secondary",
                textTransform: "capitalize",
                fontWeight: 500,
              }}
            >
              {session?.user?.role}
            </Typography>
          </Box>
        </Box>
        <Button
          fullWidth
          variant="contained"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{ 
            borderRadius: "10px",
            textTransform: "none",
            fontWeight: 700,
            fontFamily: '"Outfit", sans-serif',
            bgcolor: "#d32f2f",
            color: "#fff",
            boxShadow: "0 4px 12px rgba(211, 47, 47, 0.2)",
            "&:hover": {
              bgcolor: "#b71c1c",
              boxShadow: "0 6px 16px rgba(211, 47, 47, 0.3)",
            }
          }}
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
