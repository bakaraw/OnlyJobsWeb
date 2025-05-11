<?php

namespace App\Services;

use App\Models\User;
use App\Models\JobPost;
use Illuminate\Support\Collection;

class JobMatcher
{
    public function scoreJobs(User $user, Collection $jobs): Collection
    {
        $userSkills = $user->userSkills->pluck('skill_id')->toArray();

        return $jobs->map(function ($job) use ($userSkills) {
            $jobSkillIds = $job->skills->pluck('skill_id')->toArray();
            $skillMatches = count(array_intersect($userSkills, $jobSkillIds));
            $job->match_score = $skillMatches * 3;
            return $job;
        });
    }
}
