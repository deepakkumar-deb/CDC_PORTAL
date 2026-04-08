'use client';
import { useState, useEffect } from 'react';
import {
  Box, TextField, Grid, Typography, Button,
  MenuItem, CircularProgress, IconButton,
  Switch, FormControlLabel, Divider,
} from '@mui/material';
import AddIcon    from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const roundTypes  = ['ppt', 'resume', 'test', 'gd', 'interview'];
const modes       = ['online', 'offline', 'hybrid'];
const testTypes   = ['aptitude', 'technical', 'written'];
const intModes    = ['oncampus', 'telephonic', 'video'];

const emptyRound = (order: number) => ({
  round_order: order, round_type: 'resume',
  mode: 'offline', test_type: '',
  interview_mode: '', duration_minutes: '',
  description: '', is_elimination_round: false,
});

export default function SelectionTab({
  saving, onSave, onBack, initialData,
}: {
  saving: boolean;
  onSave: (data: any) => void;
  onBack?: () => void;
  initialData?: any;
}) {
  const [rounds, setRounds] = useState([emptyRound(1)]);
  const [infra, setInfra]   = useState({
    rooms_required: '', team_members_required: '',
    psychometric_test: false, medical_test: false,
    proctoring_required: false, other_screening: '',
  });

  // Pre-fill from initialData (duplicated JNF)
  useEffect(() => {
    if (!initialData) return;
    if (initialData.selection_rounds?.length) {
      setRounds(initialData.selection_rounds.map((r: any) => ({
        round_order:          r.round_order,
        round_type:           r.round_type           || 'resume',
        mode:                 r.mode                 || 'offline',
        test_type:            r.test_type            || '',
        interview_mode:       r.interview_mode       || '',
        duration_minutes:     r.duration_minutes     ?? '',
        description:          r.description          || '',
        is_elimination_round: r.is_elimination_round ?? false,
      })));
    }
    const si = initialData.selection_infrastructure;
    if (si) {
      setInfra({
        rooms_required:       si.rooms_required        ?? '',
        team_members_required:si.team_members_required ?? '',
        psychometric_test:    si.psychometric_test     ?? false,
        medical_test:         si.medical_test          ?? false,
        proctoring_required:  si.proctoring_required   ?? false,
        other_screening:      si.other_screening       || '',
      });
    }
  }, [initialData]);

  const addRound = () => {
    if (rounds.length >= 10) return;
    setRounds(r => [...r, emptyRound(r.length + 1)]);
  };

  const removeRound = (i: number) => {
    setRounds(r => r.filter((_, idx) => idx !== i)
      .map((r, idx) => ({ ...r, round_order: idx + 1 }))
    );
  };

  const setRound = (i: number, k: string, v: any) => {
    setRounds(prev => prev.map((r, idx) =>
      idx === i ? { ...r, [k]: v } : r
    ));
  };

  const setI = (k: string, v: any) =>
    setInfra(p => ({ ...p, [k]: v }));

  const handleSave = () => {
    onSave({ rounds, ...infra });
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#003366' }}>
        Selection Process
      </Typography>

      {/* Rounds */}
      {rounds.map((round, i) => (
        <Box key={i} sx={{
          p: 2.5, mb: 2, border: '1px solid rgba(0,0,0,0.1)',
          borderRadius: 2, background: 'white',
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography sx={{ fontWeight: 600, color: '#003366' }}>
              Round {round.round_order}
            </Typography>
            {rounds.length > 1 && (
              <IconButton size="small" color="error" onClick={() => removeRound(i)}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            )}
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth select size="small" label="Round Type"
                value={round.round_type}
                onChange={e => setRound(i, 'round_type', e.target.value)}
              >
                {roundTypes.map(t => (
                  <MenuItem key={t} value={t} sx={{ textTransform: 'capitalize' }}>
                    {t.toUpperCase()}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth select size="small" label="Mode"
                value={round.mode}
                onChange={e => setRound(i, 'mode', e.target.value)}
              >
                {modes.map(m => (
                  <MenuItem key={m} value={m} sx={{ textTransform: 'capitalize' }}>
                    {m}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            {round.round_type === 'test' && (
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth select size="small" label="Test Type"
                  value={round.test_type}
                  onChange={e => setRound(i, 'test_type', e.target.value)}
                >
                  {testTypes.map(t => (
                    <MenuItem key={t} value={t} sx={{ textTransform: 'capitalize' }}>
                      {t}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            )}
            {round.round_type === 'interview' && (
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth select size="small" label="Interview Mode"
                  value={round.interview_mode}
                  onChange={e => setRound(i, 'interview_mode', e.target.value)}
                >
                  {intModes.map(m => (
                    <MenuItem key={m} value={m} sx={{ textTransform: 'capitalize' }}>
                      {m}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            )}
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth size="small" label="Duration (minutes)"
                type="number" value={round.duration_minutes}
                onChange={e => setRound(i, 'duration_minutes', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth size="small" label="Description / Notes"
                value={round.description}
                onChange={e => setRound(i, 'description', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    size="small"
                    checked={round.is_elimination_round}
                    onChange={e => setRound(i, 'is_elimination_round', e.target.checked)}
                  />
                }
                label="Elimination round?"
              />
            </Grid>
          </Grid>
        </Box>
      ))}

      <Button
        startIcon={<AddIcon />} variant="outlined"
        onClick={addRound} disabled={rounds.length >= 10}
        sx={{ mb: 4 }}
      >
        Add Round
      </Button>

      <Divider sx={{ mb: 3 }} />

      {/* Infrastructure */}
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#003366' }}>
        Infrastructure Requirements
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth size="small" label="Rooms Required"
            type="number" value={infra.rooms_required}
            onChange={e => setI('rooms_required', e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth size="small" label="Team Members Required"
            type="number" value={infra.team_members_required}
            onChange={e => setI('team_members_required', e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <FormControlLabel
            control={
              <Switch
                checked={infra.psychometric_test}
                onChange={e => setI('psychometric_test', e.target.checked)}
              />
            }
            label="Psychometric Test"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <FormControlLabel
            control={
              <Switch
                checked={infra.medical_test}
                onChange={e => setI('medical_test', e.target.checked)}
              />
            }
            label="Medical Test"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth size="small"
            label="Other Screening Requirements"
            value={infra.other_screening}
            onChange={e => setI('other_screening', e.target.value)}
          />
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, gap: 2 }}>
        {onBack && (
          <Button variant="outlined" size="large" onClick={onBack}>
            Back
          </Button>
        )}
        <Button
          variant="contained" size="large"
          onClick={handleSave} disabled={saving}
        >
          {saving ? <CircularProgress size={22} color="inherit" /> : 'Save & Continue'}
        </Button>
      </Box>
    </Box>
  );
}