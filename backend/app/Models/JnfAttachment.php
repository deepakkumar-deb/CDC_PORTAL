<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JnfAttachment extends Model
{
    public $timestamps = false;
    protected $fillable = [
        'jnf_id', 'file_type', 'original_name',
        'stored_name', 'file_path', 'mime_type', 'file_size',
    ];

    public function jnf()
    {
        return $this->belongsTo(Jnf::class);
    }
}