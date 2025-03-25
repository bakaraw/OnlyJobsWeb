<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {

        Schema::create("work_history", function (Blueprint $table) {

            $table->id('work_history_id');
            $table->string('workName');
            $table->date('position');
            $table->date('startDate');
            $table->date('endDate');
            $table->string('workType');
            $table->text('workDescription');
            $table->string('workSkill');


//            $table->foreignId('workSkill')
//                ->references("skill_id")
//                ->on('skills')
//                ->onDelete('cascade');
        });
    }
    public function down(): void
    {
//        Schema::dropIfExists('work_history');

    }
};
