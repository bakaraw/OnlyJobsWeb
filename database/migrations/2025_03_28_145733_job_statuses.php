<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('job_statuses', function (Blueprint $table) {
            $table->id('status_id');
            $table->string('status_name');
            $table->timestamps();
        });

        // Insert default statuses
        DB::table('job_statuses')->insert([
            ['status_name' => 'Active'],
            ['status_name' => 'Closed'],
            ['status_name' => 'Temporary Closed'],
            ['status_name' => 'Updated'],
        ]);
    }
    public function down(): void
    {
        Schema::dropIfExists('job_statuses');

    }
};
