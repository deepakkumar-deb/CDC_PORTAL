'use client';
import { useState, useEffect } from 'react';
import {
  Box, TextField, Grid, Typography, Button,
  MenuItem, CircularProgress, Divider, Alert,
} from '@mui/material';

const programmes = [
  'btech_dual', 'mtech', 'mba', 'msc', 'phd',
];

const programmeLabels: Record<string, string> = {
  btech_dual: 'B.Tech / Dual / Int. M.Tech',
  mtech:      'M.Tech',
  mba:        'MBA',
  msc:        'M.Sc / M.Sc.Tech',
  ma:         'M.A. (DHSS)',
  phd:        'Ph.D',
};

const DEGREE_TO_SALARY_MAP: Record<string, string> = {
  'JEE Advanced: B.Tech / Dual Degree (4/5 Yr)': 'btech_dual',
  'JEE Advanced: Integrated M.Tech (5 Yr)': 'btech_dual',
  'GATE: M.Tech (2 Yr)': 'mtech',
  'JAM: M.Sc. Tech (3 Yr)': 'msc',
  'CAT: MBA (2 Yr)': 'mba',
  'JAM: M.Sc (2 Yr)': 'msc',
};

const currencies = ['INR', 'USD', 'EUR'];

const emptyRow = (pt: string) => ({
  programme_type: pt, currency: 'INR',
  ctc_annual: '', base_fixed: '',
  monthly_takehome: '', gross_salary: '', joining_bonus: '',
  relocation_allowance: '', medical_allowance: '', retention_bonus: '',
  first_year_ctc: '', variable_performance_bonus: '',
  esop_value: '', vest_period: '', stocks_options: '',
  bond_required: false, bond_amount: '', bond_duration_months: '', bond_details: '',
  deductions_text: '', ctc_breakup_notes: '',
});

