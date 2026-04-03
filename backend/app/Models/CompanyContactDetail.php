<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CompanyContactDetail extends Model
{
    protected $fillable = [
        'company_id', 'contact_type', 'contact_name',
        'designation', 'email', 'phone',
        'landline', 'is_primary',
    ];

    protected $casts = ['is_primary' => 'boolean'];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }
}