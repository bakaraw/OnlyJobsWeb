<?php

namespace App\Http\Controllers;

use App\Models\Skill;
use App\Models\JobPost;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class SkillController extends Controller
{
    /**
     * Create a new skill
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'skill_name' => 'required|unique:skills,skill_name',
            'skill_category' => 'nullable|string',
            'skill_level' => 'nullable|in:Beginner,Intermediate,Advanced,Expert',
            'description' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $skill = Skill::create($validator->validated());

        return response()->json($skill, 201);
    }

    /**
     * Add skills to a job post
     */
    public function addSkillsToJobPost(Request $request, $jobPostId)
    {
        $validator = Validator::make($request->all(), [
            'skills' => 'required|array',
            'skills.*.skill_id' => 'required|exists:skills,id',
            'skills.*.requirement_level' => 'nullable|in:Preferred,Required,Optional'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $jobPost = JobPost::findOrFail($jobPostId);

        // Start a database transaction
        DB::beginTransaction();

        try {
            // Prepare skills for sync
            $skillsToSync = [];
            foreach ($request->input('skills') as $skillData) {
                $skillsToSync[$skillData['skill_id']] = [
                    'skill_requirement_level' => $skillData['requirement_level'] ?? 'Required'
                ];
            }

            // Sync skills in pivot table
            $jobPost->skillRequirements()->sync($skillsToSync);

            // Update skills JSON column
            $jobPost->update([
                'skills' => array_keys($skillsToSync)
            ]);

            DB::commit();

            // Reload the job post with skills
            $jobPost->load('skillRequirements');

            return response()->json([
                'message' => 'Skills added successfully',
                'job_post' => $jobPost
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to add skills', 'details' => $e->getMessage()], 500);
        }
    }

    /**
     * Get skills for a job post
     */
    public function getJobPostSkills($jobPostId)
    {
        $jobPost = JobPost::with('skillRequirements')->findOrFail($jobPostId);

        return response()->json($jobPost->skillRequirements);
    }

    /**
     * Search skills
     */
    public function searchSkills(Request $request)
    {
        $query = Skill::query();

        if ($request->filled('category')) {
            $query->category($request->input('category'));
        }

        if ($request->filled('level')) {
            $query->skillLevel($request->input('level'));
        }

        if ($request->filled('keyword')) {
            $query->where('skill_name', 'LIKE', "%{$request->input('keyword')}%");
        }

        $skills = $query->get();

        return response()->json($skills);
    }
}
