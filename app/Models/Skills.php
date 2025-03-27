<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Skills extends Model
{
    protected $table = 'skills';
    protected $primaryKey = 'skill_id';

    protected $fillable = ['skill_name'];

    public function jobPosts()
    {
        return $this->hasMany(JobPost::class, 'skill_name', 'skill_name');
    }
}
