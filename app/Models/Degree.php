<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Degree extends Model
{
    use HasFactory;

    protected $table = 'degrees';

    protected $fillable = [
        'degree_name'
    ];

    public function jobPosts()
    {
        return $this->hasMany(JobPost::class, 'degree_id');
    }
}
