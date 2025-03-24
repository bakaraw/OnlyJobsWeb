<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Company extends Model
{

        use HasFactory;

        protected $table = 'company';
        protected $primaryKey = 'companyId';

    protected $fillable = [
        'company_name',
        'company_address',
        'company_phone',
        'company_email',
        'job_posting',
        'company_job_list',
        'company_application_list',
        'user_id'
    ];
    public $timestamps = false;

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'account_id')->where('account_type', 'company');
    }


}
