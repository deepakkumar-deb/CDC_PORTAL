<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TermsAcceptance extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'company_id', 'accepted_by_user_id',
        'terms_version', 'accepted_at', 'ip_address',
        'document_hash', 'checkbox_payload_json',
    ];

    protected $casts = [
        'checkbox_payload_json' => 'array',
        'accepted_at'           => 'datetime',
    ];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function acceptedBy()
    {
        return $this->belongsTo(User::class, 'accepted_by_user_id');
    }
}