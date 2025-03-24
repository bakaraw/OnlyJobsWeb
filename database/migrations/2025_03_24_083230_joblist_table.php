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

        Schema::create('JobList', function (Blueprint $table) {
            $table->id('jobList_id')->primary();
            $table->string('jobTitle');
            $table->timestamp('jobCreatedAt');
            $table->string('jobStatus');


            $table->foreign('jobStatus')
                ->references('jobStatus')
                ->on('JobStatus')
                ->onDelete('cascade');

            $table->foreign('jobTitle')
                ->references("jobTitle")
                ->on("JobPost")
                ->onDelete('cascade');

            $table->foreign('jobCreatedAt')
                ->references("jobCreatedAt")
                ->on("JobPost")
                ->onDelete('cascade');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Schema::dropIfExists('JobList');
        //Schema::dropIfExists('JobPost');
    }
};
