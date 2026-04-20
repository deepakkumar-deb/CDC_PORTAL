'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  Box, Card, CardContent, TextField, Button,
  Typography, Alert, CircularProgress, Divider, Grid,
  Avatar, Paper, MenuItem, Select, InputLabel, FormControl, IconButton
} from '@mui/material';
import { Person, Email, Work, Phone, PhotoCamera } from '@mui/icons-material';
import api from '@/lib/api';
import DashboardLayout from "@/components/layout/DashboardLayout";
import { STD_CODES } from '@/constants/countries';

export default function ProfilePage() {
  const { update } = useSession();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    designation: '',
    std_code: '+91',
    phone: '',
    role: '',
    profile_picture: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/auth/me');
      if (res.data.success) {
        const u = res.data.user;
        setFormData({
          name: u.name || '',
          email: u.email || '',
          designation: u.designation || '',
          std_code: u.std_code || '+91',
          phone: u.phone || '',
          role: u.role || '',
          profile_picture: u.profile_picture || ''
        });
      }
    } catch (err) {
      console.error('Failed to fetch profile', err);
      setError('Could not load profile details.');
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await api.post('/auth/update-profile', formData);
      if (res.data.success) {
        setSuccess('Profile updated successfully!');
        setFormData(res.data.user);
        // Sync with security session
        update({ 
          name: res.data.user.name, 
          profile_picture: res.data.user.profile_picture 
        });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    
    const file = e.target.files[0];
    const uploadData = new FormData();
    uploadData.append('image', file);

    setUploading(true);
    setError('');
    try {
      const res = await api.post('/auth/upload-profile-picture', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        setFormData({ ...formData, profile_picture: res.data.path });
        setSuccess('Profile picture updated successfully!');
        // Sync with security session
        update({ profile_picture: res.data.path });
      }
    } catch (err: any) {
       setError(err.response?.data?.message || 'Failed to upload image.');
    } finally {
      setUploading(false);
    }
  };

  if (fetching) {
    return (
      <DashboardLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
          <CircularProgress />
        </Box>
      </DashboardLayout>
    );
  }

  const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '');

  return (
    <DashboardLayout>
      <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1000, mx: 'auto' }}>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 700, color: '#660000' }}>
          Account Settings
        </Typography>

        <Paper sx={{ borderRadius: 4, overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
          <Grid container>
            {/* Left Sidebar: Profile Summary */}
            <Grid item xs={12} md={4} sx={{ bgcolor: 'rgba(128,0,0,0.02)', borderRight: '1px solid rgba(0,0,0,0.06)', p: 4 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Box sx={{ position: 'relative', width: 140, height: 140, mx: 'auto', mb: 3 }}>
                  <Avatar
                    src={formData.profile_picture ? `${backendUrl}${formData.profile_picture}` : ''}
                    sx={{ width: '100%', height: '100%', bgcolor: '#800000', fontSize: '3.5rem', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}
                  >
                    {formData.name.charAt(0)}
                  </Avatar>
                  <IconButton
                    component="label"
                    disabled={uploading}
                    sx={{
                      position: 'absolute', bottom: 4, right: 4,
                      bgcolor: 'white', '&:hover': { bgcolor: '#f5f5f5' },
                      boxShadow: '0 2px 10px rgba(0,0,0,0.15)', width: 40, height: 40
                    }}
                  >
                    <PhotoCamera sx={{ fontSize: 22, color: '#660000' }} />
                    <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
                  </IconButton>
                  {uploading && (
                    <CircularProgress
                      size={140}
                      sx={{ position: 'absolute', top: 0, left: 0, color: '#660000', zIndex: 1 }}
                    />
                  )}
                </Box>
                
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#333' }}>{formData.name}</Typography>
                <Typography variant="body2" color="primary" sx={{ letterSpacing: 1.5, fontWeight: 700, textTransform: 'uppercase', fontSize: '0.7rem', mt: 1 }}>
                  {formData.role}
                </Typography>

                <Divider sx={{ my: 4 }} />
                
                <Box sx={{ textAlign: 'left', px: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Email sx={{ fontSize: 20, mr: 2, color: '#800000', opacity: 0.8 }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block' }}>EMAIL</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#444' }}>{formData.email}</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Work sx={{ fontSize: 20, mr: 2, color: '#800000', opacity: 0.8 }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block' }}>DESIGNATION</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#444' }}>{formData.designation || 'Not set'}</Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Grid>

            {/* Right Side: Edit Form */}
            <Grid item xs={12} md={8} sx={{ p: { xs: 3, md: 5 } }}>
              <Typography variant="h6" sx={{ mb: 4, fontWeight: 800, color: '#333' }}>Edit Basic Information</Typography>
              
              {error && <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>{error}</Alert>}
              {success && <Alert severity="success" sx={{ mb: 4, borderRadius: 2 }}>{success}</Alert>}

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth label="Full Name"
                    name="name" value={formData.name} onChange={handleChange}
                    InputProps={{ startAdornment: <Person sx={{ mr: 1, color: 'action.active' }} /> }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth label="Email Address (Locked)"
                    value={formData.email} disabled
                    InputProps={{ startAdornment: <Email sx={{ mr: 1, color: 'action.disabled' }} /> }}
                    sx={{ '& .MuiInputBase-input': { color: 'text.disabled' } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth label="Designation / Job Title"
                    name="designation" value={formData.designation} onChange={handleChange}
                    InputProps={{ startAdornment: <Work sx={{ mr: 1, color: 'action.active' }} /> }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel>STD Code</InputLabel>
                    <Select
                      label="STD Code"
                      name="std_code" value={formData.std_code} onChange={handleChange}
                    >
                      {STD_CODES.map((item) => (
                        <MenuItem key={item.code + item.country} value={item.code}>
                          {item.code} ({item.country})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={8}>
                  <TextField
                    fullWidth label="Phone Number"
                    name="phone" value={formData.phone} onChange={handleChange}
                    InputProps={{ startAdornment: <Phone sx={{ mr: 1, color: 'action.active' }} /> }}
                  />
                </Grid>
              </Grid>

              <Box sx={{ mt: 6, display: 'flex', justifyContent: 'flex-end' }}>
                 <Button
                  variant="contained" size="large"
                  onClick={handleUpdate} disabled={loading}
                  sx={{ 
                    px: 6, py: 1.8, borderRadius: 3, fontWeight: 800, textTransform: 'none',
                    bgcolor: '#800000', '&:hover': { bgcolor: '#600000' },
                    boxShadow: '0 4px 14px rgba(128,0,0,0.3)'
                  }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Update Profile'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </DashboardLayout>
  );
}
