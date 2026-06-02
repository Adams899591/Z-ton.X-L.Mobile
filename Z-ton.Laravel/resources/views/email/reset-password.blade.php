<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 1px solid #eeeeee;
        }
        .header img {
            max-width: 150px;
            height: auto;
        }
        .content {
            padding: 20px 0;
        }
        .button-container {
            text-align: center;
            margin: 25px 0;
        }
        .button {
            background-color: #000000; /* Black */
            color: #ffffff;
            padding: 12px 25px;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            display: inline-block;
        }
        .footer {
            text-align: center;
            padding-top: 20px;
            border-top: 1px solid #eeeeee;
            font-size: 0.8em;
            color: #777777;
        }
        .link-fallback {
            font-size: 0.9em;
            color: #555555;
            word-break: break-all;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            {{-- You can add your logo here --}}
            {{-- <img src="{{ asset('images/your-logo.png') }}" alt="Your Company Logo"> --}}
            <h2>Password Reset Request</h2>
        </div>
        <div class="content">
            <p>Hello {{ $user->name ?? 'User' }},</p>
            <p>You are receiving this email because we received a password reset request for your account.</p>
            <div class="button-container">
                <a href="{{ $resetLink }}" class="button">Reset Password</a>
            </div>
            <p>This password reset link will expire in {{ config('auth.passwords.users.expire') }} minutes.</p>
            <p class="link-fallback">If the button above does not work, you can copy and paste the following link into your web browser:</p>
          <a href="{{ $resetLink }}">{{ $resetLink }}</a>
            {{-- <p class="link-fallback"><a href="{{ $resetLink }}">{{ $resetLink }}</a></p> --}}
            <p>If you did not request a password reset, no further action is required.</p>
            <p>Regards,<br>Your Application Team</p>
        </div>
        <div class="footer">
            <p>&copy; {{ date('Y') }} Your Application Name. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
