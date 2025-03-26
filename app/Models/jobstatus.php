<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class jobstatus extends Model
{

    use HasFactory;

    protected $fillable = [
        'status_id',
        'open',
        'closed',
        'temporary'
    ];


    public function jobstatus()
    {
        return $this->belongsTo(JobPost::class, 'job_status', 'status_id');
    }
}
