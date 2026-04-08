'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Box, Card, CardContent, Typography, Button,
  CircularProgress, Alert, Stepper, Step, StepLabel,
  StepConnector, stepConnectorClasses, StepIconProps,
  IconButton, Tooltip
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { styled } from '@mui/material/styles';
import DashboardLayout from '@/components/layout/DashboardLayout';
import api from '@/lib/api';
import JobDetailsTab from '@/components/jnf/JobDetailsTab';
import EligibilityTab from '@/components/jnf/EligibilityTab';
import SalaryTab from '@/components/jnf/SalaryTab';
import SelectionTab from '@/components/jnf/SelectionTab';
import DeclarationTab from '@/components/jnf/DeclarationTab';

const tabs = [
  'Job Details',
  'Eligibility',
  'Salary',
  'Selection Process',
  'Declaration & Submit',
];

// Custom Stepper Styling
const ColorlibConnector = styled(StepConnector)(() => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: '#008080', // Teal
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: '#008080', // Teal
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: '#eaeaf0',
    borderRadius: 1,
  },
}));

const ColorlibStepIconRoot = styled('div')<{
  ownerState: { completed?: boolean; active?: boolean };
}>(({ ownerState }) => ({
  backgroundColor: '#fff',
  zIndex: 1,
  color: '#ccc',
  width: 45,
  height: 45,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  fontWeight: 'bold',
  fontSize: '1.2rem',
  border: '3px solid #ccc',
  ...(ownerState.active && {
    backgroundColor: '#d32f2f', // Red
    color: '#fff',
    border: 'none',
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
  }),
  ...(ownerState.completed && {
    color: '#008080', // Teal
    border: '3px solid #008080',
    backgroundColor: '#fff',
  }),
}));

function ColorlibStepIcon(props: StepIconProps) {
  const { active, completed, className, icon } = props;
  return (
    <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
      {icon}
    </ColorlibStepIconRoot>
  );
}

export default function NewJnfPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit'); // set when coming from duplicate

  const [activeTab, setActiveTab] = useState(0);
  const [jnfId, setJnfId] = useState<number | null>(null);
  const [jnfCode, setJnfCode] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [initialized, setInit] = useState(false);
  const [existingData, setExistingData] = useState<any>(null);

  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [extracting, setExtracting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      try {
        if (editId) {
          // Load existing (duplicated) JNF data to pre-fill tabs
          const res = await api.get(`/jnf/${editId}`);
          if (!cancelled) {
            const jnf = res.data.jnf;
            setJnfId(jnf.id);
            setJnfCode(jnf.jnf_code);
            setExistingData(jnf);
            setInit(true);
          }
        } else {
          // Fresh form — create a new empty JNF record
          const res = await api.post('/jnf');
          if (!cancelled) {
            setJnfId(res.data.jnf_id);
            setJnfCode(res.data.jnf_code);
            setInit(true);
          }
        }
      } catch {
        if (!cancelled) {
          setError('Failed to initialize JNF. Make sure your company profile is complete.');
        }
      }
    };

    init();
    return () => { cancelled = true; };
  }, [editId]);

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
      setError(err.response?.data?.message || 'Save failed.');
    } finally {
      setSaving(false);
    }
  };

  const handleAutofillPdf = async (file: File) => {
    if (!file) return;
    setExtracting(true);
    setError('');
    setSuccess('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'jnf');
      const res = await api.post('/extract-pdf', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      const AI = res.data.data;
      if (AI) {
        setExistingData((prev: any) => ({
          ...(prev || {}),
          designation: AI.designation,
          job_description: AI.job_description,
          location_type: AI.location_type,
          openings_count: AI.openings_count,
          skills: AI.skills ? AI.skills.map((s: string) => ({ skill_name: s })) : [],
          salaries: AI.salary ? [{  
            salary_type: 'ctc',
            ctc: AI.salary.ctc,
            base_salary: AI.salary.base,
            performance_bonus: AI.salary.bonus,
            bond_details: AI.salary.bond_details
          }] : [],
          eligibility_rule: AI.eligibility_rule ? {
            min_cgpa: AI.eligibility_rule.min_cgpa,
            max_backlogs_allowed: AI.eligibility_rule.max_backlogs_allowed,
            min_class_10_percent: AI.eligibility_rule.min_class_10_percent,
            min_class_12_percent: AI.eligibility_rule.min_class_12_percent
          } : undefined,
          selection_rounds: AI.selection_process?.rounds,
          selection_infrastructure: AI.selection_process?.infrastructure ? {
            rooms_required: AI.selection_process.infrastructure.rooms_required,
            team_members_required: AI.selection_process.infrastructure.team_members_required,
            other_screening: AI.selection_process.infrastructure.other_screening
          } : undefined
        }));
        setSuccess('Successfully extracted details from the PDF. Please review the autofilled data carefully to ensure accuracy before submitting.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to extract data.');
    } finally {
      setExtracting(false);
    }
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#003366' }}>
            {editId ? 'Edit Job Notification Form' : 'New Job Notification Form'}
          </Typography>
          {jnfCode && (
            <Typography variant="caption" color="text.secondary">
              Form Code: {jnfCode}
              {editId && ' · Duplicated — review and resubmit'}
            </Typography>
          )}
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            component="label"
            variant="contained"
            color="secondary"
            startIcon={<UploadFileIcon />}
            size="small"
            disabled={extracting}
            sx={{ background: '#C8922A', '&:hover': { background: '#A0721A' } }}
          >
            {extracting ? 'Extracting...' : 'Autofill from PDF'}
            <input hidden accept="application/pdf" type="file" onChange={e => {
              if (e.target.files && e.target.files[0]) handleAutofillPdf(e.target.files[0]);
            }} />
          </Button>
          <Button variant="outlined" size="small" onClick={() => router.push('/dashboard')}>
            Back
          </Button>
        </Box>
      </Box>

      {/* Alerts */}
      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>{success}</Alert>}

      {/* Tabs / Stepper */}
      <Card>
        <Box sx={{ p: 4, pb: 6, borderBottom: 1, borderColor: 'divider', background: '#FAFAFA' }}>
          <Stepper alternativeLabel activeStep={activeTab} connector={<ColorlibConnector />}>
            {tabs.map((label) => (
              <Step key={label}>
                <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
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
                  initialData={existingData}
                  onSave={(data) => handleTabSave(0, data, 'job-details')}
                />
              )}
              {activeTab === 1 && (
                <EligibilityTab
                  saving={saving}
                  initialData={existingData}
                  onSave={(data) => handleTabSave(1, data, 'eligibility')}
                />
              )}
              {activeTab === 2 && (
                <SalaryTab
                  saving={saving}
                  initialData={existingData}
                  onSave={(data) => handleTabSave(2, data, 'salary')}
                />
              )}
              {activeTab === 3 && (
                <SelectionTab
                  saving={saving}
                  initialData={existingData}
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