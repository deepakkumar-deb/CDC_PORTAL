'use client';
import { useState } from 'react';
import {
  Box, Typography, FormControlLabel, Checkbox,
  TextField, Button, CircularProgress, Alert,
  Divider,
} from '@mui/material';

const declarations = [
  'I have thoroughly read the AIPC guidelines and agree to abide by them during the entire placement process.',
  'Shortlisting criteria will be provided and the final shortlist will be shared within 24–48 hours after the written test.',
  'The information in this form is verified and correct. No new clauses will be added in the final offer letter.',
  'I consent to share the company name, logo, and email with national ranking agencies and media.',
  'I confirm the accuracy of the job profile and agree to adhere to all T&C. I understand that strict action will be taken in case of discrepancy.',
];

export default function DeclarationTab({
  saving, onSubmit,
}: {
  saving: boolean;
  onSubmit: () => void;
}) {
  const [checked, setChecked] = useState<boolean[]>(
    new Array(declarations.length).fill(false)
  );
  const [signatory, setSignatory] = useState('');
  const [sigDesig, setSigDesig]   = useState('');

  const toggle = (i: number) => {
    setChecked(prev => prev.map((v, idx) => idx === i ? !v : v));
  };

  const allChecked = checked.every(Boolean);
  const canSubmit  = allChecked && signatory.trim() !== '';

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#003366' }}>
        Declaration & Submit
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Please read and accept all declarations before submitting your JNF.
      </Typography>

      {/* Declaration checkboxes */}
      <Box sx={{
        p: 3, border: '1px solid rgba(0,0,0,0.1)',
        borderRadius: 2, mb: 3,
      }}>
        {declarations.map((decl, i) => (
          <FormControlLabel
            key={i}
            sx={{ alignItems: 'flex-start', mb: 1.5, display: 'flex' }}
            control={
              <Checkbox
                checked={checked[i]}
                onChange={() => toggle(i)}
                sx={{ mt: -0.5, color: '#003366',
                  '&.Mui-checked': { color: '#003366' } }}
              />
            }
            label={
              <Typography variant="body2" sx={{ lineHeight: 1.7 }}>
                {decl}
              </Typography>
            }
          />
        ))}
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Signatory details */}
      <Typography variant="body1" sx={{ fontWeight: 600, mb: 2 }}>
        Authorised Signatory Details
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          label="Authorised Signatory Name *" size="small"
          value={signatory}
          onChange={e => setSignatory(e.target.value)}
          sx={{ flex: 1, minWidth: 220 }}
        />
        <TextField
          label="Designation" size="small"
          value={sigDesig}
          onChange={e => setSigDesig(e.target.value)}
          sx={{ flex: 1, minWidth: 220 }}
        />
      </Box>

      {!canSubmit && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Please accept all declarations and enter the authorised signatory name to submit.
        </Alert>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained" size="large"
          onClick={onSubmit}
          disabled={saving || !canSubmit}
          sx={{
            background: canSubmit ? 'linear-gradient(135deg, #003366, #1a5799)' : undefined,
            px: 5,
          }}
        >
          {saving
            ? <CircularProgress size={22} color="inherit" />
            : 'Submit JNF to CDC'}
        </Button>
      </Box>
    </Box>
  );
}