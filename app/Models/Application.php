<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Application extends Model
{
    protected $fillable = [
        'user_id',
        'job_post_id',
        'status',
        'remarks'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');

    }

    public function jobPost()
    {
        return $this->belongsTo(JobPost::class, "job_post_id");
    }

    public function address()
    {
        return $this->belongsTo(Address::class, 'address_id', 'id');
    }
    public function degree()
    {
        return $this->belongsTo(Degree::class);
    }

    public function educations() {
        return $this->hasMany(Educations::class);
    }

}
