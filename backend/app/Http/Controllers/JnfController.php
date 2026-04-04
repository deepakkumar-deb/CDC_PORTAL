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
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class JnfController extends Controller
{
    // ── List all JNFs for logged in recruiter ─────────────────
    public function index(Request $request)
    {
        $company = $request->user()->company;

        if (!$company) {
            return response()->json([
                'success' => false,
                'message' => 'Please complete your company profile first.',
            ], 404);
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
                'skills',
                'attachments',
                'eligibilityRule',
                'salaryBreakdowns',
                'allowedPrograms.programDeptMap.program',
                'allowedPrograms.programDeptMap.department',
                'allowedCategories.category',
                'deptCgpa',
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
        $company = $request->user()->company;

        if (!$company) {
            return response()->json([
                'success' => false,
                'message' => 'Please complete your company profile first.',
            ], 404);
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
            'designation'    => 'required|string',
            'location_type'  => 'required|in:onsite,remote,hybrid',
            'openings_count' => 'required|integer|min:1',
        ]);

        $jnf->update([
            'designation'            => $request->designation,
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
            'slp_requirements'       => $request->slp_requirements,
        ]);

        // Save skills (chip tags)
        if ($request->has('skills')) {
            JnfSkill::where('jnf_id', $id)->delete();
            foreach ($request->skills as $skill) {
                JnfSkill::create([
                    'jnf_id'     => $id,
                    'skill_name' => $skill,
                ]);
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
                'min_cgpa'                => $request->min_cgpa,
                'max_backlogs_allowed'    => $request->max_backlogs_allowed,
                'active_backlogs_allowed' => $request->active_backlogs_allowed ?? false,
                'min_class_10_percent'    => $request->min_class_10_percent,
                'min_class_12_percent'    => $request->min_class_12_percent,
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
                    'jnf_id'              => $id,
                    'program_dept_map_id' => $item['program_dept_map_id'],
                    'min_cgpa'            => $item['min_cgpa'],
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
                'ctc_annual'           => $row['ctc_annual'] ?? null,
                'base_fixed'           => $row['base_fixed'] ?? null,
                'monthly_takehome'     => $row['monthly_takehome'] ?? null,
                'gross_salary'         => $row['gross_salary'] ?? null,
                'joining_bonus'        => $row['joining_bonus'] ?? null,
                'retention_bonus'      => $row['retention_bonus'] ?? null,
                'relocation_allowance' => $row['relocation_allowance'] ?? null,
                'medical_allowance'    => $row['medical_allowance'] ?? null,
                'esop_value'           => $row['esop_value'] ?? null,
                'vest_period'          => $row['vest_period'] ?? null,
                'first_year_ctc'       => $row['first_year_ctc'] ?? null,
                'bond_required'        => $row['bond_required'] ?? false,
                'bond_amount'          => $row['bond_amount'] ?? null,
                'bond_duration_months' => $row['bond_duration_months'] ?? null,
                'bond_details'         => $row['bond_details'] ?? null,
                'deductions_text'      => $row['deductions_text'] ?? null,
                'ctc_breakup_notes'    => $row['ctc_breakup_notes'] ?? null,
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
            'status'       => 'submitted',
            'submitted_at' => now(),
        ]);

        // Log approval history
        ApprovalHistory::create([
            'jnf_id'            => $id,
            'action_by_user_id' => $request->user()->id,
            'old_status'        => 'draft',
            'new_status'        => 'submitted',
            'remarks'           => 'Submitted by recruiter.',
        ]);

        return $this->success('JNF submitted successfully. CDC will review it shortly.');
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
}
