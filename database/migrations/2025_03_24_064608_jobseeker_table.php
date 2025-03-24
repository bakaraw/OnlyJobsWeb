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

            $table->id('jobSeeker_id');
            $table->string('jobSeeker_name')->unique();
            $table->string('jobSeeker_email');
            $table->integer('jobSeeker_phone');
            $table->string('jobSeeker_address');

            $table->unsignedBigInteger('applied_list')->unique();

            $table->unsignedBigInteger('workHistory')->unique();
            $table->unsignedBigInteger('education')->unique();
            $table->unsignedBigInteger('certification')->unique();
            $table->unsignedBigInteger('Skill')->unique();

            $table->integer('yearOfExperience')->unique();

//
//            $table->foreignId('applied_list')
//                ->references('appliedId')
//                ->on('application_list')
//                ->onDelete('cascade');

            $table->foreignId('account_id')->constrained('users')->onDelete('cascade');


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
        Schema::dropIfExists('job_seeker');

    }
};
