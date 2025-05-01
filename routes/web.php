<?php

use App\Http\Controllers\ApplicantController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\CertificationController;
use App\Http\Controllers\EducationController;
use App\Http\Controllers\JobPostController;
use App\Http\Controllers\JobSeekerController;
use App\Http\Controllers\JobSeekerDocumentController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\PlacementController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RequirementController;
use App\Http\Controllers\WorkHistoryController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\LightcastController;
use App\Http\Controllers\UserSkillsController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\MessageController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});
Route::get('/about', [PageController::class, 'about'])->name('about');

//Route::middleware(['auth'])->group(function () {
//    Route::get('/dashboard', function () {
//        return Inertia::render('Dashboard');
//    });
//});
// Placements
Route::get('/placement', [PlacementController::class, 'index'])->name('placement.index');
Route::get('/placement/create', [PlacementController::class, 'create'])->name('placement.create');
Route::post('/placement', [PlacementController::class, 'store'])->name('placement.store');
Route::get('/placement/{placement}', [PlacementController::class, 'show'])->name('placement.show');
Route::delete('/placement/{placement}', [PlacementController::class, 'destroy'])->name('placement.destroy');

// Job Seeker Documents
Route::get('/documents', [JobSeekerDocumentController::class, 'index'])->name('documents.index');
Route::get('/documents/create', [JobSeekerDocumentController::class, 'create'])->name('documents.create');
Route::post('/documents', [JobSeekerDocumentController::class, 'store'])->name('documents.store');
Route::get('/documents/{document}', [JobSeekerDocumentController::class, 'show'])->name('documents.show');
Route::delete('/documents/{document}', [JobSeekerDocumentController::class, 'destroy'])->name('documents.destroy');

//// Requirements
//Route::get('/requirements', [RequirementController::class, 'index'])->name('requirements.index');
//Route::get('/requirements/create', [RequirementController::class, 'create'])->name('requirements.create');
//Route::post('/requirements', [RequirementController::class, 'store'])->name('requirements.store');
//Route::delete('/requirements/{requirement}', [RequirementController::class, 'destroy'])->name('requirements.destroy');
//// Requirements
//Route::get('/requirements', [RequirementController::class, 'index'])->name('requirements.index');
//Route::get('/requirements/create', [RequirementController::class, 'create'])->name('requirements.create');
//Route::post('/requirements', [RequirementController::class, 'store'])->name('requirements.store');
//Route::delete('/requirements/{requirement}', [RequirementController::class, 'destroy'])->name('requirements.destroy');


//Route::get('/dashboard', function () {
//    return Inertia::render('Dashboard');
//})->middleware(['auth', 'verified'])->name('dashboard');

//Route::get('/placements', [PlacementController::class, 'show'])->name('placements.show');


Route::get('/about_us', function () {
    return Inertia::render('AboutUs');
})->name('about_us');

Route::get('/create', function () {
    return Inertia::render('createJob');
})->name('sample');


Route::get('/contact_us', function () {
    return Inertia::render('ContactUs');
})->name('contact_us');




//Route::get('/company/dashboard', [DashboardController::class, 'company'])->name('company.dashboard');

