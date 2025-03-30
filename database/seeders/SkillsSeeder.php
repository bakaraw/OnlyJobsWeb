<?php

namespace Database\Seeders;

use App\Models\Skill;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;

class SkillsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $response = Http::get('https://gist.githubusercontent.com/fadziljusri/d72619739d1fa8b760ca8a8d89bb0c99/raw/21983ab748fed408a64e0437c0c84d52229c30e8/skills.json');
        $skillset = $response->json();

        foreach ($skillset as $skill_category) {
            foreach ($skill_category as $skill) {
                Skill::create(['skill_name' => $skill]);
            }
        }
    }
};
