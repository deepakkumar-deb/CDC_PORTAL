'use client';
import { useState, useEffect } from 'react';
import {
  Box, TextField, Grid, MenuItem, Typography,
  Button, Chip, CircularProgress, Alert
} from '@mui/material';

const locationTypes = ['onsite', 'remote', 'hybrid'];

export default function JobDetailsTab({
  saving, onSave, initialData,
}: {
  saving: boolean;
  onSave: (data: any) => void;
  initialData?: any;
}) {
  const [form, setForm] = useState({
    designation: '', department_function: '',
    job_description: '', responsibilities: '',
    location_type: 'onsite', location_text: '',
    openings_count: '', min_openings: '',
    registration_link: '', additional_info: '',
    onboarding_procedure: '',
  });
  const [skills, setSkills]    = useState<string[]>([]);
  const [skillInput, setSkill] = useState('');
  const [locations, setLocations] = useState<string[]>([]);
  const [locationInput, setLocationInput] = useState('');
  const [validationError, setValidationError] = useState('');
  const [showErrors, setShowErrors] = useState(false);

  // Pre-fill from initialData (e.g. from a duplicated JNF)
  useEffect(() => {
    if (!initialData) return;
    setForm({
      designation:        initialData.designation        || '',
      department_function:initialData.department_function|| '',
      job_description:    initialData.job_description    || '',
      responsibilities:   initialData.responsibilities   || '',
      location_type:      initialData.location_type      || 'onsite',
      location_text:      initialData.location_text      || '',
      openings_count:     initialData.openings_count     ?? '',
      min_openings:       initialData.min_openings        ?? '',
      registration_link:  initialData.registration_link  || '',
      additional_info:    initialData.additional_info    || '',
      onboarding_procedure:initialData.onboarding_procedure|| '',
    });
    if (initialData.location_text) {
      setLocations(initialData.location_text.split(',').map((l: string) => l.trim()).filter((l: string) => l));
    }
    if (initialData.skills?.length) {
      setSkills(initialData.skills.map((s: any) => s.skill_name));
    }
  }, [initialData]);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills(s => [...s, skillInput.trim()]);
      setSkill('');
    }
  };

  const addLocation = () => {
    if (locationInput.trim() && !locations.includes(locationInput.trim())) {
      setLocations(s => [...s, locationInput.trim()]);
      setLocationInput('');
    }
  };

  const handleSave = () => {
    setShowErrors(true);
    if (!form.designation.trim() || !form.job_description.trim() || !form.location_type || !String(form.openings_count).trim()) {
      setValidationError('Please fill out all required fields marked with *');
      return;
    }
    setValidationError('');
    onSave({ ...form, location_text: locations.join(', '), skills });
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
            error={showErrors && !form.designation.trim()}
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
            error={showErrors && !form.job_description.trim()}
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
          <Box sx={{ display: 'flex', gap: 1, mb: 1, mt: 0.5 }}>
            <TextField
              size="small" label="Place of Posting / Job Location" value={locationInput}
              onChange={e => setLocationInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addLocation()}
              sx={{ flex: 1 }}
              placeholder="e.g. Mumbai, Bangalore"
            />
            <Button variant="outlined" onClick={addLocation} sx={{ height: 40 }}>Add</Button>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {locations.map((loc, idx) => (
              <Chip
                key={`loc-${idx}`} label={loc} size="small"
                onDelete={() => setLocations(s => s.filter(x => x !== loc))}
                sx={{ background: 'rgba(0,51,102,0.08)', color: '#003366' }}
              />
            ))}
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth type="number" label="Expected Hires *"
            value={form.openings_count}
            onChange={e => set('openings_count', e.target.value)}
            error={showErrors && !String(form.openings_count).trim()}
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
          <Box sx={{ display: 'flex', gap: 1, mb: 1.5, mt: 1 }}>
            <TextField
              size="small" label="Required Skills (Add multiple)" value={skillInput}
              onChange={e => setSkill(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addSkill()}
              sx={{ flex: 1 }}
              placeholder="e.g. Python, Java"
            />
            <Button variant="outlined" onClick={addSkill} sx={{ height: 40 }}>Add</Button>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {skills.map((skill, idx) => (
              <Chip
                key={`skill-${idx}`} label={skill} size="small"
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
            helperText={`${form.additional_info?.length || 0}/1000`}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth multiline rows={3}
            label="Onboarding / Joining Procedure"
            value={form.onboarding_procedure}
            onChange={e => set('onboarding_procedure', e.target.value)}
            helperText="Provide details about the onboarding process"
          />
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4 }}>
        <Box sx={{ flex: 1, mr: 2 }}>
          {validationError && (
            <Alert severity="error" onClose={() => setValidationError('')}>
              {validationError}
            </Alert>
          )}
        </Box>
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