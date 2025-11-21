<!DOCTYPE html>
<html>
<head>
    <title>We Received Your Message</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #38c172; color: white; padding: 20px; text-align: center; }
        .content { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .message-box { background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #38c172; }
        .footer { text-align: center; color: #6c757d; font-size: 12px; margin-top: 20px; }
    </style>
</head>
<body>
<div class="container">
    <div class="header">
        <h1>Thank You for Contacting Us!</h1>
    </div>

    <div class="content">
        <p>Dear <strong>{{ $name }}</strong>,</p>

        <p>We've received your message and our team will get back to you within 24 hours.</p>

        <h3>Your Inquiry Summary:</h3>
        <p><strong>Subject:</strong> {{ $subject }}</p>
        <p><strong>Inquiry Type:</strong> {{ $inquiry_type }}</p>

        <div class="message-box">
            <p><strong>Your Message:</strong></p>
            <p style="white-space: pre-wrap;">{{ $message_content }}</p>
        </div>
    </div>

    <div class="content">
        <h3>Need Immediate Assistance?</h3>
        <p>If you have any urgent questions, please call our support team at <strong>+1 (555) 123-HELP</strong>.</p>
    </div>

    <div class="footer">
        <p><strong>Best regards,</strong><br>The eSupport Team</p>
        <hr>
        <p>This is an automated response. Please do not reply to this email.</p>
    </div>
</div>
</body>
</html>
