<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up()
    {
        Schema::create('job_statuses', function (Blueprint $table) {
            $table->id('status_id');
            $table->string('status_name')->unique()->default('Active');
            $table->timestamps();
        });

        DB::table('job_statuses')->insert([
            ['status_name' => 'Active'],
            ['status_name' => 'Closed'],
            ['status_name' => 'Updated'],
            ['status_name' => 'Temporary Closed']
        ]);
    }

    public function down()
    {
        Schema::dropIfExists('job_statuses');
    }
};
