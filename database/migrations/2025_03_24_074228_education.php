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
        Schema::create("educations", function (Blueprint $table) {
            $table->id('education_id')->primary();
            $table->string("school_name")->unique();
            $table->string("Undergrad");
            $table->string("master");
            $table->string("Phd");
        });
    }

    public function down(): void
    {
//        Schema::dropIfExists('education');

    }
};
