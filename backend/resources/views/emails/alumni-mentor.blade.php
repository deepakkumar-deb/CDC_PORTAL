<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
        .container { padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 8px; }
        .header { background-color: #003366; color: white; padding: 15px; border-radius: 8px 8px 0 0; text-align: center; }
        .content { padding: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>New Alumni Mentorship Application</h2>
        </div>
        <div class="content">
            <p>Hello Admin,</p>
            <p>A new IIT (ISM) Alumni Mentorship Application has been submitted.</p>
            <p><strong>Applicant Name:</strong> {{ $data['name'] }}</p>
            <p><strong>Email:</strong> {{ $data['email'] }}</p>
            @if(!empty($data['phone']))
            <p><strong>Mobile Number:</strong> {{ $data['phone'] }}</p>
            @endif
            <p><strong>Years of Experience:</strong> {{ $data['years_of_experience'] }}</p>
            <p><strong>Preferred Mode:</strong> {{ $data['preferred_mode'] }}</p>
            <p><strong>Max Mentees:</strong> {{ $data['max_mentees'] }}</p>
            <p>Please find the full application details in the attached PDF document.</p>
            <br>
            <p>Best Regards,</p>
            <p>CDC Portal System</p>
        </div>
    </div>
</body>
</html>
