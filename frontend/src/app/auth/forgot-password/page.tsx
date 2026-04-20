'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box, Card, CardContent, TextField, Button,
  Typography, Alert, CircularProgress, Divider, IconButton
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import axios from 'axios';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL;

export default function ForgotPasswordPage() {
  const router = useRouter();

  // State
  const [email, setEmail]           = useState('');
  const [otp, setOtp]               = useState('');
  const [password, setPassword]     = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep]             = useState(1); // 1: Send OTP, 2: Reset

  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');
  const [timer, setTimer] = useState(0);

  // Timer Effect
  useEffect(() => {
    let interval: any;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // ── Step 1: Send OTP ──────────────────────────────────────
  const handleSendOtp = async () => {
    if (!email) return setError('Please enter your email.');
    setLoading(true);
    setError('');
    try {
      await axios.post(`${API}/auth/forgot-password`, { email });
      setStep(2);
      setTimer(30);
      setSuccess('OTP sent to your inbox!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Email not found or failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: Reset Password ────────────────────────────────
  const handleResetPassword = async () => {
    if (!otp) return setError('Enter the 6-digit OTP.');
    if (!password || password.length < 8) return setError('Password must be at least 8 characters.');
    if (password !== confirmPassword) return setError('Passwords do not match.');

    setLoading(true);
    setError('');
    try {
      await axios.post(`${API}/auth/reset-password`, {
        email,
        otp_code: otp,
        password,
        password_confirmation: confirmPassword,
      });
      setSuccess('Password reset successfully! Redirecting to login...');
      setTimeout(() => router.push('/auth/login'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid OTP or failed to reset.');
    } finally {
      setLoading(false);
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
      <Card sx={{ width: '100%', maxWidth: 450, borderRadius: 3, position: 'relative' }}>
        <CardContent sx={{ p: 4 }}>
          {step === 2 && (
            <IconButton 
              onClick={() => setStep(1)}
              sx={{ position: 'absolute', top: 12, left: 12, color: '#660000' }}
            >
              <ArrowBack />
            </IconButton>
          )}

          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#660000' }}>
              Reset Password
            </Typography>
            <Typography variant="body2" color="text.secondary">
              CDC Portal — IIT (ISM) Dhanbad
            </Typography>
          </Box>

          {error   && <Alert severity="error"   sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

          {step === 1 ? (
             <Box>
               <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                 Enter your registered email address and we'll send you an OTP to reset your password.
               </Typography>
               <TextField
                 fullWidth label="Registered Email" type="email"
                 value={email} onChange={(e) => setEmail(e.target.value)}
                 sx={{ mb: 3 }}
               />
               <Button
                 variant="contained" fullWidth size="large"
                 onClick={handleSendOtp} disabled={loading}
               >
                 {loading ? <CircularProgress size={24} /> : 'Send OTP'}
               </Button>
             </Box>
          ) : (
            <Box>
              <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                Enter the OTP sent to <b>{email}</b> and set your new password.
              </Typography>
              <TextField
                fullWidth label="6-Digit OTP"
                value={otp} onChange={(e) => setOtp(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth label="New Password" type="password"
                value={password} onChange={(e) => setPassword(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth label="Confirm New Password" type="password"
                value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                sx={{ mb: 3 }}
              />
              <Button
                variant="contained" fullWidth size="large"
                onClick={handleResetPassword} disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Reset Password'}
              </Button>
              <Button
                fullWidth size="small"
                disabled={timer > 0}
                onClick={() => {
                  if (timer > 0 || loading) return;
                  handleSendOtp();
                }}
                sx={{ color: timer > 0 ? 'text.disabled' : '#660000', mt: 2, fontWeight: 600 }}
              >
                {timer > 0 ? `Resend OTP in ${timer}s` : 'Resend OTP'}
              </Button>
            </Box>
          )}

          <Divider sx={{ my: 3 }} />
          <Box sx={{ textAlign: 'center' }}>
            <Link href="/auth/login" style={{ color: '#660000', textDecoration: 'none', fontWeight: 600 }}>
              Back to Login
            </Link>
          </Box>

        </CardContent>
      </Card>
    </Box>
  );
}
