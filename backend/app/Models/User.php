<?php
namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens;

    protected $fillable = [
        'name', 'email', 'role',
        'password_hash', 'email_verified_at', 'is_active',
    ];

    protected $hidden = ['password_hash'];

    // One user has one company
    public function company()
    {
        return $this->hasOne(Company::class);
    }

    // One user has many notifications
    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }
}