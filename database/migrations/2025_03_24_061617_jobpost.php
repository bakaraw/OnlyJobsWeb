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
        Schema::create('jobPost', function (Blueprint $table) {

            $table->id('job_id')->primary()->autoIncrement();
            $table->string('company_name');
            $table->string('job_title')->unique();
            $table->text('job_description');
            $table->string('job_status');
            $table->timestamp('job_createdAt')->useCurrent()->unique();
            $table->string('job_location');
            $table->string('job_salary');
            $table->string('job_salaryType');
            $table->decimal('min_Salary');
            $table->decimal('max_salary');
            $table->string('job_salary_status');
            $table->string('skills_required')->nullable();
            $table->string('certificate_required')->nullable();
            $table->string('education_required')->nullable();
            $table->integer('year_of_experience');


            $table->foreign("CompanyName")
                ->references("company_id")
                ->on("Company")
                ->onDelete('cascade');

            $table->foreign("certificateRequired")
                ->references("certificate_id")
                ->on("certification")
                ->onDelete('cascade');


            $table->foreign("educationRequired")
                ->references("educationId")
                ->on("education")
                ->onDelete('cascade');

            $table->foreign("skillsRequired")
                ->references("skill_id")
                ->on("skills")
                ->onDelete('cascade');
        });




    }

        /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jobPost');

    }
};
