<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JobPost extends Model
{
    protected $fillable = [
        'job_title',
        'job_description',
        'job_location',
        'job_type',
        'min_salary',
        'max_salary',
        'min_experience_years',
        'job_status_id',
        'education_id',
        'certificate_id'
    ];

    public function jobStatus(): BelongsTo
    {
        return $this->belongsTo(JobStatus::class, 'job_status_id');
    }

    public function educationLevel(): BelongsTo
    {
        return $this->belongsTo(EducationLevel::class, 'education_id');
    }

    public function certificate(): BelongsTo
    {
        return $this->belongsTo(Certificate::class, 'certificate_id');
    }

    public function skills(): BelongsToMany
    {
        return $this->belongsToMany(Skill::class, 'job_post_skills', 'job_post_id', 'skill_id');
    }
}
