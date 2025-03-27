<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JobPost extends Model
{
    use HasFactory;

    protected $table = 'job_post';
    protected $primaryKey = 'job_id';

    protected $fillable = [
        'job_title', 'job_description', 'job_location', 'job_salary',
        'job_type', 'min_Salary', 'max_salary', 'year_of_experience',
        'job_post_certificate_id', 'education_id', 'job_status'
    ];
    protected $appends = ['skill_name'];


    public function skills()
    {
        return $this->belongsToMany(Skill::class, 'skill', 'job_id', 'skill_id');

    }
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

//get the name not the id
//    public function getCertificationNameAttribute() {
//        return $this->certification ? $this->certification->certification_name : null;
//    }
//    public function getSkillNameAttribute() {
//        return $this->skill ? $this->skill->name : null;
//    }
//
//    public function getEducationNameAttribute() {
//        return $this->education ? $this->education->education_name : null;
//    }




}

