<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::table('job_seeker', function (Blueprint $table) {

            if (!Schema::hasTable('certification')) {
                $table->foreign('certification')
                    ->references('certificate_id')
                    ->on('certificate')
                    ->onDelete('cascade');
            }
            if (!Schema::hasTable('education')) {
                $table->foreign('education')
                    ->references("education_id")
                    ->on('educations')
                    ->onDelete('cascade');
            }
            if (!Schema::hasTable('work_history')) {
                $table->foreign('workHistory')
                    ->references("work_history_id")
                    ->on("work_history")
                    ->onDelete('cascade');
            }
            if (!Schema::hasTable('skills')) {
                $table->foreign('Skills')
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


        Schema::table('companies', function (Blueprint $table) {

            if (Schema::hasTable('job_list') && !Schema::hasColumn('companies', 'company_job_list')) {
                $table->foreignId('company_job_list')
                    ->nullable() // Make it nullable
                    ->references('job_list_id')
                    ->on('job_list')
                    ->onDelete('cascade');
            }

            if (Schema::hasTable('applicants') && !Schema::hasColumn('companies', 'company_applicant_list')) {
                $table->foreignId('company_applicant_list')
                    ->nullable()  // Make it nullable if needed
                    ->constrained('applicants', 'applicant_id')  // Assuming applicants table uses 'id' as the primary key
                    ->onDelete('cascade');
            }

        });

    }


    public function down(): void
    {


    }
};
