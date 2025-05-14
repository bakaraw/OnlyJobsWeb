<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{{ $fullName }} - Application Profile</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            color: #333;
            line-height: 1.4;
            margin: 0;
            padding: 20px;
        }

        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 1px solid #ddd;
            padding-bottom: 10px;
        }

        .header h1 {
            color: #2563eb;
            margin-bottom: 5px;
        }

        .application-meta {
            margin-bottom: 15px;
        }

        .status-badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            margin-left: 8px;
        }

        .status-Accepted {
            background-color: #86efac;
            color: #14532d;
        }

        .status-Qualified {
            background-color: #93c5fd;
            color: #1e3a8a;
        }

        .status-Pending {
            background-color: #fde68a;
            color: #78350f;
        }

        .status-Rejected {
            background-color: #fca5a5;
            color: #7f1d1d;
        }

        .section {
            margin-bottom: 25px;
        }

        .section-title {
            font-size: 18px;
            font-weight: bold;
            border-bottom: 1px solid #ddd;
            padding-bottom: 5px;
            margin-bottom: 15px;
            color: #2563eb;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }

        th {
            background-color: #f3f4f6;
            text-align: left;
            padding: 8px;
            font-weight: bold;
        }

        td {
            padding: 8px;
            border-bottom: 1px solid #ddd;
        }

        .label {
            font-weight: bold;
            width: 30%;
        }

        .value {
            width: 70%;
        }

        .page-break {
            page-break-after: always;
        }

        .footer {
            position: fixed;
            bottom: 0;
            width: 100%;
            text-align: center;
            font-size: 10px;
            color: #666;
            border-top: 1px solid #ddd;
            padding-top: 5px;
        }

        .remarks {
            background-color: #f9fafb;
            padding: 10px;
            border-radius: 5px;
            border-left: 4px solid #2563eb;
            margin: 15px 0;
        }

        .no-data {
            color: #6b7280;
            font-style: italic;
        }
    </style>
</head>
<body>
<div class="header">
    <h1>Applicant Profile</h1>
    <h2>{{ $fullName }}</h2>
    <div class="application-meta">
        <p>
            <strong>Position:</strong> {{ $jobTitle }}
            <span class="status-badge status-{{ $status }}">{{ $status }}</span>
        </p>
        <p><strong>Application Date:</strong> {{ $dateApplied }}</p>
        @if($application->remarks)
            <div class="remarks">
                <strong>Remarks:</strong> {{ $application->remarks }}
            </div>
        @endif
    </div>
</div>

<!-- Personal Information -->
<div class="section">
    <h2 class="section-title">Personal Information</h2>
    <table>
        <tr>
            <td class="label">Full Name</td>
            <td class="value">{{ $fullName }}</td>
        </tr>
        <tr>
            <td class="label">Email</td>
            <td class="value">{{ $user->email ?? 'Not specified' }}</td>
        </tr>
        <tr>
            <td class="label">Contact Number</td>
            <td class="value">{{ $user->contact_number ?? 'Not specified' }}</td>
        </tr>
        <tr>
            <td class="label">Gender</td>
            <td class="value">{{ $user->gender ?? 'Not specified' }}</td>
        </tr>
        <tr>
            <td class="label">Birthdate</td>
            <td class="value">{{ $user->birthdate ? date('F d, Y', strtotime($user->birthdate)) : 'Not specified' }}</td>
        </tr>
    </table>

    <h3>Address</h3>
    @if($address)
        <table>
            <tr>
                <td class="label">Street</td>
                <td class="value">{{ $address->street ?? 'N/A' }}</td>
            </tr>
            @if($address->street2)
                <tr>
                    <td class="label">Street 2</td>
                    <td class="value">{{ $address->street2 }}</td>
                </tr>
            @endif
            <tr>
                <td class="label">City</td>
                <td class="value">{{ $address->city ?? 'N/A' }}</td>
            </tr>
            <tr>
                <td class="label">Province</td>
                <td class="value">{{ $address->province ?? 'N/A' }}</td>
            </tr>
            <tr>
                <td class="label">Postal Code</td>
                <td class="value">{{ $address->postal_code ?? 'N/A' }}</td>
            </tr>
            <tr>
                <td class="label">Country</td>
                <td class="value">{{ $address->country ?? 'N/A' }}</td>
            </tr>
        </table>
    @else
        <p class="no-data">No address information available</p>
    @endif
</div>

<div class="page-break"></div>

<!-- Qualifications -->
<div class="section">
    <h2 class="section-title">Qualifications</h2>

    <h3>Skills</h3>
    @if(count($skills) > 0)
        <table>
            <thead>
            <tr>
                <th>Skill</th>
            </tr>
            </thead>
            <tbody>
            @foreach($skills as $skill)
                <tr>
                    <td>{{ $skill->skill->name ?? $skill->skill_name ?? 'N/A' }}</td>
                </tr>
            @endforeach
            </tbody>
        </table>
    @else
        <p class="no-data">No skills information available</p>
    @endif

    <h3>Education</h3>
    @if(count($educations) > 0)
        <table>
            <thead>
            <tr>
                <th>Education Level</th>
            </tr>
            </thead>
            <tbody>
            @foreach($educations as $education)
                <tr>
                    <td>{{ $education->education_level ?? 'N/A' }}</td>
                </tr>
            @endforeach
            </tbody>
        </table>
    @else
        <p class="no-data">No education information available</p>
    @endif
</div>

<!-- Professional Background -->
<div class="section">
    <h2 class="section-title">Professional Background</h2>

    <h3>Work History</h3>
    @if(count($workHistories) > 0)
        <table>
            <thead>
            <tr>
                <th>Job Title</th>
                <th>Employer</th>
                <th>Period</th>
            </tr>
            </thead>
            <tbody>
            @foreach($workHistories as $history)
                <tr>
                    <td>{{ $history->job_title ?? 'N/A' }}</td>
                    <td>{{ $history->employer ?? 'N/A' }}</td>
                    <td>
                        {{ $history->start_date ? date('M d, Y', strtotime($history->start_date)) : '?' }}
                        –
                        {{ $history->end_date ? date('M d, Y', strtotime($history->end_date)) : 'Present' }}
                    </td>
                </tr>
            @endforeach
            </tbody>
        </table>
    @else
        <p class="no-data">No work history information available</p>
    @endif

    <h3>Certifications</h3>
    @if(count($certifications) > 0)
        <table>
            <thead>
            <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Year</th>
            </tr>
            </thead>
            <tbody>
            @foreach($certifications as $cert)
                <tr>
                    <td>{{ $cert->title ?? 'N/A' }}</td>
                    <td>{{ $cert->description ?? 'N/A' }}</td>
                    <td>{{ $cert->year ?? 'N/A' }}</td>
                </tr>
            @endforeach
            </tbody>
        </table>
    @else
        <p class="no-data">No certification information available</p>
    @endif
</div>

<div class="page-break"></div>

<!-- Documents List -->
<div class="section">
    <h2 class="section-title">Submitted Documents</h2>

    @if(count($documents) > 0)
        <table>
            <thead>
            <tr>
                <th>Document Type</th>
                <th>File Name</th>
                <th>Upload Date</th>
            </tr>
            </thead>
            <tbody>
            @foreach($documents as $document)
                <tr>
                    <td>{{ $document->requirement_name ?? 'N/A' }}</td>
                    <td>{{ $document->original_filename ?? 'N/A' }}</td>
                    <td>{{ $document->created_at ? date('M d, Y', strtotime($document->created_at)) : 'N/A' }}</td>
                </tr>
            @endforeach
            </tbody>
        </table>
    @else
        <p class="no-data">No documents submitted</p>
    @endif
</div>

<div class="footer">
    <p>Confidential - For Internal Use Only | Generated on {{ date('F d, Y') }}</p>
</div>
</body>
</html>
