<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SlotJnf extends Model
{
    public $timestamps = false;
    protected $fillable = [
        'slot_id', 'jnf_id', 'form_type',
        'ppt_date', 'test_date',
        'slot_order', 'confirmed',
    ];

    protected $casts = ['confirmed' => 'boolean'];

    public function slot()
    {
        return $this->belongsTo(PlacementSlot::class);
    }

    public function jnf()
    {
        return $this->belongsTo(Jnf::class);
    }
}