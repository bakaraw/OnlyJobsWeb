<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('job_lists', function (Blueprint $table) {
            $table->id('job_id');
            $table->unsignedBigInteger('company_id');
            $table->string('job_title');
            $table->text('job_description');
            $table->string('location');
            $table->enum('job_type', ['full-time', 'part-time', 'contract', 'temporary']);
            $table->decimal('salary', 10, 2)->nullable();
            $table->date('posting_date');
            $table->date('application_deadline');

            $table->timestamps();

            $table->foreign('company_id')->references('company_id')->on('companies')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('job_lists');
    }
};
