'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box, Card, CardContent, Typography,
  Button, Tab, Tabs, CircularProgress, Alert,
} from '@mui/material';
import DashboardLayout   from '@/components/layout/DashboardLayout';
import api               from '@/lib/api';
import InternProfileTab  from '@/components/inf/InternProfileTab';
import EligibilityTab    from '@/components/jnf/EligibilityTab';
import StipendTab        from '@/components/inf/StipendTab';
import SelectionTab      from '@/components/jnf/SelectionTab';
import DeclarationTab    from '@/components/jnf/DeclarationTab';

const tabs = [
  'Intern Profile',
  'Eligibility',
  'Stipend',
  'Selection Process',
  'Declaration & Submit',
];

export default function NewInfPage() {
  const router = useRouter();
  const [activeTab, setActiveTab]   = useState(0);
  const [jnfId, setJnfId]           = useState<number | null>(null);
  const [infCode, setInfCode]       = useState('');
  const [saving, setSaving]         = useState(false);
  const [error, setError]           = useState('');
  const [success, setSuccess]       = useState('');
  const [initialized, setInit]      = useState(false);

  const initInf = async () => {
    if (initialized) return;
    try {
      const res = await api.post('/inf');
      setJnfId(res.data.jnf_id);
      setInfCode(res.data.inf_code);
      setInit(true);
    } catch {
      setError('Failed to initialize INF. Make sure your company profile is complete.');
    }
  };

  useState(() => { initInf(); });

  const handleTabSave = async (tabIndex: number, data: any, endpoint: string) => {
    if (!jnfId) return;
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await api.post(`/inf/${jnfId}/${endpoint}`, data);
      setSuccess('Saved successfully.');
      if (tabIndex < tabs.length - 1) setActiveTab(tabIndex + 1);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (!jnfId) return;
    setSaving(true);
    try {
      await api.post(`/inf/${jnfId}/submit`);
      setSuccess('INF submitted! CDC will review it shortly.');
      setTimeout(() => router.push('/dashboard'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Submission failed.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#003366' }}>
            New Intern Notification Form
          </Typography>
          {infCode && (
            <Typography variant="caption" color="text.secondary">
              Form Code: {infCode}
            </Typography>
          )}
        </Box>
        <Button variant="outlined" size="small" onClick={() => router.push('/dashboard')}>
          Back to Dashboard
        </Button>
      </Box>

      {error   && <Alert severity="error"   sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>{success}</Alert>}

      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', background: '#A0721A' }}>
          <Tabs
            value={activeTab}
            onChange={(_, v) => setActiveTab(v)}
            variant="scrollable"
            sx={{
              '& .MuiTab-root': {
                color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem',
                textTransform: 'none',
                '&.Mui-selected': { color: '#ffffff' },
              },
              '& .MuiTabs-indicator': { background: 'white', height: 3 },
            }}
          >
            {tabs.map((tab, i) => (
              <Tab key={tab} label={tab} disabled={!initialized && i > 0} />
            ))}
          </Tabs>
        </Box>

        <CardContent sx={{ p: { xs: 2, md: 4 } }}>
          {!initialized ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {activeTab === 0 && (
                <InternProfileTab saving={saving}
                  onSave={d => handleTabSave(0, d, 'intern-profile')} />
              )}
              {activeTab === 1 && (
                <EligibilityTab saving={saving}
                  onSave={d => handleTabSave(1, d, 'eligibility')} />
              )}
              {activeTab === 2 && (
                <StipendTab saving={saving}
                  onSave={d => handleTabSave(2, d, 'stipend')} />
              )}
              {activeTab === 3 && (
                <SelectionTab saving={saving}
                  onSave={d => handleTabSave(3, d, 'selection')} />
              )}
              {activeTab === 4 && (
                <DeclarationTab saving={saving} onSubmit={handleSubmit} />
              )}
            </>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}