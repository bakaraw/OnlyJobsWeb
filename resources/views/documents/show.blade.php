<!DOCTYPE html>
<html>
<head>
    <title>View Document</title>
</head>
<body>
<h1>Document Details</h1>
<p><strong>Document Type:</strong> {{ $document->document_type }}</p>
<p>
    <strong>File:</strong>
    <a href="{{ asset('storage/' . $document->file_path) }}" target="_blank">
        View Document
    </a>
</p>
<p><strong>Verification Status:</strong> {{ $document->verification_status }}</p>
<p><strong>Uploaded At:</strong> {{ $document->uploaded_at }}</p>
<a href="{{ route('documents.index') }}">Back to Documents</a>
</body>
</html>
