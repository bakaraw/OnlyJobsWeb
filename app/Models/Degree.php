<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Degree extends Model
{
    protected $table = 'degrees';
    protected  $primaryKey = 'degree_id';

    use HasFactory;

    protected $fillable = [
        'degree_id',
        'degree_name',

    ];


    public function jobPosts()
    {
        return $this->hasMany(JobPost::class, 'degrees', 'degree_id' );
    }
}
