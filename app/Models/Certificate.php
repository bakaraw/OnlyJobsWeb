<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Certificate extends Model
{
    use HasFactory;

    protected $fillable = ['certificate_name', 'description', ];

    public function jobPosts()
    {
        return $this->hasMany(JobPost::class, 'certificate_id');
    }
}
