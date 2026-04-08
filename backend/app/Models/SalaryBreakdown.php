<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SalaryBreakdown extends Model
{
    protected $fillable = [
        'jnf_id', 'programme_type', 'currency',
        'ctc_annual', 'base_fixed', 'monthly_takehome',
        'gross_salary', 'joining_bonus', 'retention_bonus',
        'relocation_allowance', 'medical_allowance',
        'esop_value', 'vest_period', 'first_year_ctc',
        'stocks_options', 'bond_required', 'bond_amount',
        'bond_duration_months', 'bond_details',
        'deductions_text', 'ctc_breakup_notes', 'variable_performance_bonus'
    ];

    protected $casts = ['bond_required' => 'boolean'];

    public function jnf()
    {
        return $this->belongsTo(Jnf::class);
    }
}