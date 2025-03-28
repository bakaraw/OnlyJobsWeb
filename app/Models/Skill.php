<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Skill extends Model
{
    use HasFactory;

    protected $table = 'skills';

    protected $fillable = [
        'skill_name'
    ];

    public function jobPosts()
    {
        return $this->belongsToMany(JobPost::class, 'job_post_skill', 'skill_id', 'job_post_id');
    }
}

