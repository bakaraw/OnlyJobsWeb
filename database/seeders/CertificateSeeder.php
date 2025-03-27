<?php

namespace Database\Seeders;

use Faker\Factory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CertificateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $faker = Factory::create();

    foreach(range(1,10) as $index){
        DB::table('certification')->insert([
            'certification_name' => $faker->name(),
            'certification_type' => $faker->text(),
            'certification_date' => $faker->date(),
        ]);
    }
    }
}

