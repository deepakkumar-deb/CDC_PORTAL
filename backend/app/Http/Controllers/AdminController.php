<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Jnf;
use App\Models\ApprovalHistory;
use App\Models\Notification;

class AdminController extends Controller
{
    // List all submitted JNFs and INFs
    public function listForms(Request $request)
    {
        $status = $request->query('status', 'submitted');
        $type   = $request->query('type', 'all');

        $query = Jnf::with('company')
            ->where('status', $status)
            ->orderBy('submitted_at', 'desc');

        if ($type !== 'all') {
            $query->where('opportunity_type', $type === 'inf' ? 'internship' : 'job');
        }

        return response()->json([
            'success' => true,
            'forms' => $query->get([
                'id', 'jnf_code', 'opportunity_type',
                'designation', 'internship_title',
                'status', 'submitted_at', 'company_id',
            ]),
        ]);
    }

    // Get full detail of one form
    public function showForm($id)
    {
        $jnf = Jnf::with([
            'company.contacts', 'skills', 'eligibilityRule',
            'salaryBreakdowns', 'infStipendBreakdowns',
            'allowedPrograms.programDeptMap.program',
            'allowedPrograms.programDeptMap.department',
            'selectionRounds', 'selectionInfrastructure',
            'approvalHistory.actionBy',
        ])->findOrFail($id);

        return response()->json(['success' => true, 'form' => $jnf]);
    }

    // Approve a form
    public function approve(Request $request, $id)
    {
        $jnf = Jnf::findOrFail($id);

        if ($jnf->status !== 'submitted') {
            return response()->json([
                'success' => false,
                'message' => 'Only submitted forms can be approved.',
            ], 409);
        }

        $jnf->update([
            'status'      => 'approved',
            'approved_by' => $request->user()->id,
            'approved_at' => now(),
            'admin_notes' => $request->admin_notes,
        ]);

        ApprovalHistory::create([
            'jnf_id'           => $id,
            'action_by_user_id'=> $request->user()->id,
            'old_status'       => 'submitted',
            'new_status'       => 'approved',
            'remarks'          => $request->admin_notes ?? 'Approved by admin.',
        ]);

        // Notify recruiter
        Notification::create([
            'user_id'      => $jnf->company->user_id,
            'type'         => 'form_approved',
            'title'        => 'Your form has been approved!',
            'message'      => "Your form {$jnf->jnf_code} has been approved by CDC.",
            'related_id'   => $jnf->id,
            'related_type' => $jnf->opportunity_type,
        ]);

        return response()->json(['success' => true, 'message' => 'Form approved.']);
    }

    // Reject a form
    public function reject(Request $request, $id)
    {
        $request->validate([
            'rejection_reason' => 'required|string',
        ]);

        $jnf = Jnf::findOrFail($id);

        if ($jnf->status !== 'submitted') {
            return response()->json([
                'success' => false,
                'message' => 'Only submitted forms can be rejected.',
            ], 409);
        }

        $jnf->update([
            'status'           => 'rejected',
            'rejection_reason' => $request->rejection_reason,
            'admin_notes'      => $request->admin_notes,
        ]);

        ApprovalHistory::create([
            'jnf_id'           => $id,
            'action_by_user_id'=> $request->user()->id,
            'old_status'       => 'submitted',
            'new_status'       => 'rejected',
            'remarks'          => $request->rejection_reason,
        ]);

        Notification::create([
            'user_id'      => $jnf->company->user_id,
            'type'         => 'form_rejected',
            'title'        => 'Your form needs revision.',
            'message'      => "Your form {$jnf->jnf_code} was rejected. Reason: {$request->rejection_reason}",
            'related_id'   => $jnf->id,
            'related_type' => $jnf->opportunity_type,
        ]);

        return response()->json(['success' => true, 'message' => 'Form rejected.']);
    }

