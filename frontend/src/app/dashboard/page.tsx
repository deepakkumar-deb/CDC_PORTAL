"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";
import WorkIcon from "@mui/icons-material/Work";
import SchoolIcon from "@mui/icons-material/School";
import AddIcon from "@mui/icons-material/Add";
import DashboardLayout from "@/components/layout/DashboardLayout";
import api from "@/lib/api";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";


const statusColor: Record<string, "default" | "warning" | "success" | "error"> =
  {
    draft: "default",
    submitted: "warning",
    approved: "success",
    rejected: "error",
  };

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [jnfs, setJnfs] = useState<any[]>([]);
  const [infs, setInfs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [duplicatingId, setDuplicatingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login");
  }, [status]);

  useEffect(() => {
    if (status !== "authenticated") return;
    const fetchData = async () => {
      try {
        const [jnfRes, infRes] = await Promise.all([
          api.get("/jnf"),
          api.get("/inf"),
        ]);
        
        const isRecruiter = session?.user?.role === "recruiter";
        if (isRecruiter && (jnfRes.data.profile_completed === false || infRes.data.profile_completed === false)) {
           setError(jnfRes.data.message || "Please complete your company profile to start creating forms.");
        }

        setJnfs(Array.isArray(jnfRes.data?.jnfs) ? jnfRes.data.jnfs : []);
        setInfs(Array.isArray(infRes.data?.infs) ? infRes.data.infs : []);
      } catch (err: any) {
        console.error("Dashboard fetch error:", err);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [status]);

  const handleDuplicate = async (jnfId: number) => {
    setDuplicatingId(jnfId);
    try {
      const res = await api.post(`/jnf/${jnfId}/duplicate`);
      alert(`Duplicated! New form: ${res.data.jnf_code}`);
      // Refresh the list
      const [jnfRes, infRes] = await Promise.all([
        api.get("/jnf"),
        api.get("/inf"),
      ]);
      setJnfs(jnfRes.data.jnfs ?? []);
      setInfs(infRes.data.infs ?? []);
    } catch {
      alert("Failed to duplicate.");
    } finally {
      setDuplicatingId(null);
    }
  };

  if (status === "loading" || loading) {
    return (
      <DashboardLayout>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
          <CircularProgress />
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Error Alert */}
      {error && (
        <Alert
          severity="info"
          variant="outlined"
          sx={{ mb: 3, borderRadius: 2, bgcolor: "info.main" + "08" }}
          action={
            error.toLowerCase().includes("profile") && (
              <Button color="inherit" size="small" onClick={() => router.push("/profile")}>
                Complete Profile
              </Button>
            )
          }
        >
          {error}
        </Alert>
      )}

      {/* Welcome */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{ fontWeight: 700, color: "#003366", mb: 0.5 }}
        >
          Welcome back, {session?.user?.name?.split(" ")[0] || "Recruiter"} 👋
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage your Job and Internship Notification Forms from here.
        </Typography>
      </Box>

      {/* Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { label: "Total JNFs", value: jnfs.length, color: "#003366" },
          {
            label: "Approved JNFs",
            value: jnfs.filter((j) => j.status === "approved").length,
            color: "#2e7d32",
          },
          { label: "Total INFs", value: infs.length, color: "#C8922A" },
          {
            label: "Pending Review",
            value: [...jnfs, ...infs].filter((j) => j.status === "submitted")
              .length,
            color: "#ed6c02",
          },
        ].map((stat) => (
          <Grid item xs={6} md={3} key={stat.label}>
            <Card>
              <CardContent sx={{ textAlign: "center", py: 3 }}>
                <Typography
                  sx={{
                    fontFamily: '"Playfair Display", serif',
                    fontSize: "2.5rem",
                    fontWeight: 700,
                    color: stat.color,
                    lineHeight: 1,
                  }}
                >
                  {stat.value}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  {stat.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* JNF Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <WorkIcon sx={{ color: "#003366" }} /> Job Notification Forms
            </Typography>
            <Button
              variant="contained"
              size="small"
              startIcon={<AddIcon />}
              onClick={() => router.push("/jnf/new")}
            >
              Post a Job
            </Button>
          </Box>

          {jnfs.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 4, color: "text.secondary" }}>
              <Typography variant="body2">
                No JNFs yet. Post your first job!
              </Typography>
            </Box>
          ) : (
            jnfs.slice(0, 5).map((jnf) => (
              <Box
                key={jnf.id}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  py: 1.5,
                  borderBottom: "1px solid rgba(0,0,0,0.06)",
                  "&:last-child": { borderBottom: "none" },
                }}
              >
                <Box>
                  <Typography sx={{ fontWeight: 600, fontSize: "0.9rem" }}>
                    {jnf.designation || "Untitled JNF"}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {jnf.jnf_code} · {jnf.recruitment_cycle}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Chip
                    label={jnf.status}
                    size="small"
                    color={statusColor[jnf.status] ?? "default"}
                    sx={{ textTransform: "capitalize" }}
                  />
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => router.push(`/jnf/${jnf.id}`)}
                  >
                    View
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<ContentCopyIcon />}
                    onClick={() => handleDuplicate(jnf.id)}
                    sx={{ borderColor: "#003366", color: "#003366" }}
                  >
                    Duplicate
                  </Button>
                </Box>
              </Box>
            ))
          )}
        </CardContent>
      </Card>

      {/* INF Section */}
      <Card>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <SchoolIcon sx={{ color: "#C8922A" }} /> Intern Notification Forms
            </Typography>
            <Button
              variant="contained"
              size="small"
              startIcon={<AddIcon />}
              onClick={() => router.push("/inf/new")}
              sx={{
                background: "#C8922A",
                "&:hover": { background: "#A0721A" },
              }}
            >
              Post an Internship
            </Button>
          </Box>

          {infs.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 4, color: "text.secondary" }}>
              <Typography variant="body2">
                No INFs yet. Post your first internship!
              </Typography>
            </Box>
          ) : (
            infs.slice(0, 5).map((inf) => (
              <Box
                key={inf.id}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  py: 1.5,
                  borderBottom: "1px solid rgba(0,0,0,0.06)",
                  "&:last-child": { borderBottom: "none" },
                }}
              >
                <Box>
                  <Typography sx={{ fontWeight: 600, fontSize: "0.9rem" }}>
                    {inf.internship_title || "Untitled INF"}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {inf.jnf_code} · {inf.recruitment_cycle}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Chip
                    label={inf.status}
                    size="small"
                    color={statusColor[inf.status] ?? "default"}
                    sx={{ textTransform: "capitalize" }}
                  />
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => router.push(`/inf/${inf.id}`)}
                  >
                    View
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={
                      duplicatingId === inf.id ? (
                        <CircularProgress size={14} />
                      ) : (
                        <ContentCopyIcon />
                      )
                    }
                    onClick={() => handleDuplicate(inf.id)}
                    disabled={duplicatingId === inf.id}
                    sx={{ borderColor: "#C8922A", color: "#C8922A" }}
                  >
                    {duplicatingId === inf.id ? "Duplicating..." : "Duplicate"}
                  </Button>
                </Box>
              </Box>
            ))
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
