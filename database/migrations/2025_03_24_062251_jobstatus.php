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
        Schema::create('job_status', function (Blueprint $table) {

            $table->id('status_id');
            $table->enum('open', ['yes', 'no'])->default('no'); // Ensuring clear options
            $table->enum('closed', ['yes', 'no'])->default('no');
            $table->enum('temporary', ['yes', 'no'])->default('no');
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('job_status');
    }
};
