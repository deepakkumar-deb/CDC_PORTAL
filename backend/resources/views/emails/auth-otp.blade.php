<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
        .header { background-color: #800000; padding: 30px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px; }
        .content { padding: 40px; text-align: center; color: #333333; }
        .otp-box { background-color: #f9f9f9; border: 1px dashed #800000; padding: 20px; font-size: 32px; font-weight: bold; color: #800000; letter-spacing: 5px; margin: 25px 0; border-radius: 4px; }
        .footer { background-color: #f4f4f4; padding: 20px; text-align: center; color: #777777; font-size: 12px; }
        .message { line-height: 1.6; font-size: 16px; margin-bottom: 20px; }
        .btn { display: inline-block; padding: 12px 24px; background-color: #800000; color: #ffffff; text-decoration: none; border-radius: 4px; font-weight: bold; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>CDC PORTAL</h1>
        </div>
        <div class="content">
            <div class="message">
                <h2>Email Verification</h2>
                <p>Hello,</p>
                <p>Verification Code for your CDC Portal account. This code is valid for <strong>{{ $expires }} minutes</strong>.</p>
            </div>
            <div class="otp-box">
                {{ $otp }}
            </div>
            <p class="message">If you did not request this code, please ignore this email.</p>
        </div>
        <div class="footer">
            <p>&copy; {{ date('Y') }} Career Development Centre, IIT (ISM) Dhanbad</p>
        </div>
    </div>
</body>
</html>
