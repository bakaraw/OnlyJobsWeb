<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\RequirementUser;
use Illuminate\Support\Facades\Auth;

class DocumentViewController extends Controller
{
    /**
     * Get a specific document for viewing
     *
     * @param int $id The RequirementUser ID
     * @return \Illuminate\Http\JsonResponse
     */
    public function getDocument($id)
    {
        $document = RequirementUser::with(['application', 'requirement'])
            ->findOrFail($id);

        // Security check - only allow users to view their own documents or company users
        if (Auth::user()->id !== $document->user_id &&
            Auth::user()->id !== $document->application->job_post->user_id &&
            !Auth::user()->hasRole('admin')) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized to view this document'
            ], 403);
        }

        return response()->json([
            'success' => true,
            'document' => [
                'id' => $document->id,
                'file_path' => $document->file_path,
                'original_filename' => $document->original_filename,
                'requirement_name' => $document->requirement->requirement_name ?? 'Unknown Requirement',
                'status' => $document->status,
                'created_at' => $document->created_at->format('M d, Y'),
                'updated_at' => $document->updated_at->format('M d, Y'),
            ]
        ]);
    }

    /**
     * Get all documents for a specific application
     *
     * @param int $applicationId The application ID
     * @return \Illuminate\Http\JsonResponse
     */
    public function getApplicationDocuments($applicationId)
    {
        // Find the application and check authorization
        $documents = RequirementUser::with(['requirement'])
            ->where('application_id', $applicationId)
            ->get();



        return response()->json([
            'success' => true,
            'documents' => $documents->map(function($doc) {
                return [
                    'id' => $doc->id,
                    'file_path' => $doc->file_path,
                    'original_filename' => $doc->original_filename,
                    'requirement_name' => $doc->requirement->requirement_name ?? 'Unknown Requirement',
                    'status' => $doc->status,
                    'created_at' => $doc->created_at->format('M d, Y'),
                    'updated_at' => $doc->updated_at->format('M d, Y'),
                ];
            })
        ]);
    }
}
