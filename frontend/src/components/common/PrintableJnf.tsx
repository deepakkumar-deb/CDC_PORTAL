import React, { memo } from 'react';
import {
  Box, Typography, Grid, Chip, Divider, Button,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';

interface Props {
  form: any;
  showDownloadButton?: boolean;
}

const PrintableJnf = memo(({ form, showDownloadButton = true }: Props) => {
  const isInf = form.opportunity_type === 'internship';

  const handlePrint = () => {
    window.print();
  };

  if (!form) return null;

  return (
    <>
      {/* Download Button — hidden during print */}
      {showDownloadButton && (
        <Box className="no-print" sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={handlePrint}
            sx={{
              background: '#003366',
              '&:hover': { background: '#001f3f' },
            }}
          >
            Download as PDF
          </Button>
        </Box>
      )}

      {/* Printable Area */}
      <Box id="print-area" sx={{
        background: 'white',
        p: { xs: 2, md: 4 },
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <td>
                {/* Official Office Header (Repeats on each page) */}
                <Box sx={{
                  background: '#F1F8E9',
                  border: '2px solid #333',
                  p: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 2,
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      component="img"
                      src="/logo.webp"
                      sx={{ width: 70, height: 70, objectFit: 'contain' }}
                    />
                  </Box>
                  <Box sx={{ textAlign: 'center', flex: 1, px: 2 }}>
                    <Typography sx={{ color: '#D32F2F', fontWeight: 700, fontSize: '1.2rem', lineHeight: 1.1 }}>
                      कैरियर विकास केंद्र
                    </Typography>
                    <Typography sx={{ color: '#1565C0', fontWeight: 600, fontSize: '0.85rem', lineHeight: 1.1 }}>
                      भारतीय प्रौद्योगिकी संस्थान (भारतीय खनि विद्यापीठ), धनबाद
                    </Typography>
                    <Typography sx={{ color: '#455A64', fontSize: '0.65rem', fontWeight: 500, mb: 0.8 }}>
                      धनबाद, झारखंड, भारत, पिन-826004
                    </Typography>

                    <Typography sx={{ color: '#D32F2F', fontWeight: 700, fontSize: '1.4rem', lineHeight: 1.1 }}>
                      Career Development Centre
                    </Typography>
                    <Typography sx={{ color: '#1565C0', fontWeight: 600, fontSize: '1rem', lineHeight: 1.1 }}>
                      Indian Institute of Technology (Indian School of Mines), Dhanbad
                    </Typography>
                    <Typography sx={{ color: '#455A64', fontSize: '0.75rem', fontWeight: 500 }}>
                      Dhanbad, Jharkhand, India, Pin-826004
                    </Typography>
                  </Box>
                  {/* Centenary Logo Placeholder */}
                  <Box
                    component="img"
                    src="/centenary.webp"
                    onError={(e: any) => e.target.style.display = 'none'}
                    sx={{ width: 70, height: 70, objectFit: 'contain' }}
                  />
                </Box>
              </td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                {/* Sub-header for JNF/INF specific info (Only appears once at the top) */}
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  mb: 3,
                  pb: 1,
                  borderBottom: '2px solid #003366',
                }}>
                  <Box>
                    <Typography sx={{ color: '#003366', fontWeight: 700, fontSize: '1rem', textTransform: 'uppercase' }}>
                      {isInf ? 'Intern Notification Form' : 'Job Notification Form'}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#003366' }}>
                      {form.jnf_code}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Cycle: {form.recruitment_cycle} | Status: {form.status?.toUpperCase()}
                    </Typography>
                  </Box>
                </Box>
                {/* Company Info */}
                <Section title="Company Information">
                  <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', mb: 2 }}>
                    {form.company?.logo_url && (
                      <Box
                        component="img"
                        src={form.company.logo_url}
                        sx={{ width: 80, height: 80, objectFit: 'contain', border: '1px solid #eee', p: 1, borderRadius: 1 }}
                      />
                    )}
                    <Grid container spacing={2}>
                      <Field label="Company Name" value={form.company?.company_name} />
                      <Field label="Industry" value={form.company?.industry} />
                      <Field label="Website" value={form.company?.website} />
                      <Field label="City" value={form.company?.city} />
                    </Grid>
                  </Box>
                  <Grid container spacing={2}>
                    {form.company?.contacts?.map((c: any, idx: number) => (
                      <Field
                        key={c.id || idx}
                        label={c.contact_type?.replace(/_/g, ' ').toUpperCase()}
                        value={`${c.contact_name} | ${c.email} | ${c.phone || '—'}`}
                        full
                      />
                    ))}
                  </Grid>
                </Section>

                <Divider sx={{ my: 2 }} />

                {/* Job / Intern Details */}
                <Section title={isInf ? 'Internship Details' : 'Job Details'}>
                  <Grid container spacing={2}>
                    <Field
                      label={isInf ? 'Internship Title' : 'Designation'}
                      value={form.internship_title || form.designation}
                    />
                    <Field label="Department / Function" value={form.department_function} />
                    <Field label="Location Type" value={form.location_type} />
                    <Field label="Location" value={form.location_text} />
                    <Field label="Expected Hires" value={form.openings_count} />
                    <Field label="Minimum Hires" value={form.min_openings} />
                    {isInf && (
                      <>
                        <Field label="Internship Duration" value={form.expected_duration} />
                        <Field label="PPO Offered" value={form.ppo_offered ? 'Yes' : 'No'} />
                      </>
                    )}
                    {form.job_description && (
                      <Field label="Description" value={form.job_description} full />
                    )}
                    {form.responsibilities && (
                      <Field label="Responsibilities" value={form.responsibilities} full />
                    )}
                    {form.skills?.filter((s: any) => s.skill_name).length > 0 && (
                      <Grid item xs={12}>
                        <PrintLabel>Required Skills</PrintLabel>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                          {form.skills.filter((s: any) => s.skill_name).map((s: any, idx: number) => (
                            <Chip key={s.id || idx} label={s.skill_name} size="small"
                              sx={{ background: 'rgba(0,51,102,0.08)', color: '#003366' }} />
                          ))}
                        </Box>
                      </Grid>
                    )}
                  </Grid>
                </Section>

                <Divider sx={{ my: 2 }} />

                {/* Branches Section */}
                {form.allowed_programs?.length > 0 && (
                  <Section title="Allowed Branches & Programs">
                    {(() => {
                      const grouped: Record<string, string[]> = {};
                      form.allowed_programs.forEach((p: any) => {
                        const course = p.program_dept_map?.program?.program_name || p.program_dept_map?.program?.course || 'Other';
                        if (!grouped[course]) grouped[course] = [];
                        grouped[course].push(p.program_dept_map?.department?.department_name || 'Unknown');
                      });
                      return Object.entries(grouped).map(([course, Depts]) => (
                        <Box key={course} sx={{ mb: 1, borderLeft: '3px solid #003366', pl: 1.5, py: 0.5 }}>
                          <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#003366', textTransform: 'uppercase' }}>
                            {course}
                          </Typography>
                          <Typography sx={{ fontSize: '0.8rem', color: '#455A64', lineHeight: 1.4 }}>
                            {Depts.join(', ')}
                          </Typography>
                        </Box>
                      ));
                    })()}
                  </Section>
                )}

                {/* Categories Section */}
                {form.allowed_categories?.length > 0 && (
                  <Section title="Allowed Categories">
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {form.allowed_categories.map((c: any, idx: number) => (
                        <Chip
                          key={c.id || idx}
                          label={c.category?.name || '—'}
                          size="small"
                          sx={{ fontSize: '0.7rem', background: '#f5f5f5' }}
                        />
                      ))}
                    </Box>
                  </Section>
                )}

                <Divider sx={{ my: 2 }} />

                {/* Eligibility */}
                {form.eligibility_rule && (
                  <>
                    <Section title="Eligibility Criteria">
                      <Grid container spacing={2}>
                        <Field label="Minimum CGPA" value={form.eligibility_rule.min_cgpa} />
                        <Field label="Max Backlogs" value={form.eligibility_rule.max_backlogs_allowed} />
                        <Field label="Active Backlogs Allowed" value={form.eligibility_rule.active_backlogs_allowed ? 'Yes' : 'No'} />
                        <Field label="Gender Filter" value={form.eligibility_rule.allowed_gender} />
                        <Field label="Min Class 10%" value={form.eligibility_rule.min_class_10_percent} />
                        <Field label="Min Class 12%" value={form.eligibility_rule.min_class_12_percent} />
                        {form.eligibility_rule.additional_text && (
                          <Field label="Additional Notes" value={form.eligibility_rule.additional_text} full />
                        )}
                      </Grid>
                    </Section>

                    {/* Department-wise CGPA if any */}
                    {form.dept_cgpa?.length > 0 && (
                      <Box sx={{ mt: 1, px: 2, py: 2, background: '#fafafa', borderRadius: 1, border: '1px dashed #ccc' }}>
                        <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 1, color: '#003366' }}>
                          Course-wise CGPA Exceptions:
                        </Typography>
                        <Grid container spacing={2}>
                          {form.dept_cgpa.map((dc: any, idx: number) => {
                            // Robust lookup: find the branch name from allowed_programs if relations are missing
                            const branchRef = form.allowed_programs?.find((p: any) => 
                              p.program_dept_map_id === dc.program_dept_map_id
                            );
                            
                            const branchName = 
                              (dc.program_dept_map?.program?.program_name || dc.program_dept_map?.program?.course || branchRef?.program_dept_map?.program?.program_name || '') + 
                              ' - ' + 
                              (dc.program_dept_map?.department?.department_name || branchRef?.program_dept_map?.department?.department_name || 'Specified Program');

                            return (
                              <Grid item xs={12} sm={6} md={4} key={dc.id || idx}>
                                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', fontWeight: 600 }}>
                                  {branchName}:
                                </Typography>
                                <Typography sx={{ fontSize: '0.8rem', fontWeight: 700 }}>
                                  {dc.min_cgpa} CGPA {dc.active_backlogs_allowed ? '(Backlogs ok)' : '(No backlogs)'}
                                </Typography>
                              </Grid>
                            );
                          })}
                        </Grid>
                      </Box>
                    )}

                    <Divider sx={{ my: 2 }} />
                  </>
                )}

                {/* Salary/Stipend */}
                {form.salary_breakdowns?.filter((row: any) => row.ctc_annual || row.base_fixed).length > 0 && (
                  <Section title="Salary Details">
                    {form.salary_breakdowns.filter((row: any) => row.ctc_annual || row.base_fixed).map((row: any, idx: number) => (
                      <Box key={row.id || idx} sx={{ mb: 2, p: 2, border: '1px solid rgba(0,0,0,0.1)', borderRadius: 1 }}>
                        <Typography sx={{ fontWeight: 700, fontSize: '0.8rem', color: '#003366', mb: 1, textTransform: 'uppercase' }}>
                          {row.programme_type?.replace(/_/g, ' / ')} — {row.currency}
                        </Typography>
                        <Grid container spacing={1}>
                          {[
                            ['CTC Annual', row.ctc_annual],
                            ['Base / Fixed', row.base_fixed],
                            ['Monthly Take-home', row.monthly_takehome],
                            ['Joining Bonus', row.joining_bonus],
                            ['Variable Bonus', row.variable_performance_bonus],
                            ['ESOP Value', row.esop_value],
                            ['Bond Required', row.bond_required ? 'Yes' : null],
                            ['Bond Amount', row.bond_amount],
                            ['Bond Duration', row.bond_duration_months ? `${row.bond_duration_months} months` : null],
                          ].filter(([, v]) => v != null && v !== '' && v !== false).map(([label, val]) => (
                            <Grid item xs={6} md={3} key={label as string}>
                              <PrintLabel>{label as string}</PrintLabel>
                              <Typography sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
                                {typeof val === 'number' ? `₹${Number(val).toLocaleString('en-IN')}` : String(val)}
                              </Typography>
                            </Grid>
                          ))}
                          {row.ctc_breakup_notes && (
                            <Grid item xs={12}>
                              <PrintLabel>Notes</PrintLabel>
                              <Typography sx={{ fontSize: '0.75rem' }}>{row.ctc_breakup_notes}</Typography>
                            </Grid>
                          )}
                        </Grid>
                      </Box>
                    ))}
                  </Section>
                )}

                {form.inf_stipend_breakdowns?.length > 0 && (
                  <Section title="Stipend Details">
                    {form.inf_stipend_breakdowns.map((row: any, idx: number) => (
                      <Box key={row.id || idx} sx={{ mb: 2, p: 2, border: '1px solid rgba(0,0,0,0.1)', borderRadius: 1 }}>
                        <Typography sx={{ fontWeight: 700, fontSize: '0.8rem', color: '#003366', mb: 1, textTransform: 'uppercase' }}>
                          {row.programme_type?.replace(/_/g, ' / ')} — {row.currency}
                        </Typography>
                        <Grid container spacing={1}>
                          {[
                            ['Base Stipend', row.base_stipend],
                            ['HRA / Housing', row.hra_housing],
                            ['Variable Pay', row.variable_pay],
                            ['Other Allowance', row.other_allowance],
                            ['Total Monthly', row.total_stipend],
                          ].filter(([, v]) => v).map(([label, val]) => (
                            <Grid item xs={6} md={3} key={label as string}>
                              <PrintLabel>{label as string}</PrintLabel>
                              <Typography sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
                                {typeof val === 'number' ? `₹${Number(val).toLocaleString('en-IN')}` : String(val)}
                              </Typography>
                            </Grid>
                          ))}
                        </Grid>
                      </Box>
                    ))}
                  </Section>
                )}

                {/* Selection Process */}
                {form.selection_rounds?.length > 0 && (
                  <Section title="Selection Process">
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                       {form.selection_infrastructure && (
                         <>
                           <Field label="Rooms Required" value={form.selection_infrastructure.rooms_required} />
                           <Field label="Team Size" value={form.selection_infrastructure.team_members_required} />
                           <Field label="Medical Test" value={form.selection_infrastructure.medical_test ? 'Yes' : 'No'} />
                         </>
                       )}
                    </Grid>
                    {form.selection_rounds.map((round: any, idx: number) => (
                      <Box key={round.id || idx} sx={{ display: 'flex', gap: 2, py: 1.5, borderBottom: '1px solid rgba(0,0,0,0.06)', '&:last-child': { borderBottom: 'none' } }}>
                        <Box sx={{ minWidth: 28, height: 28, borderRadius: '50%', background: '#003366', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0 }}>
                          {round.round_order}
                        </Box>
                        <Box>
                          <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', textTransform: 'capitalize' }}>
                            {round.round_type.replace(/_/g, ' ')} {round.mode && ` · ${round.mode}`} {round.duration_minutes && ` · ${round.duration_minutes} mins`}
                          </Typography>
                          {round.description && <Typography variant="caption" color="text.secondary">{round.description}</Typography>}
                        </Box>
                        {round.is_elimination_round && <Chip label="Elimination" size="small" color="error" sx={{ ml: 'auto' }} />}
                      </Box>
                    ))}
                  </Section>
                )}

                {/* Footer */}
                <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" color="text.secondary">Generated from CDC Portal — IIT (ISM) Dhanbad</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </Typography>
                </Box>
              </td>
            </tr>
          </tbody>
        </table>
      </Box>
    </>
  );
});

PrintableJnf.displayName = 'PrintableJnf';

// Helper sub-components
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography sx={{
        fontWeight: 700, fontSize: '0.95rem',
        color: '#003366', mb: 1.5,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
      }}>
        {title}
      </Typography>
      {children}
    </Box>
  );
}

function PrintLabel({ children }: { children: React.ReactNode }) {
  return (
    <Typography variant="caption" color="text.secondary"
      sx={{ display: 'block', mb: 0.3 }}>
      {children}
    </Typography>
  );
}

function Field({
  label, value, full = false,
}: {
  label: string;
  value: any;
  full?: boolean;
}) {
  if (!value && value !== 0) return null;
  return (
    <Grid item xs={12} sm={full ? 12 : 6} md={full ? 12 : 4}>
      <PrintLabel>{label}</PrintLabel>
      <Typography sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
        {String(value)}
      </Typography>
    </Grid>
  );
}

export default PrintableJnf;