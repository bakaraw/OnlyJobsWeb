<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class JobPostSkill extends Pivot
{
    protected $table = 'job_post_skill';

    protected $fillable = ['job_post_id', 'skill_id'];
}
