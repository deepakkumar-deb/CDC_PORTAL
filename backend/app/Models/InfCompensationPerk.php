<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InfCompensationPerk extends Model
{
    public $timestamps = false;
    protected $fillable = [
        'jnf_id', 'programme_type',
        'perk_label', 'perk_value', 'display_order',
    ];

    public function jnf()
    {
        return $this->belongsTo(Jnf::class);
    }
}