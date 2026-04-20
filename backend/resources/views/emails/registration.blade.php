<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
        .header { background-color: #800000; padding: 40px; text-align: center; color: #ffffff; }
        .header h1 { margin: 0; font-size: 26px; letter-spacing: 1px; font-weight: 300; }
        .header h1 span { font-weight: 700; color: #ffffff; }
        .content { padding: 40px; color: #333333; line-height: 1.8; }
        .welcome-msg { font-size: 20px; font-weight: 700; color: #800000; margin-bottom: 10px; }
        .footer { background-color: #f4f4f4; padding: 25px; text-align: center; color: #777777; font-size: 13px; border-top: 1px solid #eeeeee; }
        .next-steps { background-color: #fffaf0; border-left: 4px solid #C8922A; padding: 25px; margin: 30px 0; border-radius: 0 4px 4px 0; }
        .btn { display: inline-block; padding: 14px 32px; background-color: #800000; color: #ffffff !important; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 10px; box-shadow: 0 4px 8px rgba(128,0,0,0.2); }
        .footer-links { margin-top: 20px; font-size: 12px; }
        .footer-links a { color: #800000; text-decoration: none; font-weight: 600; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>CDC <span>PORTAL</span></h1>
            <p style="margin-top: 5px; opacity: 0.9;">IIT (ISM) Dhanbad</p>
        </div>
        <div class="content">
            <p class="welcome-msg">Welcome, {{ $name }}!</p>
            <p>Greetings from the Career Development Centre! Your account has been successfully registered on the CDC recruitment portal. We are committed to providing you with a seamless and efficient recruitment experience.</p>
            
            <div class="next-steps">
                <strong style="color: #800000; font-size: 18px;">Quick Start Guide:</strong>
                <ul style="margin-top: 10px; padding-left: 20px;">
                    <li><strong>Complete Profile:</strong> Update your company details.</li>
                    <li><strong>Post Openings:</strong> Create Job (JNF) or Internship (INF) forms.</li>
                    <li><strong>Manage Applications:</strong> Track recruitment status in real-time.</li>
                </ul>
            </div>

            <p>You can access your personalized recruiter dashboard using your email (<strong>{{ $email }}</strong>) through the link below:</p>
            <div style="text-align: center;">
                <a href="{{ $portal_url }}" class="btn">Access Dashboard</a>
            </div>
            
            <p style="margin-top: 40px; font-size: 14px; border-top: 1px solid #f0f0f0; pt: 20px;">
                For any technical assistance or recruitment queries, please reach out to us at 
                <a href="mailto:cdc@iitism.ac.in" style="color: #800000; font-weight: 600;">cdc@iitism.ac.in</a>.
            </p>
        </div>
        <div class="footer">
            <p>&copy; {{ date('Y') }} Career Development Centre, IIT (ISM) Dhanbad</p>
            <div class="footer-links">
                <a href="https://www.iitism.ac.in/~cdc/">Official Website</a> | 
                <a href="https://www.linkedin.com/school/iitism/">LinkedIn</a>
            </div>
        </div>
    </div>
</body>
</html>
