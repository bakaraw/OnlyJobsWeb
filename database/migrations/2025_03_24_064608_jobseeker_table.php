<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('job_seekers', function (Blueprint $table) {
            $table->id('jobseeker_id');
            $table->unsignedBigInteger('user_id');
            $table->string('jobseeker_name');
            $table->string('jobseeker_email')->unique();
            $table->string('jobseeker_phone')->nullable();
            $table->string('jobseeker_address')->nullable();
            $table->integer('years_of_experience')->nullable();

            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('job_seekers');
    }
};
