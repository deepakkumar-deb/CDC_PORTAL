<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EligibilityRule extends Model
{
    public $timestamps = false;
    protected $fillable = [
        'jnf_id', 'min_cgpa', 'max_backlogs_allowed',
        'active_backlogs_allowed', 'min_class_10_percent',
        'min_class_12_percent', 'allowed_gender', 'additional_text',
    ];

    protected $casts = [
        'active_backlogs_allowed' => 'boolean',
    ];

    public function jnf()
    {
        return $this->belongsTo(Jnf::class);
    }
}