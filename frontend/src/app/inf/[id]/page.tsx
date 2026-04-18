"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DashboardLayout from "@/components/layout/DashboardLayout";
import api from "@/lib/api";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import PrintableJnf from "@/components/common/PrintableJnf";

const statusColor: Record<string, any> = {
  draft: "default",
  submitted: "warning",
  approved: "success",
  rejected: "error",
};

export default function InfDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [inf, setInf] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [duplicating, setDuplicating] = useState(false);
  const [dupSuccess, setDupSuccess] = useState("");

  // Request Edit state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editReason, setEditReason] = useState("");
  const [editSending, setEditSending] = useState(false);
  const [editSuccess, setEditSuccess] = useState("");
  const [editError, setEditError] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  // Pre-check all declarations — form was already submitted with these agreed
  const [declarationChecked, setDeclarationChecked] = useState<boolean[]>([true, true, true, true, true]);
  const toggleDeclaration = (i: number) =>
    setDeclarationChecked(prev => prev.map((v, idx) => idx === i ? !v : v));

  useEffect(() => {
    api
      .get(`/inf/${id}`)
      .then((res) => setInf(res.data.inf))
      .catch(() => setError("INF not found or you do not have access."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDuplicate = async () => {
    setDuplicating(true);
    setDupSuccess("");
    try {
      const res = await api.post(`/jnf/${id}/duplicate`);
      setDupSuccess(
        `Duplicated! New form code: ${res.data.jnf_code}. Redirecting...`,
      );
      setTimeout(() => {
        router.push(`/inf/${res.data.jnf_id}`);
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to duplicate.");
    } finally {
      setDuplicating(false);
    }
  };

  const handleRequestEdit = async () => {
    if (!editReason.trim()) return;
    setEditSending(true);
    setEditError("");
    try {
      await api.post(`/inf/${id}/request-edit`, { reason: editReason });
      setEditSuccess("Your edit request has been sent to the CDC admin!");
      setEditModalOpen(false);
      setEditReason("");
    } catch (err: any) {
      setEditError(err.response?.data?.message || "Failed to send request.");
    } finally {
      setEditSending(false);
    }
  };

  if (loading)
    return (
      <DashboardLayout>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
          <CircularProgress />
        </Box>
      </DashboardLayout>
    );

  if (error || !inf)
    return (
      <DashboardLayout>
        <Alert severity="error">{error || "INF not found."}</Alert>
      </DashboardLayout>
    );

  return (
    <DashboardLayout>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.back()}
          variant="outlined"
          size="small"
        >
          Back
        </Button>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: "#660000" }}>
            {inf.internship_title || "Untitled INF"}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {inf.jnf_code} · {inf.recruitment_cycle}
          </Typography>
        </Box>
        <Chip
          label={inf.status}
          color={statusColor[inf.status]}
          sx={{ textTransform: "capitalize", fontWeight: 600 }}
        />
      </Box>

      {inf.status === "rejected" && inf.rejection_reason && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <strong>Rejection Reason:</strong> {inf.rejection_reason}
        </Alert>
      )}
      {dupSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {dupSuccess}
        </Alert>
      )}
      {editSuccess && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setEditSuccess("")}>
          {editSuccess}
        </Alert>
      )}

      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: { xs: 2, md: 4 } }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, mb: 2, color: "#660000" }}
          >
            Internship Details
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="caption" color="text.secondary">
                Title
              </Typography>
              <Typography fontWeight={500}>
                {inf.internship_title || "—"}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="caption" color="text.secondary">
                Location
              </Typography>
              <Typography fontWeight={500}>
                {inf.location_text || "—"} ({inf.location_type})
              </Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography variant="caption" color="text.secondary">
                Duration
              </Typography>
              <Typography fontWeight={500}>
                {inf.expected_duration ||
                  `${inf.internship_duration_months} months` ||
                  "—"}
              </Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography variant="caption" color="text.secondary">
                Openings
              </Typography>
              <Typography fontWeight={500}>
                {inf.openings_count ?? "—"}
              </Typography>
            </Grid>
            {inf.job_description && (
              <Grid item xs={12}>
                <Typography variant="caption" color="text.secondary">
                  Description
                </Typography>
                <Typography fontWeight={500}>{inf.job_description}</Typography>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>

      {/* Stipend */}
      {inf.inf_stipend_breakdowns?.length > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ p: { xs: 2, md: 4 } }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, mb: 2, color: "#660000" }}
            >
              Stipend Details
            </Typography>
            {inf.inf_stipend_breakdowns.map((row: any) => (
              <Box
                key={row.id}
                sx={{
                  mb: 2,
                  p: 2,
                  border: "1px solid rgba(0,0,0,0.08)",
                  borderRadius: 2,
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    color: "#C8922A",
                    mb: 1,
                  }}
                >
                  {row.programme_type?.replace("_", " / ").toUpperCase()}
                </Typography>
                <Grid container spacing={1}>
                  {[
                    ["Base Stipend", row.base_stipend],
                    ["HRA/Housing", row.hra_housing],
                    ["Variable Pay", row.variable_pay],
                    ["Total Monthly", row.total_stipend],
                  ]
                    .filter(([, v]) => v)
                    .map(([label, val]) => (
                      <Grid item xs={6} md={3} key={label as string}>
                        <Typography variant="caption" color="text.secondary">
                          {label}
                        </Typography>
                        <Typography fontWeight={500}>
                          ₹{Number(val).toLocaleString("en-IN")}
                        </Typography>
                      </Grid>
                    ))}
                </Grid>
              </Box>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <Box
        sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 4 }}
        className="no-print"
      >
        <Button
          variant="outlined"
          startIcon={
            duplicating ? <CircularProgress size={16} /> : <ContentCopyIcon />
          }
          onClick={handleDuplicate}
          disabled={duplicating}
          sx={{ borderColor: "#C8922A", color: "#C8922A" }}
        >
          {duplicating ? "Duplicating..." : "Duplicate this INF"}
        </Button>

        {/* Request Edit — for submitted / approved / rejected */}
        {inf.status !== 'draft' && (
          <Button
            variant="outlined"
            color="warning"
            startIcon={<EditNoteIcon />}
            onClick={() => setEditModalOpen(true)}
            sx={{ borderColor: '#e65100', color: '#e65100' }}
          >
            Request Edit
          </Button>
        )}

        {inf.status === "draft" && (
          <Button
            variant="contained"
            size="large"
            onClick={() => router.push(`/inf/new?edit=${inf.id}`)}
            sx={{ background: "#C8922A", "&:hover": { background: "#A0721A" } }}
          >
            Continue Editing
          </Button>
        )}
      </Box>

      {/* Request Edit Modal */}
      <Dialog
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700, color: '#660000' }}>
          Request Edit for {inf.jnf_code}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Describe what you'd like to change. The CDC admin will be notified
            by email and will contact you.
          </Typography>
          {editError && (
            <Alert severity="error" sx={{ mb: 2 }}>{editError}</Alert>
          )}
          <TextField
            label="Reason for edit"
            multiline
            rows={5}
            fullWidth
            value={editReason}
            onChange={(e) => setEditReason(e.target.value)}
            placeholder="e.g. Please update the stipend to ₹25,000/month and extend duration to 6 months."
            inputProps={{ maxLength: 2000 }}
            helperText={`${editReason.length}/2000`}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button
            onClick={() => { setEditModalOpen(false); setEditError(''); }}
            disabled={editSending}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="warning"
            onClick={handleRequestEdit}
            disabled={!editReason.trim() || editSending}
            startIcon={editSending ? <CircularProgress size={16} /> : <EditNoteIcon />}
            sx={{ background: '#C8922A', '&:hover': { background: '#A0721A' } }}
          >
            {editSending ? 'Sending...' : 'Send Request'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* PDF Preview — always mounted so checkbox state persists */}
      <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="outlined"
            onClick={() => setShowPreview(!showPreview)}
            sx={{ borderRadius: 4, px: 4, borderColor: '#C8922A', color: '#C8922A' }}
          >
            {showPreview ? 'Hide PDF Preview' : 'Preview PDF Layout for Download'}
          </Button>
        </Box>
        <Card
          variant="outlined"
          sx={{ p: 1, background: '#f5f5f5', display: showPreview ? 'block' : 'none' }}
        >
          <PrintableJnf
            form={inf}
            checkedClauses={declarationChecked}
            onToggleClause={toggleDeclaration}
          />
        </Card>
      </Box>
    </DashboardLayout>
  );
}
