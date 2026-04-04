'use client';
import { useState } from 'react';
import {
  Box, TextField, Grid, MenuItem, Typography,
  Button, CircularProgress, Switch, FormControlLabel,
} from '@mui/material';

const genderOptions = ['all', 'male', 'female', 'other'];

const programmes = [
  { id: 1,  label: 'B.Tech — Computer Science & Engineering' },
  { id: 2,  label: 'B.Tech — Electrical Engineering' },
  { id: 3,  label: 'B.Tech — Electronics & Communication' },
  { id: 4,  label: 'B.Tech — Mechanical Engineering' },
  { id: 5,  label: 'B.Tech — Civil Engineering' },
  { id: 6,  label: 'B.Tech — Chemical Engineering' },
  { id: 7,  label: 'B.Tech — Mining Engineering' },
  { id: 8,  label: 'B.Tech — Petroleum Engineering' },
  { id: 9,  label: 'M.Tech — CSE' },
  { id: 10, label: 'M.Tech — Data Analytics' },
  { id: 11, label: 'MBA — Business Analytics' },
  { id: 12, label: 'M.Sc — Mathematics & Computing' },
];

export default function EligibilityTab({
  saving, onSave,
}: {
  saving: boolean;
  onSave: (data: any) => void;
}) {
  const [form, setForm] = useState({
    min_cgpa: '', max_backlogs_allowed: '',
    active_backlogs_allowed: false,
    min_class_10_percent: '', min_class_12_percent: '',
    allowed_gender: 'all', additional_text: '',
  });
  const [selectedPrograms, setSelectedPrograms] = useState<number[]>([]);

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  const toggleProgram = (id: number) => {
    setSelectedPrograms(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedPrograms.length === programmes.length) {
      setSelectedPrograms([]);
    } else {
      setSelectedPrograms(programmes.map(p => p.id));
    }
  };

  const handleSave = () => {
    onSave({
      ...form,
      program_dept_map_ids: selectedPrograms,
    });
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#003366' }}>
        Eligibility Criteria
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth label="Minimum CGPA"
            type="number" value={form.min_cgpa}
            onChange={e => set('min_cgpa', e.target.value)}
            inputProps={{ step: 0.1, min: 0, max: 10 }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth label="Max Backlogs Allowed"
            type="number" value={form.max_backlogs_allowed}
            onChange={e => set('max_backlogs_allowed', e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth select label="Gender Filter"
            value={form.allowed_gender}
            onChange={e => set('allowed_gender', e.target.value)}
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
            label="Active Backlogs Allowed?"
          />
        </Grid>

        {/* Programme selection */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              Eligible Programmes & Departments
            </Typography>
            <Button size="small" variant="outlined" onClick={toggleAll}>
              {selectedPrograms.length === programmes.length ? 'Deselect All' : 'Select All'}
            </Button>
          </Box>
          <Grid container spacing={1}>
            {programmes.map(prog => {
              const selected = selectedPrograms.includes(prog.id);
              return (
                <Grid item xs={12} sm={6} md={4} key={prog.id}>
                  <Box
                    onClick={() => toggleProgram(prog.id)}
                    sx={{
                      p: 1.5, borderRadius: 2, cursor: 'pointer',
                      border: selected
                        ? '2px solid #003366'
                        : '1px solid rgba(0,0,0,0.12)',
                      background: selected ? 'rgba(0,51,102,0.07)' : 'white',
                      transition: 'all 0.15s ease',
                      '&:hover': { borderColor: '#003366' },
                    }}
                  >
                    <Typography sx={{
                      fontSize: '0.8rem',
                      fontWeight: selected ? 600 : 400,
                      color: selected ? '#003366' : 'text.primary',
                    }}>
                      {prog.label}
                    </Typography>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
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

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
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