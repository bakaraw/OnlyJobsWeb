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

            if (Schema::hasTable('appliedId')) {
                if (!Schema::hasColumn('job_seeker', 'applied_list')) {
                    $table->foreignId('applied_list')
                        ->references('appliedId')
                        ->on('applied_list')
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

            if (Schema::hasTable('applicants') && !Schema::hasColumn('company', 'company_applicant_list')) {
                $table->foreignId('company_applicant_list')
                    ->nullable()  // Make it nullable if needed
                    ->constrained('applicants', 'applicant_id')  // Assuming applicants table uses 'id' as the primary key
                    ->onDelete('cascade');
            }

        });

    }


    public function down(): void
    {
        Schema::table('job_post', function (Blueprint $table) {
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

        Schema::table('company', function (Blueprint $table) {
            // Drop foreign key for company_job_list
            if (Schema::hasColumn('company', 'company_job_list')) {
                $table->dropForeign(['company_job_list']);
            }

            // Drop foreign key for company_applicant_list
            if (Schema::hasColumn('company', 'company_applicant_list')) {
                $table->dropForeign(['company_applicant_list']);
            }
        });

    }
};
