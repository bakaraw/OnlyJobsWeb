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
            $table->foreignId('job_post_id')->constrained()->onDelete('cascade');
            $table->string('skill_id');
            $table->string('skill_name');
            /*$table->foreign('skill_id')->references('skill_id')->on('skills')->onDelete('cascade');*/
            $table->timestamps();
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
