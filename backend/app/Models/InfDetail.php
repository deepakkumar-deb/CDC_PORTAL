<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InfDetail extends Model
{
    public $timestamps = false;
    protected $fillable = [
        'jnf_id', 'internship_type', 'duration_months',
        'ppo_offered', 'ppo_ctc_expected',
        'accommodation_provided', 'accommodation_details',
        'travel_allowance', 'travel_allowance_details',
        'certificate_provided', 'work_from_home_allowed',
    ];

    protected $casts = [
        'ppo_offered'             => 'boolean',
        'accommodation_provided'  => 'boolean',
        'travel_allowance'        => 'boolean',
        'certificate_provided'    => 'boolean',
        'work_from_home_allowed'  => 'boolean',
    ];

    public function jnf()
    {
        return $this->belongsTo(Jnf::class);
    }
}