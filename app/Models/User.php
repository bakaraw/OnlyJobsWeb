<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;
    protected $fillable = [
        'first_name',
        'last_name',
        'middle',
        'suffix',
        'email',
        'contact_number',
        'birthdate',
        'gender',
        'street',
        'street2',
        'city',
        'province',
        'postal_code',
        'country',
        'password',
        'account_type',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function jobSeeker()
    {
        return $this->hasOne(JobSeeker::class);
    }

    public function company()
    {
        return $this->hasOne(Company::class);
    }
}
