<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Alumni Mentorship Application</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            color: #333;
            line-height: 1.6;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #003366;
            margin-bottom: 30px;
            padding-bottom: 10px;
        }
        .header h1 {
            color: #003366;
            margin: 0;
        }
        .header p {
            margin: 5px 0 0 0;
            color: #555;
            font-size: 14px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th, td {
            padding: 12px 15px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        th {
            background-color: #f5f7fa;
            width: 35%;
            font-weight: bold;
            color: #003366;
        }
        .footer {
            margin-top: 50px;
            text-align: center;
            font-size: 12px;
            color: #777;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>IIT (ISM) Dhanbad Alumni Mentorship Program</h1>
        <p>Application Form Details</p>
    </div>

    <table>
        <tr>
            <th>Full Name</th>
            <td>{{ $data['name'] }}</td>
        </tr>
        <tr>
            <th>Email Address</th>
            <td>{{ $data['email'] }}</td>
        </tr>
        @if(!empty($data['phone']))
        <tr>
            <th>Mobile Number</th>
            <td>{{ $data['std_code'] }} {{ $data['phone'] }}</td>
        </tr>
        @endif
        <tr>
            <th>Graduation Year</th>
            <td>{{ $data['graduation_year'] }}</td>
        </tr>
        <tr>
            <th>Branch / Degree</th>
            <td>{{ $data['branch'] }}</td>
        </tr>
        <tr>
            <th>Current Company</th>
            <td>{{ $data['company'] }}</td>
        </tr>
        <tr>
            <th>Designation / Role</th>
            <td>{{ $data['designation'] }}</td>
        </tr>
        <tr>
            <th>Years of Experience</th>
            <td>{{ $data['years_of_experience'] }}</td>
        </tr>
        <tr>
            <th>Preferred Mentorship Mode</th>
            <td>{{ $data['preferred_mode'] }}</td>
        </tr>
        <tr>
            <th>Max Mentees Capacity</th>
            <td>{{ $data['max_mentees'] }}</td>
        </tr>
        <tr>
            <th>LinkedIn Profile</th>
            <td><a href="{{ $data['linkedin'] }}">{{ $data['linkedin'] }}</a></td>
        </tr>
        <tr>
            <th>Area of Expertise / Preferred Mentorship Topics</th>
            <td>{{ nl2br(e($data['expertise'])) }}</td>
        </tr>
    </table>

    <div class="footer">
        <p>Generated automatically by the CDC Portal System on {{ date('M d, Y') }}.</p>
    </div>
</body>
</html>
