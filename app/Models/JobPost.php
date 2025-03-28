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
        'status_id', 'university_name', 'certificate_id', 'skill_id'
    ];

    public function skills()
    {
        return $this->belongsToMany(Skill::class);
    }

    public function jobStatus()
    {
        return $this->belongsTo(JobStatus::class);
    }

//    public function education()
//    {
//        return $this->belongsTo(University::class);
//    }

    public function certificate()
    {
        return $this->belongsTo(Certificate::class);
    }
}
