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
  Divider,
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
import PrintableJnf from "@/components/common/PrintableJnf";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

const statusColor: Record<string, any> = {
  draft: "default",
  submitted: "warning",
  approved: "success",
  rejected: "error",
};

export default function JnfDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [jnf, setJnf] = useState<any>(null);
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
      .get(`/jnf/${id}`)
      .then((res) => setJnf(res.data.jnf))
      .catch(() => setError("JNF not found or you do not have access."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDuplicate = async () => {
    setDuplicating(true);
    setDupSuccess("");
    try {
      const res = await api.post(`/jnf/${id}/duplicate`);
      setDupSuccess(
        `Duplicated successfully! New form code: ${res.data.jnf_code}. Redirecting to edit...`,
      );
      setTimeout(() => {
        router.push(`/jnf/${res.data.jnf_id}`);
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
      await api.post(`/jnf/${id}/request-edit`, { reason: editReason });
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

  if (error || !jnf)
    return (
      <DashboardLayout>
        <Alert severity="error">{error || "JNF not found."}</Alert>
      </DashboardLayout>
    );

  return (
    <DashboardLayout>
      {/* Header */}
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
          <Typography variant="h5" sx={{ fontWeight: 700, color: "#003366" }}>
            {jnf.designation || "Untitled JNF"}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {jnf.jnf_code} · {jnf.recruitment_cycle}
          </Typography>
        </Box>
        <Chip
          label={jnf.status}
          color={statusColor[jnf.status]}
          sx={{ textTransform: "capitalize", fontWeight: 600 }}
        />
      </Box>

      {/* Rejection reason banner */}
      {jnf.status === "rejected" && jnf.rejection_reason && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <strong>Rejection Reason:</strong> {jnf.rejection_reason}
        </Alert>
      )}

      {dupSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {dupSuccess}
        </Alert>
      )}

      {editSuccess && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setEditSuccess("")}>
          {editSuccess}
        </Alert>
      )}

      {/* Job Details */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: { xs: 2, md: 4 } }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, mb: 2, color: "#003366" }}
          >
            Job Details
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Label>Designation</Label>
              <Value>{jnf.designation || "—"}</Value>
            </Grid>
            <Grid item xs={12} md={6}>
              <Label>Department / Function</Label>
              <Value>{jnf.department_function || "—"}</Value>
            </Grid>
            <Grid item xs={12} md={4}>
              <Label>Location Type</Label>
              <Value>{jnf.location_type || "—"}</Value>
            </Grid>
            <Grid item xs={12} md={4}>
              <Label>Location</Label>
              <Value>{jnf.location_text || "—"}</Value>
            </Grid>
            <Grid item xs={12} md={2}>
              <Label>Openings</Label>
              <Value>{jnf.openings_count ?? "—"}</Value>
            </Grid>
            <Grid item xs={12} md={2}>
              <Label>Min. Hires</Label>
              <Value>{jnf.min_openings ?? "—"}</Value>
            </Grid>
            {jnf.job_description && (
              <Grid item xs={12}>
                <Label>Job Description</Label>
                <Value>{jnf.job_description}</Value>
              </Grid>
            )}
            {jnf.skills?.length > 0 && (
              <Grid item xs={12}>
                <Label>Required Skills</Label>
                <Box
                  sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 0.5 }}
                >
                  {jnf.skills.map((s: any) => (
                    <Chip
                      key={s.id}
                      label={s.skill_name}
                      size="small"
                      sx={{
                        background: "rgba(0,51,102,0.08)",
                        color: "#003366",
                      }}
                    />
                  ))}
                </Box>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>

      {/* Eligibility */}
      {jnf.eligibility_rule && (
        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ p: { xs: 2, md: 4 } }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, mb: 2, color: "#003366" }}
            >
              Eligibility Criteria
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} md={3}>
                <Label>Min. CGPA</Label>
                <Value>{jnf.eligibility_rule.min_cgpa ?? "—"}</Value>
              </Grid>
              <Grid item xs={6} md={3}>
                <Label>Max Backlogs</Label>
                <Value>
                  {jnf.eligibility_rule.max_backlogs_allowed ?? "—"}
                </Value>
              </Grid>
              <Grid item xs={6} md={3}>
                <Label>Gender</Label>
                <Value>{jnf.eligibility_rule.allowed_gender ?? "all"}</Value>
              </Grid>
              <Grid item xs={6} md={3}>
                <Label>Active Backlogs OK?</Label>
                <Value>
                  {jnf.eligibility_rule.active_backlogs_allowed ? "Yes" : "No"}
                </Value>
              </Grid>
              {jnf.eligibility_rule.additional_text && (
                <Grid item xs={12}>
                  <Label>Additional Notes</Label>
                  <Value>{jnf.eligibility_rule.additional_text}</Value>
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Salary */}
      {jnf.salary_breakdowns?.length > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ p: { xs: 2, md: 4 } }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, mb: 2, color: "#003366" }}
            >
              Salary Details
            </Typography>
            {jnf.salary_breakdowns.map((row: any) => (
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
                    color: "#003366",
                    mb: 1,
                  }}
                >
                  {row.programme_type?.replace("_", " / ").toUpperCase()} —{" "}
                  {row.currency}
                </Typography>
                <Grid container spacing={1}>
                  {[
                    ["CTC Annual", row.ctc_annual],
                    ["Base/Fixed", row.base_fixed],
                    ["Monthly Take-home", row.monthly_takehome],
                    ["Joining Bonus", row.joining_bonus],
                    ["ESOP Value", row.esop_value],
                  ]
                    .filter(([, v]) => v)
                    .map(([label, val]) => (
                      <Grid item xs={6} md={3} key={label as string}>
                        <Label>{label as string}</Label>
                        <Value>₹{Number(val).toLocaleString("en-IN")}</Value>
                      </Grid>
                    ))}
                </Grid>
              </Box>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Selection Rounds */}
      {jnf.selection_rounds?.length > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ p: { xs: 2, md: 4 } }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, mb: 2, color: "#003366" }}
            >
              Selection Process
            </Typography>
            {jnf.selection_rounds.map((round: any) => (
              <Box
                key={round.id}
                sx={{
                  display: "flex",
                  gap: 2,
                  alignItems: "flex-start",
                  py: 1.5,
                  borderBottom: "1px solid rgba(0,0,0,0.06)",
                  "&:last-child": { borderBottom: "none" },
                }}
              >
                <Box
                  sx={{
                    minWidth: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: "#003366",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {round.round_order}
                </Box>
                <Box>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      fontSize: "0.9rem",
                      textTransform: "capitalize",
                    }}
                  >
                    {round.round_type} {round.mode && `· ${round.mode}`}
                  </Typography>
                  {round.description && (
                    <Typography variant="caption" color="text.secondary">
                      {round.description}
                    </Typography>
                  )}
                </Box>
                {round.is_elimination_round && (
                  <Chip
                    label="Elimination"
                    size="small"
                    color="error"
                    sx={{ ml: "auto" }}
                  />
                )}
              </Box>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }} className="no-print">
        {/* Duplicate button — always visible */}
        <Button
          variant="outlined"
          startIcon={duplicating ? <CircularProgress size={16} /> : <ContentCopyIcon />}
          onClick={handleDuplicate}
          disabled={duplicating}
          sx={{ borderColor: '#003366', color: '#003366' }}
        >
          {duplicating ? 'Duplicating...' : 'Duplicate this JNF'}
        </Button>

        {/* Request Edit — for submitted / approved / rejected */}
        {jnf.status !== 'draft' && (
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

        {/* Continue editing — only for drafts */}
        {jnf.status === 'draft' && (
          <Button
            variant="contained"
            size="large"
            onClick={() => router.push(`/jnf/new?edit=${jnf.id}`)}
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
        <DialogTitle sx={{ fontWeight: 700, color: '#003366' }}>
          Request Edit for {jnf.jnf_code}
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
            placeholder="e.g. Please update the CTC from 12 LPA to 14 LPA and add Python as a required skill."
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
          >
            {editSending ? 'Sending...' : 'Send Request'}
          </Button>
        </DialogActions>
      </Dialog>

      <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="outlined"
            onClick={() => setShowPreview(!showPreview)}
            sx={{ borderRadius: 4, px: 4, borderColor: '#003366', color: '#003366' }}
          >
            {showPreview ? 'Hide PDF Preview' : 'Preview PDF Layout for Download'}
          </Button>
        </Box>

        {/* Always mounted — toggled via display so checkbox state persists */}
        <Card
          variant="outlined"
          sx={{ p: 1, background: '#f5f5f5', display: showPreview ? 'block' : 'none' }}
        >
          <PrintableJnf
            form={jnf}
            checkedClauses={declarationChecked}
            onToggleClause={toggleDeclaration}
          />
        </Card>
      </Box>
    </DashboardLayout>
  );
}

// Small helper components
function Label({ children }: { children: React.ReactNode }) {
  return (
    <Typography
      variant="caption"
      color="text.secondary"
      sx={{ display: "block", mb: 0.3 }}
    >
      {children}
    </Typography>
  );
}
function Value({ children }: { children: React.ReactNode }) {
  return (
    <Typography sx={{ fontSize: "0.9rem", fontWeight: 500 }}>
      {children || "—"}
    </Typography>
  );
}
