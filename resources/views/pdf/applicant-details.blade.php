<!DOCTYPE html>
<html>
<head>
    <title>Applicant Details</title>
    <style>
        body { font-family: Arial, sans-serif; }
        .header { text-align: center; margin-bottom: 20px; }
        .section { margin-bottom: 20px; }
        h2 { border-bottom: 1px solid #ddd; padding-bottom: 5px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
        th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background-color: #f2f2f2; }
    </style>
</head>
<body>
<div class="header">
    <h1>Applicant Profile</h1>
    <h2>{{ $user->first_name }} {{ $user->middle_name ?? '' }} {{ $user->last_name }}</h2>
</div>

<div class="section">
    <h2>Personal Information</h2>
    <p><strong>Email:</strong> {{ $user->email }}</p>
    <p><strong>Contact:</strong> {{ $user->contact_number }}</p>
    <p><strong>Gender:</strong> {{ $user->gender }}</p>
    <p><strong>Birthdate:</strong> {{ $user->birthdate }}</p>
    @if($user->address)
        <p><strong>Address:</strong>
            {{ $user->address->street ?? '' }},
            {{ $user->address->city ?? '' }},
            {{ $user->address->province ?? '' }}
        </p>
    @endif
</div>

@if($user->educations && $user->educations->count() > 0)
    <div class="section">
        <h2>Education</h2>
        <table>
            <thead>
            <tr>
                <th>Degree</th>
                <th>School</th>
                <th>Year</th>
            </tr>
            </thead>
            <tbody>
            @foreach($user->educations as $education)
                <tr>
                    <td>{{ $education->degree }}</td>
                    <td>{{ $education->school }}</td>
                    <td>{{ $education->start_year }} - {{ $education->end_year ?? 'Present' }}</td>
                </tr>
            @endforeach
            </tbody>
        </table>
    </div>
@endif

@if($user->workHistories && $user->workHistories->count() > 0)
    <div class="section">
        <h2>Work Experience</h2>
        <table>
            <thead>
            <tr>
                <th>Position</th>
                <th>Company</th>
                <th>Duration</th>
            </tr>
            </thead>
            <tbody>
            @foreach($user->workHistories as $work)
                <tr>
                    <td>{{ $work->position }}</td>
                    <td>{{ $work->employer }}</td>
                    <td>{{ $work->start_date }} - {{ $work->end_date ?? 'Present' }}</td>
                </tr>
            @endforeach
            </tbody>
        </table>
    </div>
@endif

@if($user->userSkills && $user->userSkills->count() > 0)
    <div class="section">
        <h2>Skills</h2>
        <ul>
            @foreach($user->userSkills as $userSkill)
                <li>{{ $userSkill->skill->name ?? $userSkill->skill_name ?? 'Unnamed skill' }}</li>
            @endforeach
        </ul>
    </div>
@endif

@if($user->applications && $user->applications->count() > 0)
    <div class="section">
        <h2>Applications</h2>
        <table>
            <thead>
            <tr>
                <th>Job Title</th>
                <th>Company</th>
                <th>Status</th>
                <th>Applied Date</th>
            </tr>
            </thead>
            <tbody>
            @foreach($user->applications as $application)
                <tr>
                    <td>{{ $application->jobPost->job_title ?? 'N/A' }}</td>
                    <td>{{ $application->jobPost->company ?? 'N/A' }}</td>
                    <td>{{ ucfirst($application->status) }}</td>
                    <td>{{ $application->created_at->format('M d, Y') }}</td>
                </tr>
            @endforeach
            </tbody>
        </table>
    </div>
@endif
</body>
</html>
