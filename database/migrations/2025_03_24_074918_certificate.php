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
        Schema::create("certificate", function (Blueprint $table) {

            $table->id('certificate_id')->primary();
            $table->string('certificate_name')->unique();
            $table->string('certificate_type');
            $table->string('certificate_date');
        });
    }
    public function down(): void
    {
 //       Schema::dropIfExists('certification');

    }
};
