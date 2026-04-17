<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JnfDeptCgpa extends Model
{
    public $timestamps = false;
    protected $table = 'jnf_dept_cgpa';

    protected $fillable = [
        'jnf_id',
        'program_dept_map_id',
        'min_cgpa',
        'active_backlogs_allowed',
    ];

    // Always include branch_name in JSON output
    protected $appends = ['branch_name'];

    public function getBranchNameAttribute(): string
    {
        return optional($this->programDeptMap)->display_name ?? '';
    }

    public function jnf()
    {
        return $this->belongsTo(Jnf::class);
    }

    public function programDeptMap()
    {
        return $this->belongsTo(ProgramDeptMap::class);
    }
}
