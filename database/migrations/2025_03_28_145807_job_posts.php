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
        Schema::create('job_posts', function (Blueprint $table) {
            $table->id();

            // Job Details
            $table->string('job_title');
            $table->text('job_description');
            $table->string('job_location');
            $table->string('job_type');
            $table->string('university_name')->nullable();

            // Salary Details
            $table->decimal('min_salary', 10, 2);
            $table->decimal('max_salary', 10, 2);

            // Experience
            $table->integer('min_experience_years');

            // Foreign Keys
            $table->unsignedBigInteger('status_id')->nullable();
            $table->unsignedBigInteger('degree_id')->nullable();
            $table->unsignedBigInteger('certificate_id')->nullable();
            $table->unsignedBigInteger('skill_id')->nullable();

            $table->foreign('status_id')->references('status_id')->on('job_statuses')->onDelete('set null');
            $table->foreign('degree_id')->references('degree_id')->on('degrees')->onDelete('set null');
            $table->foreign('certificate_id')->references('certificate_id')->on('certificates')->onDelete('set null');
            $table->foreign('skill_id')->references('skill_id')->on('skills')->onDelete('set null');

            $table->timestamps();
        });

        if (Schema::hasTable('job_posts')) {
            Schema::create('job_post_skill', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('job_post_id');
                $table->unsignedBigInteger('skill_id');

                $table->foreign('job_post_id')->references('id')->on('job_posts')->onDelete('cascade');
                $table->foreign('skill_id')->references('skill_id')->on('skills')->onDelete('cascade');
            });
        }

    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
       Schema::dropIfExists('job_post_skill'); // Drop pivot table first
        Schema::dropIfExists('job_posts');
    }
};
