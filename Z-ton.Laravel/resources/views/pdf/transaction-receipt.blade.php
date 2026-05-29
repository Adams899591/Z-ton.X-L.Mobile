<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Transaction Receipt</title>
    <style>
        @page {
            margin: 0;
        }

        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            color: #333;
            font-size: 11px;
            margin: 0;
            padding: 0;
            background-color: #fff;
        }

        .receipt-container {
            width: 280px;
            margin: 0 auto;
            padding: 15px;
        }

        .header {
            text-align: center;
            margin-bottom: 15px;
            border-bottom: 1px solid #eee;
            padding-bottom: 10px;
        }

        .header h1 {
            color: #B8860B;
            margin: 5px 0;
            font-size: 18px;
            text-transform: uppercase;
        }

        .reference {
            font-family: 'Courier', monospace;
            font-size: 10px;
            color: #777;
        }

        .section {
            margin-bottom: 12px;
        }

        .section-title {
            font-size: 9px;
            text-transform: uppercase;
            font-weight: bold;
            color: #999;
            border-bottom: 1px solid #f4f4f4;
            margin-bottom: 5px;
            padding-bottom: 2px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        td {
            padding: 3px 0;
            vertical-align: top;
        }

        .td-label {
            color: #666;
            width: 40%;
        }

        .td-value {
            text-align: right;
            font-weight: 600;
        }

        .amount-box {
            margin: 15px 0;
            text-align: center;
            background: #fafafa;
            border-top: 2px solid #B8860B;
            border-bottom: 2px solid #B8860B;
            padding: 10px;
        }

        .amount-text {
            font-size: 22px;
            font-weight: bold;
            color: #B8860B;
        }

        .footer {
            margin-top: 20px;
            text-align: center;
            font-size: 9px;
            color: #aaa;
            line-height: 1.4;
        }

        .status-badge {
            color: #27ae60;
            font-weight: bold;
            text-transform: uppercase;
        }
    </style>
</head>

<body>
    <div class="receipt-container">
        <div class="header">
            <h1>Z-TON</h1>
            <div class="reference">REF: {{ $reference }}</div>
        </div>

        <div class="section">
            <table style="margin-bottom: 10px;">
                <tr>
                    <td class="td-label">Date</td>
                    <td class="td-value">{{ $date }}</td>
                </tr>
                <tr>
                    <td class="td-label">Status</td>
                    <td class="td-value"><span class="status-badge">Successful</span></td>
                </tr>
            </table>
        </div>

        <div class="section">
            <div class="section-title">Sender</div>
            <table>
                <tr>
                    <td class="td-label">Name</td>
                    <td class="td-value">{{ $sender }}</td>
                </tr>
                <tr>
                    <td class="td-label">Account</td>
                    <td class="td-value" style="font-family: monospace;">{{ $sender_account }}</td>
                </tr>
            </table>
        </div>

        <div class="section">
            <div class="section-title">Receiver</div>
            <table>
                <tr>
                    <td class="td-label">Beneficiary</td>
                    <td class="td-value">{{ $receiver }}</td>
                </tr>
                <tr>
                    <td class="td-label">Bank</td>
                    <td class="td-value">{{ $receiver_bank }}</td>
                </tr>
            </table>
        </div>

        @if($description)
        <div class="section">
            <div class="section-title">Note</div>
            <p>{{ $description }}</p>
        </div>
        @endif

        <div class="amount-box">
            <p style="margin: 0; color: #666;">Amount Transferred</p>
            <div class="amount-text">NGN {{ number_format($amount, 2) }}</div>
        </div>

        <div class="footer">
            <p>Thank you for using Z-ton. This is a computer-generated receipt.</p>
        </div>
    </div>
</body>

</html>