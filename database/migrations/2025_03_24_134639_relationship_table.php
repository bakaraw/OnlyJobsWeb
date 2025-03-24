<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::table('job_seeker', function (Blueprint $table) {

            if (Schema::hasTable('certification')) {
                $table->foreign('certification')
                    ->references('certificationId')
                    ->on('certification')
                    ->onDelete('cascade');
            }
            if (Schema::hasTable('education')) {
                $table->foreign('education')
                    ->references("educationId")
                    ->on('education')
                    ->onDelete('cascade');
            }
            if (Schema::hasTable('work_history')) {
                $table->foreign('workHistory')
                    ->references("work_history_id")
                    ->on("work_history")
                    ->onDelete('cascade');
            }
            if (Schema::hasTable('skills')) {
                $table->foreign('Skill')
                    ->references("skill_id")
                    ->on('skills')
                    ->onDelete('cascade');
            }

            if (Schema::hasTable('application_list')) {
                if (!Schema::hasColumn('job_seeker', 'applied_list')) {
                    $table->foreignId('applied_list')
                        ->references('applicationId')
                        ->on('application_list')
                        ->onDelete('cascade');
                }
            }


        });


        Schema::table('company', function (Blueprint $table) {
            if (Schema::hasTable('job_list') && !Schema::hasColumn('company', 'company_job_list')) {
                $table->foreignId('company_job_list')
                    ->nullable() // Make it nullable
                    ->references('job_list_id')
                    ->on('job_list')
                    ->onDelete('cascade');
            }

            if (Schema::hasTable('application_list')) {
                if (!Schema::hasColumn('company', 'company_application_list')) {
                    $table->foreignId('company_application_list')
                        ->references('applicationId')
                        ->on('application_list')
                        ->onDelete('cascade');
                }
            }
        });

    }


    public function down(): void
    {
        Schema::table('job_post', function (Blueprint $table) {
            if (Schema::hasColumn('job_post', 'application_list')) {
                $table->dropForeign(['application_list']);
            }
            if (Schema::hasColumn('job_post', 'job_post_company_name')) {
                $table->dropForeign(['job_post_company_name']);
            }
            if (Schema::hasColumn('job_post', 'job_post_certificate')) {
                $table->dropForeign(['job_post_certificate']);
            }
            if (Schema::hasColumn('job_post', 'education_id')) {
                $table->dropForeign(['education_id']);
            }
            if (Schema::hasColumn('job_post', 'skill_id')) {
                $table->dropForeign(['skill_id']);
            }
        });

        Schema::table('work_history', function (Blueprint $table) {
            if (Schema::hasColumn('work_history', 'workSkill')) {
                $table->dropForeign(['workSkill']);
            }
        });

        Schema::table('applicants', function (Blueprint $table) {
            if (Schema::hasColumn('applicants', 'applicant_jobseeker_id')) {
                $table->dropForeign(['applicant_jobseeker_id']);
            }
            if (Schema::hasColumn('applicants', 'applicant_jobposting_id')) {
                $table->dropForeign(['applicant_jobposting_id']);
            }
        });
    }
};
