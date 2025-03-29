<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JobPost extends Model
{
    use HasFactory;

    protected $fillable = [
        'job_title',
        'job_description',
        'job_location',
        'job_type',
        'min_salary',
        'max_salary',
        'min_experience_years',
        'status_id',
        'degree_id',
        'certificate_id',
    ];

    public function status()
    {
        return $this->belongsTo(JobStatus::class);
    }

    public function degree()
    {
        return $this->belongsTo(Degree::class);
    }

    public function certificate()
    {
        return $this->belongsTo(Certificate::class);
    }

    public function skills()
    {
        return $this->belongsToMany(Skill::class, 'job_post_skill', 'job_post_id', 'skill_id');
    }
}
