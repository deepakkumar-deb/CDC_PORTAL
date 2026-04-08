'use client';
import { useState, useEffect } from 'react';
import {
  Box, TextField, Grid, Typography, Button,
  MenuItem, CircularProgress, Divider,
} from '@mui/material';

const programmes = [
  'btech_dual', 'mtech', 'mba', 'msc', 'phd',
];

const programmeLabels: Record<string, string> = {
  btech_dual: 'B.Tech / Dual / Int. M.Tech',
  mtech:      'M.Tech',
  mba:        'MBA',
  msc:        'M.Sc / M.Sc.Tech',
  phd:        'Ph.D',
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
  const [rows, setRows] = useState(
    programmes.map(p => emptyRow(p))
  );

  // Pre-fill from initialData (duplicated JNF)
  useEffect(() => {
    if (!initialData?.salary_breakdowns?.length) return;
    setRows(programmes.map(pt => {
      const existing = initialData.salary_breakdowns.find((r: any) => r.programme_type === pt);
      if (!existing) return emptyRow(pt);
      return {
        programme_type:   existing.programme_type,
        currency:         existing.currency         || 'INR',
        ctc_annual:       existing.ctc_annual        ?? '',
        base_fixed:       existing.base_fixed        ?? '',
        monthly_takehome: existing.monthly_takehome  ?? '',
        gross_salary:     existing.gross_salary      ?? '',
        joining_bonus:    existing.joining_bonus     ?? '',
        relocation_allowance: existing.relocation_allowance ?? '',
        medical_allowance: existing.medical_allowance ?? '',
        retention_bonus:  existing.retention_bonus   ?? '',
        first_year_ctc:   existing.first_year_ctc    ?? '',
        variable_performance_bonus: existing.variable_performance_bonus ?? '',
        esop_value:       existing.esop_value        ?? '',
        vest_period:      existing.vest_period       ?? '',
        stocks_options:   existing.stocks_options    ?? '',
        bond_required:    existing.bond_required     ?? false,
        bond_amount:      existing.bond_amount       ?? '',
        bond_duration_months: existing.bond_duration_months ?? '',
        bond_details:     existing.bond_details      ?? '',
        deductions_text:  existing.deductions_text   ?? '',
        ctc_breakup_notes:existing.ctc_breakup_notes || '',
      };
    }));
  }, [initialData]);

  const setRow = (index: number, key: string, value: any) => {
    setRows(prev => prev.map((r, i) =>
      i === index ? { ...r, [key]: value } : r
    ));
  };

  const handleSave = () => {
    onSave({ salary_breakdowns: rows });
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#003366' }}>
        Salary Details
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Fill salary details for each programme you are recruiting from.
        Leave blank if not applicable.
      </Typography>

      {rows.map((row, i) => (
        <Box key={row.programme_type} sx={{ mb: 4 }}>
          <Box sx={{
            display: 'flex', alignItems: 'center', gap: 2, mb: 2,
          }}>
            <Box sx={{
              px: 2, py: 0.5, borderRadius: 1,
              background: '#003366', color: 'white',
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
                fullWidth size="small" label="CTC (Annual)"
                type="number" value={row.ctc_annual}
                onChange={e => setRow(i, 'ctc_annual', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth size="small" label="Base / Fixed"
                type="number" value={row.base_fixed}
                onChange={e => setRow(i, 'base_fixed', e.target.value)}
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