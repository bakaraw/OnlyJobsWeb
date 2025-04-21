<?php

namespace App\Services;

use App\Models\User;
use App\Models\JobPost;

class JobMatcher
{

    public function matchJobs($user)
    {
        $userSkills = $user->userSkills->pluck('skill_id')->toArray();

        $jobs = JobPost::with('skills')->get();

        $scoredJobs = $jobs->map(function ($job) use ($userSkills) {
            $jobSkillIds = $job->skills->pluck('skill_id')->toArray();
            $skillMatches = count(array_intersect($userSkills, $jobSkillIds));
            $job->match_score = $skillMatches * 3;
            return $job;
        });

        /*return $scoredJobs->sortByDesc('match_score')->take(10)->values();*/
        return $scoredJobs
            ->filter(fn($job) => $job->match_score > 0)
            ->sortByDesc('match_score')
            ->take(10)
            ->values();
    }
}
