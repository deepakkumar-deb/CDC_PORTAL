'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box, Card, CardContent, TextField, Button,
  Typography, Alert, CircularProgress,
  Stepper, Step, StepLabel, Divider,
  MenuItem, Select, InputLabel, FormControl, IconButton,
  InputAdornment
} from '@mui/material';
import { ArrowBack, Visibility, VisibilityOff } from '@mui/icons-material';
import { STD_CODES } from '@/constants/countries';
import axios from 'axios';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL;

const steps = ['Verify Email', 'Your Details', 'Set Password'];

export default function RegisterPage() {
  const router = useRouter();

  // Step tracking
  const [activeStep, setActiveStep] = useState(0);

  // Step 1 state
  const [email, setEmail]     = useState('');
  const [otp, setOtp]         = useState('');
  const [otpSent, setOtpSent] = useState(false);

  // Step 2 state
  const [name, setName]               = useState('');
  const [designation, setDesignation] = useState('');
  const [stdCode, setStdCode]         = useState('+91');
  const [phone, setPhone]             = useState('');

  // Step 3 state
  const [password, setPassword]     = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword]               = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // UI state
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

  // ── Step 1A: Send OTP ──────────────────────────────────────
  const handleSendOtp = async () => {
    if (!email) return setError('Please enter your company email.');
    setLoading(true);
    setError('');
    try {
      await axios.post(`${API}/auth/send-otp`,
        { email },
        { headers: { Accept: 'application/json' } }
      );
      setOtpSent(true);
      setTimer(30);
      setSuccess('OTP sent! Check your inbox.');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  // ── Step 1B: Verify OTP ────────────────────────────────────
  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) return setError('Enter the 6-digit OTP.');
    setLoading(true);
    setError('');
    try {
      await axios.post(`${API}/auth/verify-otp`,
        { email, otp_code: otp },
        { headers: { Accept: 'application/json' } }
      );
      setSuccess('Email verified!');
      setActiveStep(1);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid or expired OTP.');
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: Save recruiter info ────────────────────────────
  const handleRecruiterInfo = () => {
    if (!name) return setError('Please enter your full name.');
    if (phone && phone.length < 10) return setError('Please enter a valid 10-digit mobile number.');
    setError('');
    setActiveStep(2);
  };

  // ── Step 3: Complete registration ─────────────────────────
  const handleRegister = async () => {
    if (!password || password.length < 8)
      return setError('Password must be at least 8 characters.');
    if (password !== confirmPassword)
      return setError('Passwords do not match.');

    setLoading(true);
    setError('');

    try {
      await axios.post(`${API}/auth/register`,
        {
          name,
          email,
          designation,
          std_code: stdCode,
          phone,
          password,
          password_confirmation: confirmPassword,
        },
        { headers: { Accept: 'application/json' } }
      );
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => router.push('/auth/login'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed.');
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
      <Card sx={{ width: '100%', maxWidth: 500, borderRadius: 3, position: 'relative' }}>
        <CardContent sx={{ p: 4 }}>
          {(otpSent && activeStep === 0) && (
            <IconButton 
              onClick={() => { setOtpSent(false); setOtp(''); setError(''); setTimer(0); }}
              sx={{ position: 'absolute', top: 12, left: 12, color: '#660000' }}
            >
              <ArrowBack />
            </IconButton>
          )}

          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
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
              Recruiter Registration
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              CDC Portal — IIT (ISM) Dhanbad
            </Typography>
          </Box>

          {/* Stepper */}
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Alerts */}
          {error   && <Alert severity="error"   sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

          {/* ── Step 1: Email OTP ── */}
          {activeStep === 0 && (
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Enter your company email to receive a 6-digit verification code.
              </Typography>
              <TextField
                fullWidth label="Company Email" type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={otpSent}
                sx={{ mb: 2 }}
              />
              {!otpSent ? (
                <Button
                  variant="contained" fullWidth size="large"
                  onClick={handleSendOtp} disabled={loading}
                  sx={{ mb: 2 }}
                >
                  {loading
                    ? <CircularProgress size={22} color="inherit" />
                    : 'Send OTP'}
                </Button>
              ) : (
                <Box>
                  <TextField
                    fullWidth label="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    inputProps={{ maxLength: 6 }}
                    sx={{ mb: 2 }}
                  />
                  <Button
                    variant="contained" fullWidth size="large"
                    onClick={handleVerifyOtp} disabled={loading}
                    sx={{ mb: 1 }}
                  >
                    {loading
                      ? <CircularProgress size={22} color="inherit" />
                      : 'Verify OTP'}
                  </Button>

                  <Button
                    fullWidth size="small"
                    disabled={timer > 0}
                    onClick={() => {
                      if (timer > 0 || loading) return;
                      handleSendOtp();
                    }}
                    sx={{ color: timer > 0 ? 'text.disabled' : '#660000', mt: 1, fontWeight: 600 }}
                  >
                    {timer > 0 ? `Resend OTP in ${timer}s` : 'Resend OTP'}
                  </Button>
                </Box>
              )}
            </Box>
          )}

          {/* ── Step 2: Recruiter Info ── */}
          {activeStep === 1 && (
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Tell us about yourself.
              </Typography>
              <TextField
                fullWidth label="Full Name" value={name}
                onChange={(e) => setName(e.target.value)}
                required sx={{ mb: 2 }}
              />
              <TextField
                fullWidth label="Designation" value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                sx={{ mb: 2 }}
              />

              <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                <FormControl sx={{ flex: '0 0 100px' }}>
                  <InputLabel>STD</InputLabel>
                  <Select
                    label="STD"
                    value={stdCode}
                    onChange={(e) => setStdCode(e.target.value)}
                  >
                    {STD_CODES.map((item) => (
                      <MenuItem key={item.code + item.country} value={item.code}>
                        {item.code} ({item.country})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  fullWidth label="Mobile Number" value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  inputProps={{ maxLength: 10 }}
                />
              </Box>
              <Button
                variant="contained" fullWidth size="large"
                onClick={handleRecruiterInfo}
              >
                Continue
              </Button>
              <Button
                fullWidth size="small"
                onClick={() => { setActiveStep(0); setError(''); }}
                sx={{ mt: 1, color: 'text.secondary' }}
              >
                Back
              </Button>
            </Box>
          )}

          {/* ── Step 3: Set Password ── */}
          {activeStep === 2 && (
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Set a strong password for your account.
              </Typography>
              <TextField
                fullWidth label="Password" 
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                helperText="Minimum 8 characters"
                sx={{ mb: 2 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        onMouseDown={(e) => e.preventDefault()}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth label="Confirm Password" 
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                sx={{ mb: 3 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        onMouseDown={(e) => e.preventDefault()}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                variant="contained" fullWidth size="large"
                onClick={handleRegister} disabled={loading}
                sx={{ mb: 1 }}
              >
                {loading
                  ? <CircularProgress size={22} color="inherit" />
                  : 'Complete Registration'}
              </Button>
              <Button
                fullWidth size="small"
                onClick={() => { setActiveStep(1); setError(''); }}
                sx={{ mt: 1, color: 'text.secondary' }}
              >
                Back
              </Button>
            </Box>
          )}

          <Divider sx={{ my: 3 }} />
          <Typography variant="body2" textAlign="center" color="text.secondary">
            Already registered?{' '}
            <Link href="/auth/login"
              style={{ color: '#660000', fontWeight: 600 }}>
              Login here
            </Link>
          </Typography>

        </CardContent>
      </Card>
    </Box>
  );
}