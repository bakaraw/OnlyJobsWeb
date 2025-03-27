<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Educations extends Model
{
    protected $table = 'educations';
    protected $primaryKey = 'education_id';

    protected $fillable = ['school_name'];

    public function jobPosts()
    {
        return $this->hasMany(JobPost::class, 'school_name', 'school_name');
    }
}
