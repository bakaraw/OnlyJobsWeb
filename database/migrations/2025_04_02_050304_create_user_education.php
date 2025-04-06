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
        Schema::create('educations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Foreign Key
            $table->enum('education_level', ['Elementary', 'High School', 'Undergraduate', 'Graduate', 'Vocational', 'Others']);
            $table->string('school');
            $table->string('degree', 255)->nullable();
            $table->integer('start_year');
            $table->integer('end_year');
            $table->string('attached_file', 2083)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('educations');
    }
};
