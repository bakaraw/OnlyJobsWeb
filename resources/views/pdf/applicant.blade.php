<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Applicant {{ $applicant->name }} (App #{{ $application->id }})</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 12px; }
        h2 { margin-top: 1em; border-bottom: 1px solid #333; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 1em; }
        th, td { border: 1px solid #666; padding: 4px; }
        th { background: #eee; }
    </style>
</head>
<body>
<h1>Applicant Profile</h1>
<p><strong>Name:</strong> {{ $applicant->first_name }} {{ $applicant->last_name }}</p>
<p><strong>Email:</strong> {{ $applicant->email }}</p>
<p><strong>Contact:</strong> {{ $applicant->contact_number }}</p>
<p><strong>Gender:</strong> {{ $applicant->gender }}</p>
<p><strong>Birthdate:</strong> {{ optional($applicant->birthdate)->format('F j, Y') }}</p>

<h2>Address</h2>
<p>
    {{ $applicant->address->street ?? 'N/A' }}<br>
    {{ $applicant->address->street2 ?? '' }}<br>
    {{ $applicant->address->city ?? '' }}, {{ $applicant->address->province ?? '' }} {{ $applicant->address->postal_code ?? '' }}<br>
    {{ $applicant->address->country ?? '' }}
</p>

<h2>Qualifications & Skills</h2>
@if($skills->isEmpty())
    <p>No skills listed.</p>
@else
    <ul>
        @foreach($skills as $us)
            <li>{{ $us->skill->name ?? $us->skill_name }}</li>
        @endforeach
    </ul>
@endif

<h2>Education</h2>
@if($educations->isEmpty())
    <p>No education records.</p>
@else
    <table>
        <thead>
        <tr><th>Level</th><th>School</th><th>Year</th></tr>
        </thead>
        <tbody>
        @foreach($educations as $edu)
            <tr>
                <td>{{ $edu->education_level }}</td>
                <td>{{ $edu->school_name }}</td>
                <td>{{ $edu->year_completed }}</td>
            </tr>
        @endforeach
        </tbody>
    </table>
@endif

<h2>Work History</h2>
@if($workHistory->isEmpty())
    <p>No work history.</p>
@else
    <table>
        <thead>
        <tr><th>Job Title</th><th>Employer</th><th>From – To</th></tr>
        </thead>
        <tbody>
        @foreach($workHistory as $w)
            <tr>
                <td>{{ $w->job_title }}</td>
                <td>{{ $w->employer }}</td>
                <td>{{ optional($w->start_date)->format('M Y') }} – {{ $w->end_date ? $w->end_date->format('M Y') : 'Present' }}</td>
            </tr>
        @endforeach
        </tbody>
    </table>
@endif

<h2>Certifications</h2>
@if($certifications->isEmpty())
    <p>No certifications.</p>
@else
    <table>
        <thead>
        <tr><th>Title</th><th>Description</th><th>Year</th></tr>
        </thead>
        <tbody>
        @foreach($certifications as $c)
            <tr>
                <td>{{ $c->title }}</td>
                <td>{{ $c->description }}</td>
                <td>{{ $c->year }}</td>
            </tr>
        @endforeach
        </tbody>
    </table>
@endif

<h2>Applications</h2>
<table>
    <thead>
    <tr><th>Job</th><th>Company</th><th>Date Applied</th><th>Status</th></tr>
    </thead>
    <tbody>
    <tr>
        <td>{{ $jobPost->job_title ?? 'N/A' }}</td>
        <td>{{ $jobPost->company ?? 'N/A' }}</td>
        <td>{{ optional($application->created_at)->format('F j, Y') }}</td>
        <td>{{ $application->status }}</td>
    </tr>
    </tbody>
</table>

<h2>Uploaded Documents</h2>
@if($documents->isEmpty())
    <p>No documents uploaded.</p>
@else
    <ul>
        @foreach($documents as $doc)
            <li>{{ $doc->requirement_name }} ({{ optional($doc->created_at)->format('F j, Y') }})</li>
        @endforeach
    </ul>
@endif
</body>
</html>
