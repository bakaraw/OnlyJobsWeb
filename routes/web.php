<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EducationController;
use App\Http\Controllers\JobPostController;
use App\Http\Controllers\JobSeekerDocumentController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\PlacementController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RequirementController;
use App\Http\Controllers\ViewsController;
use App\Http\Middleware\RoleMiddleware;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});
Route::get('/about', [PageController::class, 'about'])->name('about');

Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    });
});
// Placements

// Job Seeker Documents
Route::get('/documents', [JobSeekerDocumentController::class, 'index'])->name('documents.index');
Route::get('/documents/create', [JobSeekerDocumentController::class, 'create'])->name('documents.create');
Route::post('/documents', [JobSeekerDocumentController::class, 'store'])->name('documents.store');
Route::get('/documents/{document}', [JobSeekerDocumentController::class, 'show'])->name('documents.show');
Route::delete('/documents/{document}', [JobSeekerDocumentController::class, 'destroy'])->name('documents.destroy');

// Requirements
Route::get('/requirements', [RequirementController::class, 'index'])->name('requirements.index');
Route::get('/requirements/create', [RequirementController::class, 'create'])->name('requirements.create');
Route::post('/requirements', [RequirementController::class, 'store'])->name('requirements.store');
Route::delete('/requirements/{requirement}', [RequirementController::class, 'destroy'])->name('requirements.destroy');


//Route::get('/dashboard', function () {
//    return Inertia::render('Dashboard');
//})->middleware(['auth', 'verified'])->name('dashboard');

//Route::get('/placements', [PlacementController::class, 'show'])->name('placements.show');

Route::get('/find_work', [JobPostController::class, 'show'])->name('find_work');

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


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    //    Route::get('/jobseeker/dashboard', [DashboardController::class, 'jobseeker'])->name('jobseeker.dashboard');
    //    Route::get('/company/dashboard', [DashboardController::class, 'company'])->name('company.dashboard');
    //    Route::post('/company/createjob', [JobPostController::class, 'store']);
    //Route::get('/find_work', [JobPostController::class, 'show'])->name('jobs.show');
    Route::get('job_posts/create', [JobPostController::class, 'create'])
        ->name('job_posts.create');
    Route::post('/job_posts/{id}/increment_views', [JobPostController::class, 'incrementViews'])->name('job_posts.increment_views');

    Route::post('job_posts', [JobPostController::class, 'store'])
        ->name('job_posts.store');

    Route::get('/education/store', [EducationController::class, 'edit'])
        ->name('education.edit');

    Route::post('/education/store', [EducationController::class, 'store'])
        ->name('education.store');

    Route::get('/admin/dashboard', [JobPostController::class, 'showDashboard'])
        ->name('dashboard');
});
//Route::get('/dashboard', function () {
//    return Inertia::render('Dashboard', [
//        'auth' => [
//            'user' => auth()->user(),
//        ],
//    ]);
//})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

require __DIR__ . '/auth.php';
