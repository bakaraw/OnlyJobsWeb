<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;
use App\Models\Certificate;
use Illuminate\Support\Facades\DB;
use App\Models\Skill;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {

        // creates admin user
        User::create([
            'first_name' => 'Admin',
            'last_name' => 'Admin',
            'middle' => ' ',
            'email' => 'admin@example.com',
            'contact_number' => '0912312412',
            'gender' => 'male',
            'password' => Hash::make('password123'), // Securely hash the password
        ]);

        // creates default data in certificates
        $response = Http::get('https://gist.githubusercontent.com/killa-kyle/44b955f5a45632eefe02af63bc72e8b7/raw/8fac85b48278de43073e6f1478239e6d911a0778/professionalCertifications.json');
        $certificates = $response->json();

        foreach ($certificates as $certificate) {
            Certificate::create([
                'name' => $certificate['name'],
                'post_nominal' => $certificate['post_nominal'] ?? null,
                'agency' => $certificate['agency'] ?? null,
            ]);
        }

        // creates degrees default data
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

        // creates skills default data
        $response = Http::get('https://gist.githubusercontent.com/fadziljusri/d72619739d1fa8b760ca8a8d89bb0c99/raw/21983ab748fed408a64e0437c0c84d52229c30e8/skills.json');
        $skillset = $response->json();

        foreach ($skillset as $skill_category) {
            foreach ($skill_category as $skill) {
                Skill::create(['skill_name' => $skill]);
            }
        }
    }
}
