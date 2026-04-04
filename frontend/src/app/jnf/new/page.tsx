'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box, Card, CardContent, Typography, Button,
  Tab, Tabs, CircularProgress, Alert, Stepper,
  Step, StepLabel,
} from '@mui/material';
import DashboardLayout from '@/components/layout/DashboardLayout';
import api from '@/lib/api';
import JobDetailsTab    from '@/components/jnf/JobDetailsTab';
import EligibilityTab  from '@/components/jnf/EligibilityTab';
import SalaryTab       from '@/components/jnf/SalaryTab';
import SelectionTab    from '@/components/jnf/SelectionTab';
import DeclarationTab  from '@/components/jnf/DeclarationTab';

const tabs = [
  'Job Details',
  'Eligibility',
  'Salary',
  'Selection Process',
  'Declaration & Submit',
];

export default function NewJnfPage() {
  const router = useRouter();
  const [activeTab, setActiveTab]   = useState(0);
  const [jnfId, setJnfId]           = useState<number | null>(null);
  const [jnfCode, setJnfCode]       = useState('');
  const [saving, setSaving]         = useState(false);
  const [error, setError]           = useState('');
  const [success, setSuccess]       = useState('');
  const [initialized, setInit]      = useState(false);

  // Create JNF record on first load
  const initJnf = async () => {
    if (initialized) return;
    try {
      const res = await api.post('/jnf');
      setJnfId(res.data.jnf_id);
      setJnfCode(res.data.jnf_code);
      setInit(true);
    } catch {
      setError('Failed to initialize JNF. Make sure your company profile is complete.');
    }
  };

  // Call on mount
  useState(() => { initJnf(); });

  const handleTabSave = async (tabIndex: number, data: any, endpoint: string) => {
    if (!jnfId) return;
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await api.post(`/jnf/${jnfId}/${endpoint}`, data);
      setSuccess('Saved successfully.');
      if (tabIndex < tabs.length - 1) {
        setActiveTab(tabIndex + 1);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (!jnfId) return;
    setSaving(true);
    setError('');
    try {
      await api.post(`/jnf/${jnfId}/submit`);
      setSuccess('JNF submitted successfully! CDC will review it shortly.');
      setTimeout(() => router.push('/dashboard'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Submission failed.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#003366' }}>
            New Job Notification Form
          </Typography>
          {jnfCode && (
            <Typography variant="caption" color="text.secondary">
              Form Code: {jnfCode}
            </Typography>
          )}
        </Box>
        <Button variant="outlined" size="small" onClick={() => router.push('/dashboard')}>
          Back to Dashboard
        </Button>
      </Box>

      {/* Alerts */}
      {error   && <Alert severity="error"   sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>{success}</Alert>}

      {/* Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', background: '#003366' }}>
          <Tabs
            value={activeTab}
            onChange={(_, v) => setActiveTab(v)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                color: 'rgba(255,255,255,0.6)',
                fontSize: '0.85rem',
                textTransform: 'none',
                '&.Mui-selected': { color: '#E5B04A' },
              },
              '& .MuiTabs-indicator': { background: '#C8922A', height: 3 },
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
                <JobDetailsTab
                  saving={saving}
                  onSave={(data) => handleTabSave(0, data, 'job-details')}
                />
              )}
              {activeTab === 1 && (
                <EligibilityTab
                  saving={saving}
                  onSave={(data) => handleTabSave(1, data, 'eligibility')}
                />
              )}
              {activeTab === 2 && (
                <SalaryTab
                  saving={saving}
                  onSave={(data) => handleTabSave(2, data, 'salary')}
                />
              )}
              {activeTab === 3 && (
                <SelectionTab
                  saving={saving}
                  onSave={(data) => handleTabSave(3, data, 'selection')}
                />
              )}
              {activeTab === 4 && (
                <DeclarationTab
                  saving={saving}
                  onSubmit={handleSubmit}
                />
              )}
            </>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}