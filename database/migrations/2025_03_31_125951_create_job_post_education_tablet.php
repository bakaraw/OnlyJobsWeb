<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('job_post_education', function (Blueprint $table) {
            $table->foreignId('job_post_id')->constrained()->onDelete('cascade');
            $table->unsignedBigInteger('education_level');
            $table->foreign('education_level')->references('education_level')->on('educations')->onDelete('cascade');
            $table->timestamps();
            $table->unique(['job_post_id', 'education_level']);
        });
    }

    public function up(): void
    {
        Schema::create('job_post_education', function (Blueprint $table) {
            $table->id('job_post_education_id');
            $table->foreignId('job_post_id')->constrained()->onDelete('cascade');
            $table->unsignedBigInteger('education_id');
            $table->timestamps();
            $table->unique(['job_post_id', 'requirement_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job_post_education');
    }
};
