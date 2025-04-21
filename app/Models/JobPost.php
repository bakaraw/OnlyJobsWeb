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
        'requirement',
        'skills',
        'company',
        'user_id',
        'views'

    ];

    public function status()
    {
        return $this->belongsTo(JobStatus::class);
    }

    public function degree()
    {
        return $this->belongsTo(Degree::class);
    }

    public function requirements()
    {
        return $this->belongsToMany(Requirement::class, 'job_post_requirement', 'job_post_id', 'requirement_id')
            ->select('requirements.requirement_id', 'requirements.requirement_name');
    }

    /*public function skills()*/
    /*{*/
    /*    return $this->belongsToMany(Skill::class, 'job_post_skill', 'job_post_id', 'skill_id')*/
    /*        ->select('skills.skill_id', 'skills.skill_name');*/
    /*}*/

    public function skills()
    {
        return $this->hasMany(JobPostSkill::class);
    }

    public function placements()
    {
        return $this->hasMany(Placement::class);
    }
    public function applications()
    {
        return $this->hasMany(Application::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
