<!DOCTYPE html>
<html>
<head>
    <title>Requirement Details</title>
</head>
<body>
<h1>Requirement Details</h1>
<p><strong>Name:</strong> {{ $requirement->requirement_name }}</p>
<p><strong>Description:</strong> {{ $requirement->description }}</p>
<p><strong>Validity Period:</strong> {{ $requirement->validity_period }}</p>
<a href="{{ route('requirements.index') }}">Back to Requirements</a>
</body>
</html>
