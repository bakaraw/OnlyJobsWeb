<?php

namespace Database\Seeders;

use App\Models\Certificate;
use Faker\Factory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;

class CertificateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $faker = Factory::create();

        $response = Http::get('https://gist.githubusercontent.com/killa-kyle/44b955f5a45632eefe02af63bc72e8b7/raw/8fac85b48278de43073e6f1478239e6d911a0778/professionalCertifications.json');
        $certificates = $response->json();

        foreach ($certificates as $certificate) {
            Certificate::create([
                'name' => $certificate['name'],
                'post_nominal' => $certificate['post_nominal'] ?? null,
                'agency' => $certificate['agency'] ?? null,
            ]);
        }
    }
}
