<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PlacementSlot extends Model
{
    protected $fillable = [
        'season_year', 'slot_number', 'phase',
        'start_datetime', 'end_datetime',
        'slot_type', 'is_final_round',
    ];

    protected $casts = [
        'is_final_round'  => 'boolean',
        'start_datetime'  => 'datetime',
        'end_datetime'    => 'datetime',
    ];

    public function slotJnfs()
    {
        return $this->hasMany(SlotJnf::class, 'slot_id');
    }
}