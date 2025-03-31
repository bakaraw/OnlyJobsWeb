<!DOCTYPE html>
<html>
<head>
    <title>Upload Document</title>
</head>
<body>
<h1>Upload Document</h1>
<form action="{{ route('documents.store') }}" method="POST" enctype="multipart/form-data">
    @csrf
    <label>Document Type:</label>
    <input type="text" name="document_type" required><br>

    <label>Select File:</label>
    <input type="file" name="file" required><br>

    <button type="submit">Upload</button>
</form>
<a href="{{ route('documents.index') }}">Back to Documents</a>
</body>
</html>
