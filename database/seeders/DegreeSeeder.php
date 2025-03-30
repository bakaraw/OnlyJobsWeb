<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DegreeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('degrees')->insert([
            ['name' => 'Associate\'s'],
            ['name' => 'Bachelor\'s'],
            ['name' => 'Master\'s'],
            ['name' => 'Doctorate'],
            ['name' => 'Professional Degree'],
            ['name' => 'Certificate'],
            ['name' => 'Diploma'],
            ['name' => 'Postgraduate Diploma'],
            ['name' => 'Postdoctoral Degree'],
            ['name' => 'Honorary Degree'],
        ]);
    }
}
