<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Certificate extends Model
{
    protected $fillable = [
        'certificate_name',
        'description',
        'issuing_organization',
        'is_active'
    ];

    public function jobPosts(): HasMany
    {
        return $this->hasMany(JobPost::class, 'certificate_id');
    }
}
