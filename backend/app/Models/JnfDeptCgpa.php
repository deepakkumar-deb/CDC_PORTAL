<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JnfDeptCgpa extends Model
{
    public $timestamps = false;
    protected $table = 'jnf_dept_cgpa'; // ← add this line

    protected $fillable = [
        'jnf_id',
        'program_dept_map_id',
        'min_cgpa',
        'active_backlogs_allowed',
    ];

    public function jnf()
    {
        return $this->belongsTo(Jnf::class);
    }

    public function programDeptMap()
    {
        return $this->belongsTo(ProgramDeptMap::class);
    }
}
