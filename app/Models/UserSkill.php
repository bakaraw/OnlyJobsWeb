<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserSkill extends Model
{
    protected $fillable = [
        'user_id',
        'skill_id',
        'skill_name'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
    public function skill()
    {
        return $this->belongsTo(Skill::class);
    }
}
