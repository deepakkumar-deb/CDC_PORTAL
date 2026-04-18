<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Registration Confirmation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            color: #333333;
            line-height: 1.6;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            border: 1px solid #e0e0e0;
        }
        .header {
            background-color: #800000; /* Maroon */
            color: #ffffff;
            text-align: center;
            padding: 30px 20px;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: normal;
        }
        .header h1 span {
            color: #ffffff;
            font-weight: bold;
        }
        .content {
            padding: 30px;
        }
        .bold {
            font-weight: bold;
        }
        .credentials {
            margin: 20px 0;
        }
        .footer {
            background-color: #800000;
            color: white;
            padding: 15px 30px;
            font-size: 14px;
        }
        .footer-links {
            margin-top: 30px;
            padding: 0 30px 20px 30px;
            font-size: 13px;
        }
        a {
            color: #0056b3;
            text-decoration: none;
        }
        .footer-links a {
            color: #0056b3;
        }
        .highlight-text {
            font-weight: bold;
            color: #8B0000;
        }
    </style>
</head>
<body>
    <div class="container">
        
        <div class="header">
            <h1>Career Development Centre, <span>IIT (ISM) Dhanbad</span></h1>
        </div>

        <div class="content">
            <p>Dear Recruitment Team,</p>
            <p>Greetings from Team CDC!</p>
            
            <p>Thank you for registering for our on-campus recruitment drive.<br>
            Please login to the portal using your credentials. Your login credentials are:</p>
            
            <div class="credentials">
                <p><span class="bold">Username:</span> <a href="mailto:{{ $email }}">{{ $email }}</a><br>
                <span class="bold">Portal Link:</span> <a href="{{ $portal_url }}">{{ $portal_url }}</a></p>
            </div>
            
            <p>Please fill the <span class="bold">Job Notification Form (JNF)</span> or <span class="bold">Internship Notification Form (INF)</span> after logging-in to the portal.</p>
            
            <p>Kindly note that the filled-in forms can be <span class="bold">edited only as long as it is not approved</span> by Team CDC!</p>
            
            <p>Also find below the CDC, IIT (ISM) website link:<br>
            <a href="https://www.iitism.ac.in/~cdc/">https://www.iitism.ac.in/~cdc/</a></p>
            
            <p>Kindly reach out to us in case of any issue or query.</p>
            
            <p>Thanks and Regards,<br>
            Team CDC</p>
        </div>

        <div class="footer-links">
            <hr style="border: 0; border-top: 1px solid #ccc; margin-bottom: 15px;">
            <p style="margin: 3px 0;">Visit us at <a href="https://www.iitism.ac.in/~cdc/">CDC portal</a></p>
            <p style="margin: 3px 0;"><a href="https://www.linkedin.com/school/iitism/">LinkedIn</a> | <a href="{{ $portal_url }}">Career Portal</a></p>
            <p style="margin: 3px 0;">Career Development Centre</p>
            <p style="margin: 3px 0;"><span style="font-weight: bold; color: #800000;">IIT (ISM) Dhanbad</span></p>
            <hr style="border: 0; border-top: 1px solid #ccc; margin-top: 15px;">
        </div>

        <div class="footer">
            <p style="margin: 0;">Career Development Centre</p>
        </div>

    </div>
</body>
</html>
