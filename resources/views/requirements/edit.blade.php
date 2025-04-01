<!DOCTYPE html>
<html>
<head>
    <title>Edit Requirement</title>
</head>
<body>
<h1>Edit Requirement</h1>
<form action="{{ route('requirements.update', $requirement->id) }}" method="POST">
    @csrf
    @method('PUT')
    <label>Requirement Name:</label>
    <input type="text" name="requirement_name" value="{{ $requirement->requirement_name }}" required><br>

    <label>Description:</label>
    <textarea name="description" required>{{ $requirement->description }}</textarea><br>

    <label>Validity Period (if applicable):</label>
    <input type="text" name="validity_period" value="{{ $requirement->validity_period }}"><br>

    <button type="submit">Update Requirement</button>
</form>
<a href="{{ route('requirements.index') }}">Back to Requirements</a>
</body>
</html>
