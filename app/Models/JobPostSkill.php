<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Model;

class JobPostSkill extends Model
{
    protected $table = 'job_post_skill';

    protected $fillable = [
        'job_post_id',
        'skill_id',
        'skill_name'
    ];

    public function jobPost(): BelongsTo
    {
        return $this->belongsTo(JobPost::class);
    }
}
