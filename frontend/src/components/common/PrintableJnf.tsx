import React, { memo } from 'react';
import {
  Box, Typography, Grid, Chip, Divider, Button,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';

interface Props {
  form: any;
  showDownloadButton?: boolean;
  checkedClauses?: boolean[];
  onToggleClause?: (i: number) => void;
}

const PrintableJnf = memo(({ form, showDownloadButton = true, checkedClauses: externalChecked, onToggleClause }: Props) => {
  const isInf = form.opportunity_type === 'internship';

  // Checkbox state: use parent-provided state if available (persists across hide/show),
  // otherwise fall back to local state
  const [localChecked, setLocalChecked] = React.useState<boolean[]>([false, false, false, false, false]);
  const checkedClauses = externalChecked ?? localChecked;
  const toggleClause = onToggleClause ??
    ((i: number) => setLocalChecked(prev => prev.map((v, idx) => idx === i ? !v : v)));

  const handlePrint = () => {
    window.print();
  };

  if (!form) return null;

  // Build a lookup: program_dept_map_id → display_name
  // Preferred: use display_name directly from program_dept_map (always stored in DB)
  // Fallback: reconstruct from dept + program names
  const programLookup: Record<number, string> = {};
  (form.allowed_programs || []).forEach((ap: any) => {
    const id = ap.program_dept_map_id ?? ap.program_dept_map?.id;
    if (id) {
      programLookup[id] =
        ap.program_dept_map?.display_name ||
        [ap.program_dept_map?.program?.program_name, ap.program_dept_map?.department?.department_name]
          .filter(Boolean).join(' — ') ||
        '';
    }
  });

  return (
    <>
      {/* Inject full-width print CSS */}
      <style>{`
        @media print {
          @page { size: A4; margin: 1cm; }
          body * { visibility: hidden; }
          #print-area, #print-area * { visibility: visible; }
          #print-area {
            position: absolute;
            left: 0; top: 0;
            width: 100% !important;
            max-width: 100% !important;
          }
          .no-print { display: none !important; }
          .MuiDrawer-root, header, nav { display: none !important; }
        }
      `}</style>

      {/* Download Button — hidden during print */}
      {showDownloadButton && (
        <Box className="no-print" sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={handlePrint}
            sx={{
              background: '#660000',
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
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box',
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
                  width: '100%',
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      component="img"
                      src="/logo.webp"
                      sx={{ width: 70, height: 70, objectFit: 'contain' }}
                    />
                  </Box>
                  <Box sx={{ textAlign: 'center', flex: 1, px: 2 }}>
                    <Typography sx={{ color: '#8B0000', fontWeight: 700, fontSize: '1.2rem', lineHeight: 1.1 }}>
                      कैरियर विकास केंद्र
                    </Typography>
                    <Typography sx={{ color: '#1565C0', fontWeight: 600, fontSize: '0.85rem', lineHeight: 1.1 }}>
                      भारतीय प्रौद्योगिकी संस्थान (भारतीय खनि विद्यापीठ), धनबाद
                    </Typography>
                    <Typography sx={{ color: '#455A64', fontSize: '0.65rem', fontWeight: 500, mb: 0.8 }}>
                      धनबाद, झारखंड, भारत, पिन-826004
                    </Typography>

                    <Typography sx={{ color: '#8B0000', fontWeight: 700, fontSize: '1.4rem', lineHeight: 1.1 }}>
                      Career Development Centre
                    </Typography>
                    <Typography sx={{ color: '#1565C0', fontWeight: 600, fontSize: '1rem', lineHeight: 1.1 }}>
                      Indian Institute of Technology (Indian School of Mines), Dhanbad
                    </Typography>
                    <Typography sx={{ color: '#455A64', fontSize: '0.75rem', fontWeight: 500 }}>
                      Dhanbad, Jharkhand, India, Pin-826004
                    </Typography>
                  </Box>
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
                {/* Sub-header */}
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  mb: 3,
                  pb: 1,
                  borderBottom: '2px solid #660000',
                }}>
                  <Box>
                    <Typography sx={{ color: '#660000', fontWeight: 700, fontSize: '1rem', textTransform: 'uppercase' }}>
                      {isInf ? 'Intern Notification Form' : 'Job Notification Form'}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#660000' }}>
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
                              sx={{ background: 'rgba(0,51,102,0.08)', color: '#660000' }} />
                          ))}
                        </Box>
                      </Grid>
                    )}
                  </Grid>
                </Section>

                <Divider sx={{ my: 2 }} />

                {/* Branches Section — use display_name for reliable display */}
                {form.allowed_programs?.length > 0 && (
                  <Section title="Eligible Branches & Programmes">
                    {(() => {
                      // Group by programme type (e.g. "B.Tech", "M.Tech") using display_name prefix
                      const grouped: Record<string, string[]> = {};
                      form.allowed_programs.forEach((p: any) => {
                        // Use display_name (e.g. "B.Tech - Computer Science") or fallback
                        const displayName =
                          p.program_dept_map?.display_name ||
                          programLookup[p.program_dept_map_id] ||
                          [p.program_dept_map?.program?.program_name, p.program_dept_map?.department?.department_name]
                            .filter(Boolean).join(' — ') ||
                          'Unknown';
                        // Extract the programme group from the display_name (text before " - ")
                        const dashIdx = displayName.indexOf(' - ');
                        const group = dashIdx > 0 ? displayName.substring(0, dashIdx) : 'Other';
                        const branch = dashIdx > 0 ? displayName.substring(dashIdx + 3) : displayName;
                        if (!grouped[group]) grouped[group] = [];
                        grouped[group].push(branch);
                      });
                      return Object.entries(grouped).map(([group, branches]) => (
                        <Box key={group} sx={{ mb: 1.5, borderLeft: '3px solid #660000', pl: 1.5, py: 0.5 }}>
                          <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#660000', textTransform: 'uppercase', mb: 0.5 }}>
                            {group}
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {branches.sort().map((b, i) => (
                              <Chip
                                key={i}
                                label={b}
                                size="small"
                                sx={{ fontSize: '0.68rem', background: 'rgba(0,51,102,0.07)', color: '#660000', height: 22 }}
                              />
                            ))}
                          </Box>
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
                        <Field
                          label="Active Backlogs Allowed"
                          value={form.eligibility_rule.active_backlogs_allowed ? 'Yes' : 'No'}
                        />
                        <Field label="Gender Filter" value={form.eligibility_rule.allowed_gender} />
                        <Field label="Min Class 10%" value={form.eligibility_rule.min_class_10_percent} />
                        <Field label="Min Class 12%" value={form.eligibility_rule.min_class_12_percent} />
                        {form.eligibility_rule.additional_text && (
                          <Field label="Additional Notes" value={form.eligibility_rule.additional_text} full />
                        )}
                      </Grid>
                    </Section>

                    {/* Smart CGPA section:
                       - If all dept_cgpa match global values → hide the exceptions box
                       - If some differ → show only those that genuinely differ */}
                    {(() => {
                      const globalCgpa = String(form.eligibility_rule?.min_cgpa ?? '');
                      const globalBacklogs = !!form.eligibility_rule?.active_backlogs_allowed;
                      const exceptions = (form.dept_cgpa || []).filter((dc: any) =>
                        String(dc.min_cgpa) !== globalCgpa ||
                        !!dc.active_backlogs_allowed !== globalBacklogs
                      );

                      if (exceptions.length === 0) return null;

                      return (
                        <Box sx={{ mt: 1, px: 2, py: 2, background: '#fafafa', borderRadius: 1, border: '1px dashed #ccc' }}>
                          <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 1, color: '#660000' }}>
                            Branch-wise CGPA Exceptions (differ from global):
                          </Typography>
                          <Grid container spacing={2}>
                        {exceptions.map((dc: any, idx: number) => {
                              // Use backend-injected branch_name → programLookup → display_name
                              // Never fall back to a bare ID
                              const branchName =
                                (dc.branch_name && dc.branch_name.trim()) ||
                                (programLookup[dc.program_dept_map_id] && programLookup[dc.program_dept_map_id].trim()) ||
                                dc.program_dept_map?.display_name ||
                                'Unknown Branch';
                              const backlogText = dc.active_backlogs_allowed
                                ? '(Active backlogs OK)'
                                : '(No active backlogs)';

                              return (
                                <Grid item xs={12} sm={6} md={4} key={dc.id || idx}>
                                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', fontWeight: 600 }}>
                                    {branchName}:
                                  </Typography>
                                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 700 }}>
                                    {dc.min_cgpa} CGPA {backlogText}
                                  </Typography>
                                </Grid>
                              );
                            })}
                          </Grid>
                        </Box>
                      );
                    })()}

                    <Divider sx={{ my: 2 }} />
                  </>
                )}

                {/* Salary/Stipend */}
                {form.salary_breakdowns?.filter((row: any) => row.ctc_annual || row.base_fixed).length > 0 && (
                  <Section title="Salary Details">
                    {form.salary_breakdowns.filter((row: any) => row.ctc_annual || row.base_fixed).map((row: any, idx: number) => (
                      <Box key={row.id || idx} sx={{ mb: 2, p: 2, border: '1px solid rgba(0,0,0,0.1)', borderRadius: 1 }}>
                        <Typography sx={{ fontWeight: 700, fontSize: '0.8rem', color: '#660000', mb: 1, textTransform: 'uppercase' }}>
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
                        <Typography sx={{ fontWeight: 700, fontSize: '0.8rem', color: '#660000', mb: 1, textTransform: 'uppercase' }}>
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
                        <Box sx={{ minWidth: 28, height: 28, borderRadius: '50%', background: '#660000', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0 }}>
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

                <Divider sx={{ my: 3 }} />

                {/* ── Uniform Declaration ───────────────────────────── */}
                <Box sx={{
                  mt: 2,
                  p: 2.5,
                  border: '1.5px solid #660000',
                  borderRadius: 1,
                  background: '#f9fbff',
                }}>
                  <Typography sx={{
                    fontWeight: 700, fontSize: '0.95rem', textAlign: 'center',
                    mb: 2, color: '#660000', textDecoration: 'underline',
                  }}>
                    Uniform Declaration
                  </Typography>

                  {([
                    <>We have gone through the <strong>AIPC guidelines</strong> thoroughly and agree to abide by the guidelines during the entire process of placement/internship activities. In case of violation of guidelines by us, we understand that an appropriate action may be taken on us as per AIPC guidelines.</>,
                    <>We declare that we would be providing the shortlisting criteria along with the CV-shortlisted and/or Test-shortlisted candidates. We also assure that the details of final shortlisted candidates will be provided within the 24 to 48 hours after the written test.</>,
                    <>The information related to various job/intern profiles posted by us is verified and correct to the best of our knowledge, and the company will abide by the terms and conditions as outlined in these job/intern profiles posted while making the offers. No new clauses/changes would be added/made in the final offer rolled out to the candidates selected on the profile(s). All details have already been outlined in the Job/Internship Notification Forms. In the event of any discrepancy in the final offers, the company may be subject to appropriate actions in accordance with the AIPC guidelines.</>,
                    <>We consent to sharing of company name, logo and email with national ranking agencies and government directives, and to listing company names in social media platforms and press/media.</>,
                    <>I/We confirm that the information pertaining to the posted job profile is accurate and verified to the best of our knowledge. The company commits to adhere to the terms and conditions outlined in these job profiles while extending offers. No new terms would be added without prior approval from CDC, IIT (ISM) Dhanbad.</>,
                  ] as React.ReactNode[]).map((clause, i) => (
                    <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 1.5 }}>
                      <input
                        type="checkbox"
                        checked={checkedClauses[i]}
                        onChange={() => toggleClause(i)}
                        style={{
                          marginTop: 3,
                          width: 16,
                          height: 16,
                          flexShrink: 0,
                          cursor: 'pointer',
                          accentColor: '#660000',
                        }}
                      />
                      <Typography sx={{ fontSize: '0.78rem', lineHeight: 1.6, color: '#222' }}>
                        {clause}
                      </Typography>
                    </Box>
                  ))}

                  <Box sx={{ mt: 2, pt: 1.5, borderTop: '1px dashed #aaa', display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#660000' }}>
                      📎 AIPC Guidelines:
                    </Typography>
                    <Typography
                      component="a"
                      href="/AIPC_Guidelines.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ fontSize: '0.75rem', color: '#1565C0', textDecoration: 'underline', wordBreak: 'break-all' }}
                    >
                      Click here to view AIPC Guidelines
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                      (Read AIPC guidelines before signing)
                    </Typography>
                  </Box>
                </Box>

                {/* Signature block */}
                <Grid container spacing={4} sx={{ mt: 3 }}>
                  <Grid item xs={6}>
                    <Box sx={{ borderTop: '1px solid #333', pt: 1, mt: 5 }}>
                      {(() => {
                        const hrContact = form.company?.contacts?.find((c: any) => c.contact_type === 'hr_head') || 
                                          form.company?.contacts?.[0];
                        return (
                          <>
                            {hrContact && (
                              <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: '#333', mb: 0.2 }}>
                                {hrContact.contact_name}
                              </Typography>
                            )}
                            {hrContact && (
                              <Typography sx={{ fontSize: '0.8rem', color: '#555', mb: 1 }}>
                                {hrContact.designation}
                              </Typography>
                            )}
                          </>
                        );
                      })()}
                      <Typography sx={{ fontSize: '0.75rem', color: '#555', fontWeight: 600 }}>Authorised Signatory</Typography>
                      <Typography sx={{ fontSize: '0.7rem', color: '#888' }}>Name / Designation / Seal</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ borderTop: '1px solid #333', pt: 1, mt: 5, textAlign: 'right' }}>
                      <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: '#333', mb: 0.2 }}>
                        {new Date(form.submitted_at || Date.now()).toLocaleDateString('en-IN')}
                      </Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: '#555', fontWeight: 600 }}>Date</Typography>
                    </Box>
                  </Grid>
                </Grid>

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
        color: '#660000', mb: 1.5,
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