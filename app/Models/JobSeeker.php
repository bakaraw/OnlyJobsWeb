<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Inertia\Testing\Concerns\Has;

class JobSeeker extends Model
{
    use HasFactory;

    protected $table = 'job_seeker';
    protected $primaryKey = 'jobSeeker_id';

    protected $fillable = [
        'jobSeeker_name',
        'jobSeeker_email',
        'jobSeeker_phone',
        'jobSeeker_address',
        'applied_list',
        'workHistory',
        'education',
        'certification',
        'skill',
        'yearOfExperience',
        'user_id'
    ];


    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
