<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    protected $fillable = [
        'user_id', 'company_name', 'logo_path',
        'website', 'industry', 'company_type',
        'about_company', 'headquarters_address',
        'city', 'state', 'country', 'postal_code',
        'linkedin_url', 'date_of_establishment',
        'annual_turnover', 'no_of_employees',
        'industry_tags', 'mnc_hq_country', 'mnc_hq_city',
        'company_file_path', 'company_file_original_name',
    ];

    protected $casts = [
        'industry_tags' => 'array',
    ];
    
    protected $appends = [
        'logo_url',
        'company_file_url',
    ];

    public function getLogoUrlAttribute()
    {
        return $this->logo_path ? asset('storage/' . $this->logo_path) : null;
    }

    public function getCompanyFileUrlAttribute()
    {
        return $this->company_file_path ? asset('storage/' . $this->company_file_path) : null;
    }

    // Company belongs to a user
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Company has many contacts (head_hr, poc1, poc2)
    public function contacts()
    {
        return $this->hasMany(CompanyContactDetail::class);
    }

    // Company has many JNFs/INFs
    public function jnfs()
    {
        return $this->hasMany(Jnf::class);
    }

    // Company has one terms acceptance
    public function termsAcceptance()
    {
        return $this->hasOne(TermsAcceptance::class);
    }
}