<!DOCTYPE html>
<html>
<head>
    <title>Placement Details</title>
</head>
<body>
<h1>Placement Details</h1>
<p><strong>Candidate ID:</strong> {{ $placement->user->id }}</p>
<p><strong>Candidate Name:</strong> {{ $placement->user->first_name }} {{ $placement->user->last_name }}</p>
<p><strong>Job Post:</strong> {{ $placement->jobPost->job_title }}</p>
<p><strong>Status:</strong> {{ $placement->placement_status }}</p>
<p><strong>Date Placed:</strong> {{ $placement->date_placed }}</p>
<p><strong>Remarks:</strong> {{ $placement->remarks }}</p>
<a href="{{ route('placement.index') }}">Back to Placements</a>
</body>
</html>
