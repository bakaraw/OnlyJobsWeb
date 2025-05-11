<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\RequirementUser;
use Illuminate\Support\Facades\Auth;

class DocumentStatusController extends Controller
{
    /**
     * Update the status of a document
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateStatus(Request $request)
    {
        $request->validate([
            'document_id' => 'required|exists:requirement_users,id',
            'status' => 'required|in:pending,approved,rejected',
            'remarks' => 'nullable|string|max:500',
        ]);

        $document = RequirementUser::with(['application', 'requirement'])
            ->findOrFail($request->document_id);

        $document->status = strtolower($request->status);

        if ($request->has('remarks')) {
            $document->remarks = $request->remarks;
        }
        $document->save();
        return response()->json([
            'success' => true,
            'message' => 'Document status updated successfully',
            'document' => [
                'id' => $document->id,
                'status' => $document->status,
                'remarks' => $document->remarks,
                'updated_at' => $document->updated_at->format('M d, Y'),
            ]
        ]);
    }
}
