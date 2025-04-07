// JobView.jsx
import React from 'react';

const JobView = ({ jobview }) => {
    console.log('JobView Data:', jobview); // Debug to check if data exists

    return (
        <div>
            {jobview ? (
                <div>
                    <h1>{jobview.job_title}</h1>
                    <p>Company: {jobview.company}</p>
                    {/* Other job details */}
                </div>
            ) : (
                <p>Loading job details...</p>
            )}
        </div>
    );
}

export default JobView;
