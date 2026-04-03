<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'code', 'department_name', 'is_active',
    ];

    // Department has many program mappings
    public function programMaps()
    {
        return $this->hasMany(ProgramDeptMap::class);
    }
}