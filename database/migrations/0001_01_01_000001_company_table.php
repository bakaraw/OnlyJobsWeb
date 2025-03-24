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
        Schema::create('company', function (Blueprint $table) {
            $table->id('company_id')->primary()->autoIncrement() ;
            $table->string('CompanyName')->unique();
            $table->string('CompanyAddress');
            $table->integer('CompanyPhone');
            $table->string('CompanyEmail');
            $table->string('JobPosting')->unique();
            $table->string('jobList')->unique();
            $table->foreignId('account_id')->constrained('users')->onDelete('cascade');

            $table->foreign('jobList')
                ->references("jobList_id")
                ->on("jobList")
                ->onDelete('cascade');
        });




    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('company');
    }
};
