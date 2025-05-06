<?php

namespace App\Models;

class JobEducation

{
    protected $primaryKey = 'education_id';
    protected $table = 'job_post_education';

    protected $fillable = [
        'education_level',
    ];

    public function jobPosts()
    {
        return $this->belongsToMany(JobPost::class, 'job_post_education', 'education_id', 'job_post_id');
    }








}
