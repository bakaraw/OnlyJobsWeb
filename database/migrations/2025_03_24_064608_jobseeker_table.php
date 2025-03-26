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
        Schema::create('job_seeker', function (Blueprint $table) {

            $table->id('jobSeeker_id')->primary();
            $table->string('jobSeeker_name')->unique();
            $table->string('jobSeeker_email');
            $table->integer('jobSeeker_phone')->nullable();
            $table->string('jobSeeker_address')->nullable();

            $table->unsignedBigInteger('applied_list')->unique()->nullable();

            $table->unsignedBigInteger('workHistory')->unique()->nullable();
            $table->unsignedBigInteger('education')->unique()->nullable();
            $table->unsignedBigInteger('certification')->unique()->nullable();
            $table->unsignedBigInteger('Skill')->unique()->nullable();
            $table->integer('yearOfExperience')->unique()->nullable();

            $table->timestamps();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');


//            $table->foreign('certification')
//                ->references('certificationId')
//                ->on('certification')
//                ->onDelete('cascade');
//
//
//            $table->foreign('education')
//                ->references("educationId")
//                ->on('education')
//                ->onDelete('cascade');
//
//            $table->foreign('workHistory')
//                ->references("work_history_id")
//                ->on("work_history")
//                ->onDelete('cascade');
//
//            $table->foreign('Skill')
//                ->references("skill_id")
//                ->on('skills')
//                ->onDelete('cascade');

            #
        });
    }
    public function down(): void
    {
//        Schema::table('job_seeker', function (Blueprint $table) {
//            $table->dropForeign(['user_id']);
//        });

        Schema::dropIfExists('job_seeker');
    }
};
