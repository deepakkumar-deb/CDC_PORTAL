<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JnfDeptCgpa extends Model
{
    public $timestamps = false;
    protected $fillable = [
        'jnf_id', 'program_dept_map_id', 'min_cgpa',
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