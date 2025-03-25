<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobPost extends Model
{
    // Certification relationship
    public function certification()
    {
        return $this->belongsTo(Certification::class, 'job_post_certificate_id', 'certificationId');
    }

    // Education relationship
    public function education()
    {
        return $this->belongsTo(Education::class, 'education_id', 'educationId');
    }

    // Skills relationship
    public function skill()
    {
        return $this->belongsTo(Skill::class, 'skill_id', 'skill_id');
    }
}

