<!DOCTYPE html>
<html>
<head>
    <title>Edit Placement</title>
</head>
<body>
<h1>Edit Placement</h1>
<form action="{{ route('placement.update', $placement->id) }}" method="POST">
    @csrf
    @method('PUT')
    <label>Candidate (User ID):</label>
    <select name="user_id" required>
        @foreach ($candidates as $candidate)
            <option value="{{ $candidate->id }}"
                {{ $placement->user_id == $candidate->id ? 'selected' : '' }}>
                {{ $candidate->first_name }} {{ $candidate->last_name }}
            </option>
        @endforeach
    </select><br>

    <label>Job Post:</label>
    <select name="job_post_id" required>
        @foreach ($jobPosts as $jobPost)
            <option value="{{ $jobPost->id }}"
                {{ $placement->job_post_id == $jobPost->id ? 'selected' : '' }}>
                {{ $jobPost->job_title }}
            </option>
        @endforeach
    </select><br>

    <label>Placement Status:</label>
    <input type="text" name="placement_status" value="{{ $placement->placement_status }}" required><br>

    <label>Date Placed:</label>
    <input type="date" name="date_placed" value="{{ $placement->date_placed }}" required><br>

    <label>Remarks:</label>
    <textarea name="remarks">{{ $placement->remarks }}</textarea><br>

    <button type="submit">Update Placement</button>
</form>
<a href="{{ route('placement.index') }}">Back to Placements</a>
</body>
</html>
