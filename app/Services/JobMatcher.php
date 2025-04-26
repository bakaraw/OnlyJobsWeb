<?php

namespace App\Services;

use App\Models\User;
use App\Models\JobPost;
use Illuminate\Support\Collection;

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

        // this one sorts the jobs based on the score.
        return $scoredJobs->sortByDesc('match_score')->values();

        // this neglects all jobs with a score of 0
        /*return $scoredJobs*/
        /*    ->filter(fn($job) => $job->match_score > 0)*/
        /*    ->sortByDesc('match_score')*/
        /*    ->take(10)*/
        /*    ->values();*/
    }

    /*public function scoreJobs($user, $jobs)*/
    /*{*/
    /*    $userSkills = $user->userSkills->pluck('skill_id')->toArray();*/
    /**/
    /*    return $jobs->map(function ($job) use ($userSkills) {*/
    /*        $jobSkillIds = $job->skills->pluck('skill_id')->toArray();*/
    /*        $job->match_score = count(array_intersect($userSkills, $jobSkillIds)) * 3;*/
    /*        return $job;*/
    /*    });*/
    /*}*/
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
