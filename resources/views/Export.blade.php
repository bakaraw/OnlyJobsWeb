<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Applicant #{{ $user->id }} Details</title>
    <style>
        body { font-family: sans-serif; }
        h2 { margin-top: 1em; border-bottom: 1px solid #ccc; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 1.5em; }
        th, td { border: 1px solid #ddd; padding: 6px; }
        th { background: #f4f4f4; text-align: left; }
    </style>
</head>
<body>
<h1>Applicant Profile: {{ $user->first_name }} {{ $user->last_name }}</h1>

<h2>Personal Information</h2>
<table>
    <tr><th>First Name</th><td>{{ $user->first_name }}</td></tr>
    <tr><th>Middle Name</th><td>{{ $user->middle_name ?? 'N/A' }}</td></tr>
    <tr><th>Last Name</th><td>{{ $user->last_name }}</td></tr>
    <tr><th>Suffix</th><td>{{ $user->suffix ?? 'N/A' }}</td></tr>
    <tr><th>Email</th><td>{{ $user->email }}</td></tr>
    <tr><th>Contact Number</th><td>{{ $user->contact_number }}</td></tr>
    <tr><th>Gender</th><td>{{ $user->gender }}</td></tr>
    <tr><th>Birthdate</th>
        <td>{{ optional($user->birthdate)->format('F d, Y') ?? 'N/A' }}</td>
    </tr>
</table>

@if($user->address)
    <h2>Address</h2>
    <table>
        <tr><th>Street</th><td>{{ $user->address->street }}</td></tr>
        <tr><th>Street 2</th><td>{{ $user->address->street2 ?? 'N/A' }}</td></tr>
        <tr><th>City</th><td>{{ $user->address->city }}</td></tr>
        <tr><th>Province</th><td>{{ $user->address->province }}</td></tr>
        <tr><th>Postal Code</th><td>{{ $user->address->postal_code }}</td></tr>
        <tr><th>Country</th><td>{{ $user->address->country }}</td></tr>
    </table>
@endif

<h2>Qualifications</h2>
<table>
    <thead>
    <tr><th>Type</th><th>Detail</th></tr>
    </thead>
    <tbody>
    @foreach($user->userSkills as $skill)
        <tr><td>Skill</td><td>{{ $skill->skill->name ?? $skill->skill_name }}</td></tr>
    @endforeach
    @foreach($user->educations as $edu)
        <tr>
            <td>Education</td>
            <td>
                {{ $edu->degree }} ({{ $edu->education_level }})<br>
                {{ $edu->school }}<br>
                {{ $edu->start_year }} – {{ $edu->end_year ?? 'Present' }}
            </td>
        </tr>
    @endforeach
    </tbody>
</table>

<h2>Professional Background</h2>
<table>
    <thead>
    <tr>
        <th>Category</th><th>Role</th><th>Employer/Issuer</th><th>Period/Year</th>
    </tr>
    </thead>
    <tbody>
    @foreach($user->experiences as $exp)
        <tr>
            <td>Experience</td>
            <td>{{ $exp->job_title }}</td>
            <td>{{ $exp->employer }}</td>
            <td>{{ $exp->start_date->format('Y-m-d') }} – {{ $exp->end_date ? $exp->end_date->format('Y-m-d') : 'Present' }}</td>
        </tr>
    @endforeach
    @foreach($user->workHistories as $hist)
        <tr>
            <td>History</td>
            <td>{{ $hist->position }}</td>
            <td>{{ $hist->employer }}</td>
            <td>{{ $hist->start_date->format('Y-m-d') }} – {{ $hist->end_date ? $hist->end_date->format('Y-m-d') : 'Present' }}</td>
        </tr>
    @endforeach
    @foreach($user->certifications as $cert)
        <tr>
            <td>Certification</td>
            <td>{{ $cert->title }}</td>
            <td>{{ $cert->description }}</td>
            <td>{{ $cert->year }}</td>
        </tr>
    @endforeach
    </tbody>
</table>

<h2>Applications</h2>
<table>
    <thead>
    <tr><th>Job</th><th>Company</th><th>Date Applied</th><th>Status</th></tr>
    </thead>
    <tbody>
    @foreach($user->applications as $app)
        <tr>
            <td>{{ $app->jobPost->job_title ?? $app->job_title }}</td>
            <td>{{ $app->jobPost->company ?? $app->company }}</td>
            <td>{{ $app->created_at->format('F d, Y') }}</td>
            <td>{{ $app->status }}</td>
        </tr>
    @endforeach
    </tbody>
</table>
</body>
</html>
