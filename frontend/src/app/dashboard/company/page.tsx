'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  Box, Card, CardContent, Typography, TextField,
  Button, Grid, CircularProgress, Alert, Avatar,
  Divider, Chip,
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import DashboardLayout from '@/components/layout/DashboardLayout';
import api from '@/lib/api';

export default function CompanyProfilePage() {
  const { status } = useSession();
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [hasProfile, setHasProfile] = useState(false);

  const [form, setForm] = useState({
    company_name: '',
    website: '',
    industry: '',
    company_type: '',
    about_company: '',
    city: '',
    state: '',
    country: 'India',
    linkedin_url: '',
    no_of_employees: '',
  });

  const [contacts, setContacts] = useState([
    { contact_type: 'head_hr', contact_name: '', email: '', phone: '', designation: '' },
    { contact_type: 'poc1', contact_name: '', email: '', phone: '', designation: '' },
    { contact_type: 'poc2', contact_name: '', email: '', phone: '', designation: '' },
  ]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/company');
        setForm(res.data.company);
        setContacts(res.data.company.contacts || contacts);
        setHasProfile(true);
      } catch {
        setHasProfile(false);
      } finally {
        setLoading(false);
      }
    };
    if (status === 'authenticated') fetchProfile();
  }, [status]);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const setContact = (idx: number, k: string, v: string) => {
    setContacts(prev => prev.map((c, i) => i === idx ? { ...c, [k]: v } : c));
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      if (hasProfile) {
        await api.post('/company/update', { ...form, contacts });
        setSuccess('Company profile updated successfully.');
      } else {
        await api.post('/company', { ...form, contacts });
        setSuccess('Company profile created successfully.');
        setHasProfile(true);
      }
      setEditing(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
          <CircularProgress />
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ width: 56, height: 56, background: '#003366' }}>
            <BusinessIcon sx={{ fontSize: 32 }} />
          </Avatar>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#003366' }}>
              Company Profile
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {hasProfile ? 'Manage your company information' : 'Complete your profile to post jobs'}
            </Typography>
          </Box>
        </Box>
        {hasProfile && !editing && (
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => setEditing(true)}
          >
            Edit Profile
          </Button>
        )}
      </Box>

      {/* Alerts */}
      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>{success}</Alert>}

      {/* Company Details Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#003366' }}>
            Company Information
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Company Name *"
                value={form.company_name}
                onChange={e => set('company_name', e.target.value)}
                disabled={!editing && hasProfile}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Website"
                value={form.website}
                onChange={e => set('website', e.target.value)}
                disabled={!editing && hasProfile}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Industry"
                value={form.industry}
                onChange={e => set('industry', e.target.value)}
                disabled={!editing && hasProfile}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Company Type"
                value={form.company_type}
                onChange={e => set('company_type', e.target.value)}
                disabled={!editing && hasProfile}
                placeholder="e.g., Startup, MNC, PSU"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="About Company"
                value={form.about_company}
                onChange={e => set('about_company', e.target.value)}
                disabled={!editing && hasProfile}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="City"
                value={form.city}
                onChange={e => set('city', e.target.value)}
                disabled={!editing && hasProfile}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="State"
                value={form.state}
                onChange={e => set('state', e.target.value)}
                disabled={!editing && hasProfile}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Country"
                value={form.country}
                onChange={e => set('country', e.target.value)}
                disabled={!editing && hasProfile}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="LinkedIn URL"
                value={form.linkedin_url}
                onChange={e => set('linkedin_url', e.target.value)}
                disabled={!editing && hasProfile}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Number of Employees"
                value={form.no_of_employees}
                onChange={e => set('no_of_employees', e.target.value)}
                disabled={!editing && hasProfile}
                placeholder="e.g., 100-500"
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Contact Details Card */}
      <Card>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#003366' }}>
            Contact Details
          </Typography>
          {contacts.map((contact, idx) => (
            <Box key={idx} sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Chip
                  label={
                    contact.contact_type === 'head_hr'
                      ? 'Head HR'
                      : contact.contact_type === 'poc1'
                      ? 'Point of Contact 1'
                      : 'Point of Contact 2'
                  }
                  color="primary"
                  size="small"
                />
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Full Name *"
                    value={contact.contact_name}
                    onChange={e => setContact(idx, 'contact_name', e.target.value)}
                    disabled={!editing && hasProfile}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Designation"
                    value={contact.designation}
                    onChange={e => setContact(idx, 'designation', e.target.value)}
                    disabled={!editing && hasProfile}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Email *"
                    type="email"
                    value={contact.email}
                    onChange={e => setContact(idx, 'email', e.target.value)}
                    disabled={!editing && hasProfile}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Phone"
                    value={contact.phone}
                    onChange={e => setContact(idx, 'phone', e.target.value)}
                    disabled={!editing && hasProfile}
                  />
                </Grid>
              </Grid>
              {idx < contacts.length - 1 && <Divider sx={{ mt: 3 }} />}
            </Box>
          ))}
        </CardContent>
      </Card>

      {/* Save Button */}
      {(editing || !hasProfile) && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
          {editing && (
            <Button
              variant="outlined"
              onClick={() => setEditing(false)}
              disabled={saving}
            >
              Cancel
            </Button>
          )}
          <Button
            variant="contained"
            size="large"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? <CircularProgress size={22} color="inherit" /> : 'Save Profile'}
          </Button>
        </Box>
      )}
    </DashboardLayout>
  );
}