<?php
// app/Models/Conversation.php



namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\JobPost;

class Conversation extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'job_id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function job()
    {
        return $this->belongsTo(JobPost::class);
    }

    public function messages()
    {
        return $this->hasMany(Message::class);
    }
}
