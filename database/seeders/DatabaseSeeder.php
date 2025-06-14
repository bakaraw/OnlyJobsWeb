<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;
use App\Models\Certificate;
use Illuminate\Support\Facades\DB;
use App\Models\Skill;
use Illuminate\Support\Facades\Hash;
use App\Models\Address;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {

        Address::create([
            'street' => '123 Admin St',
            'street2' => 'otin',
            'city' => 'Admin City',
            'province' => 'Admin Province',
            'postal_code' => '8105',
            'country' => 'Philippines',
        ]);

        Address::create([
            'street' => '123 Main St',
            'street2' => 'Apt 4B',
            'city' => 'Anytown',
            'province' => 'Anystate',
            'postal_code' => '12345',
            'country' => 'USA',
        ]);

        $adminAddress = Address::first();
        $userAddress = Address::skip(1)->first();

        // creates admin user
        User::create([
            'first_name' => 'Admin',
            'last_name' => 'Admin',
            'middle_name' => ' ',
            'email' => 'admin@example.com',
            'birthdate' => '2025-1-1',
            'contact_number' => '0912312412',
            'gender' => 'male',
            'address_id' => $adminAddress->id,
            'password' => Hash::make('password123'), // Securely hash the password
        ]);

        // creates sample user
        User::create([
            'first_name' => 'John',
            'last_name' => 'Doe',
            'middle_name' => 'A',
            'suffix' => 'Jr',
            'email' => 'john.doe@example.com',
            'contact_number' => '1234567890',
            'birthdate' => '1990-01-01',
            'gender' => 'Male',
            'address_id' => $adminAddress->id,
            'password' => bcrypt('password123'),
        ]);

        User::create([
            'first_name' => 'lean',
            'last_name' => 'yawa',
            'middle_name' => 'A',
            'suffix' => 'Jr',
            'email' => 'lean@example.com',
            'contact_number' => '1234567890',
            'birthdate' => '1990-01-01',
            'gender' => 'Male',
            'address_id' => $adminAddress->id,
            'password' => bcrypt('password123'),
        ]);



        //        // creates default data in certificates
        //        $response = Http::get('https://gist.githubusercontent.com/killa-kyle/44b955f5a45632eefe02af63bc72e8b7/raw/8fac85b48278de43073e6f1478239e6d911a0778/professionalCertifications.json');
        //        $certificates = $response->json();
        //
        //        foreach ($certificates as $certificate) {
        //            Certificate::create([
        //                'name' => $certificate['name'],
        //                'post_nominal' => $certificate['post_nominal'] ?? null,
        //                'agency' => $certificate['agency'] ?? null,
        //            ]);
        //        }

        // creates degrees default data
        DB::table('degrees')->insert([
            ['name' => 'Vocational'],
            ['name' => 'Graduate'],
            ['name' => 'Undergraduate'],
            ['name' => 'High School'],
            ['name' => 'Elementary'],
            ['name' => 'Others'],

        ]);


        DB::table('requirements')->insert([
            ['requirement_name' => 'Passport'],
            ['requirement_name' => 'NBI Clearance'],
            ['requirement_name' => 'Medical Certificate'],
            ['requirement_name' => 'POEA Contract'],
            ['requirement_name' => 'OEC'],
            ['requirement_name' => 'PDOS Certificate'],
            ['requirement_name' => 'TESDA Certificate'],
            ['requirement_name' => 'Barangay Clearance'],
            ['requirement_name' => 'Government Issued ID (e.g., Driver’s License, SSS, or PhilHealth ID)'],
            ['requirement_name' => 'Police Clearance'],
            ['requirement_name' => 'Tax Identification Number (TIN)'],
            ['requirement_name' => 'Voter’s ID'],
            ['requirement_name' => 'Immigration Clearance '],
            ['requirement_name' => 'Photocopy of Birth Certificate'],
            ['requirement_name' => '3 Recent Passport-sized Photos'],
            ['requirement_name' => 'Work Visa'],
        ]);
        // creates skills default data

    }
}
