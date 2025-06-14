<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Inertia\Testing\Concerns\Has;

class Placement extends Model
{
    use HasFactory;

    protected $table = 'placement';
    protected $fillable = [
        'user_id', 'job_post_id', 'placement_status' , 'date_placement', 'additional_remarks'
    ];


    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function jobPost()
    {
        return $this->belongsTo(JobPost::class, 'job_post_id');
    }
}
