<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Education extends Model
{

    use HasFactory;

    protected $fillable = [
        'education_id',
        'school_name',
        'Undergrad',
        'master',
        'Phd'
    ];



    public function education()
    {
        return $this->belongsTo(JobPost::class, 'education_id', 'education_id');
    }
}
