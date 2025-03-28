<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JobPost extends Model
{
    use HasFactory;

    protected $table = 'job_posts';

    protected $fillable = [
        'job_title',
        'job_description',
        'job_location',
        'job_type',
        'university_name',
        'min_salary',
        'max_salary',
        'min_experience_years',
        'status_id',
        'degree_id',
        'certificate_id',
        'skill_id'
    ];

    // Relationships

    public function status()
    {
        return $this->belongsTo(JobStatus::class, 'status_id');
    }

    public function degree()
    {
        return $this->belongsTo(Degree::class, 'degree_id');
    }

    public function certificate()
    {
        return $this->belongsTo(Certificate::class, 'certificate_id');
    }

    public function skills()
    {
        return $this->belongsToMany(Skill::class, 'job_post_skill', 'job_post_id', 'skill_id');
    }
}
