'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box, Card, CardContent, Typography, Chip, Button,
  CircularProgress, Alert, Grid,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DashboardLayout from '@/components/layout/DashboardLayout';
import api from '@/lib/api';

const statusColor: Record<string, any> = {
  draft: 'default', submitted: 'warning',
  approved: 'success', rejected: 'error',
};

export default function InfDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [inf, setInf] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/inf/${id}`)
      .then(res => setInf(res.data.inf))
      .catch(() => setError('INF not found or you do not have access.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <DashboardLayout>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    </DashboardLayout>
  );

  if (error || !inf) return (
    <DashboardLayout>
      <Alert severity="error">{error || 'INF not found.'}</Alert>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => router.back()} variant="outlined" size="small">
          Back
        </Button>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#003366' }}>
            {inf.internship_title || 'Untitled INF'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {inf.jnf_code} · {inf.recruitment_cycle}
          </Typography>
        </Box>
        <Chip label={inf.status} color={statusColor[inf.status]}
          sx={{ textTransform: 'capitalize', fontWeight: 600 }} />
      </Box>

      {inf.status === 'rejected' && inf.rejection_reason && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <strong>Rejection Reason:</strong> {inf.rejection_reason}
        </Alert>
      )}

      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: { xs: 2, md: 4 } }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#003366' }}>
            Internship Details
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}><Typography variant="caption" color="text.secondary">Title</Typography><Typography fontWeight={500}>{inf.internship_title || '—'}</Typography></Grid>
            <Grid item xs={12} md={6}><Typography variant="caption" color="text.secondary">Location</Typography><Typography fontWeight={500}>{inf.location_text || '—'} ({inf.location_type})</Typography></Grid>
            <Grid item xs={6} md={3}><Typography variant="caption" color="text.secondary">Duration</Typography><Typography fontWeight={500}>{inf.expected_duration || `${inf.internship_duration_months} months` || '—'}</Typography></Grid>
            <Grid item xs={6} md={3}><Typography variant="caption" color="text.secondary">Openings</Typography><Typography fontWeight={500}>{inf.openings_count ?? '—'}</Typography></Grid>
            {inf.job_description && (
              <Grid item xs={12}><Typography variant="caption" color="text.secondary">Description</Typography><Typography fontWeight={500}>{inf.job_description}</Typography></Grid>
            )}
          </Grid>
        </CardContent>
      </Card>

      {/* Stipend */}
      {inf.inf_stipend_breakdowns?.length > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ p: { xs: 2, md: 4 } }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#003366' }}>
              Stipend Details
            </Typography>
            {inf.inf_stipend_breakdowns.map((row: any) => (
              <Box key={row.id} sx={{ mb: 2, p: 2, border: '1px solid rgba(0,0,0,0.08)', borderRadius: 2 }}>
                <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', color: '#C8922A', mb: 1 }}>
                  {row.programme_type?.replace('_', ' / ').toUpperCase()}
                </Typography>
                <Grid container spacing={1}>
                  {[
                    ['Base Stipend', row.base_stipend],
                    ['HRA/Housing', row.hra_housing],
                    ['Variable Pay', row.variable_pay],
                    ['Total Monthly', row.total_stipend],
                  ].filter(([, v]) => v).map(([label, val]) => (
                    <Grid item xs={6} md={3} key={label as string}>
                      <Typography variant="caption" color="text.secondary">{label}</Typography>
                      <Typography fontWeight={500}>₹{Number(val).toLocaleString('en-IN')}</Typography>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            ))}
          </CardContent>
        </Card>
      )}

      {inf.status === 'draft' && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained" size="large"
            sx={{ background: '#C8922A', '&:hover': { background: '#A0721A' } }}
            onClick={() => router.push(`/inf/new?edit=${inf.id}`)}>
            Continue Editing
          </Button>
        </Box>
      )}
    </DashboardLayout>
  );
}