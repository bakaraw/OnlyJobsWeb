<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up(): void
    {
        Schema::create('job_post_educations', function (Blueprint $table) {
            $table->id('education_id');
            $table->foreignId('job_post_id')->constrained()->onDelete('cascade'); // Foreign Key
            $table->enum('education_level', ['Elementary', 'High School', 'Undergraduate', 'Graduate', 'Vocational', 'Others']);
            $table->string('school');
            $table->string('degree', 255)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job_post_educations');
    }
};
