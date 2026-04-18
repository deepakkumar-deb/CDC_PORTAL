'use client';
import { Box, Typography, Button } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      bgcolor: '#800000',
      color: 'white',
      textAlign: 'center',
      p: 3,
    }}>
      <Typography sx={{
        fontFamily: '"Playfair Display", serif',
        fontSize: '6rem',
        fontWeight: 700,
        color: '#C8922A',
        lineHeight: 1,
      }}>
        404
      </Typography>
      <Typography variant="h5" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
        Page Not Found
      </Typography>
      <Typography variant="body2" sx={{ opacity: 0.7, mb: 4 }}>
        The page you're looking for doesn't exist or you don't have access.
      </Typography>
      <Button
        variant="contained"
        onClick={() => router.push('/dashboard')}
        sx={{ background: '#C8922A', '&:hover': { background: '#A0721A' } }}
      >
        Back to Dashboard
      </Button>
    </Box>
  );
}