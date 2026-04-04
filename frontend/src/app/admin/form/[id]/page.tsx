'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box, Card, CardContent, Typography, Chip, Button,
  CircularProgress, Alert, Grid, Divider,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DashboardLayout from '@/components/layout/DashboardLayout';
import api from '@/lib/api';

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

  useEffect(() => {
    if (!id) return;
    api.get(`/admin/forms/${id}`)
      .then(res => setForm(res.data.form))
      .catch(err => {
        console.error(err.response?.data);
        setError('Form not found or access denied.');
      })
      .finally(() => setLoading(false));
  }, [id]);

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

      {form.status === 'rejected' && form.rejection_reason && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <strong>Rejection Reason:</strong> {form.rejection_reason}
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
    </DashboardLayout>
  );
}