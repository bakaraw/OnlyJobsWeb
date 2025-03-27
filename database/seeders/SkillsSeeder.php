<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SkillsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
    $faker = \Faker\Factory::create();
    foreach(range(1,10) as $index){
        DB::table('skills')->insert([
            'skill_name' => $faker->name(),

        ]);
    }

    }
}
