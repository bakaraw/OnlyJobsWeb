<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('applicants', function (Blueprint $table) {
            $table->id('applicant_id');
            $table->unsignedBigInteger('jobseeker_id');
            $table->unsignedBigInteger('job_id');
            $table->enum('status', ['applied', 'screening', 'interview', 'accepted', 'rejected'])->default('applied');
            $table->date('application_date');

            $table->timestamps();

            // Foreign key constraints
            $table->foreign('jobseeker_id')->references('jobseeker_id')->on('job_seekers')->onDelete('cascade');
            $table->foreign('job_id')->references('job_id')->on('job_lists')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('applicants');
    }
};
