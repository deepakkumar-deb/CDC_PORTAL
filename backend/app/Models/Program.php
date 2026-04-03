<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Program extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'program_name', 'course',
        'duration_years', 'is_active',
    ];

    // Program has many dept mappings
    public function deptMaps()
    {
        return $this->hasMany(ProgramDeptMap::class);
    }
}