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
        Schema::create("certification", function (Blueprint $table) {

            $table->id('certificate_id')->primary();
            $table->string('certification_name')->unique();
            $table->string('certification_type');
            $table->string('certification_date');
        });
    }
    public function down(): void
    {
 //       Schema::dropIfExists('certification');

    }
};
