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
            if (!Schema::hasColumn('job_post', 'job_post_certificate_id')) {
                $table->foreignId('job_post_certificate_id')
                    ->nullable()
                    ->constrained('certification', 'certificationId')
                    ->onDelete('cascade');
            }

            // Education relationship – reference the primary key 'educationId' in 'education'
            if (!Schema::hasColumn('job_post', 'education_id')) {
                $table->foreignId('education_id')
                    ->nullable()
                    ->constrained('education', 'educationId')
                    ->onDelete('cascade');
            }

            // Skill relationship – reference the primary key 'skill_id' in 'skills'
            if (!Schema::hasColumn('job_post', 'skill_id')) {
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
//        // Remove foreign keys and drop columns from job_post table
//        Schema::table('job_post', function (Blueprint $table) {
//            // Drop the foreign key constraints then the columns
//            if (Schema::hasColumn('job_post', 'job_post_certificate_id')) {
//                $table->dropForeign(['job_post_certificate_id']);
//                $table->dropColumn('job_post_certificate_id');
//            }
//            if (Schema::hasColumn('job_post', 'education_id')) {
//                $table->dropForeign(['education_id']);
//                $table->dropColumn('education_id');
//            }
//            if (Schema::hasColumn('job_post', 'skill_id')) {
//                $table->dropForeign(['skill_id']);
//                $table->dropColumn('skill_id');
//            }
////        });
//
//        // Remove foreign keys and drop columns from applicants table
//        Schema::table('applicants', function (Blueprint $table) {
//            if (Schema::hasColumn('applicants', 'applicant_jobseeker_id')) {
//                $table->dropForeign(['applicant_jobseeker_id']);
//                $table->dropColumn('applicant_jobseeker_id');
//            }
//            if (Schema::hasColumn('applicants', 'applicant_jobposting_id')) {
//                $table->dropForeign(['applicant_jobposting_id']);
//                $table->dropColumn('applicant_jobposting_id');
//            }
//        });
    }
};
