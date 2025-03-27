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
        DB::table('certificate')->insert([
            'certificate_name' => $faker->name(),
            'certificate_type' => $faker->text(),
            'certificate_date' => $faker->date(),
        ]);
    }
    }
}

