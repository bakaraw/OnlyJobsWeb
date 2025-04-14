<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Models\Educations;

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

    public function documents()
    {
        return $this->hasMany(JobSeekerDocument::class);
    }

    // A user can have multiple placement (jobs applied/placed)
    public function placements()
    {
        return $this->hasMany(Placement::class);
    }

    public function appliedJobs() {
        return $this->belongsToMany(JobPost::class, 'applications')
            ->withTimestamps()->withPivot('status');
    }

    public function educations()
    {
        return $this->hasMany(Educations::class);
    }

    public function workHistories()
    {
        return $this->hasMany(WorkHistory::class);
    }
}
