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
        Schema::create('applicants', function (Blueprint $table) {

        $table->id('applicantId');
        $table->integer('jobSeekerId');
        $table->string('jobPosting_id');
        $table->string('jobStatus');

        $table->foreign('jobSeekerId')
            ->references('jobSeeker_id')
            ->on('JobSeeker');

        $table->foreign('jobPosting_id')
        ->references('job_id')
        ->on('JobPost');



        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
