<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('company', function (Blueprint $table) {
            $table->id('company_id');
            $table->string('company_name')->unique();
            $table->string('company_address');
            $table->string('company_phone');
            $table->string('company_email')->unique();


            $table->string('job_posting')->unique();
            $table->string('company_job_list')->unique();
            $table->string('company_application_list')->unique();

            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');

        });
    }

    public function down(): void
    {
        Schema::dropIfExists('company');
    }
};
