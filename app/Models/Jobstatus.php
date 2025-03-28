<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JobStatus extends Model
{
    use HasFactory;

    protected $table = 'job_statuses';

    protected $fillable = [
        'status_name'
    ];

    public function jobPosts()
    {
        return $this->hasMany(JobPost::class, 'status_id');
    }
}
