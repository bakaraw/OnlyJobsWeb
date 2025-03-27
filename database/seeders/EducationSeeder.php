<?php

namespace Database\Seeders;

use Faker\Factory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EducationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
{
        $faker = Factory::create();

        foreach(range(1,10) as $index){
            DB::table('educations')->insert([
                'school_name' => $faker->name(),
                'Undergrad' => $faker->year .'Degree',
                'master' => $faker->company . 'Master Education',
                'Phd' => $faker->company . 'Phd Education',
            ]);
        }
    }
}

