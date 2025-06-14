<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Degree extends Model
{
    use HasFactory;

    protected $fillable = ['degree_name'];

    public function jobPosts()
    {
        return $this->hasMany(JobPost::class, 'degree_id');
    }


}
