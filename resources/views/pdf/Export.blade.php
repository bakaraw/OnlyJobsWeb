<?php /**
 * export.blade.php
 * Blade template for exporting applicant data
 * Variables passed:
 * - $filteredApplicants: Collection of applicants with related user data
 */ ?>

    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Applicant Export</title>
    <style>
        body { font-family: sans-serif; }
        h2 { margin-top: 2em; border-bottom: 1px solid #ccc; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 1.5em; }
        th, td { border: 1px solid #ddd; padding: 8px; }
        th { background: #f4f4f4; text-align: left; }
        .section { margin-bottom: 2em; }
    </style>
</head>
<body>
<h1>Applicant Data Export</h1>

@foreach ($filteredApplicants as $applicant)
    @php $u = $applicant->user; $addr = $u->address; @endphp

    <section class="section">
        <h2>{{ $u->first_name }} {{ $u->last_name }} @if($u->suffix) , {{ $u->suffix }}@endif</h2>

        {{-- Personal Info --}}
        <h3>Personal Information</h3>
        <table>
            <tbody>
            <tr><th>First Name</th><td>{{ $u->first_name }}</td></tr>
            <tr><th>Middle Name</th><td>{{ $u->middle_name ?? 'N/A' }}</td></tr>
            <tr><th>Last Name</th><td>{{ $u->last_name }}</td></tr>
            <tr><th>Suffix</th><td>{{ $u->suffix ?? 'N/A' }}</td></tr>
            <tr><th>Email</th><td>{{ $u->email }}</td></tr>
            <tr><th>Contact Number</th><td>{{ $u->contact_number }}</td></tr>
            <tr><th>Gender</th><td>{{ $u->gender }}</td></tr>
            <tr><th>Birthdate</th><td>{{ optional($u->birthdate)->format('F d, Y') }}</td></tr>
            </tbody>
        </table>

        {{-- Address --}}
        @if($addr)
            <h3>Address</h3>
            <table>
                <tbody>
                <tr><th>Street</th><td>{{ $addr->street }}</td></tr>
                <tr><th>Street 2</th><td>{{ $addr->street2 ?? 'N/A' }}</td></tr>
                <tr><th>City</th><td>{{ $addr->city }}</td></tr>
                <tr><th>Province</th><td>{{ $addr->province }}</td></tr>
                <tr><th>Postal Code</th><td>{{ $addr->postal_code }}</td></tr>
                <tr><th>Country</th><td>{{ $addr->country }}</td></tr>
                </tbody>
            </table>
        @endif

        {{-- Qualifications (Skills & Education) --}}
        <h3>Qualifications</h3>
        <table>
            <thead>
            <tr>
                <th>Type</th>
                <th>Detail</th>
            </tr>
            </thead>
            <tbody>
            {{-- Skills --}}
            @foreach ($u->user_skills as $skill)
                <tr>
                    <td>Skill</td>
                    <td>{{ $skill->skill->name ?? $skill->skill_name }}</td>
                </tr>
            @endforeach
            {{-- Education Levels --}}
            @foreach ($u->educations as $edu)
                <tr>
                    <td>Education</td>
                    <td>{{ $edu->degree }} ({{ $edu->education_level }}) at {{ $edu->school }}<br>
                        {{ $edu->start_year }} - {{ $edu->end_year ?? 'Present' }}
                    </td>
                </tr>
            @endforeach
            </tbody>
        </table>

        {{-- Professional Background (Work & Certifications) --}}
        <h3>Professional Background</h3>
        <table>
            <thead>
            <tr>
                <th>Category</th>
                <th>Title/Position</th>
                <th>Employer/Issuer</th>
                <th>Period/Year</th>
            </tr>
            </thead>
            <tbody>
            {{-- Experiences --}}
            @foreach ($u->experiences as $exp)
                <tr>
                    <td>Experience</td>
                    <td>{{ $exp->job_title }}</td>
                    <td>{{ $exp->employer }}</td>
                    <td>{{ $exp->start_date->format('Y-m-d') }} - {{ $exp->end_date ? $exp->end_date->format('Y-m-d') : 'Present' }}</td>
                </tr>
            @endforeach
            {{-- Work Histories --}}
            @foreach ($u->work_histories as $hist)
                <tr>
                    <td>History</td>
                    <td>{{ $hist->position }}</td>
                    <td>{{ $hist->employer }}</td>
                    <td>{{ $hist->start_date->format('Y-m-d') }} - {{ $hist->end_date ? $hist->end_date->format('Y-m-d') : 'Present' }}</td>
                </tr>
            @endforeach
            {{-- Certifications --}}
            @foreach ($u->certifications as $cert)
                <tr>
                    <td>Certification</td>
                    <td>{{ $cert->title }}</td>
                    <td>{{ $cert->description }}</td>
                    <td>{{ $cert->year }}</td>
                </tr>
            @endforeach
            </tbody>
        </table>

        {{-- Applications --}}
        <h3>Applications</h3>
        <table>
            <thead>
            <tr>
                <th>Job Title</th>
                <th>Company</th>
                <th>Date Applied</th>
                <th>Status</th>
            </tr>
            </thead>
            <tbody>
            @foreach ($applicant->applications as $app)
                <tr>
                    <td>{{ $app->job_post->job_title ?? $app->job_title }}</td>
                    <td>{{ $app->job_post->company ?? $app->company }}</td>
                    <td>{{ $app->created_at->format('F d, Y') }}</td>
                    <td>{{ $app->status }}</td>
                </tr>
            @endforeach
            </tbody>
        </table>
    </section>
@endforeach

</body>
</html>