export default function SalaryTab({
  saving, onSave, onBack, initialData,
}: {
  saving: boolean;
  onSave: (data: any) => void;
  onBack?: () => void;
  initialData?: any;
}) {
  const [rows, setRows] = useState<any[]>([]);
  const [activeProgrammeTypes, setActiveProgrammeTypes] = useState<string[]>([]);
  const [validationError, setValidationError] = useState('');
  const [showErrors, setShowErrors] = useState(false);

  // Fetch programs to map IDs back to degrees
  const [allPrograms, setAllPrograms] = useState<any[]>([]);

  useEffect(() => {
    const defaultProgs = [
      { id: 1,  degree: 'JEE Advanced: B.Tech / Dual Degree (4/5 Yr)' },
      { id: 2,  degree: 'JEE Advanced: B.Tech / Dual Degree (4/5 Yr)' },
      { id: 3,  degree: 'JEE Advanced: B.Tech / Dual Degree (4/5 Yr)' },
      { id: 4,  degree: 'JEE Advanced: B.Tech / Dual Degree (4/5 Yr)' },
      { id: 5,  degree: 'JEE Advanced: B.Tech / Dual Degree (4/5 Yr)' },
      { id: 6,  degree: 'JEE Advanced: B.Tech / Dual Degree (4/5 Yr)' },
      { id: 7,  degree: 'JEE Advanced: B.Tech / Dual Degree (4/5 Yr)' },
      { id: 8,  degree: 'JEE Advanced: B.Tech / Dual Degree (4/5 Yr)' },
      { id: 9,  degree: 'JEE Advanced: B.Tech / Dual Degree (4/5 Yr)' },
      { id: 10, degree: 'JEE Advanced: B.Tech / Dual Degree (4/5 Yr)' },
      { id: 11, degree: 'JEE Advanced: B.Tech / Dual Degree (4/5 Yr)' },
      { id: 12, degree: 'JEE Advanced: B.Tech / Dual Degree (4/5 Yr)' },
      { id: 13, degree: 'JEE Advanced: B.Tech / Dual Degree (4/5 Yr)' },
      { id: 52, degree: 'JEE Advanced: Integrated M.Tech (5 Yr)' },
      { id: 31, degree: 'JEE Advanced: Integrated M.Tech (5 Yr)' },
      { id: 32, degree: 'JEE Advanced: Integrated M.Tech (5 Yr)' },
      { id: 33, degree: 'GATE: M.Tech (2 Yr)' },
      { id: 14, degree: 'GATE: M.Tech (2 Yr)' },
      { id: 34, degree: 'GATE: M.Tech (2 Yr)' },
      { id: 15, degree: 'GATE: M.Tech (2 Yr)' },
      { id: 16, degree: 'GATE: M.Tech (2 Yr)' },
      { id: 35, degree: 'GATE: M.Tech (2 Yr)' },
      { id: 36, degree: 'GATE: M.Tech (2 Yr)' },
      { id: 37, degree: 'GATE: M.Tech (2 Yr)' },
      { id: 38, degree: 'GATE: M.Tech (2 Yr)' },
      { id: 39, degree: 'GATE: M.Tech (2 Yr)' },
      { id: 40, degree: 'GATE: M.Tech (2 Yr)' },
      { id: 19, degree: 'GATE: M.Tech (2 Yr)' },
      { id: 41, degree: 'GATE: M.Tech (2 Yr)' },
      { id: 42, degree: 'GATE: M.Tech (2 Yr)' },
      { id: 43, degree: 'GATE: M.Tech (2 Yr)' },
      { id: 25, degree: 'GATE: M.Tech (2 Yr)' },
      { id: 44, degree: 'GATE: M.Tech (2 Yr)' },
      { id: 45, degree: 'GATE: M.Tech (2 Yr)' },
      { id: 46, degree: 'GATE: M.Tech (2 Yr)' },
      { id: 47, degree: 'GATE: M.Tech (2 Yr)' },
      { id: 22, degree: 'GATE: M.Tech (2 Yr)' },
      { id: 48, degree: 'GATE: M.Tech (2 Yr)' },
      { id: 49, degree: 'GATE: M.Tech (2 Yr)' },
      { id: 24, degree: 'GATE: M.Tech (2 Yr)' },
      { id: 50, degree: 'JAM: M.Sc. Tech (3 Yr)' },
      { id: 51, degree: 'JAM: M.Sc. Tech (3 Yr)' },
      { id: 27, degree: 'CAT: MBA (2 Yr)' },
      { id: 26, degree: 'CAT: MBA (2 Yr)' },
      { id: 30, degree: 'JAM: M.Sc (2 Yr)' },
      { id: 29, degree: 'JAM: M.Sc (2 Yr)' },
      { id: 28, degree: 'JAM: M.Sc (2 Yr)' },
    ];
    setAllPrograms(defaultProgs);
  }, []);

  // Determine active programme types based on Eligibility Tab selections
  useEffect(() => {
    if (!initialData) return;
    
    const activeTypes = new Set<string>();
    
    // Check selected branches
    const selectedIds = initialData.program_dept_map_ids || [];
    selectedIds.forEach((id: number) => {
      const prog = allPrograms.find(p => p.id === id);
      if (prog && DEGREE_TO_SALARY_MAP[prog.degree]) {
        activeTypes.add(DEGREE_TO_SALARY_MAP[prog.degree]);
      }
    });

    // Check special hiring
    if (initialData.hiring_ma) activeTypes.add('ma');
    if (initialData.hiring_phd) activeTypes.add('phd');

    const typeList = Array.from(activeTypes);
    setActiveProgrammeTypes(typeList);

    // Initialize or re-filter rows
    setRows(typeList.map(pt => {
      const existing = initialData.salary_breakdowns?.find((r: any) => r.programme_type === pt);
      return existing ? { ...existing } : emptyRow(pt);
    }));
  }, [initialData, allPrograms]);

  const setRow = (index: number, key: string, value: any) => {
    setRows(prev => prev.map((r, i) =>
      i === index ? { ...r, [key]: value } : r
    ));
  };

  const applyGlobal = (key: string, value: any) => {
    setRows(prev => prev.map(r => ({ ...r, [key]: value })));
  };

  const [globalVals, setGlobalVals] = useState<any>({
    ctc_annual: '', base_fixed: '', monthly_takehome: '', gross_salary: '',
  });

  const handleApplyAll = () => {
    setRows(prev => prev.map(r => ({ ...r, ...globalVals })));
  };

  const handleSave = () => {
    setShowErrors(true);
    // Validation: CTC and Base are required for all active rows
    for (const row of rows) {
      if (!String(row.ctc_annual).trim() || !String(row.base_fixed).trim()) {
        setValidationError(`Please fill in CTC and Base Salary for ${programmeLabels[row.programme_type] || row.programme_type}`);
        return;
      }
    }
    setValidationError('');
    onSave({ salary_breakdowns: rows });
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#660000' }}>
        Salary Details
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Fill salary details for each programme you are recruiting from.
        Leave blank if not applicable.
      </Typography>

      {/* Global Salary Setter */}
      <Box sx={{ 
        p: 2, mb: 4, borderRadius: 2, 
        border: '1px dashed #660000',
        background: 'rgba(0,51,102,0.02)'
      }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: '#660000' }}>
          Global Salary Setter (Apply to all courses)
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3}>
            <TextField 
              fullWidth size="small" label="Global CTC *" 
              type="number" value={globalVals.ctc_annual}
              onChange={e => setGlobalVals({...globalVals, ctc_annual: e.target.value})}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField 
              fullWidth size="small" label="Global Base *" 
              type="number" value={globalVals.base_fixed}
              onChange={e => setGlobalVals({...globalVals, base_fixed: e.target.value})}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField 
              fullWidth size="small" label="Global Take-home" 
              type="number" value={globalVals.monthly_takehome}
              onChange={e => setGlobalVals({...globalVals, monthly_takehome: e.target.value})}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Button 
              fullWidth variant="contained" 
              onClick={handleApplyAll}
              sx={{ background: '#660000', height: 40 }}
            >
              Apply to All
            </Button>
          </Grid>
        </Grid>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          Tip: You can set values here once and click "Apply" to fill all rows below.
        </Typography>
      </Box>

      <Divider sx={{ mb: 4 }} />

      {rows.map((row, i) => (
        <Box key={row.programme_type} sx={{ mb: 4 }}>
          <Box sx={{
            display: 'flex', alignItems: 'center', gap: 2, mb: 2,
          }}>
            <Box sx={{
              px: 2, py: 0.5, borderRadius: 1,
              background: '#660000', color: 'white',
              fontSize: '0.8rem', fontWeight: 600,
            }}>
              {programmeLabels[row.programme_type]}
            </Box>
            <TextField
              select size="small" label="Currency"
              value={row.currency}
              onChange={e => setRow(i, 'currency', e.target.value)}
              sx={{ width: 100 }}
            >
              {currencies.map(c => (
                <MenuItem key={c} value={c}>{c}</MenuItem>
              ))}
            </TextField>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth size="small" label="CTC (Annual) *"
                type="number" value={row.ctc_annual}
                onChange={e => setRow(i, 'ctc_annual', e.target.value)}
                error={showErrors && !String(row.ctc_annual).trim()}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth size="small" label="Base / Fixed *"
                type="number" value={row.base_fixed}
                onChange={e => setRow(i, 'base_fixed', e.target.value)}
                error={showErrors && !String(row.base_fixed).trim()}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth size="small" label="Monthly Take-home"
                type="number" value={row.monthly_takehome}
                onChange={e => setRow(i, 'monthly_takehome', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth size="small" label="Gross Salary"
                type="number" value={row.gross_salary}
                onChange={e => setRow(i, 'gross_salary', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth size="small" label="Joining Bonus"
                type="number" value={row.joining_bonus}
                onChange={e => setRow(i, 'joining_bonus', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth size="small" label="Relocation Allowance"
                type="number" value={row.relocation_allowance}
                onChange={e => setRow(i, 'relocation_allowance', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth size="small" label="Medical Allowance"
                type="number" value={row.medical_allowance}
                onChange={e => setRow(i, 'medical_allowance', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth size="small" label="Retention Bonus"
                type="number" value={row.retention_bonus}
                onChange={e => setRow(i, 'retention_bonus', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth size="small" label="Variable / Perf. Bonus"
                type="number" value={row.variable_performance_bonus}
                onChange={e => setRow(i, 'variable_performance_bonus', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth size="small" label="First Year CTC"
                type="number" value={row.first_year_ctc}
                onChange={e => setRow(i, 'first_year_ctc', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth size="small" label="ESOP Value"
                type="number" value={row.esop_value}
                onChange={e => setRow(i, 'esop_value', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth size="small" label="Vest Period"
                value={row.vest_period}
                onChange={e => setRow(i, 'vest_period', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth size="small" label="Stocks/Options Details"
                value={row.stocks_options}
                onChange={e => setRow(i, 'stocks_options', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth size="small" label="Bond Amount"
                type="number" value={row.bond_amount}
                onChange={e => setRow(i, 'bond_amount', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth size="small" label="Bond Duration (months)"
                type="number" value={row.bond_duration_months}
                onChange={e => setRow(i, 'bond_duration_months', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth size="small" label="Bond Details"
                value={row.bond_details}
                onChange={e => setRow(i, 'bond_details', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth size="small" label="Deductions"
                value={row.deductions_text}
                onChange={e => setRow(i, 'deductions_text', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <TextField
                fullWidth size="small" label="CTC Breakup Notes"
                value={row.ctc_breakup_notes}
                onChange={e => setRow(i, 'ctc_breakup_notes', e.target.value)}
              />
            </Grid>
          </Grid>

          {i < rows.length - 1 && <Divider sx={{ mt: 3 }} />}
        </Box>
      ))}

      {rows.length === 0 && (
        <Alert severity="info" sx={{ mb: 4, borderRadius: 2 }}>
          No programs selected in the Eligibility tab. Please go back and select eligible branches or special hiring interests first.
        </Alert>
      )}

      {validationError && (
        <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>
          {validationError}
        </Alert>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 2 }}>
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