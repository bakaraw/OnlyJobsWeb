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

            $table->id('certificationId')->primary();
            $table->string('certificationName');
            $table->string('certificationType');
            $table->string('certificationDate');
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('certification');

    }
};
