<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password - Z-ton Bank</title>
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #F3F4F6; color: #1F2937; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
        .header { background-color: #1F2937; color: #ffffff; padding: 15px 15px; text-align: center; border-bottom: 4px solid #B8860B; }
        .header h1 { margin: 0; font-size: 18px; letter-spacing: 1px; }
        .content { padding: 15px 15px; line-height: 1.4; font-size: 13px; }
        .greeting { font-size: 14px; font-weight: bold; margin-bottom: 10px; }
        .info-box { background-color: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 12px; padding: 15px; text-align: center; margin: 15px 0; }
        .status-badge { display: inline-block; background-color: #EF4444; color: #ffffff; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: bold; text-transform: uppercase; margin-bottom: 8px; }
        .footer { background-color: #1F2937; padding: 15px; text-align: center; font-size: 11px; color: #9CA3AF; }
        .btn { display: inline-block; padding: 10px 20px; background-color: #000000; color: #FFFFFF !important; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 10px; transition: background 0.3s; border: 1px solid #B8860B; }
        .highlight { color: #B8860B; font-weight: bold; }
        .link-fallback { font-size: 11px; color: #9CA3AF; word-break: break-all; margin-top: 15px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Z-TON BANK</h1>
        </div>
        <div class="content">
            <p class="greeting">Hello {{ $user->name ?? 'User' }},</p>
            <p>You are receiving this email because we received a password reset request for your account at <span class="highlight">Z-ton Bank</span>.</p>
            
            <div class="info-box">
                <div class="status-badge">Security Request</div>
                <p style="margin: 5px 0; font-size: 12px;">Click the button below to set a new password. This link is valid for <strong>{{ config('auth.passwords.users.expire') }} minutes</strong>.</p>
                <div style="text-align: center;">
                    <a href="{{ $resetLink }}" class="btn">RESET PASSWORD</a>
                </div>
            </div>

            <p>If you did not request a password reset, no further action is required.</p>
            
            <p class="link-fallback">
                If the button above does not work, copy and paste this URL into your browser:<br>
                <a href="{{ $resetLink }}" style="color: #B8860B;">{{ $resetLink }}</a>
            </p>

            <p style="margin-top: 15px; font-size: 12px;">Thank you for choosing Z-ton Bank as your trusted financial partner.</p>
            <p style="font-size: 14px;">Best Regards,<br><strong>The Z-ton Bank Team</strong></p>
        </div>
        <div class="footer">
            <p>&copy; {{ date('Y') }} Z-ton X-L Bank PLC. All rights reserved.</p>
            <p>Authorized and regulated by the Central Bank. <br>This is an automated security message, please do not reply.</p>
        </div>
    </div>
</body>
</html>
