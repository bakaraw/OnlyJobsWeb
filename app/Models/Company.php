<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Company extends Model
{
    use HasFactory;

    protected $table = 'companies';
    protected $primaryKey = 'companie_id';

    protected $fillable = [
        'education_name',
    ];

    public function company()
    {
        return $this->hasOne(Company::class);
    }
}


