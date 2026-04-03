<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PlacementStat extends Model
{
    public $timestamps = false;
    protected $fillable = [
        'year', 'companies_count', 'placement_percent',
        'highest_ctc', 'departments_count',
    ];
}