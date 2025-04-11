<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WorkHistory extends Model
{
    protected $fillable = [
        'user_id',
        'job_title',
        'job_description',
        'employer',
        'start_date',
        'end_date'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
