'use client';
import { useState, useEffect } from 'react';
import {
  Box, TextField, Grid, MenuItem, Typography,
  Button, Chip, CircularProgress, Switch, FormControlLabel, Alert
} from '@mui/material';

const locationTypes   = ['onsite', 'remote', 'hybrid'];
const internshipTypes = ['summer', 'winter', 'year-long'];

export default function InternProfileTab({
  saving, onSave, onBack, initialData
}: {
  saving: boolean;
  onSave: (data: any) => void;
  onBack?: () => void;
  initialData?: any;
}) {
  const [form, setForm] = useState({
    internship_title: '', designation: '',
    department_function: '', job_description: '',
    location_type: 'onsite', location_text: '',
    openings_count: '', min_openings: '',
    internship_type: 'summer',
    internship_duration_months: '',
    expected_duration: '', ppo_offered: false,
    ppo_ctc_expected: '', registration_link: '',
    accommodation_provided: false, travel_allowance: false,
    certificate_provided: true, work_from_home_allowed: false,
    additional_info: '', responsibilities: '',
  });

  const [skills, setSkills]    = useState<string[]>([]);
  const [skillInput, setSkill] = useState('');
  const [validationError, setValidationError] = useState('');

  // Pre-fill from initialData (e.g. from a PDF Autofill or saved draft)
  useEffect(() => {
    if (!initialData) return;
    setForm(f => ({
      ...f,
      internship_title:           initialData.internship_title           || f.internship_title,
      designation:                initialData.designation                || f.designation,
      department_function:        initialData.department_function        || f.department_function,
      job_description:            initialData.job_description            || f.job_description,
      responsibilities:           initialData.responsibilities           || f.responsibilities,
      location_type:              initialData.location_type              || f.location_type,
      location_text:              initialData.location_text              || f.location_text,
      openings_count:             initialData.openings_count             ?? f.openings_count,
      min_openings:               initialData.min_openings               ?? f.min_openings,
      internship_type:            initialData.inf_detail?.internship_type || f.internship_type,
      internship_duration_months: initialData.inf_detail?.duration_months   || f.internship_duration_months,
      expected_duration:          initialData.expected_duration          || f.expected_duration,
      ppo_offered:                initialData.inf_detail?.ppo_offered     ?? f.ppo_offered,
      ppo_ctc_expected:          initialData.inf_detail?.ppo_ctc_expected || f.ppo_ctc_expected,
      registration_link:          initialData.registration_link          || f.registration_link,
      accommodation_provided:     initialData.inf_detail?.accommodation_provided ?? f.accommodation_provided,
      travel_allowance:           initialData.inf_detail?.travel_allowance       ?? f.travel_allowance,
      certificate_provided:       initialData.inf_detail?.certificate_provided   ?? f.certificate_provided,
      work_from_home_allowed:    initialData.inf_detail?.work_from_home_allowed || f.work_from_home_allowed,
      additional_info:            initialData.additional_info            || f.additional_info,
    }));
    if (initialData.skills?.length) {
      setSkills(initialData.skills.map((s: any) => s.skill_name));
    }
  }, [initialData]);

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills(s => [...s, skillInput.trim()]);
      setSkill('');
    }
  };

  const handleSave = () => {
    if (!form.internship_title.trim() || !form.job_description.trim() || !String(form.openings_count).trim()) {
      setValidationError('Please fill out all required fields marked with *');
      return;
    }
    setValidationError('');
    onSave({ ...form, skills });
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#003366' }}>
        Internship Profile Details
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth label="Internship Title *"
            value={form.internship_title}
            onChange={e => set('internship_title', e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth label="Job Designation (formal title)"
            value={form.designation}
            onChange={e => set('designation', e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth select label="Internship Type"
            value={form.internship_type}
            onChange={e => set('internship_type', e.target.value)}
          >
            {internshipTypes.map(t => (
              <MenuItem key={t} value={t} sx={{ textTransform: 'capitalize' }}>
                {t}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth label="Duration (months)" type="number"
            value={form.internship_duration_months}
            onChange={e => set('internship_duration_months', e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth label="Expected Duration (e.g. 2 months)"
            value={form.expected_duration}
            onChange={e => set('expected_duration', e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth multiline rows={4}
            label="Internship Description *"
            value={form.job_description}
            onChange={e => set('job_description', e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth multiline rows={3}
            label="Responsibilities"
            value={form.responsibilities}
            onChange={e => set('responsibilities', e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth select label="Work Location Mode"
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
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth label="Location (City)"
            value={form.location_text}
            onChange={e => set('location_text', e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth label="Expected Hires *" type="number"
            value={form.openings_count}
            onChange={e => set('openings_count', e.target.value)}
          />
        </Grid>

        {/* Skills */}
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
                sx={{ background: 'rgba(200,146,42,0.1)', color: '#8A6010' }}
              />
            ))}
          </Box>
        </Grid>

        {/* PPO & Perks */}
        <Grid item xs={12}>
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
            Additional Benefits
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {[
              { k: 'ppo_offered',            label: 'PPO on Performance' },
              { k: 'accommodation_provided', label: 'Accommodation Provided' },
              { k: 'travel_allowance',       label: 'Travel Allowance' },
              { k: 'certificate_provided',   label: 'Certificate Provided' },
              { k: 'work_from_home_allowed', label: 'WFH Allowed' },
            ].map(item => (
              <FormControlLabel
                key={item.k}
                control={
                  <Switch
                    size="small"
                    checked={form[item.k as keyof typeof form] as boolean}
                    onChange={e => set(item.k, e.target.checked)}
                  />
                }
                label={item.label}
              />
            ))}
          </Box>
        </Grid>

        {form.ppo_offered && (
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth label="Expected PPO CTC (Annual)"
              type="number" value={form.ppo_ctc_expected}
              onChange={e => set('ppo_ctc_expected', e.target.value)}
            />
          </Grid>
        )}

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

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mt: 4, gap: 2 }}>
        <Box sx={{ flex: 1, mr: 2 }}>
          {validationError && (
            <Alert severity="error" onClose={() => setValidationError('')}>
              {validationError}
            </Alert>
          )}
        </Box>
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