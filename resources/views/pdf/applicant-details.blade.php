<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{{ "{$user->first_name} {$user->last_name}" }}</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 12px; }
        h1 { text-align: center; margin-bottom: 20px; }
        .label { font-weight: bold; display: inline-block; width: 120px; vertical-align: top; }
        .section { margin-bottom: 15px; }
        table { width: 100%; border-collapse: collapse; margin-top: 5px; }
        th, td { border: 1px solid #ccc; padding: 4px; text-align: left; }
        th { background: #f5f5f5; }
    </style>
</head>
<body>
<h1>User Profile</h1>

<div class="section">
    <p><span class="label">Name:</span>
        {{ $user->first_name }}
        {{ $user->middle_name ? substr($user->middle_name,0,1).'.' : '' }}
        {{ $user->last_name }}
        {{ $user->suffix ?? '' }}
    </p>
    <p><span class="label">Email:</span> {{ $user->email }}</p>
    <p><span class="label">Contact:</span> {{ $user->contact_number }}</p>
    <p><span class="label">Gender:</span> {{ ucfirst($user->gender) }}</p>
    <p><span class="label">Birthdate:</span> {{ optional($user->birthdate)->format('M d, Y') }}</p>
    @if($user->address)
        <p><span class="label">Address:</span>
            {{
              collect([
                $user->address->street,
                $user->address->street2,
                $user->address->city,
                $user->address->province,
                $user->address->postal_code,
                $user->address->country
              ])->filter()->implode(', ')
            }}
        </p>
    @endif
</div>

{{-- Applications --}}
@if($user->applications->count())
    <div class="section">
        <p class="label">Applications:</p>
        <table>
            <thead>
            <tr>
                <th>Job</th><th>Status</th><th>Applied On</th>
            </tr>
            </thead>
            <tbody>
            @foreach($user->applications as $app)
                <tr>
                    <td>{{ $app->jobPost->job_title }}</td>
                    <td>{{ ucfirst($app->status) }}</td>
                    <td>{{ $app->created_at->format('M d, Y') }}</td>
                </tr>
            @endforeach
            </tbody>
        </table>
    </div>
@endif

{{-- Skills / Certifications / Education / Work / Requirements --}}
{{-- You can copy from the previous Blade and just swap $applicant→$user and collection names --}}
</body>
</html>
