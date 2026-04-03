<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InfStipendBreakdown extends Model
{
    protected $fillable = [
        'jnf_id', 'programme_type', 'currency',
        'base_stipend', 'hra_housing', 'variable_pay',
        'other_allowance', 'total_stipend',
    ];

    public function jnf()
    {
        return $this->belongsTo(Jnf::class);
    }
}