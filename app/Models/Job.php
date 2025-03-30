<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Job extends Model
{
    use HasFactory;

    protected $table = 'job_posts';
    protected $fillable =
    [
        'job_title',
        'job_description',
        'job_location',
        'job_type',
        'min_salary',
        'max_salary',
        'company_id',
        'status_id',
        'certificate_id',
        'degree_id',
        'min_experience_years',
        'skills',

    ];


    public function jobPosts()
    {
        return $this->hasMany(JobPost::class, 'certificate_id');
    }
}
