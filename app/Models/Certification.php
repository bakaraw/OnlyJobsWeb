<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Certification extends Model
{

    use HasFactory;

    protected $fillable = [
        'certificationId',
        'certificationName',
        'certificationType',
        'certificationDate'
    ];

    public function certification()
    {
        return $this->belongsTo(JobPost::class, 'job_post_certificate_id', 'certificationId');
    }



}
