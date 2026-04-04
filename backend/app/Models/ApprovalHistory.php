<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ApprovalHistory extends Model
{
    public $timestamps = false;
    protected $table = 'approval_history';
    protected $fillable = [
        'jnf_id', 'action_by_user_id',
        'old_status', 'new_status', 'remarks',
    ];

    public function jnf()
    {
        return $this->belongsTo(Jnf::class);
    }

    public function actionBy()
    {
        return $this->belongsTo(User::class, 'action_by_user_id');
    }
}