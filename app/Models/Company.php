<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Company extends Model
{
    use HasFactory;

    protected $table = 'companies';
    protected $primaryKey = 'company_id';

    protected $fillable = [
        'company_name',
    ];

    public function company()
    {
        return $this->hasOne(Company::class);
    }
    public function jobPosts()
    {
        return $this->hasOne(Company::class, 'user_id', 'id');
    }

}


