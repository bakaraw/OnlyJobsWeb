<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
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

            if (Schema::hasTable('job_list')) {
                if (!Schema::hasColumn('company', 'company_job_listjob_list')) {
                    $table->foreignId('company_job_listjob_list')
                        ->references('job_list_id')
                        ->on('job_list')
                        ->onDelete('cascade');
                }
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



    public function down()
    {
        Schema::table('job_seeker', function (Blueprint $table) {
            $table->dropForeign(['certification']);
            $table->dropForeign(['education']);
            $table->dropForeign(['workHistory']);
            $table->dropForeign(['Skill']);
        });

        Schema::table('company', function (Blueprint $table) {
            $table->dropForeign(['job_list']);
            $table->dropForeign(['application_list']);
        });

    }
};
