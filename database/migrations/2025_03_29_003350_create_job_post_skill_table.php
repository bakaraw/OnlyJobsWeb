<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * The dependencies of the migration.
     *
     * @var array
     */
    public $dependencies = [
        'CreateJobPostsTable',
        'CreateSkillsTable'
    ];

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('job_post_skill', function (Blueprint $table) {
            $table->id();
            // Using foreignId for job_post_id since it references an 'id' column
            $table->foreignId('job_post_id')->constrained()->onDelete('cascade');
            // Manual approach for skill_id since it references a non-standard primary key
            $table->unsignedBigInteger('skill_id');
            $table->foreign('skill_id')->references('skill_id')->on('skills')->onDelete('cascade');

            $table->timestamps();

            $table->unique(['job_post_id', 'skill_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job_post_skill');
    }
};
