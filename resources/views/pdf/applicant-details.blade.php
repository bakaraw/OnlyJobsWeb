<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Applicant Details</title>
    <style>
        @import url('https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css');
        body { font-family: 'Inter', sans-serif; }
        .header { @apply text-center mb-6; }
        .section { @apply mb-6; }
        h2 { @apply text-2xl font-bold border-b border-gray-200 pb-2 mb-4; }
        h4 { @apply text-lg font-semibold mb-2; }
        table { @apply w-full border-collapse mb-4; }
        th, td { @apply px-4 py-2 border-b border-gray-200 text-left; }
        th { @apply bg-gray-100 font-medium; }
        .btn { @apply inline-block px-4 py-2 rounded-lg text-sm font-medium; }
        .btn-back { @apply bg-gray-200 text-gray-800 hover:bg-gray-300; }
        .btn-export { @apply bg-blue-600 text-white hover:bg-blue-700; }
    </style>
</head>
<body class="p-6 bg-gray-50">
<div class="header">
    <h2>
        {{ $user->first_name }}
        @if($user->middle_name){{ ucfirst(substr($user->middle_name, 0, 1)) }}.@endif
        {{ $user->last_name }}
        @if($user->suffix), {{ $user->suffix }}@endif
    </h2>
    <div class="flex justify-center space-x-4">
        <a href="{{ url()->previous() }}" class="btn btn-back">Back</a>
        <a href="{{ route('applicants.pdf', $user->id) }}" class="btn btn-export">Export PDF</a>
    </div>
</div>

{{-- Grid container: 2 columns on md+ --}}
<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    {{-- Left column: Personal & Contact --}}
    <div class="section bg-white p-4 rounded-lg shadow">
        <h4>Personal Information</h4>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                <p class="font-semibold">Email:</p>
                <p class="text-gray-600">{{ $user->email ?? 'Not specified' }}</p>
            </div>
            <div>
                <p class="font-semibold">Contact Number:</p>
                <p class="text-gray-600">{{ $user->contact_number ?? 'Not specified' }}</p>
            </div>
            <div>
                <p class="font-semibold">Gender:</p>
                <p class="text-gray-600">{{ ucfirst($user->gender ?? 'Not specified') }}</p>
            </div>
            <div>
                <p class="font-semibold">Birthdate:</p>
                <p class="text-gray-600">{{ optional($user->birthdate)->format('M d, Y') ?? 'Not specified' }}</p>
            </div>
        </div>
        @if($user->address)
            <div class="mt-4">
                <p class="font-semibold">Address:</p>
                <p class="text-gray-600">
                    {{ implode(', ', array_filter([
                        $user->address->street,
                        $user->address->street2,
                        $user->address->city,
                        $user->address->province,
                        $user->address->postal_code,
                        $user->address->country
                    ])) }}
                </p>
            </div>
        @endif
    </div>

    {{-- Right column: Skills & Certifications --}}
    <div>
        @if($user->userSkills && $user->userSkills->count())
            <div class="section bg-white p-4 rounded-lg shadow">
                <h4>Skills</h4>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    @foreach($user->userSkills as $skill)
                        <div class="p-2 bg-gray-50 rounded">
                            {{ $skill->skill->name ?? $skill->skill_name }}
                        </div>
                    @endforeach
                </div>
            </div>
        @endif

        @if($user->certifications && $user->certifications->count())
            <div class="section bg-white p-4 rounded-lg shadow">
                <h4>Certifications</h4>
                <table>
                    <thead>
                    <tr>
                        <th>Title</th>
                        <th>Year</th>
                        <th>Description</th>
                    </tr>
                    </thead>
                    <tbody>
                    @foreach($user->certifications as $cert)
                        <tr>
                            <td>{{ $cert->title }}</td>
                            <td>{{ $cert->year }}</td>
                            <td>{{ $cert->description ?? 'N/A' }}</td>
                        </tr>
                    @endforeach
                    </tbody>
                </table>
            </div>
        @endif
    </div>
</div>

{{-- Remaining sections full width --}}
@if($user->educations && $user->educations->count())
    <div class="section bg-white p-4 rounded-lg shadow">
        <h4>Education</h4>
        <table>
            <thead>
            <tr>
                <th>Degree</th>
                <th>School</th>
                <th>Period</th>
            </tr>
            </thead>
            <tbody>
            @foreach($user->educations as $edu)
                <tr>
                    <td>{{ $edu->degree ?? 'N/A' }}</td>
                    <td>{{ $edu->school ?? 'N/A' }}</td>
                    <td>{{ $edu->start_year }} - {{ $edu->end_year ?? 'Present' }}</td>
                </tr>
            @endforeach
            </tbody>
        </table>
    </div>
@endif

@if($user->workHistories && $user->workHistories->count())
    <div class="section bg-white p-4 rounded-lg shadow">
        <h4>Work Experience</h4>
        <table>
            <thead>
            <tr>
                <th>Position</th>
                <th>Employer</th>
                <th>Duration</th>
            </tr>
            </thead>
            <tbody>
            @foreach($user->workHistories as $work)
                <tr>
                    <td>{{ $work->job_title ?? $work->position ?? 'N/A' }}</td>
                    <td>{{ $work->employer ?? 'N/A' }}</td>
                    <td>{{ optional($work->start_date)->format('M d, Y') }} - {{ optional($work->end_date)->format('M d, Y') ?? 'Present' }}</td>
                </tr>
            @endforeach
            </tbody>
        </table>
    </div>
@endif

@if($user->applications && $user->applications->count())
    <div class="section bg-white p-4 rounded-lg shadow">
        <h4>Applications</h4>
        <table>
            <thead>
            <tr>
                <th>Job Title</th>
                <th>Company</th>
                <th>Type</th>
                <th>Status</th>
                <th>Remarks</th>
                <th>Date Applied</th>
            </tr>
            </thead>
            <tbody>
            @foreach($user->applications as $app)
                <tr>
                    <td>{{ $app->jobPost->job_title ?? 'N/A' }}</td>
                    <td>{{ $app->jobPost->company ?? 'N/A' }}</td>
                    <td>{{ $app->jobPost->job_type ?? 'N/A' }}</td>
                    <td class="capitalize {{ ['accepted'=>'text-green-600','rejected'=>'text-red-600','qualified'=>'text-blue-600','pending'=>'text-yellow-600'][$app->status] ?? '' }}">{{ ucfirst($app->status) }}</td>
                    <td>{{ $app->remarks ?? 'None' }}</td>
                    <td>{{ optional($app->created_at)->format('F d, Y') }}</td>
                </tr>
                @if($app->jobPost->requirements->count())
                    <tr>
                        <td colspan="6" class="p-0">
                            <div class="bg-gray-50 p-4">
                                <h4 class="text-md font-semibold mb-2">Requirements for {{ $app->jobPost->job_title }}</h4>
                                <table>
                                    <thead>
                                    <tr>
                                        <th>Document</th>
                                        <th>Status</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    @foreach($app->jobPost->requirements as $req)
                                        <tr>
                                            <td class="capitalize">{{ $req->requirement_name }}</td>
                                            <td class="capitalize">{{ $user->requirements->contains(function($sub) use($req, $app) { return $sub->job_post_requirement_id == $req->id && $sub->application_id == $app->id; }) ? 'Submitted':'Not Submitted' }}</td>
                                        </tr>
                                    @endforeach
                                    </tbody>
                                </table>
                            </div>
                        </td>
                    </tr>
                @endif
            @endforeach
            </tbody>
        </table>
    </div>
@endif

</body>
</html>
