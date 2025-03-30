<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('job_posts', function (Blueprint $table) {
            $table->id();
            $table->string('job_title');
            $table->text('job_description');
            $table->string('job_location');
            $table->string('job_type');
            $table->decimal('min_salary', 10, 2);
            $table->decimal('max_salary', 10, 2);
            $table->integer('min_experience_years');

            $table->unsignedBigInteger('status_id')->nullable();
            $table->unsignedBigInteger('degree_id')->nullable();
            $table->unsignedBigInteger('certificate_id')->nullable();
            // Removed skill_id as it's handled by the pivot table

            $table->timestamps();

            $table->foreign('status_id')->references('id')->on('job_statuses')->onDelete('set null');
            $table->foreign('degree_id')->references('id')->on('degrees')->onDelete('set null');
            $table->foreign('certificate_id')->references('id')->on('certificates')->onDelete('set null');
            // Removed skill_id foreign key constraint
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::dropIfExists('job_posts');
    }
};
