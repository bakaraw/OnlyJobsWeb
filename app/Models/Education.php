<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Education extends Model
{

    use HasFactory;

    protected $fillable = [
        'educationId',
        'schoolName',
        'Undergrad',
        'master',
        'Phd'
    ];

    public function education()
    {
        return $this->belongsTo(JobPost::class, 'education_id', 'educationId');
    }
}
