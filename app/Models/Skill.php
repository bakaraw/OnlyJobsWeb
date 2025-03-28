<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Skill extends Model
{
    use HasFactory;

    protected $fillable = ['skill_name', 'description', 'skill_category', 'is_active'];

    public function jobPosts()
    {
        return $this->belongsToMany(JobPost::class, 'job_post_skills', 'skill_id', 'job_post_id');
    }
}