Route::get('/find_work', [JobSeekerController::class, 'show'])->name('find_work');
Route::get('/job/{id}', [JobSeekerController::class, 'JobView'])->name('job.view');
Route::post('/job_posts/{id}/increment_views', [JobSeekerController::class, 'incrementViews'])->name('job_posts.increment_views');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::post('/profile/picture', [ProfileController::class, 'updateProfilePicture'])
        ->name('profile.picture.update');
    //    Route::get('/jobseeker/dashboard', [DashboardController::class, 'jobseeker'])->name('jobseeker.dashboard');
    //    Route::get('/company/dashboard', [DashboardController::class, 'company'])->name('company.dashboard');
    //    Route::post('/company/createjob', [JobPostController::class, 'store']);
    //Route::get('/find_work', [JobPostController::class, 'show'])->name('jobs.show');
    Route::get('job_posts/create', [JobPostController::class, 'create'])
        ->name('job_posts.create');

    Route::post('job_posts', [JobPostController::class, 'store'])
        ->name('job_posts.store');

    Route::get('/education', [EducationController::class, 'edit'])
        ->name('education.edit');

    Route::get('/admin/dashboard', [JobPostController::class, 'showDashboard'])
        ->name('dashboard');

    Route::post('/education', [EducationController::class, 'store'])
        ->name('education.store');

    Route::post('/education/{education}', [EducationController::class, 'update'])
        ->name('education.update');

    Route::delete('/education/{education}', [EducationController::class, 'destroy'])
        ->name('education.destroy');

    Route::get('/admin/dashboard', [JobPostController::class, 'showDashboard'])
        ->name('dashboard');

    Route::post('/work_history', [WorkHistoryController::class, 'store'])
        ->name('work_history.store');

    Route::put('/work_history/{work_history}', [WorkHistoryController::class, 'update'])
        ->name('work_history.update');

    Route::delete('/work_history/{work_history}', [WorkHistoryController::class, 'destroy'])
        ->name('work_history.destroy');

    Route::post('/certification', [CertificationController::class, 'store'])
        ->name('certification.store');

    Route::post('/certification/{certification}', [CertificationController::class, 'update'])
        ->name('certification.update');

    Route::delete('/certification/{certification}', [CertificationController::class, 'destroy'])
        ->name('certification.destroy');

    Route::post('/user-skills', [UserSkillsController::class, 'store'])
        ->name('user-skills.store');

    Route::delete('/user-skills/{userSkill}', [UserSkillsController::class, 'destroy'])
        ->name('user-skills.destroy');

    Route::post('/jobs/{id}/apply', [JobSeekerController::class, 'apply'])->name('apply');
    Route::delete('/job-posts/{id}', [JobPostController::class, 'destroy'])->name('delete');

    Route::post('/applicants/reject', [ApplicantController::class, 'rejectApplicant'])->name('applicants.reject');
    Route::post('/applicants/qualified', [ApplicantController::class, 'qualifiedAccepted'])->name('qualified.accept');
    Route::post('/applicants/accepted', [ApplicantController::class, 'finalApplicant'])->name('applicant.accept');
    Route::patch('/applications/update-remark', [ApplicantController::class, 'updateRemark']);
    Route::get('/dashboard/pipeline', [ApplicantController::class, 'pipeLineData'])->name('pipelineData');
    Route::post('/requirements', [RequirementController::class, 'store'])->name('requirements.store');
    Route::get('/job-posts/{id}', [JobPostController::class, 'viewJobPost'])->name('job-posts.view');
    Route::get('/job-posts/{id}/edit', [JobPostController::class, 'edit'])->name('job-posts.edit');
    Route::delete('/job-posts/{id}', [JobPostController::class, 'destroy'])->name('job-posts.destroy');

    // Email Verification Notice
    Route::get('/email/verify', [AuthController::class, 'verifyNotice'])
        ->name('verification.notice');
    //
    // Email verification Handler
    Route::get('/email/verify/{id}/{hash}', [AuthController::class, 'verifyEmail'])
        ->middleware('signed')
        ->name('verification.verify');

    Route::post('/email/verification-notification', [AuthController::class, 'verifyHandler'])
        ->middleware('throttle:6,1')
        ->name('verification.send');

    // messaging
    Route::get('/conversations', [MessageController::class, 'getConversations']);  // Fetch user's conversations
    Route::get('/conversations/{conversationId}/messages', [MessageController::class, 'getMessages']);  // Get messages for a specific conversation
    Route::post('/conversations/{conversationId}/send', [MessageController::class, 'sendMessage']);  // Send a message
    Route::post('/conversations/{jobId}/create', [MessageController::class, 'createConversation']);  // Create a conversation if it doesn't exist
});
//Route::get('/dashboard', function () {
//    return Inertia::render('Dashboard', [
//        'auth' => [
//            'user' => auth()->user(),
//        ],
//    ]);
//})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

// Third Party API
Route::get('/skills', [LightcastController::class, 'fetchSkills']);

require __DIR__ . '/auth.php';
