<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Skill extends Model
{
    use HasFactory;

    protected $table = 'skills';
    protected  $primaryKey = 'skill_id';


    protected $fillable = [
        'skill_id',
        'skill_name'
    ];

    public function jobPosts()
    {
        return $this->belongsTo(JobPost::class, 'skills', 'skill_id');
    }
}
