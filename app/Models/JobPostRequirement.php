<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class JobPostRequirement extends Pivot
{
    protected $table = 'job_post_requirement';

    protected $fillable = ['job_post_id', 'requirement_id'];
}
