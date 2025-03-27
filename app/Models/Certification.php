<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Certification extends Model
{

    use HasFactory;

    protected $fillable = [
        'certificate_id',
        'certification_name',
        'certification_type',
        'certification_date'
    ];

    public function JobPost()
    {
        return $this->hasMany(JobPost::class, 'job_post_certificate_id', 'certificate_id');
    }




}
