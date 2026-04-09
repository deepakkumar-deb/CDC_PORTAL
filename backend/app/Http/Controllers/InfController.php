<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Jnf;
use App\Models\InfDetail;
use App\Models\InfStipendBreakdown;
use App\Models\InfCompensationPerk;
use App\Models\JnfSkill;
use App\Models\JnfAttachment;
use App\Models\EligibilityRule;
use App\Models\JnfAllowedProgram;
use App\Models\JnfAllowedCategory;
use App\Models\SelectionRound;
use App\Models\SelectionInfrastructure;
use App\Models\ApprovalHistory;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;

class InfController extends Controller
{
    // ── List all INFs ─────────────────────────────────────────
    public function index(Request $request)
    {
        $company = $request->user()->company;
        if (!$company) return $this->noCompany();

        $infs = Jnf::where('company_id', $company->id)
            ->where('opportunity_type', 'internship')
            ->orderBy('created_at', 'desc')
            ->get(['id','jnf_code','internship_title',
                   'status','recruitment_cycle','created_at']);

        return response()->json(['success' => true, 'infs' => $infs]);
    }

    // ── Get single INF ────────────────────────────────────────
    public function show(Request $request, $id)
    {
        $company = $request->user()->company;
        $jnf = Jnf::where('id', $id)
            ->where('company_id', $company->id)
            ->where('opportunity_type', 'internship')
            ->with([
                'skills', 'attachments', 'eligibilityRule',
                'infDetail', 'infStipendBreakdowns',
                'infCompensationPerks',
                'allowedPrograms.programDeptMap.program',
                'allowedPrograms.programDeptMap.department',
                'selectionRounds', 'selectionInfrastructure',
            ])
            ->first();

        if (!$jnf) return $this->notFound();

        return response()->json(['success' => true, 'inf' => $jnf]);
    }

    // ── Create new INF ────────────────────────────────────────
    public function store(Request $request)
    {
        $company = $request->user()->company;
        if (!$company) return $this->noCompany();

        // Reuse existing empty draft if available (created in last hour with no internship_title)
        $existing = Jnf::where('company_id', $company->id)
            ->where('opportunity_type', 'internship')
            ->where('status', 'draft')
            ->whereNull('internship_title')
            ->where('created_at', '>', now()->subHour())
            ->first();

        if ($existing) {
            return response()->json([
                'success' => true,
                'message' => 'Reusing existing empty draft.',
                'jnf_id'  => $existing->id,
                'inf_code' => $existing->jnf_code,
            ], 200);
        }

        $jnf = Jnf::create([
            'company_id'        => $company->id,
            'opportunity_type'  => 'internship',
            'status'            => 'draft',
            'jnf_code'          => 'INF-' . strtoupper(Str::random(8)),
            'recruitment_cycle' => $request->recruitment_cycle
                                    ?? date('Y') . '-' . (date('Y') + 1),
        ]);

        return response()->json([
            'success'  => true,
            'message'  => 'INF created. Continue filling the form.',
            'jnf_id'   => $jnf->id,
            'inf_code' => $jnf->jnf_code,
        ], 201);
    }

