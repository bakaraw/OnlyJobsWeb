<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('job_post', function (Blueprint $table) {
            $table->id('job_id');
            $table->string('job_title')->unique();
            $table->text('job_description');
            $table->string('job_location');
            $table->string('job_salary');
            $table->string('job_type');
            $table->decimal('min_Salary', 10, 2);
            $table->decimal('max_salary', 10, 2);
            $table->integer('year_of_experience');


            //foreign key
            $table->unsignedBigInteger('job_status')->nullable('open');
            $table->unsignedBigInteger('skill_id')->nullable();
            $table->unsignedBigInteger('job_post_certificate_id')->nullable();
            $table->unsignedBigInteger('education_id')->nullable();
            $table->timestamps();

        });

    }

    public function down(): void
    {
//        Schema::table('job_post', function (Blueprint $table) {
//            $table->dropForeign(['skill_id']);
//            $table->dropForeign(['job_post_certificate_id']);
//            $table->dropForeign(['education_id']);
//        });

        Schema::dropIfExists('job_post');
    }
};
