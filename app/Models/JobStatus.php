<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JobStatus extends Model
{
    protected $table = 'job_status';
    protected $primaryKey = 'status_id';

    protected $fillable = ['status_name'];

    public function jobPosts()
    {
        return $this->hasMany(JobPost::class, 'job_status', 'status_id');
    }
}
