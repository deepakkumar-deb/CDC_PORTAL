"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  TextField,
  MenuItem,
  CircularProgress,
  Alert,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import DashboardLayout from "@/components/layout/DashboardLayout";
import api from "@/lib/api";

const statusColor: Record<string, "default" | "warning" | "success" | "error"> =
  {
    draft: "default",
    submitted: "warning",
    approved: "success",
    rejected: "error",
  };

export default function MyInfsPage() {
  const router = useRouter();
  const [infs, setInfs] = useState<any[]>([]);
  const [filteredInfs, setFilteredInfs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    const fetchInfs = async () => {
      try {
        const res = await api.get("/inf");
        const data = Array.isArray(res.data?.infs) ? res.data.infs : [];
        setInfs(data);
        setFilteredInfs(data);
      } catch (err: any) {
        console.error("Error fetching INFs:", err);
        setError(err.response?.data?.message || "We are having trouble loading your Internship Forms. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchInfs();
  }, []);

  useEffect(() => {
    if (statusFilter === "all") {
      setFilteredInfs(infs);
    } else {
      setFilteredInfs(infs.filter((i) => i.status === statusFilter));
    }
  }, [statusFilter, infs]);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this INF? This cannot be undone.')) return;
    try {
      await api.delete(`/inf/${id}`);
      setInfs(prev => prev.filter(i => i.id !== id));
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete INF.');
    }
  };

  const columns: GridColDef[] = [
    {
      field: "jnf_code",
      headerName: "INF Code",
      width: 140,
      renderCell: (params) => (
        <Typography sx={{ fontWeight: 600, fontSize: "0.85rem" }}>
          {params.value || "N/A"}
        </Typography>
      ),
    },
    {
      field: "internship_title",
      headerName: "Internship Title",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "recruitment_cycle",
      headerName: "Cycle",
      width: 120,
    },
    {
      field: "status",
      headerName: "Status",
      width: 130,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={statusColor[params.value] || "default"}
          size="small"
          sx={{ textTransform: "capitalize", fontWeight: 600 }}
        />
      ),
    },
    {
      field: "created_at",
      headerName: "Created",
      width: 120,
      renderCell: (params) => {
        if (!params.value) return "N/A";
        try {
          const date = new Date(params.value);
          return isNaN(date.getTime()) ? "N/A" : date.toLocaleDateString();
        } catch {
          return "N/A";
        }
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Button
            size="small"
            variant="contained"
            onClick={() => router.push(`/inf/${params.row.id}`)}
            sx={{ fontSize: '0.75rem', px: 1.5, minWidth: 60, background: '#C8922A', '&:hover': { background: '#A0721A' } }}
          >
            View
          </Button>
          {params.row.status === 'draft' && (
            <Button
              size="small"
              variant="outlined"
              color="error"
              onClick={() => handleDelete(params.row.id)}
              sx={{ fontSize: '0.75rem', px: 1.5, minWidth: 60 }}
            >
              Delete
            </Button>
          )}
        </Box>
      ),
    },
  ];

  if (loading) {
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
      {/* Header */}
      <Box
        sx={{
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: "#660000" }}>
            My Intern Notification Forms
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total: {infs.length} INFs
          </Typography>
        </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => router.push("/inf/new")}
            sx={{ background: "#C8922A", "&:hover": { background: "#A0721A" } }}
          >
            Post New Internship
          </Button>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert 
          severity="error" 
          variant="outlined"
          sx={{ mb: 3, borderRadius: 2, bgcolor: "error.main" + "08" }} 
          onClose={() => setError("")}
        >
          {error}
        </Alert>
      )}

      {/* Filters */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Filter by Status:
            </Typography>
            <TextField
              select
              size="small"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              sx={{ minWidth: 150 }}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="draft">Draft</MenuItem>
              <MenuItem value="submitted">Submitted</MenuItem>
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
            </TextField>
            <Typography variant="body2" color="text.secondary">
              Showing {filteredInfs.length} of {infs.length}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* DataGrid */}
      <Card>
        <Box sx={{ height: 600, width: "100%" }}>
          <DataGrid
            rows={filteredInfs}
            columns={columns}

            initialState={{
              pagination: {
                paginationModel: { pageSize: 10, page: 0 },
              },
            }}
            pageSizeOptions={[10, 25, 50]}
            disableRowSelectionOnClick
            sx={{
              border: "none",
              "& .MuiDataGrid-cell:focus": {
                outline: "none",
              },
            }}
          />
        </Box>
      </Card>
    </DashboardLayout>
  );
}
