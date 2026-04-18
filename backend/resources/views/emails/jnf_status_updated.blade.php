<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; }
        .header { background: #003366; color: white; padding: 15px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { padding: 20px; }
        .footer { font-size: 0.8rem; color: #777; text-align: center; margin-top: 20px; }
        .status-badge { display: inline-block; padding: 5px 12px; border-radius: 4px; font-weight: bold; color: white; }
        .approved { background-color: #2e7d32; }
        .rejected { background-color: #8B0000; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Career Development Centre</h2>
            <p>IIT (ISM) Dhanbad</p>
        </div>
        <div class="content">
            <p>Dear Recruiter,</p>
            
            <p>The status of your {{ $jnf->opportunity_type === 'internship' ? 'Internship Notification Form (INF)' : 'Job Notification Form (JNF)' }} has been updated.</p>
            
            <p><strong>Form ID:</strong> {{ $jnf->jnf_code }}<br>
            <strong>Position:</strong> {{ $jnf->designation ?? $jnf->internship_title }}<br>
            <strong>Status:</strong> <span class="status-badge {{ $status }}">{{ strtoupper($status) }}</span></p>

            @if($status === 'approved')
                <p>Congratulations! Your form has been approved and was published for student applications.</p>
            @elseif($status === 'rejected')
                <p>Unfortunately, your form needs revisions before it can be processed further.</p>
                <p><strong>Reason for Rejection:</strong><br>
                <span style="color: #8B0000;">{{ $reason }}</span></p>
                <p>You can login to the portal, edit the form, and resubmit it.</p>
            @elseif($status === 'draft')
                <p>CDC admin has enabled editing for your form. You can now make the necessary adjustments.</p>
                <p><strong>Admin Note:</strong><br>
                <span style="color: #003366;">{{ $reason ?? 'CDC admin has allowed you to edit the form.' }}</span></p>
                <p>Please review the feedback, update the form, and resubmit it for final approval.</p>
            @endif

            <p>Best Regards,<br>
            Team CDC<br>
            IIT (ISM) Dhanbad</p>
        </div>
        <div class="footer">
            <p>This is an automated email. Please do not reply directly to this message.</p>
        </div>
    </div>
</body>
</html>
