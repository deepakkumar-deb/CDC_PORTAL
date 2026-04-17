'use client';

import { useEffect } from 'react';
import { Box, Typography, Button, Container, Paper } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import RefreshIcon from '@mui/icons-material/Refresh';
import HomeIcon from '@mui/icons-material/Home';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Unhandled UI Error:', error);
  }, [error]);

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '80vh',
          textAlign: 'center',
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 5,
            borderRadius: 4,
            bgcolor: 'rgba(211, 47, 47, 0.04)',
            border: '1px solid rgba(211, 47, 47, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <ErrorOutlineIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
          
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: '#1a1a1a' }}>
            Oops! Something went wrong
          </Typography>
          
          <Box sx={{ mb: 4, maxWidth: 400 }}>
            <Typography variant="body1" color="text.secondary">
              We encountered an unexpected error while rendering this page. Our team has been notified.
            </Typography>
            {error.message && (
              <Box sx={{ mt: 2, p: 1.5, bgcolor: '#f5f5f5', borderRadius: 1, fontSize: '0.8rem', fontFamily: 'monospace', width: '100%', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Error: {error.message}
              </Box>
            )}
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={() => reset()}
              sx={{ 
                borderRadius: 2,
                px: 3,
                py: 1.2,
                textTransform: 'none',
                fontWeight: 600,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            >
              Try Again
            </Button>
            
            <Link href="/" passHref style={{ textDecoration: 'none' }}>
              <Button
                variant="outlined"
                startIcon={<HomeIcon />}
                sx={{ 
                  borderRadius: 2,
                  px: 3,
                  py: 1.2,
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                Go to Dashboard
              </Button>
            </Link>
          </Box>
        </Paper>
        
        <Typography variant="caption" sx={{ mt: 4, color: 'text.disabled' }}>
          If the problem persists, please contact support at cdc@iitism.ac.in
        </Typography>
      </Box>
    </Container>
  );
}
