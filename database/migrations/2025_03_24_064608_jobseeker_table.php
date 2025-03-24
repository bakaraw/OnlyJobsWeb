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
        Schema::create('JobSeeker', function (Blueprint $table) {

            $table->id('jobSeeker_id');
            $table->string('jobSeeker_name');
            $table->string('jobSeeker_email');
            $table->integer('jobSeeker_phone');
            $table->string('jobSeeker_address');
            $table->string('workHistory');
            $table->string('education');
            $table->string('certification');
            $table->integer('yearOfExperience');
            $table->string('Skill');
            $table->foreignId('account_id')->constrained('users')->onDelete('cascade');

//            $table->foreign('certification')
//                ->references('certificationId')
//                ->on('certification')
//                ->onDelete('cascade');
//
//
//            $table->foreign('education')
//                ->references("education_id")
//                ->on('education')
//                ->onDelete('cascade');
//
//            $table->foreign('workHistory')
//                ->references("workHistory_id")
//                ->on("workHistory")
//                ->onDelete('cascade');
//
//            $table->foreign('Skill')
//                ->references("skill_id")
//                ->on('skills')
//                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
