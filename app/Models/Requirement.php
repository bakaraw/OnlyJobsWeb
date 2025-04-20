<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Requirement extends Model
{
    use HasFactory;
    protected $primaryKey = 'requirement_id';


    protected $fillable = ['requirement_name'];

    public function jobPosts()
    {
        return $this->belongsToMany(JobPost::class, 'job_post_requirement', 'requirement_id', 'job_post_id');
    }


    public function user()
    {
        return $this->belongsTo(User::class);
    }
}






