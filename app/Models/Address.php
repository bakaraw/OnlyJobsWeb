<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Address extends Model
{
    protected $fillable = ['street', 'street2', 'city', 'province', 'postal_code', 'country'];

    public function user(): HasOne
    {
        return $this->hasOne(User::class);
    }
}
