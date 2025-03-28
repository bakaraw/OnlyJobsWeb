<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('job_statuses', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->timestamps();
        });
        DB::table('job_statuses')->insert([
            ['name' => 'Active'],
            ['name' => 'Closed'],
            ['name' => 'Temporary Closed'],
            ['name' => 'Updated'],
        ]);
    }


    public function down()
    {
        Schema::dropIfExists('job_statuses');
    }
};
        // Insert default statuses

