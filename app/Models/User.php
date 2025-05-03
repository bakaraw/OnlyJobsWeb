<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Models\Educations;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;
    protected $fillable = [
        'first_name',
        'last_name',
        'middle_name',
        'suffix',
        'email',
        'contact_number',
        'birthdate',
        'gender',
        'profile_pic_url',
        'profile_pic_public_id',
        'address_id',
        'password',
        //'account_type',
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

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function address(): BelongsTo
    {
        return $this->belongsTo(Address::class);
    }

    public function appliedJobs()
    {
        return $this->belongsToMany(JobPost::class, 'applications', 'user_id', 'job_post_id')
            ->withTimestamps();
    }

    public function applications()
    {
        return $this->hasMany(Application::class);
    }

    public function requirements()
    {
        return $this->hasMany(Requirement::class, 'user_id'); // Specify 'user_id' as foreign key
    }

    public function educations()
    {
        return $this->hasMany(Educations::class);
    }

    public function certifications(): HasMany
    {
        return $this->hasMany(Certification::class);
    }

    public function workHistories()
    {
        return $this->hasMany(WorkHistory::class);
    }

    public function userSkills()
    {
        return $this->hasMany(UserSkill::class);
    }


}
