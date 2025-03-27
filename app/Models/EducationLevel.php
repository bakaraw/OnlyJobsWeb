<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EducationLevel extends Model
{
    protected $table = 'education_levels';

    protected $fillable = [
        'education_name',
        'description',
        'minimum_years',
        'is_active'
    ];

    public function jobPosts(): HasMany
    {
        return $this->hasMany(JobPost::class, 'education_id');
    }
}
