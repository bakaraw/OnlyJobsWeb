<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JobPost extends Model
{
    use HasFactory;

    protected $table = 'job_post';

    protected $fillable = [
        'job_title',
        'job_description',
        'job_location',
        'job_salary',
        'job_type',
        'min_Salary',
        'max_salary',
        'year_of_experience',
        'skill_id',

        'job_post_certificate_id',
        'education_id',
        'job_status'

    ];


    public function certification()
    {
        return $this->belongsTo(Certification::class, 'job_post_certificate_id', 'certificate_id');
    }

    public function education()
    {
        return $this->belongsTo(Education::class, 'education_id', 'education_id');
    }

    public function jobStatus()
    {
        return $this->belongsTo(JobStatus::class, 'job_status', 'status_id');
    }

    public function skills()
    {
        return $this->belongsTo(Skill::class, 'skill_id', 'skill_id');
    }
}