    // Allow Edit — revert form back to draft so recruiter can edit
    public function allowEdit(Request $request, $id)
    {
        $jnf = Jnf::findOrFail($id);

        if ($jnf->status === 'draft') {
            return response()->json([
                'success' => false,
                'message' => 'Form is already in draft.',
            ], 409);
        }

        $oldStatus = $jnf->status;

        $jnf->update([
            'status'           => 'draft',
            'rejection_reason' => null,
            'admin_notes'      => $request->admin_notes,
        ]);

        ApprovalHistory::create([
            'jnf_id'            => $id,
            'action_by_user_id' => $request->user()->id,
            'old_status'        => $oldStatus,
            'new_status'        => 'draft',
            'remarks'           => $request->admin_notes ?? 'Admin allowed recruiter to edit this form.',
        ]);

        Notification::create([
            'user_id'      => $jnf->company->user_id,
            'type'         => 'edit_allowed',
            'title'        => 'You can now edit your form!',
            'message'      => "CDC admin has allowed you to edit {$jnf->jnf_code}. Please make the required changes and resubmit.",
            'related_id'   => $jnf->id,
            'related_type' => $jnf->opportunity_type,
        ]);

        return response()->json(['success' => true, 'message' => 'Form reverted to draft. Recruiter can now edit it.']);
    }

    // Admin directly edits form fields on behalf of recruiter
    public function adminEditFields(Request $request, $id)
    {
        $jnf = Jnf::with(['skills', 'salaryBreakdowns', 'infStipendBreakdowns'])
                   ->findOrFail($id);

        $isInf = $jnf->opportunity_type === 'internship';

        // Update main JNF fields
        $fillable = [
            'designation', 'internship_title', 'department_function',
            'job_description', 'responsibilities',
            'location_type', 'location_text',
            'openings_count', 'min_openings',
            'additional_info', 'registration_link',
        ];
        $data = [];
        foreach ($fillable as $field) {
            if ($request->has($field)) {
                $data[$field] = $request->input($field);
            }
        }
        if (!empty($data)) {
            $jnf->update($data);
        }

        // Update skills if provided
        if ($request->has('skills')) {
            \App\Models\JnfSkill::where('jnf_id', $id)->delete();
            foreach ($request->skills as $skill) {
                if (trim($skill)) {
                    \App\Models\JnfSkill::create(['jnf_id' => $id, 'skill_name' => trim($skill)]);
                }
            }
        }

        // Patch first salary row (JNF)
        if (!$isInf && $request->has('salary_patch')) {
            $row = \App\Models\SalaryBreakdown::where('jnf_id', $id)->first();
            if ($row) {
                $patch = array_filter((array) $request->salary_patch, fn($v) => $v !== null && $v !== '');
                $row->update($patch);
            }
        }

        // Patch first stipend row (INF)
        if ($isInf && $request->has('stipend_patch')) {
            $row = \App\Models\InfStipendBreakdown::where('jnf_id', $id)->first();
            if ($row) {
                $patch = array_filter((array) $request->stipend_patch, fn($v) => $v !== null && $v !== '');
                $row->update($patch);
            }
        }

        // Log admin edit
        ApprovalHistory::create([
            'jnf_id'            => $id,
            'action_by_user_id' => $request->user()->id,
            'old_status'        => $jnf->status,
            'new_status'        => $jnf->status,
            'remarks'           => 'Admin applied field edits on behalf of recruiter. Note: ' . ($request->edit_note ?? 'No note provided.'),
        ]);

        // Notify recruiter
        Notification::create([
            'user_id'      => $jnf->company->user_id,
            'type'         => 'admin_edited',
            'title'        => 'Your form has been updated by CDC admin.',
            'message'      => "CDC admin has applied the requested changes to {$jnf->jnf_code}.",
            'related_id'   => $jnf->id,
            'related_type' => $jnf->opportunity_type,
        ]);

        return response()->json(['success' => true, 'message' => 'Form fields updated successfully.']);
    }

    // Dashboard stats for admin
    public function stats()
    {
        return response()->json([
            'success' => true,
            'stats' => [
                'total_submitted' => Jnf::where('status', 'submitted')->count(),
                'total_approved'  => Jnf::where('status', 'approved')->count(),
                'total_rejected'  => Jnf::where('status', 'rejected')->count(),
                'total_jnf'       => Jnf::where('opportunity_type', 'job')
                                        ->where('status', '!=', 'draft')->count(),
                'total_inf'       => Jnf::where('opportunity_type', 'internship')
                                        ->where('status', '!=', 'draft')->count(),
            ],
        ]);
    }
}