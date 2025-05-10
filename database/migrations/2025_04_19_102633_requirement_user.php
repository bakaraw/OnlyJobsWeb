<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('requirement_user', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('job_post_requirement_id');
            $table->unsignedBigInteger('application_id')->nullable();
            $table->string('file_path');
            $table->string('original_filename');
            $table->string('status')->default('pending');
            $table->text('remarks')->nullable();
            $table->timestamps();

            $table->string('file_public_id')->nullable();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('job_post_requirement_id')->references('job_post_requirement_id')->on('job_post_requirement')->onDelete('cascade');
            $table->foreign('application_id')->references('id')->on('applications')->onDelete('set null');
        });
    }

    public function down()
    {
        Schema::table('requirement_user', function (Blueprint $table) {
            $table->dropColumn('file_public_id');
        });    }
};