    // ── Tab 1: Save internship profile ────────────────────────
    public function saveInternProfile(Request $request, $id)
    {
        $jnf = $this->getInf($request, $id);
        if (!$jnf) return $this->notFound();

        $request->validate([
            'internship_title' => 'required|string',
            'location_type'    => 'required|in:onsite,remote,hybrid',
            'openings_count'   => 'required|integer|min:1',
        ]);

        $jnf->update([
            'internship_title'           => $request->internship_title,
            'designation'                => $request->designation,
            'department_function'        => $request->department_function,
            'job_description'            => $request->job_description,
            'responsibilities'           => $request->responsibilities,
            'location_type'              => $request->location_type,
            'location_text'              => $request->location_text,
            'openings_count'             => $request->openings_count,
            'min_openings'               => $request->min_openings,
            'tentative_joining_date'     => $request->tentative_joining_date,
            'expected_duration'          => $request->expected_duration,
            'internship_duration_months' => $request->internship_duration_months,
            'registration_link'          => $request->registration_link,
            'additional_info'            => $request->additional_info,
            'slp_requirements'           => $request->slp_requirements,
        ]);

        // Save INF-specific details
        InfDetail::updateOrCreate(
            ['jnf_id' => $id],
            [
                'internship_type'         => $request->internship_type,
                'duration_months'         => $request->duration_months,
                'ppo_offered'             => $request->ppo_offered ?? false,
                'ppo_ctc_expected'        => $request->ppo_ctc_expected,
                'accommodation_provided'  => $request->accommodation_provided ?? false,
                'accommodation_details'   => $request->accommodation_details,
                'travel_allowance'        => $request->travel_allowance ?? false,
                'travel_allowance_details'=> $request->travel_allowance_details,
                'certificate_provided'    => $request->certificate_provided ?? true,
                'work_from_home_allowed'  => $request->work_from_home_allowed ?? false,
            ]
        );

        // Save skills
        if ($request->has('skills')) {
            JnfSkill::where('jnf_id', $id)->delete();
            foreach ($request->skills as $skill) {
                JnfSkill::create(['jnf_id' => $id, 'skill_name' => $skill]);
            }
        }

        // Handle ID PDF upload
        if ($request->hasFile('id_file')) {
            $file = $request->file('id_file');
            JnfAttachment::create([
                'jnf_id'        => $id,
                'file_type'     => 'id_pdf',
                'original_name' => $file->getClientOriginalName(),
                'stored_name'   => $file->hashName(),
                'file_path'     => $file->store('inf_files', 'public'),
                'mime_type'     => $file->getMimeType(),
                'file_size'     => $file->getSize(),
            ]);
        }

        return $this->success('Internship profile saved.');
    }

    // ── Tab 2: Save eligibility (reuses same logic as JNF) ────
    public function saveEligibility(Request $request, $id)
    {
        $jnf = $this->getInf($request, $id);
        if (!$jnf) return $this->notFound();

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

        if ($request->has('program_dept_map_ids')) {
            JnfAllowedProgram::where('jnf_id', $id)->delete();
            foreach ($request->program_dept_map_ids as $mapId) {
                JnfAllowedProgram::create([
                    'jnf_id'              => $id,
                    'program_dept_map_id' => $mapId,
                ]);
            }
        }

        if ($request->has('category_ids')) {
            JnfAllowedCategory::where('jnf_id', $id)->delete();
            foreach ($request->category_ids as $catId) {
                JnfAllowedCategory::create([
                    'jnf_id'      => $id,
                    'category_id' => $catId,
                ]);
            }
        }

        return $this->success('Eligibility saved.');
    }

    // ── Tab 3: Save stipend details ───────────────────────────
    public function saveStipend(Request $request, $id)
    {
        $jnf = $this->getInf($request, $id);
        if (!$jnf) return $this->notFound();

        $request->validate([
            'stipend_breakdowns' => 'required|array',
            'stipend_breakdowns.*.programme_type' => 'required|string',
        ]);

        InfStipendBreakdown::where('jnf_id', $id)->delete();

        foreach ($request->stipend_breakdowns as $row) {
            InfStipendBreakdown::create([
                'jnf_id'           => $id,
                'programme_type'   => $row['programme_type'],
                'currency'         => $row['currency'] ?? 'INR',
                'base_stipend'     => $row['base_stipend'] ?? null,
                'hra_housing'      => $row['hra_housing'] ?? null,
                'variable_pay'     => $row['variable_pay'] ?? null,
                'other_allowance'  => $row['other_allowance'] ?? null,
                'total_stipend'    => $row['total_stipend'] ?? null,
            ]);
        }

        // Save perks
        if ($request->has('perks')) {
            InfCompensationPerk::where('jnf_id', $id)->delete();
            foreach ($request->perks as $index => $perk) {
                InfCompensationPerk::create([
                    'jnf_id'          => $id,
                    'programme_type'  => $perk['programme_type'],
                    'perk_label'      => $perk['perk_label'],
                    'perk_value'      => $perk['perk_value'] ?? null,
                    'display_order'   => $index,
                ]);
            }
        }

        return $this->success('Stipend details saved.');
    }

