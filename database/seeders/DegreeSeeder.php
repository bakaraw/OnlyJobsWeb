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
            ['degree_name' => 'Associate\'s'],
            ['degree_name' => 'Bachelor\'s'],
            ['degree_name' => 'Master\'s'],
            ['degree_name' => 'Doctorate'],
            ['degree_name' => 'Professional Degree'],
            ['degree_name' => 'Certificate'],
            ['degree_name' => 'Diploma'],
            ['degree_name' => 'Postgraduate Diploma'],
            ['degree_name' => 'Postdoctoral Degree'],
            ['degree_name' => 'Honorary Degree'],
        ]);
    }
}
