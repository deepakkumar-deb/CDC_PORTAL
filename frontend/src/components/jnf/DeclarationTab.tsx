'use client';
import { useState } from 'react';
import {
  Box, Typography, FormControlLabel, Checkbox,
  TextField, Button, CircularProgress, Alert,
  Divider, Dialog, DialogTitle, DialogContent,
  DialogActions,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PrintableJnf from '../common/PrintableJnf';

const declarations = [
  "We have gone through the AIPC guidelines thoroughly and agree to abide by the guidelines during the entire process of placement/internship activities. In case of violation of guidelines by us, we understand that an appropriate action may be taken on us as per AIPC guidelines.",
  "We declare that we would be providing the shortlisting criteria along with the CV-shortlisted and/or Test-shortlisted candidates. We also assure that the details of final shortlisted candidates will be provided within the 24 to 48 hours after the written test.",
  "The information related to various job/intern profiles posted by us is verified and correct to the best of our knowledge, and the company will abide by the terms and conditions as outlined in these job/intern profiles posted while making the offers. No new clauses/ changes would be added/made in the final offer rolled out to the candidates selected on the profile(s). All details have already been outlined in the Job/ Internship Notification Forms. In the event of any discrepancy in the final offers, the company may be subject to appropriate actions in accordance with the AIPC guidelines.",
  "We consent to sharing of company name, logo and email with national ranking agencies and government directives, and to listing company names in social media platforms and press/media.",
  "I/We confirm that the information pertaining to the posted job profile is accurate and verified to the best of our knowledge. The company commits to adhere to the terms and conditions outlined in these job profiles while extending offers. No additional clauses or changes will be introduced in the final offers extended to the candidates selected for the respective profiles. All relevant details have been clearly outlined in the Job Notification Form. In the event of any discrepancies in the final offers, the company will be subject to strict action as per the AIPC guidelines.",
];

export default function DeclarationTab({
  saving, onSubmit, onBack, formData,
}: {
  saving: boolean;
  onSubmit: () => void;
  onBack?: () => void;
  formData?: any;
}) {
  const [checked, setChecked] = useState<boolean[]>(
    new Array(declarations.length).fill(false)
  );
  const [signatory, setSignatory] = useState('');
  const [sigDesig, setSigDesig]   = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);

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

      <Box sx={{ mt: 4, mb: 3 }}>
        <Typography variant="caption" sx={{ color: '#d32f2f', fontWeight: 600, display: 'block', mb: 1 }}>
          Note: Student's choices will be governed by the information you provide in this form. Therefore, please be as clear and detailed as possible. Before filling the form kindly refer to the placement brochure and placement website for the selection process and rules & regulations.
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        {onBack && (
          <Button variant="outlined" size="large" onClick={onBack}>
            Back
          </Button>
        )}
        
        <Button
          variant="outlined"
          color="secondary"
          size="large"
          startIcon={<VisibilityIcon />}
          onClick={() => setPreviewOpen(true)}
          sx={{ borderColor: '#003366', color: '#003366' }}
        >
          Preview JNF
        </Button>

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

      {/* Preview Dialog */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700, color: '#003366' }}>
          Preview Submission
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ background: '#f5f5f5', p: { xs: 1, md: 3 } }}>
            <PrintableJnf form={formData} showDownloadButton={false} />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button variant="contained" onClick={() => setPreviewOpen(false)}>
            Close Preview
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}