    // ── Tab 4: Save selection process ─────────────────────────
    public function saveSelection(Request $request, $id)
    {
        $jnf = $this->getInf($request, $id);
        if (!$jnf) return $this->notFound();

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

    // ── Submit INF ────────────────────────────────────────────
    public function submit(Request $request, $id)
{
    $jnf = $this->getInf($request, $id);
    if (!$jnf) return $this->notFound();

    if ($jnf->status !== 'draft') {
        return response()->json([
            'success' => false,
            'message' => 'INF already submitted.',
        ], 409);
    }

    $jnf->update([
        'status' => 'submitted',
        'submitted_at' => now(),
    ]);

    ApprovalHistory::create([
        'jnf_id' => $id,
        'action_by_user_id' => $request->user()->id,
        'old_status' => 'draft',
        'new_status' => 'submitted',
        'remarks' => 'INF submitted by recruiter.',
    ]);

    // ✅ SEND EMAIL TO ADMIN
    $this->sendAdminNotification($jnf);

    return $this->success('INF submitted. CDC will review it shortly.');
}

// ── Request Edit (recruiter emails admin to request changes) ─
    public function requestEdit(Request $request, $id)
    {
        $jnf = $this->getInf($request, $id);
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

        $subject = "[Edit Request] INF {$jnf->jnf_code} - {$company->company_name}";
        $body  = "A recruiter has requested an edit to a submitted INF.\n\n";
        $body .= str_repeat('-', 40) . "\n";
        $body .= "INF Code         : {$jnf->jnf_code}\n";
        $body .= "Company          : {$company->company_name}\n";
        $body .= "Internship Title : {$jnf->internship_title}\n";
        $body .= "Current Status   : {$jnf->status}\n";
        $body .= str_repeat('-', 40) . "\n\n";
        $body .= "Recruiter        : {$recruiter->name}\n";
        $body .= "Recruiter Email  : {$recruiter->email}\n\n";
        $body .= "Edit Reason:\n{$request->reason}\n\n";
        $body .= "Admin Panel: " . env('APP_URL', 'http://localhost:3000') . "/admin";

        Mail::raw($body, function ($mail) use ($adminEmail, $recruiter, $subject) {
            $mail->to($adminEmail)
                 ->replyTo($recruiter->email, $recruiter->name)
                 ->subject($subject);
        });

        return $this->success('Your edit request has been sent to the CDC admin.');
    }

// ── Send admin notification on new INF submission ────────
    private function sendAdminNotification($jnf)
    {
        $adminEmail = env('ADMIN_EMAIL', 'deepakk51688@gmail.com');
        $company    = $jnf->company;

        $subject = "[New INF] {$jnf->jnf_code} - {$company->company_name}";
        $body  = "A new Internship Notification Form has been submitted for review.\n\n";
        $body .= str_repeat('-', 40) . "\n";
        $body .= "INF Code         : {$jnf->jnf_code}\n";
        $body .= "Company          : {$company->company_name}\n";
        $body .= "Internship Title : {$jnf->internship_title}\n";
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

    // ── Helpers ───────────────────────────────────────────────
    private function getInf(Request $request, $id)
    {
        $company = $request->user()->company;
        if (!$company) return null;
        return Jnf::where('id', $id)
            ->where('company_id', $company->id)
            ->where('opportunity_type', 'internship')
            ->first();
    }

    private function notFound()
    {
        return response()->json([
            'success' => false,
            'message' => 'INF not found.',
        ], 404);
    }

    private function noCompany()
    {
        return response()->json([
            'success' => false,
            'message' => 'Please complete your company profile first.',
        ], 404);
    }

    private function success($message)
    {
        return response()->json([
            'success' => true,
            'message' => $message,
        ]);
    }
    // ── Delete INF (only drafts) ──────────────────────────────
    public function destroy(Request $request, $id)
    {
        $jnf = $this->getInf($request, $id);
        if (!$jnf) return $this->notFound();

        if ($jnf->status !== 'draft') {
            return response()->json([
                'success' => false,
                'message' => 'Only draft INFs can be deleted.',
            ], 403);
        }

        $jnf->delete();

        return $this->success('INF deleted.');
    }
}