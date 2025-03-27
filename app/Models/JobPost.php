<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JobPost extends Model
{
    protected $table = 'job_post';
    protected $primaryKey = 'job_id';

    protected $fillable = [
        'job_title',
        'job_description',
        'job_location',
        'job_salary',
        'job_type',
        'min_Salary',
        'max_salary',
        'year_of_experience',
        'skill_name',
        'certificate_name',
        'school_name',
        'job_status'
    ];

    // Relationships using names
    public function skill()
    {
        return $this->belongsTo(Skills::class, 'skill_name', 'skill_name');
    }

    public function certificate()
    {
        return $this->belongsTo(Certificate::class, 'certificate_name', 'certificate_name');
    }

    public function education()
    {
        return $this->belongsTo(Educations::class, 'school_name', 'school_name');
    }

    public function status()
    {
        return $this->belongsTo(JobStatus::class, 'job_status', 'status_name');
    }
}
