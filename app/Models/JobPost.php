<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JobPost extends Model
{
    use HasFactory;

    protected $fillable = [
        'job_title', 'job_description', 'job_location', 'job_type',
        'min_salary', 'max_salary', 'min_experience_years',
        'status_id', 'degree_id', 'certificate_id', 'skill_id'
    ];


        public function skills()
    {
        return $this->belongsToMany(Skill::class, 'job_post_skill', 'job_post_id', 'skill_id');

    }

    public function jobStatus()
    {
        return $this->belongsTo(JobStatus::class, 'job_status', 'status_id' );

    }

    public function degrees()
    {
        return $this->belongsTo(Degree::class, 'degrees', 'degree_id' );
    }

    public function certificate()
    {
        return $this->belongsTo(Certificate::class, 'certificates', 'certificate_id' );

    }
}
