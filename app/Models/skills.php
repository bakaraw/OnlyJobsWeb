<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class skills extends Model
{
    use HasFactory;

    protected $fillable = [
        'skill_id',
        'skill_name',
    ];

    public function skills()
    {
        return $this->belongsTo(JobPost::class, 'job_post_skill_id', 'skill_id');
    }


}
