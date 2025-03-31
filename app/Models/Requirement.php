<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Inertia\Testing\Concerns\Has;

class Requirement extends Model
{
    use HasFactory;


    protected $fillable = [
        'requirement_name', 'description', 'validity_period'
    ];


}
