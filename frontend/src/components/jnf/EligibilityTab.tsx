'use client';
import { useState, useEffect } from 'react';
import {
  Box, TextField, Grid, MenuItem, Typography,
  Button, CircularProgress, Switch, FormControlLabel,
  Accordion, AccordionSummary, AccordionDetails, Checkbox as MuiCheckbox,
  Alert,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React, { memo } from 'react';

const genderOptions = ['all', 'male', 'female', 'other'];

const DEFAULT_PROGRAMMES = [
  // B.Tech / Dual
  { id: 1,  label: 'Chemical Engineering', degree: 'JEE Advanced: B.Tech / Dual Degree (4/5 Yr)' },
  { id: 2,  label: 'Civil Engineering', degree: 'JEE Advanced: B.Tech / Dual Degree (4/5 Yr)' },
  { id: 3,  label: 'Computer Science & Engineering', degree: 'JEE Advanced: B.Tech / Dual Degree (4/5 Yr)' },
  { id: 4,  label: 'Electrical Engineering', degree: 'JEE Advanced: B.Tech / Dual Degree (4/5 Yr)' },
  { id: 5,  label: 'Electronics & Communication Engineering', degree: 'JEE Advanced: B.Tech / Dual Degree (4/5 Yr)' },
  { id: 6,  label: 'Engineering Physics', degree: 'JEE Advanced: B.Tech / Dual Degree (4/5 Yr)' },
  { id: 7,  label: 'Environmental Engineering', degree: 'JEE Advanced: B.Tech / Dual Degree (4/5 Yr)' },
  { id: 9,  label: 'Mechanical Engineering', degree: 'JEE Advanced: B.Tech / Dual Degree (4/5 Yr)' },
  { id: 10, label: 'Mining Engineering', degree: 'JEE Advanced: B.Tech / Dual Degree (4/5 Yr)' },
  { id: 11, label: 'Mining Machinery Engineering / Mech. Eng.', degree: 'JEE Advanced: B.Tech / Dual Degree (4/5 Yr)' },
  { id: 12, label: 'Petroleum Engineering', degree: 'JEE Advanced: B.Tech / Dual Degree (4/5 Yr)' },
  { id: 13, label: 'Mineral & Metallurgical Engineering', degree: 'JEE Advanced: B.Tech / Dual Degree (4/5 Yr)' },
  { id: 8,  label: 'Mathematics & Computing', degree: 'JEE Advanced: B.Tech / Dual Degree (4/5 Yr)' },
  
  // Integrated M.Tech
  { id: 52, label: 'Mathematics & Computing', degree: 'JEE Advanced: Integrated M.Tech (5 Yr)' },
  { id: 31, label: 'Applied Geology', degree: 'JEE Advanced: Integrated M.Tech (5 Yr)' },
  { id: 32, label: 'Applied Geophysics', degree: 'JEE Advanced: Integrated M.Tech (5 Yr)' },

  // M.Tech (GATE)
  { id: 33, label: 'Earthquake Science & Engineering (Applied Geophysics)', degree: 'GATE: M.Tech (2 Yr)' },
  { id: 14, label: 'Chemical Engineering', degree: 'GATE: M.Tech (2 Yr)' },
  { id: 34, label: 'Pharmaceutical Science and Engineering', degree: 'GATE: M.Tech (2 Yr)' },
  { id: 15, label: 'Civil Engineering', degree: 'GATE: M.Tech (2 Yr)' },
  { id: 16, label: 'Computer Science and Engineering', degree: 'GATE: M.Tech (2 Yr)' },
  { id: 35, label: 'Power System Engineering (Electrical Engineering)', degree: 'GATE: M.Tech (2 Yr)' },
  { id: 36, label: 'Power Electronics & Electrical Drives (Electrical Engineering)', degree: 'GATE: M.Tech (2 Yr)' },
  { id: 37, label: 'Communication & Signal Processing (ECE)', degree: 'GATE: M.Tech (2 Yr)' },
  { id: 38, label: 'Optical Communication & Integrated Photonics (ECE)', degree: 'GATE: M.Tech (2 Yr)' },
  { id: 39, label: 'RF & Microwave Engineering (ECE)', degree: 'GATE: M.Tech (2 Yr)' },
  { id: 40, label: 'VLSI Design (ECE)', degree: 'GATE: M.Tech (2 Yr)' },
  { id: 19, label: 'Environmental Science & Engineering', degree: 'GATE: M.Tech (2 Yr)' },
  { id: 41, label: 'Fuel and Energy Engineering', degree: 'GATE: M.Tech (2 Yr)' },
  { id: 42, label: 'Mineral Engineering', degree: 'GATE: M.Tech (2 Yr)' },
  { id: 43, label: 'Metallurgical Engineering', degree: 'GATE: M.Tech (2 Yr)' },
  { id: 25, label: 'Industrial Engineering & Management', degree: 'GATE: M.Tech (2 Yr)' },
  { id: 44, label: 'Data Analytics', degree: 'GATE: M.Tech (2 Yr)' },
  { id: 45, label: 'Machine Design (Mechanical Engineering)', degree: 'GATE: M.Tech (2 Yr)' },
  { id: 46, label: 'Manufacturing Engineering (Mechanical Engineering)', degree: 'GATE: M.Tech (2 Yr)' },
  { id: 47, label: 'Thermal Engineering (Mechanical Engineering)', degree: 'GATE: M.Tech (2 Yr)' },
  { id: 22, label: 'Mining Engineering', degree: 'GATE: M.Tech (2 Yr)' },
  { id: 48, label: 'Geomatics (Mining Engineering)', degree: 'GATE: M.Tech (2 Yr)' },
  { id: 49, label: 'Tunneling and Underground Space Technology (Mining)', degree: 'GATE: M.Tech (2 Yr)' },
  { id: 24, label: 'Petroleum Engineering', degree: 'GATE: M.Tech (2 Yr)' },

  // MSc Tech (JAM)
  { id: 50, label: 'Applied Geology', degree: 'JAM: M.Sc. Tech (3 Yr)' },
  { id: 51, label: 'Applied Geophysics', degree: 'JAM: M.Sc. Tech (3 Yr)' },

  // MBA (CAT)
  { id: 27, label: 'MBA - Business Analytics', degree: 'CAT: MBA (2 Yr)' },
  { id: 26, label: 'MBA (Finance/Marketing/HR/Operations)', degree: 'CAT: MBA (2 Yr)' },

  // M.Sc (JAM)
  { id: 30, label: 'Physics', degree: 'JAM: M.Sc (2 Yr)' },
  { id: 29, label: 'Chemistry', degree: 'JAM: M.Sc (2 Yr)' },
  { id: 28, label: 'Mathematics & Computing', degree: 'JAM: M.Sc (2 Yr)' },
];

const DEFAULT_DEGREES = [
  'JEE Advanced: B.Tech / Dual Degree (4/5 Yr)',
  'JEE Advanced: Integrated M.Tech (5 Yr)',
  'GATE: M.Tech (2 Yr)',
  'JAM: M.Sc. Tech (3 Yr)',
  'CAT: MBA (2 Yr)',
  'JAM: M.Sc (2 Yr)'
];

import api from '@/lib/api';

const ProgramRow = memo(({ prog, isSelected, bdata, onToggle, onBranchDataChange }: any) => {
  return (
    <Box
      sx={{
        py: 0.5,
        px: 2,
        borderTop: '1px solid rgba(0,0,0,0.05)',
        background: isSelected ? 'rgba(0,51,102,0.02)' : 'transparent',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { md: 'center' },
        gap: 2
      }}
    >
      <FormControlLabel
        sx={{ flex: 1, minWidth: 250 }}
        control={
          <MuiCheckbox
            size="small"
            checked={isSelected}
            onChange={() => onToggle(prog.id)}
          />
        }
        label={<Typography variant="body2">{prog.label}</Typography>}
      />

      {isSelected && (
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexShrink: 0 }}>
          <TextField
            size="small"
            label="CGPA"
            type="number"
            sx={{ width: 80 }}
            value={bdata.min_cgpa}
            onChange={e => onBranchDataChange(prog.id, { ...bdata, min_cgpa: e.target.value })}
          />
          <FormControlLabel
            control={
              <Switch
                checked={bdata.active_backlogs_allowed}
                onChange={e => onBranchDataChange(prog.id, { ...bdata, active_backlogs_allowed: e.target.checked })}
              />
            }
            label={<Typography variant="caption">Active Backlogs Allowed</Typography>}
          />
        </Box>
      )}
    </Box>
  );
});

