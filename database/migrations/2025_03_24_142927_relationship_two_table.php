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


        Schema::table('job_post', function (Blueprint $table) {

            // Certificate relationship – reference the primary key 'certificationId' in 'certification'
            if (!Schema::hasColumn('job_post', 'certificate_name')) {
                $table->foreignId('certificate_name')
                    ->nullable()
                    ->constrained('certificate', 'certificate_name')
                    ->onDelete('cascade');
            }

            // Educations relationship – reference the primary key 'educationId' in 'education'
            if (!Schema::hasColumn('job_post', 'school_name')) {
                $table->foreignId('school_name')
                    ->nullable()
                    ->constrained('educations', 'school_name')
                    ->onDelete('cascade');
            }

            // Skill relationship – reference the primary key 'skill_id' in 'skill'
            if (!Schema::hasColumn('job_post', 'skill_name')) {
                $table->foreignId('skill_name')
                    ->nullable()
                    ->constrained('skills', 'skill_name')
                    ->onDelete('cascade');
            }

            // Skill relationship – reference the primary key 'skill_id' in 'skill'
            if (!Schema::hasColumn('job_post', 'job_status')) {
                $table->foreignId('job_status')
                    ->nullable()
                    ->constrained('job_status', 'status_id')
                    ->onDelete('cascade');
            }

        });


        Schema::table('applicants', function (Blueprint $table) {

            if (Schema::hasTable('job_seeker') && !Schema::hasColumn('applicants', 'applicant_jobseeker_id')) {
                $table->foreignId('applicant_jobseeker_id')
                    ->constrained('job_seeker', 'jobSeeker_id')
                    ->onDelete('cascade');
            }

            if (Schema::hasTable('job_post') && !Schema::hasColumn('applicants', 'applicant_jobposting_id')) {
                $table->foreignId('applicant_jobposting_id')
                    ->constrained('job_post', 'job_id')
                    ->onDelete('cascade');
            }
        });

    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {

    }
};
