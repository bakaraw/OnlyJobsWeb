<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Certificate extends Model
{
    protected $table = 'certificates';
    protected  $primaryKey = 'certificate_id';

    use HasFactory;


    protected $fillable = [
        'certificate_name',
        'name',
        'post_nominal',
        'agency'

        ];

    public function jobPosts()
    {
        return $this->hasMany(JobPost::class, 'certificates', 'certificate_id' );
    }
}
