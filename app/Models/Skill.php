<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Skill extends Model
{
    use HasFactory;

    protected $table = 'skills';
    protected  $primaryKey = 'skill_id';


    protected $fillable = [
        'skill_id',
        'skill_name'
    ];

    public function jobPosts()
    {
        return $this->belongsTo(JobPost::class, 'skills', 'skill_id');
    }
}


use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('job_posts', function (Blueprint $table) {
            $table->id();

            // Job Details
            $table->string('job_title');
            $table->text('job_description');
            $table->string('job_location');
            $table->string('job_type');
            $table->string('university_name')->nullable();

            // Salary Details
            $table->decimal('min_salary', 10, 2);
            $table->decimal('max_salary', 10, 2);

            // Experience
            $table->integer('min_experience_years');

            // Foreign Keys with Constraints
            $table->unsignedBigInteger('status_id')->nullable();
            $table->unsignedBigInteger('certificate_id')->nullable();
            $table->unsignedBigInteger('skill_id')->nullable();
            $table->unsignedBigInteger('degree_id')->nullable();


            $table->foreign('status_id')
                ->references('status_id')
                ->on('job_statuses')
                ->onDelete('set null');


            $table->foreign('skill_id')
                ->references('skill_id')
                ->on('skills')
                ->onDelete('set null');


            $table->foreign('degree_id')
                ->references('degree_id')
                ->on('degrees')
                ->onDelete('set null');

            $table->foreign('certificate_id')
                ->references('certificate_id')
                ->on('certificates')
                ->onDelete('set null');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        // Drop foreign key constraints first
        Schema::table('job_posts', function (Blueprint $table) {
            $table->dropForeign(['job_status_id']);
            $table->dropForeign(['certificate_id']);
            $table->dropForeign(['skill_id']);
            $table->dropForeign(['degree_id']);


        });

        Schema::dropIfExists('job_posts');
    }
};
