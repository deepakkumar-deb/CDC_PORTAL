'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box, Card, CardContent, Typography, Chip, Button,
  CircularProgress, Alert, Grid, Divider,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import EditNoteIcon from '@mui/icons-material/EditNote';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import DashboardLayout from '@/components/layout/DashboardLayout';
import api from '@/lib/api';
import PrintableJnf from '@/components/common/PrintableJnf';

const statusColor: Record<string, any> = {
  draft: 'default',
  submitted: 'warning',
  approved: 'success',
  rejected: 'error',
};

function Label({ children }: { children: React.ReactNode }) {
  return (
    <Typography variant="caption" color="text.secondary"
      sx={{ display: 'block', mb: 0.3 }}>
      {children}
    </Typography>
  );
}
function Value({ children }: { children: React.ReactNode }) {
  return (
    <Typography sx={{ fontSize: '0.9rem', fontWeight: 500 }}>
      {children || '—'}
    </Typography>
  );
}

export default function AdminFormDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMsg, setActionMsg] = useState('');
  const [actionErr, setActionErr] = useState('');

  // Dialog state (approve/reject/allow-edit)
  const [dialog, setDialog] = useState<'approve' | 'reject' | 'allow-edit' | null>(null);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Edit Fields state
  const [editOpen, setEditOpen] = useState(false);
  const [editFields, setEditFields] = useState<any>({});
  const [editSaving, setEditSaving] = useState(false);
  const [editNote, setEditNote] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const loadForm = () => {
    api.get(`/admin/forms/${id}`)
      .then(res => setForm(res.data.form))
      .catch(err => {
        console.error(err.response?.data);
        setError('Form not found or access denied.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!id) return;
    loadForm();
  }, [id]);

  const handleAction = async () => {
    if (!dialog) return;
    setSubmitting(true);
    setActionErr('');
    try {
      const payload: any = { admin_notes: notes };
      if (dialog === 'reject') payload.rejection_reason = notes;
      await api.post(`/admin/forms/${id}/${dialog}`, payload);
      const msgs: Record<string, string> = {
        approve: '✅ Form approved successfully.',
        reject: '❌ Form rejected.',
        'allow-edit': '✏️ Edit access granted. Recruiter can now update and resubmit.',
      };
      setActionMsg(msgs[dialog]);
      setDialog(null);
      setNotes('');
      loadForm(); // refresh
    } catch (err: any) {
      setActionErr(err.response?.data?.message || 'Action failed.');
    } finally {
      setSubmitting(false);
    }
  };

  // Open edit dialog pre-populated with current form values
  const openEditDialog = () => {
    const isInf = form.opportunity_type === 'internship';
    const salary = form.salary_breakdowns?.[0] ?? {};
    const stipend = form.inf_stipend_breakdowns?.[0] ?? {};
    setEditFields({
      designation: form.designation || '',
      internship_title: form.internship_title || '',
      department_function: form.department_function || '',
      job_description: form.job_description || '',
      responsibilities: form.responsibilities || '',
      location_type: form.location_type || 'onsite',
      location_text: form.location_text || '',
      openings_count: form.openings_count ?? '',
      min_openings: form.min_openings ?? '',
      additional_info: form.additional_info || '',
      skills: (form.skills ?? []).map((s: any) => s.skill_name).join(', '),
      ctc_annual: salary.ctc_annual ?? '',
      base_fixed: salary.base_fixed ?? '',
      joining_bonus: salary.joining_bonus ?? '',
      base_stipend: stipend.base_stipend ?? '',
      total_stipend: stipend.total_stipend ?? '',
      _isInf: isInf,
    });
    setEditNote('');
    setActionErr('');
    setEditOpen(true);
  };

  const handleEditSave = async () => {
    setEditSaving(true);
    setActionErr('');
    try {
      const isInf = editFields._isInf;
      const payload: any = {
        edit_note: editNote,
        designation: editFields.designation,
        internship_title: editFields.internship_title,
        department_function: editFields.department_function,
        job_description: editFields.job_description,
        responsibilities: editFields.responsibilities,
        location_type: editFields.location_type,
        location_text: editFields.location_text,
        openings_count: editFields.openings_count || undefined,
        min_openings: editFields.min_openings || undefined,
        additional_info: editFields.additional_info,
        skills: editFields.skills
          ? editFields.skills.split(',').map((s: string) => s.trim()).filter(Boolean)
          : undefined,
      };
      if (!isInf) {
        payload.salary_patch = {
          ctc_annual: editFields.ctc_annual || undefined,
          base_fixed: editFields.base_fixed || undefined,
          joining_bonus: editFields.joining_bonus || undefined,
        };
      } else {
        payload.stipend_patch = {
          base_stipend: editFields.base_stipend || undefined,
          total_stipend: editFields.total_stipend || undefined,
        };
      }
      await api.post(`/admin/forms/${id}/edit-fields`, payload);
      setActionMsg('✅ Form fields updated. Recruiter has been notified.');
      setEditOpen(false);
      loadForm();
    } catch (err: any) {
      setActionErr(err.response?.data?.message || 'Failed to save changes.');
    } finally {
      setEditSaving(false);
    }
  };

  if (loading) return (
    <DashboardLayout>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    </DashboardLayout>
  );

  if (error || !form) return (
    <DashboardLayout>
      <Button startIcon={<ArrowBackIcon />}
        onClick={() => router.push('/admin')}
        variant="outlined" size="small" sx={{ mb: 2 }}>
        Back to Admin
      </Button>
      <Alert severity="error">{error || 'Form not found.'}</Alert>
    </DashboardLayout>
  );

  const isInf = form.opportunity_type === 'internship';

  return (
    <DashboardLayout>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Button startIcon={<ArrowBackIcon />}
          onClick={() => router.push('/admin')}
          variant="outlined" size="small">
          Back
        </Button>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#003366' }}>
            {form.designation || form.internship_title || 'Untitled Form'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {form.jnf_code} · {form.recruitment_cycle} ·{' '}
            <strong>{form.company?.company_name}</strong>
          </Typography>
        </Box>
        <Chip
          label={isInf ? 'INF' : 'JNF'}
          color={isInf ? 'warning' : 'primary'}
          sx={{ fontWeight: 600 }}
        />
        <Chip
          label={form.status}
          color={statusColor[form.status]}
          sx={{ textTransform: 'capitalize', fontWeight: 600 }}
        />
      </Box>

      {form.is_edit_requested && form.edit_reason && (
        <Alert severity="info" sx={{ mb: 3, border: '1px solid #9c27b0', bgcolor: 'rgba(156, 39, 176, 0.04)' }}>
          <Typography variant="subtitle2" sx={{ color: '#9c27b0', fontWeight: 600 }}>
            ✏️ Edit Request from Recruiter:
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.5 }}>
            {form.edit_reason}
          </Typography>
        </Alert>
      )}

      {form.status === 'rejected' && form.rejection_reason && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <strong>Rejection Reason:</strong> {form.rejection_reason}
        </Alert>
      )}

      {actionMsg && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setActionMsg('')}>
          {actionMsg}
        </Alert>
      )}
      {actionErr && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setActionErr('')}>
          {actionErr}
        </Alert>
      )}

      {/* Company Info */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: { xs: 2, md: 4 } }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#003366' }}>
            Company Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Label>Company Name</Label>
              <Value>{form.company?.company_name}</Value>
            </Grid>
            <Grid item xs={12} md={4}>
              <Label>Industry</Label>
              <Value>{form.company?.industry}</Value>
            </Grid>
            <Grid item xs={12} md={4}>
              <Label>Website</Label>
              <Value>{form.company?.website}</Value>
            </Grid>
            {form.company?.contacts?.map((c: any) => (
              <Grid item xs={12} md={4} key={c.id}>
                <Label>{c.contact_type.replace('_', ' ').toUpperCase()}</Label>
                <Value>{c.contact_name} — {c.email}</Value>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Job / Intern Details */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: { xs: 2, md: 4 } }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#003366' }}>
            {isInf ? 'Internship Details' : 'Job Details'}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Label>{isInf ? 'Internship Title' : 'Designation'}</Label>
              <Value>{form.internship_title || form.designation}</Value>
            </Grid>
            <Grid item xs={12} md={6}>
              <Label>Department / Function</Label>
              <Value>{form.department_function}</Value>
            </Grid>
            <Grid item xs={12} md={4}>
              <Label>Location Type</Label>
              <Value>{form.location_type}</Value>
            </Grid>
            <Grid item xs={12} md={4}>
              <Label>Location</Label>
              <Value>{form.location_text}</Value>
            </Grid>
            <Grid item xs={12} md={2}>
              <Label>Openings</Label>
              <Value>{form.openings_count}</Value>
            </Grid>
            <Grid item xs={12} md={2}>
              <Label>Min. Hires</Label>
              <Value>{form.min_openings}</Value>
            </Grid>
            {form.job_description && (
              <Grid item xs={12}>
                <Label>Description</Label>
                <Value>{form.job_description}</Value>
              </Grid>
            )}
            {form.skills?.length > 0 && (
              <Grid item xs={12}>
                <Label>Required Skills</Label>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 0.5 }}>
                  {form.skills.map((s: any) => (
                    <Chip key={s.id} label={s.skill_name} size="small"
                      sx={{ background: 'rgba(0,51,102,0.08)', color: '#003366' }} />
                  ))}
                </Box>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>

      {/* Eligibility */}
      {form.eligibility_rule && (
        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ p: { xs: 2, md: 4 } }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#003366' }}>
              Eligibility Criteria
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} md={3}>
                <Label>Min. CGPA</Label>
                <Value>{form.eligibility_rule.min_cgpa}</Value>
              </Grid>
              <Grid item xs={6} md={3}>
                <Label>Max Backlogs</Label>
                <Value>{form.eligibility_rule.max_backlogs_allowed}</Value>
              </Grid>
              <Grid item xs={6} md={3}>
                <Label>Gender</Label>
                <Value>{form.eligibility_rule.allowed_gender}</Value>
              </Grid>
              <Grid item xs={6} md={3}>
                <Label>Active Backlogs OK?</Label>
                <Value>{form.eligibility_rule.active_backlogs_allowed ? 'Yes' : 'No'}</Value>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Salary / Stipend */}
      {form.salary_breakdowns?.length > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ p: { xs: 2, md: 4 } }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#003366' }}>
              Salary Details
            </Typography>
            {form.salary_breakdowns.map((row: any) => (
              <Box key={row.id} sx={{
                mb: 2, p: 2,
                border: '1px solid rgba(0,0,0,0.08)', borderRadius: 2,
              }}>
                <Typography sx={{
                  fontWeight: 600, fontSize: '0.85rem',
                  color: '#003366', mb: 1,
                }}>
                  {row.programme_type?.replace('_', ' / ').toUpperCase()} — {row.currency}
                </Typography>
                <Grid container spacing={1}>
                  {[
                    ['CTC Annual', row.ctc_annual],
                    ['Base/Fixed', row.base_fixed],
                    ['Monthly Take-home', row.monthly_takehome],
                    ['Joining Bonus', row.joining_bonus],
                  ].filter(([, v]) => v).map(([label, val]) => (
                    <Grid item xs={6} md={3} key={label as string}>
                      <Label>{label as string}</Label>
                      <Value>₹{Number(val).toLocaleString('en-IN')}</Value>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            ))}
          </CardContent>
        </Card>
      )}

      {/* INF Stipend */}
      {form.inf_stipend_breakdowns?.length > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ p: { xs: 2, md: 4 } }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#003366' }}>
              Stipend Details
            </Typography>
            {form.inf_stipend_breakdowns.map((row: any) => (
              <Box key={row.id} sx={{
                mb: 2, p: 2,
                border: '1px solid rgba(0,0,0,0.08)', borderRadius: 2,
              }}>
                <Typography sx={{
                  fontWeight: 600, fontSize: '0.85rem',
                  color: '#C8922A', mb: 1,
                }}>
                  {row.programme_type?.replace('_', ' / ').toUpperCase()} — {row.currency}
                </Typography>
                <Grid container spacing={1}>
                  {[
                    ['Base Stipend', row.base_stipend],
                    ['HRA', row.hra_housing],
                    ['Variable Pay', row.variable_pay],
                    ['Total', row.total_stipend],
                  ].filter(([, v]) => v).map(([label, val]) => (
                    <Grid item xs={6} md={3} key={label as string}>
                      <Label>{label as string}</Label>
                      <Value>₹{Number(val).toLocaleString('en-IN')}</Value>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Selection Rounds */}
      {form.selection_rounds?.length > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ p: { xs: 2, md: 4 } }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#003366' }}>
              Selection Process
            </Typography>
            {form.selection_rounds.map((round: any) => (
              <Box key={round.id} sx={{
                display: 'flex', gap: 2, alignItems: 'flex-start',
                py: 1.5, borderBottom: '1px solid rgba(0,0,0,0.06)',
                '&:last-child': { borderBottom: 'none' },
              }}>
                <Box sx={{
                  minWidth: 32, height: 32, borderRadius: '50%',
                  background: '#003366', color: 'white',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem', fontWeight: 700, flexShrink: 0,
                }}>
                  {round.round_order}
                </Box>
                <Box>
                  <Typography sx={{
                    fontWeight: 600, fontSize: '0.9rem',
                    textTransform: 'capitalize',
                  }}>
                    {round.round_type} {round.mode && `· ${round.mode}`}
                  </Typography>
                  {round.description && (
                    <Typography variant="caption" color="text.secondary">
                      {round.description}
                    </Typography>
                  )}
                </Box>
                {round.is_elimination_round && (
                  <Chip label="Elimination" size="small"
                    color="error" sx={{ ml: 'auto' }} />
                )}
              </Box>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Approval History */}
      {form.approval_history?.length > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ p: { xs: 2, md: 4 } }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#003366' }}>
              Approval History
            </Typography>
            {form.approval_history.map((h: any) => (
              <Box key={h.id} sx={{
                display: 'flex', gap: 2, alignItems: 'center',
                py: 1.5, borderBottom: '1px solid rgba(0,0,0,0.06)',
                '&:last-child': { borderBottom: 'none' },
              }}>
                <Chip
                  label={h.new_status}
                  size="small"
                  color={statusColor[h.new_status]}
                  sx={{ textTransform: 'capitalize', minWidth: 80 }}
                />
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: '0.85rem' }}>
                    {h.remarks}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    by {h.action_by?.name} · {new Date(h.action_at).toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            ))}
          </CardContent>
        </Card>
      )}

      <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="outlined"
            onClick={() => setShowPreview(!showPreview)}
            sx={{ borderRadius: 4, px: 4 }}
          >
            {showPreview ? 'Hide PDF Preview' : 'Preview PDF Layout for Download'}
          </Button>
        </Box>

        {showPreview && (
          <Card variant="outlined" sx={{ p: 1, background: '#f5f5f5' }}>
            <PrintableJnf form={form} />
          </Card>
        )}
      </Box>

      {/* Admin Action Buttons */}
      <Card sx={{ mt: 3, border: '2px solid #003366', borderRadius: 3 }}>
        <CardContent sx={{ p: { xs: 2, md: 3 } }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#003366', mb: 2 }}>
            Admin Actions
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>

            {/* Approve — only for submitted */}
            <Button
              id="btn-approve-form"
              variant="contained"
              color="success"
              startIcon={<CheckCircleOutlineIcon />}
              onClick={() => setDialog('approve')}
              disabled={form.status !== 'submitted'}
            >
              Approve
            </Button>

            {/* Reject — only for submitted */}
            <Button
              id="btn-reject-form"
              variant="contained"
              color="error"
              startIcon={<CancelOutlinedIcon />}
              onClick={() => setDialog('reject')}
              disabled={form.status !== 'submitted'}
            >
              Reject
            </Button>

            {/* Allow Edit — for all non-draft forms (accept edit request) */}
            <Button
              id="btn-allow-edit-form"
              variant="outlined"
              color="warning"
              startIcon={<EditNoteIcon />}
              onClick={() => setDialog('allow-edit')}
              disabled={form.status === 'draft'}
              sx={{ borderColor: '#e65100', color: '#e65100' }}
            >
              Allow Edit
            </Button>

            {/* Edit Fields — admin applies changes directly */}
            <Button
              id="btn-edit-fields-form"
              variant="contained"
              startIcon={<DriveFileRenameOutlineIcon />}
              onClick={openEditDialog}
              sx={{ background: '#5c35b5', '&:hover': { background: '#4527a0' } }}
            >
              Edit Fields Directly
            </Button>

          </Box>
          {form.status === 'draft' && (
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1.5 }}>
              This form is currently in draft — no actions needed.
            </Typography>
          )}
          {form.status === 'approved' && (
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1.5 }}>
              This form is approved. Use <strong>Allow Edit</strong> to let the recruiter make changes.
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Action Confirmation Dialog */}
      <Dialog
        open={!!dialog}
        onClose={() => { setDialog(null); setNotes(''); setActionErr(''); }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700, color:
          dialog === 'approve' ? '#2e7d32' :
          dialog === 'reject'  ? '#c62828' : '#e65100'
        }}>
          {dialog === 'approve' && '✅ Approve Form'}
          {dialog === 'reject'  && '❌ Reject Form'}
          {dialog === 'allow-edit' && '✏️ Allow Recruiter to Edit'}
        </DialogTitle>
        <DialogContent>
          {actionErr && <Alert severity="error" sx={{ mb: 2 }}>{actionErr}</Alert>}
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {dialog === 'approve' && 'Add optional notes and confirm approval.'}
            {dialog === 'reject'  && 'Provide a reason for rejection. The recruiter will be notified.'}
            {dialog === 'allow-edit' && 'This will revert the form to draft. The recruiter will be notified and can edit and resubmit.'}
          </Typography>
          <TextField
            label={dialog === 'reject' ? 'Rejection reason *' : 'Notes (optional)'}
            multiline
            rows={4}
            fullWidth
            value={notes}
            onChange={e => setNotes(e.target.value)}
            required={dialog === 'reject'}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button
            onClick={() => { setDialog(null); setNotes(''); setActionErr(''); }}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            id="btn-confirm-action"
            variant="contained"
            color={dialog === 'approve' ? 'success' : dialog === 'reject' ? 'error' : 'warning'}
            onClick={handleAction}
            disabled={submitting || (dialog === 'reject' && !notes.trim())}
            startIcon={submitting ? <CircularProgress size={16} /> : undefined}
            sx={dialog === 'allow-edit' ? { background: '#e65100', '&:hover': { background: '#bf360c' } } : {}}
          >
            {submitting ? 'Processing...' :
              dialog === 'approve' ? 'Confirm Approve' :
              dialog === 'reject'  ? 'Confirm Reject' :
              'Confirm — Allow Edit'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Fields Dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, color: '#5c35b5' }}>
          ✏️ Edit Form Fields — {form.jnf_code}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Apply changes requested by the recruiter. The form status will not change.
            The recruiter will be notified after saving.
          </Typography>
          {actionErr && <Alert severity="error" sx={{ mb: 2 }}>{actionErr}</Alert>}

          <Grid container spacing={2} sx={{ mt: 0.5 }}>

            {/* Title */}
            {!editFields._isInf ? (
              <Grid item xs={12} md={6}>
                <TextField label="Designation" fullWidth
                  value={editFields.designation}
                  onChange={e => setEditFields((p: any) => ({ ...p, designation: e.target.value }))}
                />
              </Grid>
            ) : (
              <Grid item xs={12} md={6}>
                <TextField label="Internship Title" fullWidth
                  value={editFields.internship_title}
                  onChange={e => setEditFields((p: any) => ({ ...p, internship_title: e.target.value }))}
                />
              </Grid>
            )}

            <Grid item xs={12} md={6}>
              <TextField label="Department / Function" fullWidth
                value={editFields.department_function}
                onChange={e => setEditFields((p: any) => ({ ...p, department_function: e.target.value }))}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField label="Location Type" fullWidth select
                value={editFields.location_type}
                onChange={e => setEditFields((p: any) => ({ ...p, location_type: e.target.value }))}
                SelectProps={{ native: true }}
              >
                <option value="onsite">Onsite</option>
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
              </TextField>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField label="Location" fullWidth
                value={editFields.location_text}
                onChange={e => setEditFields((p: any) => ({ ...p, location_text: e.target.value }))}
              />
            </Grid>

            <Grid item xs={6} md={2}>
              <TextField label="Openings" type="number" fullWidth
                value={editFields.openings_count}
                onChange={e => setEditFields((p: any) => ({ ...p, openings_count: e.target.value }))}
              />
            </Grid>

            <Grid item xs={6} md={2}>
              <TextField label="Min Hires" type="number" fullWidth
                value={editFields.min_openings}
                onChange={e => setEditFields((p: any) => ({ ...p, min_openings: e.target.value }))}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField label="Job Description" fullWidth multiline rows={3}
                value={editFields.job_description}
                onChange={e => setEditFields((p: any) => ({ ...p, job_description: e.target.value }))}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField label="Skills (comma-separated)" fullWidth
                value={editFields.skills}
                onChange={e => setEditFields((p: any) => ({ ...p, skills: e.target.value }))}
                helperText="e.g. Python, React, SQL"
              />
            </Grid>

            {/* Salary (JNF only) */}
            {!editFields._isInf && (
              <>
                <Grid item xs={12}>
                  <Divider><Typography variant="caption">Salary (first row)</Typography></Divider>
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField label="CTC Annual (₹)" type="number" fullWidth
                    value={editFields.ctc_annual}
                    onChange={e => setEditFields((p: any) => ({ ...p, ctc_annual: e.target.value }))}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField label="Base / Fixed (₹)" type="number" fullWidth
                    value={editFields.base_fixed}
                    onChange={e => setEditFields((p: any) => ({ ...p, base_fixed: e.target.value }))}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField label="Joining Bonus (₹)" type="number" fullWidth
                    value={editFields.joining_bonus}
                    onChange={e => setEditFields((p: any) => ({ ...p, joining_bonus: e.target.value }))}
                  />
                </Grid>
              </>
            )}

            {/* Stipend (INF only) */}
            {editFields._isInf && (
              <>
                <Grid item xs={12}>
                  <Divider><Typography variant="caption">Stipend (first row)</Typography></Divider>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField label="Base Stipend (₹/month)" type="number" fullWidth
                    value={editFields.base_stipend}
                    onChange={e => setEditFields((p: any) => ({ ...p, base_stipend: e.target.value }))}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField label="Total Stipend (₹/month)" type="number" fullWidth
                    value={editFields.total_stipend}
                    onChange={e => setEditFields((p: any) => ({ ...p, total_stipend: e.target.value }))}
                  />
                </Grid>
              </>
            )}

            {/* Admin note */}
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
              <TextField label="Admin note (logged in history)" fullWidth multiline rows={2}
                value={editNote}
                onChange={e => setEditNote(e.target.value)}
                placeholder="e.g. Applied CTC change from 12L to 14L as requested by recruiter via email."
              />
            </Grid>

          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button onClick={() => setEditOpen(false)} disabled={editSaving}>Cancel</Button>
          <Button
            id="btn-save-edit-fields"
            variant="contained"
            onClick={handleEditSave}
            disabled={editSaving}
            startIcon={editSaving ? <CircularProgress size={16} /> : <DriveFileRenameOutlineIcon />}
            sx={{ background: '#5c35b5', '&:hover': { background: '#4527a0' } }}
          >
            {editSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}