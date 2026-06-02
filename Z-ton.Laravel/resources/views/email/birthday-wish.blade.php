<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Happy Birthday from Z-ton Bank!</title>
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #F3F4F6; color: #1F2937; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
        .header { background-color: #1F2937; color: #ffffff; padding: 15px 15px; text-align: center; border-bottom: 4px solid #B8860B; }
        .header h1 { margin: 0; font-size: 20px; letter-spacing: 2px; }
        .icon-image { width: 120px; height: auto; display: block; margin: 25px auto 0; }
        .content { padding: 10px 20px; line-height: 1.6; font-size: 14px; text-align: center; }
        .greeting { font-family: Georgia, 'Times New Roman', Times, serif; font-size: 26px; font-style: italic; font-weight: normal; margin-bottom: 5px; color: #B8860B; }
        .message { margin-bottom: 25px; color: #4B5563; }
        .footer { background-color: #1F2937; padding: 15px; text-align: center; font-size: 11px; color: #9CA3AF; }
        .highlight { color: #B8860B; font-weight: bold; }
        .divider { width: 40px; height: 2px; background-color: #B8860B; margin: 15px auto; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Z-TON BANK</h1>
        </div>
        <img src="https://qpopsjtjprtaouaasozv.supabase.co/storage/v1/object/public/Z-ton-Mobile-App/Icon/1780363023912.png" alt="Happy Birthday" class="icon-image">
        <div class="content">
            <p class="greeting">Happy Birthday!</p>
            <div class="divider"></div>
            <p class="message">
                Dear {{ $user->name ?? 'Valued Customer' }},<br><br>
                On behalf of everyone at <span class="highlight">Z-ton Bank</span>, we extend our warmest wishes to you on your special day.
            </p>
            <p class="message">
                May your birthday be filled with joy, happiness, and memorable moments. We deeply appreciate your trust and partnership with us.
            </p>
            <p class="message">
                Wishing you a truly wonderful birthday and a year ahead filled with health, success, and prosperity.
            </p>
            <p style="font-size: 14px; margin-bottom: 0;">Warmest Regards,<br><strong>The Z-ton Bank Team</strong></p>
        </div>
        <div class="footer">
            <p>&copy; {{ date('Y') }} Z-ton X-L Bank PLC. All rights reserved.</p>
            <p>Authorized and regulated by the Central Bank. <br>This is a special greeting from your bank.</p>
        </div>
    </div>
</body>
</html>