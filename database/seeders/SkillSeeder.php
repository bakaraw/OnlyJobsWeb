<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use App\Models\UserSkill;

class SkillSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function getAccessToken()
    {
        return Cache::remember('lightcast_token', 3500, function () {
            $response = Http::asForm()->post(env('LIGHTCAST_AUTH_URL'), [
                'client_id' => env('LIGHTCAST_CLIENT_ID'),
                'client_secret' => env('LIGHTCAST_CLIENT_SECRET'),
                'grant_type' => 'client_credentials',
                'scope' => env('LIGHTCAST_SCOPE'),
            ]);

            if ($response->successful()) {
                return $response->json()['access_token'];
            }

            throw new \Exception('Unable to authenticate with Lightcast.');
        });
    }

    public function run(): void
    {
        //
        $token = $this->getAccessToken();

        // Make an API request to fetch skills from Lightcast
        $response = Http::withToken($token)
            ->get('https://emsiservices.com/skills/versions/latest/skills', [
                'q' => 'developer', // Example search query, you can customize it
            ]);

        if ($response->successful()) {
            $skills = $response->json();

            foreach ($skills as $skill) {
                // Insert skills into user_skills table (you may choose to add extra logic for filtering)
                UserSkill::create([
                    'skill_name' => $skill['name'], // Adjust this based on the actual response structure
                    'skill_id' => $skill['id'], // Adjust this based on the actual response structure
                    'user_id' => 1, // Example: Assuming skill is being added for user with ID 1, adjust accordingly
                ]);
            }
            $this->command->info('Skills seeded successfully from Lightcast.');
        } else {
            $this->command->error('Error fetching skills from Lightcast.');
        }
    }
}
