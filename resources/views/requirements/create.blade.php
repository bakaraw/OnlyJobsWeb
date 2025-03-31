<!DOCTYPE html>
<html>
<head>
    <title>Create Requirement</title>
</head>
<body>
<h1>Create Requirement</h1>
<form action="{{ route('requirements.store') }}" method="POST">
    @csrf
    <label>Requirement Name:</label>
    <input type="text" name="requirement_name" required><br>

    <label>Description:</label>
    <textarea name="description" required></textarea><br>

    <label>Validity Period (if applicable):</label>
    <input type="text" name="validity_period"><br>

    <button type="submit">Create Requirement</button>
</form>
<a href="{{ route('requirements.index') }}">Back to Requirements</a>
</body>
</html>
