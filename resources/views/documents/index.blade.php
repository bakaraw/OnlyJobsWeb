<!DOCTYPE html>
<html>
<head>
    <title>Candidate Documents</title>
</head>
<body>
<h1>Documents</h1>
<table>
    <tr><th>Job Seeker</th><th>Type</th></tr>
    @foreach ($documents as $document)
        <tr>
            <td>{{ $document->user->name }}</td>
            <td>{{ $document->document_type }}</td>
        </tr>
    @endforeach
</table>
</body>
</html>
