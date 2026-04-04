'use client';
import { useState } from 'react';
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
  monthly_takehome: '', joining_bonus: '',
  esop_value: '', bond_required: false,
  bond_amount: '', bond_duration_months: '',
  ctc_breakup_notes: '',
});

export default function SalaryTab({
  saving, onSave,
}: {
  saving: boolean;
  onSave: (data: any) => void;
}) {
  const [rows, setRows] = useState(
    programmes.map(p => emptyRow(p))
  );

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
                fullWidth size="small" label="Joining Bonus"
                type="number" value={row.joining_bonus}
                onChange={e => setRow(i, 'joining_bonus', e.target.value)}
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
            <Grid item xs={12} md={9}>
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

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
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