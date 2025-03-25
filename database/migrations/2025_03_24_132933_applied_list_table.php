<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up(): void
    {
        Schema::create("applied_list", function (Blueprint $table) {
            $table->id('appliedId')->primary();
            $table->string("jobId");
            $table->string("userId");
            $table->string("status");
            $table->string("date");
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('applied_list');
    }
};
