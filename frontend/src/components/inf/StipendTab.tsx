'use client';
import { useState } from 'react';
import {
  Box, TextField, Grid, Typography, Button,
  MenuItem, CircularProgress, Divider, IconButton,
} from '@mui/material';
import AddIcon    from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const programmes = ['btech_dual', 'mtech', 'mba', 'msc', 'phd'];
const programmeLabels: Record<string, string> = {
  btech_dual: 'B.Tech / Dual / Int. M.Tech',
  mtech: 'M.Tech', mba: 'MBA',
  msc: 'M.Sc / M.Sc.Tech', phd: 'Ph.D',
};
const currencies = ['INR', 'USD', 'EUR'];

const emptyRow = (pt: string) => ({
  programme_type: pt, currency: 'INR',
  base_stipend: '', hra_housing: '',
  variable_pay: '', other_allowance: '',
  total_stipend: '',
});

export default function StipendTab({
  saving, onSave, initialData
}: {
  saving: boolean;
  onSave: (data: any) => void;
  initialData?: any;
}) {
  const [rows, setRows] = useState(programmes.map(p => emptyRow(p)));
  const [perks, setPerks] = useState<
    { programme_type: string; perk_label: string; perk_value: string }[]
  >([]);

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
    onSave({ stipend_breakdowns: rows, perks });
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#003366' }}>
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
              { k: 'base_stipend',   label: 'Base Stipend (Monthly)' },
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
                />
              </Grid>
            ))}
          </Grid>

          {i < rows.length - 1 && <Divider sx={{ mt: 3 }} />}
        </Box>
      ))}

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

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
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