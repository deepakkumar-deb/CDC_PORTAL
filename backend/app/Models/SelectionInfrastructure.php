<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SelectionInfrastructure extends Model
{
    public $timestamps = false;
    protected $table = 'selection_infrastructure';
    protected $fillable = [
        'jnf_id', 'rooms_required', 'team_members_required',
        'psychometric_test', 'medical_test',
        'proctoring_required', 'other_screening',
    ];

    protected $casts = [
        'psychometric_test'   => 'boolean',
        'medical_test'        => 'boolean',
        'proctoring_required' => 'boolean',
    ];

    public function jnf()
    {
        return $this->belongsTo(Jnf::class);
    }
}