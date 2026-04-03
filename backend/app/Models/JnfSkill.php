<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JnfSkill extends Model
{
    public $timestamps = false;
    protected $fillable = ['jnf_id', 'skill_name'];

    public function jnf()
    {
        return $this->belongsTo(Jnf::class);
    }
}