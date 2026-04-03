<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProgramDeptMap extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'program_id', 'department_id',
        'display_name', 'is_active',
    ];

    public function program()
    {
        return $this->belongsTo(Program::class);
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }
}