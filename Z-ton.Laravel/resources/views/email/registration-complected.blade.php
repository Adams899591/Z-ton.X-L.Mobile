<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Fully Activated - Z-ton Bank</title>
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #F3F4F6; color: #1F2937; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
        .header { background-color: #1F2937; color: #ffffff; padding: 25px 20px; text-align: center; border-bottom: 4px solid #B8860B; }
        .header h1 { margin: 0; font-size: 20px; letter-spacing: 1px; }
        .content { padding: 25px 20px; line-height: 1.5; }
        .greeting { font-size: 16px; font-weight: bold; margin-bottom: 15px; }
        .success-box { background-color: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 12px; padding: 20px; text-align: center; margin: 20px 0; }
        .status-badge { display: inline-block; background-color: #10B981; color: #ffffff; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; text-transform: uppercase; margin-bottom: 10px; }
        .account-label { font-size: 12px; text-transform: uppercase; color: #9CA3AF; font-weight: 700; letter-spacing: 2px; margin-bottom: 5px; display: block; }
        .account-number { font-size: 24px; font-weight: bold; color: #B8860B; letter-spacing: 3px; }
        .details-list { list-style: none; padding: 0; margin: 15px 0; border-top: 1px solid #F3F4F6; padding-top: 15px; }
        .details-list li { margin-bottom: 8px; font-size: 14px; }
        .footer { background-color: #1F2937; padding: 20px; text-align: center; font-size: 12px; color: #9CA3AF; }
        .btn { display: inline-block; padding: 12px 25px; background-color: #000000; color: #FFFFFF !important; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 15px; transition: background 0.3s; border: 1px solid #B8860B; }
        .highlight { color: #B8860B; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Z-TON BANK</h1>
        </div>
        <div class="content">
            <p class="greeting">Hello {{ $user->name }},</p>
            <p>Great news! Your registration is now complete and your <span class="highlight">Z-ton Bank</span> account has been successfully activated.</p>
            
            <div class="success-box">
                <div class="status-badge">Fully Active</div>
                <span class="account-label">Confirmed Account Number</span>
                <div class="account-number">{{ $user->account_number }}</div>
            </div>

            <p>You now have full access to our digital banking suite. You can start using the app immediately to:</p>
            <ul class="details-list">
                <li>✓ Send and receive secure transfers</li>
                <li>✓ Pay bills and purchase airtime/data</li>
                <li>✓ Track your spending in real-time</li>
                <li>✓ Access 24/7 priority customer support</li>
            </ul>

            <p>Your welcome credit has been applied to your balance. Open the Z-ton mobile app now to explore your new way of banking.</p>
            
            <div style="text-align: center;">
                <a href="#" class="btn">LOGIN TO YOUR ACCOUNT</a>
            </div>

            <p style="margin-top: 25px; font-size: 14px;">Thank you for choosing Z-ton Bank as your trusted financial partner.</p>
            <p style="font-size: 14px;">Best Regards,<br><strong>The Z-ton Bank Team</strong></p>
        </div>
        <div class="footer">
            <p>&copy; {{ date('Y') }} Z-ton X-L Bank PLC. All rights reserved.</p>
            <p>Authorized and regulated by the Central Bank. <br>This is an automated security message, please do not reply.</p>
        </div>
    </div>
</body>
</html>
