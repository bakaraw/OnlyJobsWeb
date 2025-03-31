<!DOCTYPE html>
<html>
<head>
    <title>Requirements</title>
</head>
<body>
<h1>Requirements</h1>
<ul>
    @foreach ($requirements as $requirement)
        <li>{{ $requirement->requirement_name }}</li>
    @endforeach
</ul>
</body>
</html>
