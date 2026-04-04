'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Box, Card, CardContent, TextField, Button,
  Typography, Alert, CircularProgress, Divider,
} from '@mui/material';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError('Invalid email or password. Please try again.');
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(150deg, #001028 0%, #003366 60%, #0a4a8a 100%)',
      p: 2,
    }}>
      <Card sx={{ width: '100%', maxWidth: 440, borderRadius: 3 }}>
        <CardContent sx={{ p: 4 }}>

          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box sx={{
              width: 56, height: 56, borderRadius: '50%',
              background: 'linear-gradient(135deg, #003366, #C8922A)',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', mx: 'auto', mb: 2,
              fontFamily: '"Playfair Display", serif',
              fontWeight: 700, fontSize: '1.1rem', color: 'white',
            }}>
              ISM
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#003366' }}>
              Recruiter Login
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              CDC Portal — IIT (ISM) Dhanbad
            </Typography>
          </Box>

          {/* Error */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Form */}
          <Box component="form" onSubmit={handleLogin}>
            <TextField
              fullWidth label="Company Email" type="email"
              value={email} onChange={(e) => setEmail(e.target.value)}
              required sx={{ mb: 2 }}
            />
            <TextField
              fullWidth label="Password" type="password"
              value={password} onChange={(e) => setPassword(e.target.value)}
              required sx={{ mb: 3 }}
            />
            <Button
              type="submit" variant="contained" fullWidth
              size="large" disabled={loading}
              sx={{ py: 1.5 }}
            >
              {loading
                ? <CircularProgress size={22} color="inherit" />
                : 'Login'}
            </Button>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Typography variant="body2" textAlign="center" color="text.secondary">
            New recruiter?{' '}
            <Link href="/auth/register"
              style={{ color: '#003366', fontWeight: 600 }}>
              Register here
            </Link>
          </Typography>

        </CardContent>
      </Card>
    </Box>
  );
}