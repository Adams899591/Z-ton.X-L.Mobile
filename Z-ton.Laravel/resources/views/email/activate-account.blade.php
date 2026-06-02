<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Z-ton Bank</title>
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #F3F4F6; color: #1F2937; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
        .header { background-color: #1F2937; color: #ffffff; padding: 15px 15px; text-align: center; border-bottom: 4px solid #B8860B; }
        .header h1 { margin: 0; font-size: 18px; letter-spacing: 1px; }
        .content { padding: 15px 15px; line-height: 1.4; font-size: 13px; }
        .greeting { font-size: 14px; font-weight: bold; margin-bottom: 10px; }
        .account-box { background-color: #F9FAFB; border: 2px solid #1F2937; border-radius: 12px; padding: 15px; text-align: center; margin: 15px 0; position: relative; }
        .account-label { font-size: 11px; text-transform: uppercase; color: #9CA3AF; font-weight: 700; letter-spacing: 1.5px; margin-bottom: 5px; display: block; }
        .account-number { font-size: 22px; font-weight: bold; color: #B8860B; letter-spacing: 4px; }
        .step-info { background-color: #FFFBEB; border-left: 4px solid #B8860B; padding: 10px 12px; margin: 12px 0; font-size: 13px; }
        .details-list { list-style: none; padding: 0; margin: 10px 0; border-top: 1px solid #F3F4F6; padding-top: 10px; }
        .details-list li { margin-bottom: 5px; font-size: 13px; }
        .footer { background-color: #1F2937; padding: 15px; text-align: center; font-size: 11px; color: #9CA3AF; }
        .btn { display: inline-block; padding: 10px 20px; background-color: #000000; color: #FFFFFF !important; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 10px; transition: background 0.3s; border: 1px solid #B8860B; }
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
            <p>Congratulations! You have successfully completed the first step of your registration with <span class="highlight">Z-ton Bank</span>. We are thrilled to have you join our digital banking community.</p>
            
            <div class="account-box">
                <span class="account-label">Your Official Account Number</span>
                <div class="account-number">{{ $user->account_number }}</div>
            </div>

            <div class="step-info">
                <strong>Final Action Required:</strong> To fully activate your account and receive your <span class="highlight">Welcome Credit</span>, please return to the mobile app and complete <strong>Step 2 (Activate Account)</strong> using the account number provided above.
            </div>

            <p><strong>Initial Account Details:</strong></p>
            <ul class="details-list">
                <li><strong>Account Type:</strong> {{ $user->account_type }}</li>
                <li><strong>Currency:</strong> {{ $user->currency }}</li>
                <li><strong>Status:</strong> <span style="color: #D97706;">Pending Activation</span></li>
            </ul>

            <p>Once activated, you will gain full access to secure transfers, bill payments, and our real-time financial tracking tools.</p>
            
            <div style="text-align: center;">
                <a href="#" class="btn">COMPLETE ACTIVATION</a>
            </div>

            <p style="margin-top: 15px; font-size: 12px;">If you have any questions, our 24/7 technical support team is always available to assist you.</p>
            <p style="font-size: 14px;">Best Regards,<br><strong>The Z-ton Bank Team</strong></p>
        </div>
        <div class="footer">
            <p>&copy; {{ date('Y') }} Z-ton X-L Bank PLC. All rights reserved.</p>
            <p>Authorized and regulated by the Central Bank. <br>This is an automated security message, please do not reply.</p>
        </div>
    </div>
</body>
</html>
