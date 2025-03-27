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
        Schema::create('job_posts', function (Blueprint $table) {
            $table->id();

            // Job Details
            $table->string('job_title');
            $table->text('job_description');
            $table->string('job_location');
            $table->string('job_type');

            // Salary Details
            $table->decimal('min_salary', 10, 2);
            $table->decimal('max_salary', 10, 2);

            // Experience
            $table->integer('min_experience_years');

            // Foreign Keys with Constraints
            $table->unsignedBigInteger('job_status_id')->nullable();
            $table->unsignedBigInteger('education_id')->nullable();
            $table->unsignedBigInteger('certificate_id')->nullable();

            $table->foreign('job_status_id')
                ->references('id')
                ->on('job_statuses')
                ->onDelete('set null');

            $table->foreign('education_id')
                ->references('id')
                ->on('education_levels')
                ->onDelete('set null');

            $table->foreign('certificate_id')
                ->references('id')
                ->on('certificates')
                ->onDelete('set null');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        // Drop foreign key constraints first
        Schema::table('job_posts', function (Blueprint $table) {
            $table->dropForeign(['job_status_id']);
            $table->dropForeign(['education_id']);
            $table->dropForeign(['certificate_id']);
        });

        Schema::dropIfExists('job_posts');
    }
};
