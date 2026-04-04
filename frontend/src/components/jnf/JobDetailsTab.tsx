'use client';
import { useState } from 'react';
import {
  Box, TextField, Grid, MenuItem, Typography,
  Button, Chip, CircularProgress,
} from '@mui/material';

const locationTypes = ['onsite', 'remote', 'hybrid'];

export default function JobDetailsTab({
  saving, onSave,
}: {
  saving: boolean;
  onSave: (data: any) => void;
}) {
  const [form, setForm] = useState({
    designation: '', department_function: '',
    job_description: '', responsibilities: '',
    location_type: 'onsite', location_text: '',
    openings_count: '', min_openings: '',
    registration_link: '', additional_info: '',
  });
  const [skills, setSkills]     = useState<string[]>([]);
  const [skillInput, setSkill]  = useState('');

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills(s => [...s, skillInput.trim()]);
      setSkill('');
    }
  };

  const handleSave = () => {
    onSave({ ...form, skills });
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#003366' }}>
        Job Profile Details
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth label="Job Designation / Title *"
            value={form.designation}
            onChange={e => set('designation', e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth label="Department / Function"
            value={form.department_function}
            onChange={e => set('department_function', e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth multiline rows={4}
            label="Job Description *"
            value={form.job_description}
            onChange={e => set('job_description', e.target.value)}
            helperText="Describe the role, responsibilities, and expectations"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth multiline rows={3}
            label="Key Responsibilities"
            value={form.responsibilities}
            onChange={e => set('responsibilities', e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth select label="Work Location Mode *"
            value={form.location_type}
            onChange={e => set('location_type', e.target.value)}
          >
            {locationTypes.map(t => (
              <MenuItem key={t} value={t} sx={{ textTransform: 'capitalize' }}>
                {t}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} md={8}>
          <TextField
            fullWidth label="Location (City / State)"
            value={form.location_text}
            onChange={e => set('location_text', e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth type="number" label="Expected Hires *"
            value={form.openings_count}
            onChange={e => set('openings_count', e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth type="number" label="Minimum Hires"
            value={form.min_openings}
            onChange={e => set('min_openings', e.target.value)}
          />
        </Grid>

        {/* Skills chip input */}
        <Grid item xs={12}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
            Required Skills
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 1.5 }}>
            <TextField
              size="small" label="Add skill" value={skillInput}
              onChange={e => setSkill(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addSkill()}
              sx={{ flex: 1 }}
            />
            <Button variant="outlined" onClick={addSkill}>Add</Button>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {skills.map(skill => (
              <Chip
                key={skill} label={skill} size="small"
                onDelete={() => setSkills(s => s.filter(x => x !== skill))}
                sx={{ background: 'rgba(0,51,102,0.08)', color: '#003366' }}
              />
            ))}
          </Box>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth label="Registration Link (optional)"
            value={form.registration_link}
            onChange={e => set('registration_link', e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth multiline rows={2}
            label="Additional Information"
            value={form.additional_info}
            onChange={e => set('additional_info', e.target.value)}
            inputProps={{ maxLength: 1000 }}
            helperText={`${form.additional_info.length}/1000`}
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