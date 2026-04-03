<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SelectionRound extends Model
{
    public $timestamps = false;
    protected $fillable = [
        'jnf_id', 'round_order', 'round_type',
        'mode', 'test_type', 'interview_mode',
        'description', 'tentative_date',
        'duration_minutes', 'is_elimination_round',
    ];

    protected $casts = [
        'is_elimination_round' => 'boolean',
        'tentative_date'       => 'datetime',
    ];

    public function jnf()
    {
        return $this->belongsTo(Jnf::class);
    }
}