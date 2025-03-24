<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void {

        Schema::create('job_list', function (Blueprint $table) {
            $table->id('job_list_id')->primary();
            $table->string('job_title');
            $table->timestamp('job_createdAt');
            $table->string('job_status');

//
//            $table->foreignId('job_status')
//                ->references('status_id')
//                ->on('job_status')
//                ->onDelete('cascade');
//
//            $table->foreign('job_title')
//                ->references("job_title")
//                ->on("job_post")
//                ->onDelete('cascade');
//
//            $table->foreign('job_createdAt')
//                ->references("job_createdAt")
//                ->on("job_post")
//                ->onDelete('cascade');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job_list');
        //Schema::dropIfExists('JobPost');
    }
};
