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
            // Certificate relationship - reference the primary key
            if (Schema::hasTable('certification') && !Schema::hasColumn('job_post', 'job_post_certificate_id')) {
                $table->foreignId('job_post_certificate_id')
                    ->nullable() // Use nullable if not all job posts have a certificate associated
                    ->constrained('certification', 'certificationId')
                    ->onDelete('cascade');
            }

            // Education relationship - reference the primary key
            if (Schema::hasTable('education') && !Schema::hasColumn('job_post', 'education_id')) {
                $table->foreignId('education_id')
                    ->nullable()
                    ->constrained('education', 'educationId')
                    ->onDelete('cascade');
            }

            // Skill relationship - reference the primary key
            if (Schema::hasTable('skills') && !Schema::hasColumn('job_post', 'skill_id')) {
                $table->foreignId('skill_id')
                    ->nullable()
                    ->constrained('skills', 'skill_id')
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

        Schema::table('job_post', function (Blueprint $table) {
            $table->dropForeign(['job_post_certificate']);
            $table->dropForeign(['education_id']);
            $table->dropForeign(['skill_id']);
        });

        Schema::table('work_history', function (Blueprint $table) {
            $table->dropForeign(['workSkill']);
        });

        Schema::table('applicants', function (Blueprint $table) {
            $table->dropForeign(['applicant_jobseeker_id']);
            $table->dropForeign(['applicant_jobposting_id']);
        });
    }
};
