<!DOCTYPE html>
<html>
<head>
    <title>Placements</title>
</head>
<body>
<h1>Placements</h1>
<table>
    <tr><th>Job Seeker</th><th>Job</th></tr>
    @foreach ($placements as $placement)
        <tr>
            <td>{{ $placement->user->first_name }}</td>
            <td>{{ $placement->jobPost->job_title }}</td>
        </tr>
    @endforeach
</table>
</body>
</html>
