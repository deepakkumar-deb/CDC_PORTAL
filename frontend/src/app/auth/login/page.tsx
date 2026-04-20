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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
      backgroundImage: 'url("/background_img.jpg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      p: 2,
    }}>
      <Card sx={{ width: '100%', maxWidth: 440, borderRadius: 3 }}>
        <CardContent sx={{ p: 4 }}>

          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              component="img"
              src="/logo.webp"
              alt="IIT ISM Logo"
              sx={{
                width: 80,
                height: 80,
                objectFit: "contain",
                mx: 'auto',
                mb: 2,
                display: 'block'
              }}
            />
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#660000' }}>
              CDC Portal Login
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              IIT (ISM) Dhanbad
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
              sx={{ py: 1.5, mb: 1.5 }}
            >
              {loading
                ? <CircularProgress size={22} color="inherit" />
                : 'Login'}
            </Button>
            <Box sx={{ textAlign: 'right' }}>
              <Link href="/auth/forgot-password" style={{ color: '#660000', fontSize: '0.875rem' }}>
                Forgot Password?
              </Link>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>
            <Typography sx={{ fontSize: '0.95rem', color: 'text.secondary' }}>
              Don't have an account?{' '}
              <Link href="/auth/register" style={{ color: '#660000', fontWeight: 600 }}>
                Register here
              </Link>
            </Typography>

            <Typography sx={{ fontSize: '0.95rem', color: 'text.secondary' }}>
              Apply as an Alumni Mentor?{' '}
              <Link href="/alumni-mentor" style={{ color: '#660000', fontWeight: 600, textDecoration: 'underline' }}>
                Click here
              </Link>
            </Typography>
          </Box>

        </CardContent>
      </Card>
    </Box>
  );
}