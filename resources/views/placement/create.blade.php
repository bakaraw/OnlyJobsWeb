<!DOCTYPE html>
<html>
<head>
    <title>Create Placement</title>
</head>
<body>
<h1>Create Placement</h1>
<form action="{{ route('placement.store') }}" method="POST">
    @csrf
    <label>Candidate (User ID):</label>
    <select name="user_id" required>
        @foreach ($candidates as $candidate)
            <option value="{{ $candidate->id }}">{{ $candidate->first_name }} {{ $candidate->last_name }}</option>
        @endforeach
    </select><br>

    <label>Job Post:</label>
    <select name="job_post_id" required>
        @foreach ($jobPosts as $jobPost)
            <option value="{{ $jobPost->id }}">{{ $jobPost->job_title }}</option>
        @endforeach
    </select><br>

    <label>Placement Status:</label>
    <input type="text" name="placement_status" required><br>

    <label>Date Placed:</label>
    <input type="date" name="date_placed" required><br>

    <label>Remarks:</label>
    <textarea name="remarks"></textarea><br>

    <button type="submit">Create Placement</button>
</form>
<a href="{{ route('placement.index') }}">Back to Placements</a>
</body>
</html>
