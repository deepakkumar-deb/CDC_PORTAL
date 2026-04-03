<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Jnf extends Model
{
    protected $fillable = [
        'company_id', 'approved_by', 'jnf_code',
        'recruitment_cycle', 'opportunity_type',
        'internship_title', 'designation',
        'department_function', 'job_description',
        'responsibilities', 'location_type',
        'location_text', 'openings_count', 'min_openings',
        'start_date', 'tentative_joining_date',
        'internship_duration_months', 'expected_duration',
        'ppo_offered', 'registration_link',
        'additional_info', 'slp_requirements',
        'status', 'submitted_at', 'approved_at',
        'rejection_reason', 'admin_notes',
    ];

    protected $casts = [
        'ppo_offered'   => 'boolean',
        'start_date'    => 'date',
        'submitted_at'  => 'datetime',
        'approved_at'   => 'datetime',
    ];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function approvedBy()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function skills()
    {
        return $this->hasMany(JnfSkill::class);
    }

    public function attachments()
    {
        return $this->hasMany(JnfAttachment::class);
    }

    public function eligibilityRule()
    {
        return $this->hasOne(EligibilityRule::class);
    }

    public function salaryBreakdowns()
    {
        return $this->hasMany(SalaryBreakdown::class);
    }

    public function allowedPrograms()
    {
        return $this->hasMany(JnfAllowedProgram::class);
    }

    public function allowedCategories()
    {
        return $this->hasMany(JnfAllowedCategory::class);
    }

    public function deptCgpa()
    {
        return $this->hasMany(JnfDeptCgpa::class);
    }

    public function selectionRounds()
    {
        return $this->hasMany(SelectionRound::class);
    }

    public function selectionInfrastructure()
    {
        return $this->hasOne(SelectionInfrastructure::class);
    }

    public function infDetail()
    {
        return $this->hasOne(InfDetail::class);
    }

    public function infStipendBreakdowns()
    {
        return $this->hasMany(InfStipendBreakdown::class);
    }

    public function infCompensationPerks()
    {
        return $this->hasMany(InfCompensationPerk::class);
    }

    public function approvalHistory()
    {
        return $this->hasMany(ApprovalHistory::class);
    }

    public function slots()
    {
        return $this->hasMany(SlotJnf::class);
    }

    // Helper: is this a JNF or INF?
    public function isInternship(): bool
    {
        return $this->opportunity_type === 'internship';
    }
}