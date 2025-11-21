<!DOCTYPE html>
<html>
<head>
    <title>New Contact Form Submission</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #3490dc; color: white; padding: 20px; text-align: center; }
        .content { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .message-box { background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #3490dc; }
        .footer { text-align: center; color: #6c757d; font-size: 12px; margin-top: 20px; }
    </style>
</head>
<body>
<div class="container">
    <div class="header">
        <h1>New Contact Form Submission</h1>
    </div>

    <div class="content">
        <h3>Contact Details:</h3>
        <p><strong>Name:</strong> {{ $name }}</p>
        <p><strong>Email:</strong> {{ $email }}</p>
        <p><strong>Inquiry Type:</strong> {{ $inquiry_type }}</p>
        <p><strong>Subject:</strong> {{ $subject }}</p>
        <p><strong>Received:</strong> {{ $received_at }}</p>
    </div>

    <div class="content">
        <h3>Message:</h3>
        <div class="message-box">
            <p style="white-space: pre-wrap;">{{ $message_content }}</p>
        </div>
    </div>

    <div class="footer">
        <p>This email was sent from your website contact form.</p>
    </div>
</div>
</body>
</html>
