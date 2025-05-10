<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Application;
use App\Models\RequirementUser;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ApplicationRequirementController extends Controller
{
    public function uploadRequirements(Request $request)
    {
        // 1️⃣ Validate
        $request->validate([
            'job_id'  => 'required|exists:job_posts,id',
            'user_id' => 'required|exists:users,id',
            'files'   => 'required|array',
            'files.*' => 'file|mimes:jpg,jpeg,png,pdf,doc,docx|max:10240',
        ]);

        DB::beginTransaction();

        try {
            // 2️⃣ Create or fetch existing application
            $application = Application::firstOrCreate(
                [
                    'user_id'     => $request->user_id,
                    'job_post_id' => $request->job_id,
                ],
                ['status' => 'Pending']
            );

            // 3️⃣ Loop through uploaded files
            foreach ($request->file('files') as $reqId => $file) {
                if (!$file->isValid()) {
                    continue;
                }

                // 3a) Delete previous file if it exists
                $existing = RequirementUser::where([
                    'user_id'                  => $request->user_id,
                    'job_post_requirement_id'  => $reqId,
                    'application_id'           => $application->id,
                ])->first();

                if ($existing && $existing->file_public_id) {
                    Storage::disk('cloudinary')->delete($existing->file_public_id);
                }

                // 3b) Upload to Cloudinary
                $publicId = Storage::disk('cloudinary')->putFile('/job_requirements', $file);
                $url      = Storage::disk('cloudinary')->url($publicId);

                // 3c) Update or create pivot record
                RequirementUser::updateOrCreate(
                    [
                        'user_id'                 => $request->user_id,
                        'job_post_requirement_id' => $reqId,
                        'application_id'          => $application->id,
                    ],
                    [
                        'file_path'         => $url,
                        'file_public_id'    => $publicId,
                        'original_filename' => $file->getClientOriginalName(),
                        'status'            => 'pending',
                    ]
                );
            }

            DB::commit();

            return response()->json([
                'success'        => true,
                'message'        => 'Requirements uploaded successfully',
                'application_id' => $application->id,
            ]);
        } catch (\Throwable $e) {
            DB::rollBack();
            \Log::error('UploadRequirements error', ['exception' => $e]);
            return response()->json([
                'success' => false,
                'message' => 'Error uploading requirements: ' . $e->getMessage(),
            ], 500);
        }
    }
}
