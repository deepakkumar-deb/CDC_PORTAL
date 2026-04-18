'use client';
import { useState, useEffect } from 'react';
import {
  Box, TextField, Grid, Typography, Button,
  MenuItem, CircularProgress, Divider, IconButton, Alert,
} from '@mui/material';
import AddIcon    from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const programmes = ['btech_dual', 'mtech', 'mba', 'msc', 'phd'];
const programmeLabels: Record<string, string> = {
  btech_dual: 'B.Tech / Dual / Int. M.Tech',
  mtech: 'M.Tech', mba: 'MBA',
  msc: 'M.Sc / M.Sc.Tech', 
  ma: 'M.A. (DHSS)',
  phd: 'Ph.D',
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
  base_stipend: '', hra_housing: '',
  variable_pay: '', other_allowance: '',
  total_stipend: '',
});

export default function StipendTab({
  saving, onSave, onBack, initialData
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
  const [perks, setPerks] = useState<
    { programme_type: string; perk_label: string; perk_value: string }[]
  >([]);

  // Fetch programs to map IDs back to degrees
  const [allPrograms, setAllPrograms] = useState<any[]>([]);

  useEffect(() => {
    // This matches the mapping in SalaryTab
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
      const existing = initialData.inf_stipend_breakdowns?.find((r: any) => r.programme_type === pt);
      return existing ? { ...existing } : emptyRow(pt);
    }));

    if (initialData.inf_compensation_perks?.length) {
      setPerks(initialData.inf_compensation_perks.map((p: any) => ({
        programme_type: p.programme_type,
        perk_label:     p.perk_label || '',
        perk_value:     p.perk_value || '',
      })));
    }
  }, [initialData, allPrograms]);

  const setRow = (i: number, k: string, v: string) => {
    setRows(prev => prev.map((r, idx) =>
      idx === i ? { ...r, [k]: v } : r
    ));
  };

  const addPerk = () => {
    setPerks(p => [...p, {
      programme_type: 'btech_dual',
      perk_label: '', perk_value: '',
    }]);
  };

  const setPerk = (i: number, k: string, v: string) => {
    setPerks(prev => prev.map((p, idx) =>
      idx === i ? { ...p, [k]: v } : p
    ));
  };

  const removePerk = (i: number) => {
    setPerks(p => p.filter((_, idx) => idx !== i));
  };

  const handleSave = () => {
    setShowErrors(true);
    // Validation: Base stipend is required for all active rows
    for (const row of rows) {
      if (!String(row.base_stipend).trim()) {
        setValidationError(`Please fill in the Base Stipend for ${programmeLabels[row.programme_type] || row.programme_type}`);
        return;
      }
    }
    setValidationError('');
    onSave({ stipend_breakdowns: rows, perks });
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#660000' }}>
        Stipend Details
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Fill stipend details per programme. Leave blank if not applicable.
      </Typography>

      {rows.map((row, i) => (
        <Box key={row.programme_type} sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Box sx={{
              px: 2, py: 0.5, borderRadius: 1,
              background: '#C8922A', color: 'white',
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
            {[
              { k: 'base_stipend',   label: 'Base Stipend (Monthly) *' },
              { k: 'hra_housing',    label: 'HRA / Housing Allowance' },
              { k: 'variable_pay',   label: 'Variable / Performance Pay' },
              { k: 'other_allowance',label: 'Other Allowance' },
              { k: 'total_stipend',  label: 'Total Monthly Stipend' },
            ].map(field => (
              <Grid item xs={12} sm={6} md={4} key={field.k}>
                <TextField
                  fullWidth size="small"
                  label={field.label} type="number"
                  value={row[field.k as keyof typeof row]}
                  onChange={e => setRow(i, field.k, e.target.value)}
                  error={showErrors && field.k === 'base_stipend' && !String(row.base_stipend).trim()}
                />
              </Grid>
            ))}
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

      <Divider sx={{ mb: 3 }} />

      {/* Custom Perks */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="body1" sx={{ fontWeight: 600 }}>
          Other Compensation & Perks
        </Typography>
        <Button startIcon={<AddIcon />} size="small" variant="outlined" onClick={addPerk}>
          Add Perk
        </Button>
      </Box>

      {perks.map((perk, i) => (
        <Box key={i} sx={{ display: 'flex', gap: 2, mb: 1.5, alignItems: 'center' }}>
          <TextField
            select size="small" label="Programme"
            value={perk.programme_type}
            onChange={e => setPerk(i, 'programme_type', e.target.value)}
            sx={{ width: 180 }}
          >
            {programmes.map(p => (
              <MenuItem key={p} value={p}>{programmeLabels[p]}</MenuItem>
            ))}
          </TextField>
          <TextField
            size="small" label="Perk Label" value={perk.perk_label}
            onChange={e => setPerk(i, 'perk_label', e.target.value)}
            sx={{ flex: 1 }}
          />
          <TextField
            size="small" label="Value / Details" value={perk.perk_value}
            onChange={e => setPerk(i, 'perk_value', e.target.value)}
            sx={{ flex: 1 }}
          />
          <IconButton size="small" color="error" onClick={() => removePerk(i)}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ))}

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, gap: 2 }}>
        {onBack && (
          <Button variant="outlined" size="large" onClick={onBack}>
            Back
          </Button>
        )}
        <Button
          variant="contained" size="large"
          onClick={handleSave} disabled={saving}
          sx={{ background: '#C8922A', '&:hover': { background: '#A0721A' } }}
        >
          {saving ? <CircularProgress size={22} color="inherit" /> : 'Save & Continue'}
        </Button>
      </Box>
    </Box>
  );
}