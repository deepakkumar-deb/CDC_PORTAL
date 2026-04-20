<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
        .header { background-color: #800000; padding: 40px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; font-size: 28px; letter-spacing: 1px; }
        .content { padding: 40px; color: #333333; line-height: 1.8; }
        .welcome-msg { font-size: 20px; font-weight: 700; color: #800000; margin-bottom: 20px; }
        .footer { background-color: #f4f4f4; padding: 25px; text-align: center; color: #777777; font-size: 13px; }
        .next-steps { background-color: #fff9f0; border-left: 4px solid #C8922A; padding: 20px; margin: 30px 0; }
        .btn { display: inline-block; padding: 14px 28px; background-color: #800000; color: #ffffff !important; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 10px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>CDC PORTAL</h1>
        </div>
        <div class="content">
            <p class="welcome-msg">Welcome to the CDC Portal, {{ $name }}!</p>
            <p>Your account has been successfully created. We are excited to have you on board to facilitate recruitment and mentorship at IIT (ISM) Dhanbad.</p>
            
            <div class="next-steps">
                <strong>Next Steps:</strong>
                <ul style="margin-top: 10px;">
                    <li>Complete your Company Profile.</li>
                    <li>Post Job Notification Forms (JNF).</li>
                    <li>Post Internship Notification Forms (INF).</li>
                    <li>Connect with student talent and alumni mentors.</li>
                </ul>
            </div>

            <p>Log in to your dashboard to get started:</p>
            <a href="{{ url('/') }}" class="btn">Go to Dashboard</a>
            
            <p style="margin-top: 30px;">If you have any questions, feel free to contact our support team at <a href="mailto:cdc@iitism.ac.in">cdc@iitism.ac.in</a>.</p>
        </div>
        <div class="footer">
            <p>&copy; {{ date('Y') }} Career Development Centre, IIT (ISM) Dhanbad</p>
            <p>This is an automated message, please do not reply.</p>
        </div>
    </div>
</body>
</html>
