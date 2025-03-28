<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EducationLevel extends Model
{
    use HasFactory;

    protected $fillable = ['education_name', 'education_type'];

    public function jobPosts()
    {
        return $this->hasMany(JobPost::class, 'education_id');
    }
}
