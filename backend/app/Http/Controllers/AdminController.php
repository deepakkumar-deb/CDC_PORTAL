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

    // Dashboard stats for admin
    public function stats()
    {
        return response()->json([
            'success' => true,
            'stats' => [
                'total_submitted' => Jnf::where('status', 'submitted')->count(),
                'total_approved'  => Jnf::where('status', 'approved')->count(),
                'total_rejected'  => Jnf::where('status', 'rejected')->count(),
                'total_jnf'       => Jnf::where('opportunity_type', 'job')->count(),
                'total_inf'       => Jnf::where('opportunity_type', 'internship')->count(),
            ],
        ]);
    }
}