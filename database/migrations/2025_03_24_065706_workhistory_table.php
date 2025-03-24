<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {

        Schema::create("workHistory", function (Blueprint $table) {

            $table->id('workHistory_id');
            $table->string('workName');
            $table->date('position');
            $table->date('startDate');
            $table->date('endDate');
            $table->string('workType');
            $table->text('workDescription');
            $table->string('workSkill');


            $table->foreign('workSkill')
                ->references("skill_id")
                ->on('skills')
                ->onDelete('cascade');

        });

    }

    public function down(): void
    {
        //
    }
};
