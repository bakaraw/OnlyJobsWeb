<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\User;

class Educations extends Model
{
    protected $fillable = [
        'user_id',
        'education_level',
        'school',
        'degree',
        'start_year',
        'end_year',
        'attached_file'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
    //
}
