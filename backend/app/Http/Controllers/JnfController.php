<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Jnf;
use App\Models\JnfSkill;
use App\Models\JnfAttachment;
use App\Models\EligibilityRule;
use App\Models\SalaryBreakdown;
use App\Models\JnfAllowedProgram;
use App\Models\JnfAllowedCategory;
use App\Models\JnfDeptCgpa;
use App\Models\SelectionRound;
use App\Models\SelectionInfrastructure;
use App\Models\ApprovalHistory;
// use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;

class JnfController extends Controller
{
    // ── List all JNFs for logged in recruiter ─────────────────
    public function index(Request $request)
    {
        $company = $request->user()->company;

        if (!$company) {
            return response()->json([
                'success' => true,
                'jnfs'    => [],
                'profile_completed' => false,
                'message' => 'Please complete your company profile first.',
            ], 200);
        }

        $jnfs = Jnf::where('company_id', $company->id)
            ->where('opportunity_type', 'job')
            ->orderBy('created_at', 'desc')
            ->get([
                'id',
                'jnf_code',
                'designation',
                'status',
                'recruitment_cycle',
                'created_at'
            ]);

        return response()->json([
            'success' => true,
            'jnfs'    => $jnfs,
        ]);
    }

    // ── Get single JNF with all related data ──────────────────
    public function show(Request $request, $id)
    {
        $company = $request->user()->company;

        if (!$company) {
            return response()->json([
                'success' => false,
                'message' => 'Please complete your company profile first.',
            ], 404);
        }
        $jnf = Jnf::where('id', $id)
            ->where('company_id', $company->id)
            ->with([
                'company.contacts',
                'skills',
                'attachments',
                'eligibilityRule',
                'salaryBreakdowns',
                'allowedPrograms.programDeptMap.program',
                'allowedPrograms.programDeptMap.department',
                'allowedCategories.category',
                'deptCgpa.programDeptMap',
                'selectionRounds',
                'selectionInfrastructure',
            ])
            ->first();

        if (!$jnf) {
            return response()->json([
                'success' => false,
                'message' => 'JNF not found.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'jnf'     => $jnf,
        ]);
    }

    // ── Create new JNF (returns jnf_id for auto-save) ─────────
    public function store(Request $request)
    {
        \Illuminate\Support\Facades\Log::info('JnfController.store hit');
        $company = $request->user()->company;

        if (!$company) {
            return response()->json([
                'success' => false,
                'message' => 'Please complete your company profile first.',
            ], 404);
        }

        // Reuse existing empty draft if available (created in last hour with no designation)
        $existing = Jnf::where('company_id', $company->id)
            ->where('opportunity_type', 'job')
            ->where('status', 'draft')
            ->whereNull('designation')
            ->where('created_at', '>', now()->subHour())
            ->first();

        if ($existing) {
            return response()->json([
                'success' => true,
                'message' => 'Reusing existing empty draft.',
                'jnf_id'  => $existing->id,
                'jnf_code' => $existing->jnf_code,
            ], 200);
        }

        $jnf = Jnf::create([
            'company_id'       => $company->id,
            'opportunity_type' => 'job',
            'status'           => 'draft',
            'jnf_code'         => 'JNF-' . strtoupper(Str::random(8)),
            'recruitment_cycle' => $request->recruitment_cycle ?? date('Y') . '-' . (date('Y') + 1),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'JNF created. Continue filling the form.',
            'jnf_id'  => $jnf->id,
            'jnf_code' => $jnf->jnf_code,
        ], 201);
    }

    // ── Tab 1: Save job details ────────────────────────────────
    public function saveJobDetails(Request $request, $id)
    {
        $jnf = $this->getJnf($request, $id);
        if (!$jnf) return $this->notFound();

        $request->validate([
            'designation'       => 'required|string',
            'location_type'     => 'required|in:onsite,remote,hybrid',
            'openings_count'    => 'required|integer|min:1',
            'recruitment_cycle' => 'nullable|string',
        ]);

        $jnf->update([
            'designation'            => $request->designation,
            'recruitment_cycle'      => $request->recruitment_cycle,
            'department_function'    => $request->department_function,
            'job_description'        => $request->job_description,
            'responsibilities'       => $request->responsibilities,
            'location_type'          => $request->location_type,
            'location_text'          => $request->location_text,
            'openings_count'         => $request->openings_count,
            'min_openings'           => $request->min_openings,
            'tentative_joining_date' => $request->tentative_joining_date,
            'registration_link'      => $request->registration_link,
            'additional_info'        => $request->additional_info,
            'onboarding_procedure'   => $request->onboarding_procedure,
            'slp_requirements'       => $request->slp_requirements,
        ]);

        // Save skills (chip tags)
        if ($request->has('skills')) {
            JnfSkill::where('jnf_id', $id)->delete();
            foreach ($request->skills as $skill) {
                if (!is_null($skill) && trim($skill) !== '') {
                    JnfSkill::create([
                        'jnf_id'     => $id,
                        'skill_name' => trim($skill),
                    ]);
                }
            }
        }

        // Handle JD PDF upload
        if ($request->hasFile('jd_file')) {
            $file = $request->file('jd_file');
            JnfAttachment::create([
                'jnf_id'        => $id,
                'file_type'     => 'jd_pdf',
                'original_name' => $file->getClientOriginalName(),
                'stored_name'   => $file->hashName(),
                'file_path'     => $file->store('jnf_files', 'public'),
                'mime_type'     => $file->getMimeType(),
                'file_size'     => $file->getSize(),
            ]);
        }

        return $this->success('Job details saved.');
    }

    // ── Tab 2: Save eligibility ────────────────────────────────
    public function saveEligibility(Request $request, $id)
    {
        $jnf = $this->getJnf($request, $id);
        if (!$jnf) return $this->notFound();

        // Save eligibility rules
        EligibilityRule::updateOrCreate(
            ['jnf_id' => $id],
            [
                'min_cgpa'                => $this->cleanNum($request->min_cgpa),
                'max_backlogs_allowed'    => $this->cleanNum($request->max_backlogs_allowed, true),
                'active_backlogs_allowed' => $request->active_backlogs_allowed ?? false,
                'min_class_10_percent'    => $this->cleanNum($request->min_class_10_percent),
                'min_class_12_percent'    => $this->cleanNum($request->min_class_12_percent),
                'allowed_gender'          => $request->allowed_gender ?? 'all',
                'additional_text'         => $request->additional_text,
            ]
        );

        // Save allowed programmes
        if ($request->has('program_dept_map_ids')) {
            JnfAllowedProgram::where('jnf_id', $id)->delete();
            foreach ($request->program_dept_map_ids as $mapId) {
                JnfAllowedProgram::create([
                    'jnf_id'             => $id,
                    'program_dept_map_id' => $mapId,
                ]);
            }
        }

        // Save allowed categories
        if ($request->has('category_ids')) {
            JnfAllowedCategory::where('jnf_id', $id)->delete();
            foreach ($request->category_ids as $catId) {
                JnfAllowedCategory::create([
                    'jnf_id'      => $id,
                    'category_id' => $catId,
                ]);
            }
        }

        // Save per-department CGPA
        if ($request->has('dept_cgpa')) {
            JnfDeptCgpa::where('jnf_id', $id)->delete();
            foreach ($request->dept_cgpa as $item) {
                JnfDeptCgpa::create([
                    'jnf_id'                  => $id,
                    'program_dept_map_id'     => $item['program_dept_map_id'],
                    'min_cgpa'                => $item['min_cgpa'],
                    'active_backlogs_allowed' => $item['active_backlogs_allowed'] ?? false,
                ]);
            }
        }

        return $this->success('Eligibility saved.');
    }

    // ── Tab 3: Save salary ─────────────────────────────────────
    public function saveSalary(Request $request, $id)
    {
        $jnf = $this->getJnf($request, $id);
        if (!$jnf) return $this->notFound();

        $request->validate([
            'salary_breakdowns'   => 'required|array',
            'salary_breakdowns.*.programme_type' => 'required|string',
        ]);

        SalaryBreakdown::where('jnf_id', $id)->delete();

        foreach ($request->salary_breakdowns as $row) {
            SalaryBreakdown::create([
                'jnf_id'               => $id,
                'programme_type'       => $row['programme_type'],
                'currency'             => $row['currency'] ?? 'INR',
                'ctc_annual'           => $this->cleanNum($row['ctc_annual']),
                'base_fixed'           => $this->cleanNum($row['base_fixed']),
                'monthly_takehome'     => $this->cleanNum($row['monthly_takehome']),
                'gross_salary'         => $this->cleanNum($row['gross_salary']),
                'joining_bonus'        => $row['joining_bonus'] ?? null,
                'retention_bonus'      => $row['retention_bonus'] ?? null,
                'relocation_allowance' => $row['relocation_allowance'] ?? null,
                'medical_allowance'    => $row['medical_allowance'] ?? null,
                'esop_value'           => $this->cleanNum($row['esop_value']),
                'vest_period'          => $row['vest_period'] ?? null,
                'first_year_ctc'       => $this->cleanNum($row['first_year_ctc']),
                'bond_required'        => $row['bond_required'] ?? false,
                'bond_amount'          => $this->cleanNum($row['bond_amount']),
                'bond_duration_months' => $this->cleanNum($row['bond_duration_months'], true),
                'bond_details'         => $row['bond_details'] ?? null,
                'deductions_text'      => $row['deductions_text'] ?? null,
                'ctc_breakup_notes'    => $row['ctc_breakup_notes'] ?? null,
                'variable_performance_bonus' => $row['variable_performance_bonus'] ?? null,
                'stocks_options'       => $row['stocks_options'] ?? null,
            ]);
        }

        return $this->success('Salary details saved.');
    }

    // ── Tab 4: Save selection process ─────────────────────────
    public function saveSelection(Request $request, $id)
    {
        $jnf = $this->getJnf($request, $id);
        if (!$jnf) return $this->notFound();

        // Save rounds
        if ($request->has('rounds')) {
            SelectionRound::where('jnf_id', $id)->delete();
            foreach ($request->rounds as $round) {
                SelectionRound::create([
                    'jnf_id'               => $id,
                    'round_order'          => $round['round_order'],
                    'round_type'           => $round['round_type'],
                    'mode'                 => $round['mode'] ?? null,
                    'test_type'            => $round['test_type'] ?? null,
                    'interview_mode'       => $round['interview_mode'] ?? null,
                    'description'          => $round['description'] ?? null,
                    'tentative_date'       => $round['tentative_date'] ?? null,
                    'duration_minutes'     => $round['duration_minutes'] ?? null,
                    'is_elimination_round' => $round['is_elimination_round'] ?? false,
                ]);
            }
        }

        // Save infrastructure
        SelectionInfrastructure::updateOrCreate(
            ['jnf_id' => $id],
            [
                'rooms_required'        => $request->rooms_required,
                'team_members_required' => $request->team_members_required,
                'psychometric_test'     => $request->psychometric_test ?? false,
                'medical_test'          => $request->medical_test ?? false,
                'proctoring_required'   => $request->proctoring_required ?? false,
                'other_screening'       => $request->other_screening,
            ]
        );

        return $this->success('Selection process saved.');
    }

    // ── Tab 5: Submit JNF ─────────────────────────────────────
    public function submit(Request $request, $id)
    {
        $jnf = $this->getJnf($request, $id);
        if (!$jnf) return $this->notFound();

        if ($jnf->status !== 'draft') {
            return response()->json([
                'success' => false,
                'message' => 'JNF already submitted.',
            ], 409);
        }

        $jnf->update([
            'status' => 'submitted',
            'submitted_at' => now(),
        ]);

        // Log approval history
        ApprovalHistory::create([
            'jnf_id' => $id,
            'action_by_user_id' => $request->user()->id,
            'old_status' => 'draft',
            'new_status' => 'submitted',
            'remarks' => 'Submitted by recruiter.',
        ]);

        // ✅ SEND EMAIL TO ADMIN
        $this->sendAdminNotification($jnf);

        return $this->success('JNF submitted successfully. CDC will review it shortly.');
    }

    // ── Request Edit (recruiter emails admin to request changes) ─
    public function requestEdit(Request $request, $id)
    {
        $jnf = $this->getJnf($request, $id);
        if (!$jnf) return $this->notFound();

        $jnf->update([
            'is_edit_requested' => true,
            'edit_reason'       => $request->reason
        ]);

        $request->validate([
            'reason' => 'required|string|max:2000',
        ]);

        $adminEmail = env('ADMIN_EMAIL', 'deepakk51688@gmail.com');
        $recruiter  = $request->user();
        $company    = $jnf->company;

        $subject = "[Edit Request] JNF {$jnf->jnf_code} - {$company->company_name}";
        $body  = "A recruiter has requested an edit to a submitted JNF.\n\n";
        $body .= str_repeat('-', 40) . "\n";
        $body .= "JNF Code       : {$jnf->jnf_code}\n";
        $body .= "Company        : {$company->company_name}\n";
        $body .= "Designation    : {$jnf->designation}\n";
        $body .= "Current Status : {$jnf->status}\n";
        $body .= str_repeat('-', 40) . "\n\n";
        $body .= "Recruiter      : {$recruiter->name}\n";
        $body .= "Recruiter Email: {$recruiter->email}\n\n";
        $body .= "Edit Reason:\n{$request->reason}\n\n";
        $body .= "Admin Panel: " . env('APP_URL', 'http://localhost:3000') . "/admin";

        Mail::raw($body, function ($mail) use ($adminEmail, $recruiter, $subject) {
            $mail->to($adminEmail)
                ->replyTo($recruiter->email, $recruiter->name)
                ->subject($subject);
        });

        return $this->success('Your edit request has been sent to the CDC admin.');
    }

    // ── Send admin notification on new JNF submission ────────
    private function sendAdminNotification($jnf)
    {
        $adminEmail = env('ADMIN_EMAIL', 'deepakk51688@gmail.com');
        $company    = $jnf->company;

        $subject = "[New JNF] {$jnf->jnf_code} - {$company->company_name}";
        $body  = "A new Job Notification Form has been submitted for review.\n\n";
        $body .= str_repeat('-', 40) . "\n";
        $body .= "JNF Code         : {$jnf->jnf_code}\n";
        $body .= "Company          : {$company->company_name}\n";
        $body .= "Designation      : {$jnf->designation}\n";
        $body .= "Recruitment Cycle: {$jnf->recruitment_cycle}\n";
        $body .= "Submitted At     : " . date('d/m/Y h:i A', strtotime($jnf->submitted_at)) . "\n";
        $body .= str_repeat('-', 40) . "\n\n";
        $body .= "Login to the admin panel to review:\n";
        $body .= env('APP_URL', 'http://localhost:3000') . "/admin";

        Mail::raw($body, function ($mail) use ($adminEmail, $subject) {
            $mail->to($adminEmail)
                ->subject($subject);
        });
    }


    // ── Delete JNF (only drafts) ──────────────────────────────
    public function destroy(Request $request, $id)
    {
        $jnf = $this->getJnf($request, $id);
        if (!$jnf) return $this->notFound();

        if ($jnf->status !== 'draft') {
            return response()->json([
                'success' => false,
                'message' => 'Only draft JNFs can be deleted.',
            ], 403);
        }

        $jnf->delete();

        return $this->success('JNF deleted.');
    }

    // ── Helper methods ────────────────────────────────────────
    private function getJnf(Request $request, $id)
    {
        $company = $request->user()->company;
        if (!$company) return null;
        return Jnf::where('id', $id)
            ->where('company_id', $company->id)
            ->first();
    }

    private function notFound()
    {
        return response()->json([
            'success' => false,
            'message' => 'JNF not found.',
        ], 404);
    }

    private function success($message)
    {
        return response()->json([
            'success' => true,
            'message' => $message,
        ]);
    }

    private function cleanNum($val, $integer = false)
    {
        if (!$val || is_bool($val)) return null;
        if (is_numeric($val)) return $val;

        // Remove commas, spaces, currency symbols
        $cleaned = preg_replace('/[^\d.]/', '', (string)$val);
        if ($cleaned === '' || $cleaned === '.') return null;

        return $integer ? (int)$cleaned : (float)$cleaned;
    }

    // ■■ Duplicate a JNF ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
    public function duplicate(Request $request, $id)
    {
        $company = $request->user()->company;
        if (!$company) return $this->notFound();

        // Find original JNF
        $original = Jnf::where('id', $id)
            ->where('company_id', $company->id)
            ->with([
                'skills',
                'eligibilityRule',
                'salaryBreakdowns',
                'allowedPrograms',
                'allowedCategories',
                'deptCgpa',
                'selectionRounds',
                'selectionInfrastructure',
                'infDetail',
                'infStipendBreakdowns',
                'infCompensationPerks',
            ])
            ->first();

        if (!$original) return $this->notFound();

        // Create new JNF as draft with copied data
        $new = Jnf::create([
            'company_id'                => $company->id,
            'opportunity_type'          => $original->opportunity_type,
            'status'                    => 'draft',
            'jnf_code'                  => ($original->opportunity_type === 'internship' ? 'INF-' : 'JNF-') . strtoupper(\Illuminate\Support\Str::random(8)),
            'recruitment_cycle'         => date('Y') . '-' . (date('Y') + 1),
            'designation'               => $original->designation . ' (Copy)',
            'internship_title'          => $original->internship_title ? $original->internship_title . ' (Copy)' : null,
            'department_function'       => $original->department_function,
            'job_description'           => $original->job_description,
            'responsibilities'          => $original->responsibilities,
            'location_type'             => $original->location_type,
            'location_text'             => $original->location_text,
            'openings_count'            => $original->openings_count,
            'min_openings'              => $original->min_openings,
            'tentative_joining_date'    => $original->tentative_joining_date,
            'internship_duration_months' => $original->internship_duration_months,
            'expected_duration'         => $original->expected_duration,
            'ppo_offered'               => $original->ppo_offered,
            'registration_link'         => $original->registration_link,
            'additional_info'           => $original->additional_info,
            'onboarding_procedure'      => $original->onboarding_procedure,
            'slp_requirements'          => $original->slp_requirements,
        ]);

        // Copy skills
        foreach ($original->skills as $skill) {
            if (!is_null($skill->skill_name) && trim($skill->skill_name) !== '') {
                \App\Models\JnfSkill::create([
                    'jnf_id'     => $new->id,
                    'skill_name' => trim($skill->skill_name),
                ]);
            }
        }

        // Copy eligibility rules
        if ($original->eligibilityRule) {
            \App\Models\EligibilityRule::create([
                'jnf_id'                  => $new->id,
                'min_cgpa'                => $original->eligibilityRule->min_cgpa,
                'max_backlogs_allowed'    => $original->eligibilityRule->max_backlogs_allowed,
                'active_backlogs_allowed' => $original->eligibilityRule->active_backlogs_allowed,
                'min_class_10_percent'    => $original->eligibilityRule->min_class_10_percent,
                'min_class_12_percent'    => $original->eligibilityRule->min_class_12_percent,
                'allowed_gender'          => $original->eligibilityRule->allowed_gender,
                'additional_text'         => $original->eligibilityRule->additional_text,
            ]);
        }

        // Copy salary breakdowns
        foreach ($original->salaryBreakdowns as $row) {
            \App\Models\SalaryBreakdown::create([
                'jnf_id'               => $new->id,
                'programme_type'       => $row->programme_type,
                'currency'             => $row->currency,
                'ctc_annual'           => $row->ctc_annual,
                'base_fixed'           => $row->base_fixed,
                'monthly_takehome'     => $row->monthly_takehome,
                'gross_salary'         => $row->gross_salary,
                'joining_bonus'        => $row->joining_bonus,
                'retention_bonus'      => $row->retention_bonus,
                'relocation_allowance' => $row->relocation_allowance,
                'medical_allowance'    => $row->medical_allowance,
                'esop_value'           => $row->esop_value,
                'vest_period'          => $row->vest_period,
                'first_year_ctc'       => $row->first_year_ctc,
                'bond_required'        => $row->bond_required,
                'bond_amount'          => $row->bond_amount,
                'bond_duration_months' => $row->bond_duration_months,
                'bond_details'         => $row->bond_details,
                'deductions_text'      => $row->deductions_text,
                'ctc_breakup_notes'    => $row->ctc_breakup_notes,
                'variable_performance_bonus' => $row->variable_performance_bonus,
                'stocks_options'       => $row->stocks_options,
            ]);
        }

        // Copy allowed programs
        foreach ($original->allowedPrograms as $p) {
            \App\Models\JnfAllowedProgram::create([
                'jnf_id'             => $new->id,
                'program_dept_map_id' => $p->program_dept_map_id,
            ]);
        }

        // Copy allowed categories
        foreach ($original->allowedCategories as $c) {
            \App\Models\JnfAllowedCategory::create([
                'jnf_id'      => $new->id,
                'category_id' => $c->category_id,
            ]);
        }

        // Copy selection rounds
        foreach ($original->selectionRounds as $round) {
            \App\Models\SelectionRound::create([
                'jnf_id'               => $new->id,
                'round_order'          => $round->round_order,
                'round_type'           => $round->round_type,
                'mode'                 => $round->mode,
                'test_type'            => $round->test_type,
                'interview_mode'       => $round->interview_mode,
                'description'          => $round->description,
                'duration_minutes'     => $round->duration_minutes,
                'is_elimination_round' => $round->is_elimination_round,
            ]);
        }

        // Copy selection infrastructure
        if ($original->selectionInfrastructure) {
            \App\Models\SelectionInfrastructure::create([
                'jnf_id'                 => $new->id,
                'rooms_required'         => $original->selectionInfrastructure->rooms_required,
                'team_members_required'  => $original->selectionInfrastructure->team_members_required,
                'psychometric_test'      => $original->selectionInfrastructure->psychometric_test,
                'medical_test'           => $original->selectionInfrastructure->medical_test,
                'proctoring_required'    => $original->selectionInfrastructure->proctoring_required,
                'other_screening'        => $original->selectionInfrastructure->other_screening,
            ]);
        }

        // Copy INF specific data if internship
        if ($original->opportunity_type === 'internship') {
            if ($original->infDetail) {
                \App\Models\InfDetail::create([
                    'jnf_id'                  => $new->id,
                    'internship_type'         => $original->infDetail->internship_type,
                    'duration_months'         => $original->infDetail->duration_months,
                    'ppo_offered'             => $original->infDetail->ppo_offered,
                    'ppo_ctc_expected'        => $original->infDetail->ppo_ctc_expected,
                    'accommodation_provided'  => $original->infDetail->accommodation_provided,
                    'accommodation_details'   => $original->infDetail->accommodation_details,
                    'travel_allowance'        => $original->infDetail->travel_allowance,
                    'travel_allowance_details' => $original->infDetail->travel_allowance_details,
                    'certificate_provided'    => $original->infDetail->certificate_provided,
                    'work_from_home_allowed'  => $original->infDetail->work_from_home_allowed,
                ]);
            }

            foreach ($original->infStipendBreakdowns as $row) {
                \App\Models\InfStipendBreakdown::create([
                    'jnf_id'          => $new->id,
                    'programme_type'  => $row->programme_type,
                    'currency'        => $row->currency,
                    'base_stipend'    => $row->base_stipend,
                    'hra_housing'     => $row->hra_housing,
                    'variable_pay'    => $row->variable_pay,
                    'other_allowance' => $row->other_allowance,
                    'total_stipend'   => $row->total_stipend,
                ]);
            }

            foreach ($original->infCompensationPerks as $perk) {
                \App\Models\InfCompensationPerk::create([
                    'jnf_id'          => $new->id,
                    'programme_type'  => $perk->programme_type,
                    'perk_label'      => $perk->perk_label,
                    'perk_value'      => $perk->perk_value,
                    'display_order'   => $perk->display_order,
                ]);
            }
        }

        return response()->json([
            'success'  => true,
            'message'  => 'JNF duplicated successfully as a new draft.',
            'jnf_id'   => $new->id,
            'jnf_code' => $new->jnf_code,
        ], 201);
    }
}
