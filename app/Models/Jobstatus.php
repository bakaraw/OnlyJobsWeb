<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JobStatus extends Model
{
    use HasFactory;

    protected $fillable = ['status_name', 'is_active'];

    public function jobPosts()
    {
        return $this->hasMany(JobPost::class, 'job_status_id');
    }
}