ProgramRow.displayName = 'ProgramRow';

export default function EligibilityTab({
  saving, onSave, onBack, initialData,
}: {
  saving: boolean;
  onSave: (data: any) => void;
  onBack?: () => void;
  initialData?: any;
}) {
  const [form, setForm] = useState({
    min_cgpa: '', max_backlogs_allowed: '',
    active_backlogs_allowed: false,
    min_class_10_percent: '', min_class_12_percent: '',
    allowed_gender: 'all', additional_text: '',
    hiring_ma: false, hiring_phd: false, phd_departments: '',
  });
  const [selectedPrograms, setSelectedPrograms] = useState<number[]>([]);
  const [useBranchWise, setUseBranchWise] = useState(false);
  const [branchWiseData, setBranchWiseData] = useState<Record<number, { min_cgpa: string, active_backlogs_allowed: boolean }>>({});
  const [validationError, setValidationError] = useState('');
  const [showErrors, setShowErrors] = useState(false);
  
  const [programmes, setProgrammes] = useState<any[]>(DEFAULT_PROGRAMMES);
  const [degrees, setDegrees] = useState<string[]>(DEFAULT_DEGREES);

  // Fetch programs from metadata API
  useEffect(() => {
    api.get('/metadata/programs')
      .then(res => {
        if (res.data.success && res.data.programmes?.length > 0) {
          const fetched = res.data.programmes;
          setProgrammes(fetched);
          const uniqueDegrees: string[] = Array.from(new Set(fetched.map((p: any) => p.degree)));
          setDegrees(uniqueDegrees);
        }
      })
      .catch(err => console.error("Failed to fetch programs:", err));
  }, []);

  // Pre-fill from initialData (duplicated JNF)
  useEffect(() => {
    if (!initialData) return;
    const rule = initialData.eligibility_rule;
    if (rule) {
      setForm(f => ({
        ...f,
        min_cgpa:                rule.min_cgpa                ?? '',
        max_backlogs_allowed:    rule.max_backlogs_allowed     ?? '',
        active_backlogs_allowed: rule.active_backlogs_allowed  ?? false,
        min_class_10_percent:    rule.min_class_10_percent     ?? '',
        min_class_12_percent:    rule.min_class_12_percent     ?? '',
        allowed_gender:          rule.allowed_gender           || 'all',
        additional_text:         rule.additional_text          || '',
        hiring_ma:               rule.hiring_ma                ?? false,
        hiring_phd:              rule.hiring_phd               ?? false,
        phd_departments:         rule.phd_departments          || '',
      }));
    }
    if (initialData.allowed_programs?.length) {
      setSelectedPrograms(initialData.allowed_programs.map((p: any) => p.program_dept_map_id));
    }
    if (initialData.dept_cgpa?.length) {
      setUseBranchWise(true);
      const m: Record<number, any> = {};
      initialData.dept_cgpa.forEach((d: any) => {
        m[d.program_dept_map_id] = { min_cgpa: d.min_cgpa, active_backlogs_allowed: d.active_backlogs_allowed };
      });
      setBranchWiseData(m);
    }
  }, [initialData]);

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  const toggleProgram = (id: number) => {
    setSelectedPrograms(prev => {
      const selected = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      if (!prev.includes(id) && !branchWiseData[id]) {
        setBranchWiseData(d => ({ ...d, [id]: { min_cgpa: form.min_cgpa, active_backlogs_allowed: form.active_backlogs_allowed } }));
      }
      return selected;
    });
  };

  const toggleAll = () => {
    if (selectedPrograms.length === programmes.length) {
      setSelectedPrograms([]);
    } else {
      setSelectedPrograms(programmes.map(p => p.id));
    }
  };

  // Toggle all programmes within a single degree group
  const toggleDegree = (degree: string) => {
    const groupIds = programmes.filter(p => p.degree === degree).map(p => p.id);
    const allSelected = groupIds.every(id => selectedPrograms.includes(id));
    if (allSelected) {
      // Deselect all in this group
      setSelectedPrograms(prev => prev.filter(id => !groupIds.includes(id)));
    } else {
      // Select all in this group (add missing ones)
      setSelectedPrograms(prev => Array.from(new Set([...prev, ...groupIds])));
    }
  };

  const handleSave = () => {
    setShowErrors(true);
    // Basic validation
    if (!form.min_cgpa || !form.max_backlogs_allowed || !form.allowed_gender) {
      setValidationError('Please fill out all required global eligibility fields marked with *');
      return;
    }

    if (selectedPrograms.length === 0 && !form.hiring_ma && !form.hiring_phd) {
      setValidationError('Please select at least one eligible program or special hiring interest.');
      return;
    }

    setValidationError('');
    const dept_cgpa = selectedPrograms.map(id => ({
      program_dept_map_id: id,
      min_cgpa: branchWiseData[id]?.min_cgpa || form.min_cgpa || '0',
      active_backlogs_allowed: branchWiseData[id]?.active_backlogs_allowed ?? form.active_backlogs_allowed
    }));

    onSave({
      ...form,
      program_dept_map_ids: selectedPrograms,
      dept_cgpa,
    });
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#660000' }}>
        Eligibility Criteria
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth label="Minimum CGPA *"
            type="number" value={form.min_cgpa}
            onChange={e => set('min_cgpa', e.target.value)}
            inputProps={{ step: 0.1, min: 0, max: 10 }}
            error={showErrors && !form.min_cgpa}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth label="Max Backlogs Allowed *"
            type="number" value={form.max_backlogs_allowed}
            onChange={e => set('max_backlogs_allowed', e.target.value)}
            error={showErrors && !form.max_backlogs_allowed}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth select label="Gender Filter *"
            value={form.allowed_gender}
            onChange={e => set('allowed_gender', e.target.value)}
            error={showErrors && !form.allowed_gender}
          >
            {genderOptions.map(g => (
              <MenuItem key={g} value={g} sx={{ textTransform: 'capitalize' }}>
                {g === 'all' ? 'All Genders' : g.charAt(0).toUpperCase() + g.slice(1)}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth label="Min Class 10 % (optional)"
            type="number" value={form.min_class_10_percent}
            onChange={e => set('min_class_10_percent', e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth label="Min Class 12 % (optional)"
            type="number" value={form.min_class_12_percent}
            onChange={e => set('min_class_12_percent', e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControlLabel
            control={
              <Switch
                checked={form.active_backlogs_allowed}
                onChange={e => set('active_backlogs_allowed', e.target.checked)}
              />
            }
            label="Active Backlogs Allowed"
          />
        </Grid>

        {/* Programme selection */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, mt: 2 }}>
            <Typography variant="body1" sx={{ fontWeight: 700, color: '#660000' }}>
              Eligible Programmes & Branch-wise Criteria
            </Typography>
            <Button size="small" variant="outlined" onClick={toggleAll}>
              {selectedPrograms.length === programmes.length ? 'Deselect All' : 'Select All'}
            </Button>
          </Box>

          <Box>
            {degrees.map(degree => {
              const groupProgs = programmes.filter(p => p.degree === degree);
              const selectedCount = groupProgs.filter(p => selectedPrograms.includes(p.id)).length;
              const allGroupSelected = selectedCount === groupProgs.length;

              return (
                <Accordion
                  key={degree}
                  sx={{
                    mb: 1,
                    border: '1px solid rgba(0,0,0,0.1)',
                    boxShadow: 'none',
                    '&:before': { display: 'none' }
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{ '& .MuiAccordionSummary-content': { alignItems: 'center', gap: 1 } }}
                  >
                    <Typography sx={{ fontWeight: 600, flex: 1 }}>{degree} Programmes</Typography>
                    <Typography sx={{ color: 'text.secondary', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                      ({selectedCount} selected)
                    </Typography>
                    {/* Per-group select toggle — stop propagation so accordion doesn't toggle */}
                    <Box
                      component="span"
                      onClick={e => { e.stopPropagation(); toggleDegree(degree); }}
                      sx={{
                        ml: 1.5,
                        px: 1.5,
                        py: 0.3,
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        border: '1px solid',
                        borderColor: allGroupSelected ? '#7A0000' : '#660000',
                        color: allGroupSelected ? '#7A0000' : '#660000',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        userSelect: 'none',
                        whiteSpace: 'nowrap',
                        background: 'transparent',
                        display: 'inline-flex',
                        alignItems: 'center',
                        '&:hover': {
                          background: allGroupSelected ? 'rgba(198,40,40,0.06)' : 'rgba(0,51,102,0.06)',
                        },
                      }}
                    >
                      {allGroupSelected ? 'Deselect All' : 'Select All'}
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails sx={{ p: 0 }}>
                    {groupProgs
                      .sort((a, b) => a.label.localeCompare(b.label))
                      .map(prog => (
                        <ProgramRow
                          key={prog.id}
                          prog={prog}
                          isSelected={selectedPrograms.includes(prog.id)}
                          bdata={branchWiseData[prog.id] || {
                            min_cgpa: form.min_cgpa,
                            active_backlogs_allowed: form.active_backlogs_allowed
                          }}
                          onToggle={toggleProgram}
                          onBranchDataChange={(id: number, newData: any) =>
                            setBranchWiseData(prev => ({ ...prev, [id]: newData }))
                          }
                        />
                      ))}
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </Box>

          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Note: Selecting a branch automatically applies the global CGPA/Backlog settings. You can then override them individually.
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ mt: 3, p: 3, border: '1px solid #e0e0e0', borderRadius: 2, bgcolor: '#f9f9f9' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: '#660000' }}>
              Special Hiring Interests
            </Typography>
            <Grid container spacing={2}>
              {/* M.A. Question */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, flexGrow: 1 }}>
                    Are you interested in Hiring 2 Year M.A. (Digital Humanities & Social Sciences):
                  </Typography>
                  <FormControlLabel
                    control={<MuiCheckbox checked={form.hiring_ma} onChange={() => set('hiring_ma', true)} />}
                    label={<Typography variant="caption">Yes</Typography>}
                  />
                  <FormControlLabel
                    control={<MuiCheckbox checked={!form.hiring_ma} onChange={() => set('hiring_ma', false)} />}
                    label={<Typography variant="caption">No</Typography>}
                  />
                </Box>
              </Grid>

              {/* Ph.D. Question */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, flexGrow: 1 }}>
                    Are you interested in Hiring Ph.D. Students admitted through GATE/NET:
                  </Typography>
                  <FormControlLabel
                    control={<MuiCheckbox checked={form.hiring_phd} onChange={() => set('hiring_phd', true)} />}
                    label={<Typography variant="caption">Yes</Typography>}
                  />
                  <FormControlLabel
                    control={<MuiCheckbox checked={!form.hiring_phd} onChange={() => set('hiring_phd', false)} />}
                    label={<Typography variant="caption">No</Typography>}
                  />
                </Box>
              </Grid>

              {form.hiring_phd && (
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>
                      If yes, Please specify the required Department name:
                    </Typography>
                    <TextField
                      fullWidth
                      variant="standard"
                      placeholder="Click here to enter text"
                      value={form.phd_departments}
                      onChange={e => set('phd_departments', e.target.value)}
                      sx={{ '& .MuiInputBase-input': { fontSize: '0.8rem' } }}
                    />
                  </Box>
                </Grid>
              )}
            </Grid>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth multiline rows={2}
            label="Additional Eligibility Requirements"
            value={form.additional_text}
            onChange={e => set('additional_text', e.target.value)}
          />
        </Grid>
      </Grid>
      
      {validationError && (
        <Alert severity="error" sx={{ mt: 3, borderRadius: 2 }}>
          {validationError}
        </Alert>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, gap: 2 }}>
        {onBack && (
          <Button variant="outlined" size="large" onClick={onBack}>
            Back
          </Button>
        )}
        <Button
          variant="contained" size="large"
          onClick={handleSave} disabled={saving}
        >
          {saving ? <CircularProgress size={22} color="inherit" /> : 'Save & Continue'}
        </Button>
      </Box>
    </Box>
  );
}