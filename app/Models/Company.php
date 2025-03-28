<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Company extends Model
{
    use HasFactory;

    protected $table = 'educations'; // or the actual table name
    protected $primaryKey = 'education_id';

    protected $fillable = [
        'education_name',
        // add other fields
    ];
}


