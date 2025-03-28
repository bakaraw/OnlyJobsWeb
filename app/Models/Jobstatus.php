<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class jobstatus extends Model
{

    protected $table = 'job_status';
    protected  $primaryKey = 'status_id';

    use HasFactory;

    protected $fillable = [
        'status_id',
        'active',
        'Closed',
        'Updated',
        'Temporary Closed',
    ];


    public function jobstatus()
    {
        return $this->belongsTo(JobPost::class, 'job_status', 'status_id');
    }
}
