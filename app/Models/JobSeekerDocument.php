<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Inertia\Testing\Concerns\Has;

class JobSeekerDocument extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'document_type', 'file_path', 'verification_status', 'uploaded_at', 'remarks'
    ];


    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
