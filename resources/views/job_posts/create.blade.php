<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Create Job Post</title>
</head>
<body>
<h1>Create Job Post</h1>

@if(session('success'))
    <div style="color: green;">{{ session('success') }}</div>
@endif

@if($errors->any())
    <div style="color: red;">
        <ul>
            @foreach($errors->all() as $error)
                <li>{{ $error }}</li>
            @endforeach
        </ul>
    </div>
@endif

<form action="{{ route('job_posts.store') }}" method="POST">
    @csrf

    <!-- Job Title -->
    <div>
        <label for="job_title">Job Title:</label>
        <input type="text" name="job_title" id="job_title" value="{{ old('job_title') }}" required>
    </div>
    <br>
    <div>
        <label for="company">Company:</label>
        <input type="text" name="company" id="company" value="{{ old('company') }}" required>
    </div>

    <!-- Job Description -->
    <div>
        <label for="job_description">Job Description:</label>
        <textarea name="job_description" id="job_description" required>{{ old('job_description') }}</textarea>
    </div>
    <br>

    <!-- Job Location -->
    <div>
        <label for="job_location">Job Location:</label>
        <input type="text" name="job_location" id="job_location" value="{{ old('job_location') }}" required>
    </div>
    <br>

    <!-- Job Type -->
    <div>
        <label for="job_type">Job Type:</label>
        <input type="text" name="job_type" id="job_type" value="{{ old('job_type') }}" required>
    </div>
    <br>

    <!-- Salary Range -->
    <div>
        <label for="min_salary">Minimum Salary:</label>
        <input type="number" name="min_salary" id="min_salary" value="{{ old('min_salary') }}" required>
    </div>
    <br>
    <div>
        <label for="max_salary">Maximum Salary:</label>
        <input type="number" name="max_salary" id="max_salary" value="{{ old('max_salary') }}" required>
    </div>
    <br>

    <!-- Experience -->
    <div>
        <label for="min_experience_years">Minimum Experience (Years):</label>
        <input type="number" name="min_experience_years" id="min_experience_years"
               value="{{ old('min_experience_years') }}" required>
    </div>


    <br>

    <!-- Job Status (Using job_statuses table) -->
    <div>
        <label for="status_id">Job Status:</label>
        <select name="status_id" id="status_id">
            <option value="">Select Job Status</option>
            @foreach($statuses as $status)
                <option value="{{ $status->id }}" {{ old('status_id') == $status->id ? 'selected' : '' }}>
                    {{ $status->name }}
                </option>
            @endforeach
        </select>
    </div>
    <br>

    <!-- Degree (Using degrees table) -->
    <div>
        <label for="degree_id">Degree:</label>
        <select name="degree_id" id="degree_id">
            <option value="">Select Degree</option>
            @foreach($degrees as $degree)
                <option value="{{ $degree->id }}" {{ old('degree_id') == $degree->id ? 'selected' : '' }}>
                    {{ $degree->name }}
                </option>
            @endforeach
        </select>
    </div>
    <br>

    <!-- Certificate (Using certificates table) -->
    {{--    <div>--}}
    {{--        <label for="requirement_id">Requirements:</label>--}}
    {{--        <select name="requirement_id" id="requirement_id">--}}
    {{--            <option value="">Select Requirements</option>--}}
    {{--            @foreach($requirement as $requirements)--}}
    {{--                <option--}}
    {{--                    value="{{ $requirements->id }}" {{ old('requirement_id') == $requirements->id ? 'selected' : '' }}>--}}
    {{--                    {{ $requirements->requirement_name }}--}}
    {{--                </option>--}}
    {{--            @endforeach--}}
    {{--        </select>--}}
    {{--    </div>--}}
    {{--    <br>--}}

    <!-- Skills (Multi-select) -->
    <div>
        <label for="skills">Skills (hold CTRL/Command for multiple):</label>
        <select name="skills[]" id="skills" multiple>
            @foreach($skills as $skill)
                <option
                    value="{{ $skill->skill_id }}" {{ collect(old('skills'))->contains($skill->skill_id) ? 'selected' : '' }}>
                    {{ $skill->skill_name }}
                </option>
            @endforeach
        </select>
    </div>
    <br>

    <!-- Skills (Multi-select) -->
    <div>
        <label for="requirements">Requirement (hold CTRL/Command for multiple):</label>
        <select name="requirements[]" id="requirement_id" multiple>
            @foreach($requirements as $requirement)
                <option
                    value="{{ $requirement->requirement_id }}" {{ old('requirement_id') == $requirement->requirement_id ? 'selected' : '' }}>
                    {{ $requirement->requirement_name }}
                </option>
            @endforeach
        </select>
    </div>
    <br>

    <button type="submit">Create Job Post</button>
</form>
</body>
</html>
