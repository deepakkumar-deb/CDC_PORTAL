'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Box, Card, CardContent, Typography, Button, Chip,
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, CircularProgress, Alert,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Tabs, Tab, Grid,
} from '@mui/material';
import DashboardLayout from '@/components/layout/DashboardLayout';
import api from '@/lib/api';

const statusColor: Record<string, any> = {
  submitted: 'warning',
  approved: 'success',
  rejected: 'error',
  draft: 'default',
};

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [tab, setTab] = useState(0);
  const [forms, setForms] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionForm, setActionForm] = useState<any>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [reason, setReason] = useState('');
  const [acting, setActing] = useState(false);

  const statusFilters = ['submitted', 'requests', 'approved', 'rejected'];

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/login');
    if (status === 'authenticated' && !['admin', 'superadmin'].includes(session?.user?.role)) {
      router.push('/dashboard');
    }
  }, [status]);

  useEffect(() => {
    if (status !== 'authenticated') return;
    loadData();
  }, [status, tab]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [formsRes, statsRes] = await Promise.all([
        api.get(`/admin/forms?status=${statusFilters[tab]}`),
        api.get('/admin/stats'),
      ]);
      setForms(formsRes.data.forms);
      setStats(statsRes.data.stats);
    } catch {
      setError('Failed to load data. Make sure you are logged in as admin.');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async () => {
    if (!actionForm || !actionType) return;
    setActing(true);
    try {
      if (actionType === 'approve') {
        await api.post(`/admin/forms/${actionForm.id}/approve`, {
          admin_notes: reason,
        });
      } else {
        await api.post(`/admin/forms/${actionForm.id}/reject`, {
          rejection_reason: reason,
        });
      }
      setActionForm(null);
      setReason('');
      loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Action failed.');
    } finally {
      setActing(false);
    }
  };

  return (
    <DashboardLayout>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#660000' }}>
          Admin Panel
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Review, approve and reject JNF and INF submissions.
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Stats */}
      {stats && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {[
            { label: 'Pending Review', value: stats.total_submitted, color: '#ed6c02' },
            { label: 'Edit Requests', value: stats.total_requests, color: '#9c27b0' },
            { label: 'Approved', value: stats.total_approved, color: '#2e7d32' },
            { label: 'Rejected', value: stats.total_rejected, color: '#8B0000' },
            { label: 'Total JNFs', value: stats.total_jnf, color: '#660000' },
            { label: 'Total INFs', value: stats.total_inf, color: '#C8922A' },
          ].map(s => (
            <Grid item xs={6} sm={4} md={2} key={s.label}>
              <Card>
                <CardContent sx={{ textAlign: 'center', py: 2 }}>
                  <Typography sx={{
                    fontFamily: '"Playfair Display", serif',
                    fontSize: '2rem', fontWeight: 700, color: s.color,
                  }}>
                    {s.value}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {s.label}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Filter Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tab} onChange={(_, v) => setTab(v)}>
            <Tab label="Pending" />
            <Tab label="Requests" />
            <Tab label="Approved" />
            <Tab label="Rejected" />
          </Tabs>
        </Box>
        <CardContent sx={{ p: 0 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress />
            </Box>
          ) : forms.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
              <Typography>No forms found.</Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ background: '#f5f5f5' }}>
                    <TableCell sx={{ fontWeight: 600 }}>Form Code</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Company</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Role / Title</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {forms.map(form => (
                    <TableRow key={form.id} hover>
                      <TableCell>
                        <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                          {form.jnf_code}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={form.opportunity_type === 'internship' ? 'INF' : 'JNF'}
                          size="small"
                          color={form.opportunity_type === 'internship' ? 'warning' : 'primary'}
                        />
                      </TableCell>
                      <TableCell>{form.company?.company_name ?? '—'}</TableCell>
                      <TableCell>
                        {form.designation || form.internship_title || 'Untitled'}
                        {tab === 1 && form.edit_reason && (
                          <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', fontStyle: 'italic', mt: 0.5 }}>
                            Reason: {form.edit_reason}
                          </Typography>
                        )}
                        {tab === 1 && (
                          <Chip 
                            label="Edit Requested" size="small" 
                            sx={{ mt: 0.5, height: 18, fontSize: '0.65rem', bgcolor: '#9c27b0', color: 'white' }} 
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={form.status}
                          size="small"
                          color={statusColor[form.status]}
                          sx={{ textTransform: 'capitalize' }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          {form.status === 'submitted' && (
                            <>
                              <Button size="small" variant="contained"
                                color="success"
                                onClick={() => { setActionForm(form); setActionType('approve'); }}>
                                Approve
                              </Button>
                              <Button size="small" variant="outlined"
                                color="error"
                                onClick={() => { setActionForm(form); setActionType('reject'); }}>
                                Reject
                              </Button>
                            </>
                          )}
                          <Button size="small" variant="outlined"
                            onClick={() => router.push(`/admin/form/${form.id}`)}>
                            View
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Approve/Reject Dialog */}
      <Dialog open={!!actionForm} onClose={() => { setActionForm(null); setReason(''); }} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          {actionType === 'approve' ? '✅ Approve Form' : '❌ Reject Form'}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
            Form: <strong>{actionForm?.jnf_code}</strong>
          </Typography>
          <TextField
            fullWidth multiline rows={3}
            label={actionType === 'approve' ? 'Admin Notes (optional)' : 'Rejection Reason *'}
            value={reason}
            onChange={e => setReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => { setActionForm(null); setReason(''); }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color={actionType === 'approve' ? 'success' : 'error'}
            onClick={handleAction}
            disabled={acting || (actionType === 'reject' && !reason.trim())}
          >
            {acting
              ? <CircularProgress size={20} color="inherit" />
              : actionType === 'approve' ? 'Confirm Approve' : 'Confirm Reject'}
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}