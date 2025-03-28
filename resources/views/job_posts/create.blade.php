@extends('layouts.app')

@section('content')
    <div class="container">
        <h1 class="mb-4">Create Job Post</h1>
        <form action="{{ route('job_posts.store') }}" method="POST">
            @csrf

            <!-- Job Title -->
            <div class="form-group mb-3">
                <label for="job_title">Job Title</label>
                <input type="text" name="job_title" id="job_title" class="form-control" value="{{ old('job_title') }}">
                @error('job_title')<span class="text-danger">{{ $message }}</span>@enderror
            </div>

            <!-- Job Description -->
            <div class="form-group mb-3">
                <label for="job_description">Job Description</label>
                <textarea name="job_description" id="job_description" class="form-control">{{ old('job_description') }}</textarea>
                @error('job_description')<span class="text-danger">{{ $message }}</span>@enderror
            </div>

            <!-- Job Location -->
            <div class="form-group mb-3">
                <label for="job_location">Job Location</label>
                <input type="text" name="job_location" id="job_location" class="form-control" value="{{ old('job_location') }}">
                @error('job_location')<span class="text-danger">{{ $message }}</span>@enderror
            </div>

            <!-- Job Type -->
            <div class="form-group mb-3">
                <label for="job_type">Job Type</label>
                <input type="text" name="job_type" id="job_type" class="form-control" value="{{ old('job_type') }}">
                @error('job_type')<span class="text-danger">{{ $message }}</span>@enderror
            </div>

            <!-- Salary Details -->
            <div class="row mb-3">
                <div class="col-md-6">
                    <label for="min_salary">Minimum Salary</label>
                    <input type="number" name="min_salary" id="min_salary" class="form-control" value="{{ old('min_salary') }}">
                    @error('min_salary')<span class="text-danger">{{ $message }}</span>@enderror
                </div>
                <div class="col-md-6">
                    <label for="max_salary">Maximum Salary</label>
                    <input type="number" name="max_salary" id="max_salary" class="form-control" value="{{ old('max_salary') }}">
                    @error('max_salary')<span class="text-danger">{{ $message }}</span>@enderror
                </div>
            </div>

            <!-- Experience -->
            <div class="form-group mb-3">
                <label for="min_experience_years">Minimum Experience (Years)</label>
                <input type="number" name="min_experience_years" id="min_experience_years" class="form-control" value="{{ old('min_experience_years') }}">
                @error('min_experience_years')<span class="text-danger">{{ $message }}</span>@enderror
            </div>

            <!-- Job Status -->
            <div class="form-group mb-3">
                <label for="status_id">Job Status</label>
                <select name="status_id" id="status_id" class="form-control">
                    <option value="">Select Status</option>
                    @foreach($statuses as $status)
                        <option value="{{ $status->id }}" {{ old('status_id') == $status->id ? 'selected' : '' }}>
                            {{ $status->name }}
                        </option>
                    @endforeach
                </select>
                @error('status_id')<span class="text-danger">{{ $message }}</span>@enderror
            </div>

            <!-- Degree -->
            <div class="form-group mb-3">
                <label for="degree_id">Degree</label>
                <select name="degree_id" id="degree_id" class="form-control">
                    <option value="">Select Degree</option>
                    @foreach($degrees as $degree)
                        <option value="{{ $degree->id }}" {{ old('degree_id') == $degree->id ? 'selected' : '' }}>
                            {{ $degree->name }}
                        </option>
                    @endforeach
                </select>
                @error('degree_id')<span class="text-danger">{{ $message }}</span>@enderror
            </div>

            <!-- Certificate Search and Select -->
            <div class="form-group mb-3">
                <label for="certificate_search">Search Certificate</label>
                <input type="text" id="certificate_search" class="form-control" placeholder="Type to filter certificates...">
            </div>
            <div class="form-group mb-3">
                <label for="certificate_id">Certificate</label>
                <select name="certificate_id" id="certificate_id" class="form-control">
                    <option value="">Select Certificate</option>
                    @foreach($certificates as $certificate)
                        <option value="{{ $certificate->id }}" data-name="{{ strtolower($certificate->name) }}"
                            {{ old('certificate_id') == $certificate->id ? 'selected' : '' }}>
                            {{ $certificate->name }}
                        </option>
                    @endforeach
                </select>
                @error('certificate_id')<span class="text-danger">{{ $message }}</span>@enderror
            </div>

            <!-- Skills Search and Multi-select -->
            <div class="form-group mb-3">
                <label for="skill_search">Search Skills</label>
                <input type="text" id="skill_search" class="form-control" placeholder="Type to filter skills...">
            </div>
            <div class="form-group mb-3">
                <label for="skills">Skills</label>
                <select name="skills[]" id="skills" class="form-control" multiple>
                    @foreach($skills as $skill)
                        <option value="{{ $skill->id }}" data-name="{{ strtolower($skill->name) }}"
                            {{ (collect(old('skills'))->contains($skill->id)) ? 'selected' : '' }}>
                            {{ $skill->name }}
                        </option>
                    @endforeach
                </select>
                @error('skills')<span class="text-danger">{{ $message }}</span>@enderror
            </div>

            <button type="submit" class="btn btn-primary">Create Job Post</button>
        </form>
    </div>

    <!-- Basic JavaScript to filter certificate and skills selects -->
    <script>
        document.addEventListener("DOMContentLoaded", function() {
            // Filter Certificate Options
            const certificateSearch = document.getElementById('certificate_search');
            const certificateSelect = document.getElementById('certificate_id');

            certificateSearch.addEventListener('input', function() {
                const searchTerm = this.value.toLowerCase();
                for (let option of certificateSelect.options) {
                    if (option.value === "") continue; // Skip the default option
                    const optionName = option.getAttribute('data-name');
                    option.style.display = optionName.includes(searchTerm) ? "" : "none";
                }
            });

            // Filter Skills Options
            const skillSearch = document.getElementById('skill_search');
            const skillsSelect = document.getElementById('skills');

            skillSearch.addEventListener('input', function() {
                const searchTerm = this.value.toLowerCase();
                for (let option of skillsSelect.options) {
                    const optionName = option.getAttribute('data-name');
                    option.style.display = optionName.includes(searchTerm) ? "" : "none";
                }
            });
        });
    </script>
@endsection
