<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JnfAllowedCategory extends Model
{
    public $timestamps = false;
    protected $fillable = ['jnf_id', 'category_id'];

    public function jnf()
    {
        return $this->belongsTo(Jnf::class);
    }

    public function category()
    {
        return $this->belongsTo(SocialCategory::class);
    }
}