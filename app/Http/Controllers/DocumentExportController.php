<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Application;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Exception;
use Illuminate\Support\Facades\Log;

class DocumentExportController extends Controller
{
    /**
     * Export applicant documents as PDF
     *
     * @param int $applicantId
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function exportApplicantDocuments($applicantId, Request $request)
    {
        try {
            // Get application ID from query param if available
            $applicationId = $request->query('application_id');

            // Get user with all related data needed for the PDF
            $user = User::with([
                'requirements',
                'educations',
                'workHistories',
                'certifications',
                'userSkills.skill',
                'address',
            ])->findOrFail($applicantId);

            // Get application data if provided
            $application = null;
            if ($applicationId) {
                $application = Application::with([
                    'jobPost:id,job_title,company',
                    'requirements'
                ])->find($applicationId);
            }

            // Collect all documents
            $allDocuments = collect($user->requirements ?? []);

            // Add application-specific documents if applicable
            if ($application && isset($application->requirements)) {
                $allDocuments = $allDocuments->concat($application->requirements);
            }

            // Remove duplicates by ID
            $uniqueDocuments = $allDocuments->unique('id')->values();

            // Load the PDF view
            $pdf = Pdf::loadView('pdf.all-documents', [
                'user' => $user,
                'application' => $application,
                'documents' => $uniqueDocuments,
            ]);

            // Set paper size and orientation for better readability
            $pdf->setPaper('a4', 'portrait');

            // Generate a descriptive filename
            $filename = "applicant-{$user->id}-{$user->last_name}-documents.pdf";

            return $pdf->download($filename);
        } catch (Exception $e) {
            Log::error('PDF export failed: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
