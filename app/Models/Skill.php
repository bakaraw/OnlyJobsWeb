<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Skill extends Model
{
    use HasFactory;
    protected $table = 'skill';
    protected $primaryKey = 'skill_id'; // Explicitly set primary key
    protected $fillable = [
        //'skill_id',
        'skill_name',
    ];

    public function jobPosts()
    {
        return $this->belongsToMany(JobPost::class, 'skill_required', 'skill_id', 'job_id');
    }

}
