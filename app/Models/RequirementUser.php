<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RequirementUser extends Model
{
    use HasFactory;

    protected $table = 'requirement_user';

    protected $fillable = [
        'user_id',
        'job_post_requirement_id',
        'application_id',
        'file_path',
        'file_public_id',
        'original_filename',
        'status',
        'remarks',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function requirement()
    {
        return $this->belongsTo(Requirement::class, 'job_post_requirement_id', 'requirement_id');
    }
    public function application()
    {
        return $this->belongsTo(Application::class);
    }
}
