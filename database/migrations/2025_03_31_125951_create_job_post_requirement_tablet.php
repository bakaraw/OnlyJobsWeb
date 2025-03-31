<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public $dependencies = [
        'CreateJobPostsTable',
        'CreateRequirementsTable'
    ];
    public function up(): void
    {
        Schema::create('job_post_requirement', function (Blueprint $table) {
            $table->id();
            $table->foreignId('job_post_id')->constrained()->onDelete('cascade');
            $table->unsignedBigInteger('requirement_id');
            $table->foreign('requirement_id')->references('requirement_id')->on('requirements')->onDelete('cascade');

            $table->timestamps();

            $table->unique(['job_post_id', 'requirement_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job_post_requirement');
    }
};

