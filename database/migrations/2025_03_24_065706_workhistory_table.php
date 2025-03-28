<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('work_histories', function (Blueprint $table) {
            $table->id('work_history_id');
            $table->unsignedBigInteger('jobseeker_id');
            $table->string('company_name');
            $table->string('job_title');
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->text('job_description')->nullable();

            $table->timestamps();

            $table->foreign('jobseeker_id')->references('jobseeker_id')->on('job_seekers')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('work_histories');
    }
};
