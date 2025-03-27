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
        Schema::create('applicant', function (Blueprint $table) {

        $table->id('applicant_id');
        $table->integer('applicant_jobseeker_id');
        $table->string('applicant_jobposting_id');
        $table->string('applicant_job_status');

//        $table->foreignId('jobseeker_id')
//            ->references('jobSeeker_id')
//            ->on('Job_seeker')
//            ->onDelete('cascade');
//
//        $table->foreignId('jobposting_id')
//        ->references('job_id')
//        ->on('job_post');
        });

    }

    public function down(): void
    {
        Schema::dropIfExists('applicants');

    }
};
