export const accVerifyHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            color: #333333;
            margin: 0;
            padding: 20px;
            text-align: center;
        }
        .container {
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            max-width: 600px;
            margin: 0 auto;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #ff6600;
            color: #ffffff;
            padding: 10px;
            border-radius: 8px 8px 0 0;
        }
        .header img {
            max-width: 100px;
            margin-bottom: 10px;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            font-size: 16px;
            color: #ffffff;
            background-color: #ff6600;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
        }
        .footer {
            color: #777777;
            font-size: 12px;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="https://csoc.040203.xyz/codeshack.png" width="100px" height="100px" alt="Codeshack Logo">
            <h1>Welcome to Codeshack Mentorship Program!</h1>
        </div>
        <p>Hi there,</p>
        <p>Thank you for registering in CSOC 2024 program. To complete your registration, please verify your email address by clicking the button below:</p>
        <a href="{{_link_}}" class="button">Verify Your Account</a>
        <p>If the button doesn't work, please copy and paste the following link into your browser:</p>
        <p><a href="{{_link_}}">{{_link_}}</a></p>
        <p>Welcome aboard!</p>
        <p>The Codeshack Team</p>
        <div class="footer">
            <p>&copy; 2024 Codeshack. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`

export const accVerifyText = `
Welcome to Codeshack Mentorship Program!

Hi there,

Thank you for registering in CSOC 2024 program. To complete your registration, please verify your email address by clicking the link below:

Verify Your Account: {{_link_}}

Welcome aboard!

The Codeshack Team
`

export const forgotHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            color: #333333;
            margin: 0;
            padding: 20px;
            text-align: center;
        }
        .container {
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            max-width: 600px;
            margin: 0 auto;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #ff6600;
            color: #ffffff;
            padding: 10px;
            border-radius: 8px 8px 0 0;
        }
        .header img {
            max-width: 100px;
            margin-bottom: 10px;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            font-size: 16px;
            color: #ffffff;
            background-color: #ff6600;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
        }
        .footer {
            color: #777777;
            font-size: 12px;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="https://csoc.040203.xyz/codeshack.png" width="100px" height="100px" alt="Codeshack Logo">
            <h1>Reset Your Password</h1>
        </div>
        <p>Hi there,</p>
        <p>We received a request to reset your password. Click the button below to reset your password:</p>
        <a href="{{_link_}}" class="button">Reset Password</a>
        <p>If the button doesn't work, please copy and paste the following link into your browser:</p>
        <p><a href="{{_link_}}">{{_link_}}</a></p>
        <p>If you didn't request a password reset, please ignore this email.</p>
        <p>The Codeshack Team</p>
        <div class="footer">
            <p>&copy; 2024 Codeshack. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`

export const forgotText = `
Reset Your Password

Hi there,

We received a request to reset your password. Click the link below to reset your password:

Reset Password: {{_link_}}

If you didn't request a password reset, please ignore this email.

The Codeshack Team
`

export const inviteHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            color: #333333;
            margin: 0;
            padding: 20px;
            text-align: center;
        }
        .container {
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            max-width: 600px;
            margin: 0 auto;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #ff6600;
            color: #ffffff;
            padding: 10px;
            border-radius: 8px 8px 0 0;
        }
        .header img {
            max-width: 100px;
            margin-bottom: 10px;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            font-size: 16px;
            color: #ffffff;
            background-color: #ff6600;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
        }
        .footer {
            color: #777777;
            font-size: 12px;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="https://csoc.040203.xyz/codeshack.png" width="100px" height="100px" alt="Codeshack Logo">
            <h1>You're Invited to Join a Team!</h1>
        </div>
        <p>Hi there,</p>
        <p><strong>{{_user_}}</strong> has invited you to join their team on CSOC.<br/>Please login and accept the invitation.</p>
        <p>We look forward to seeing you collaborate!</p>
        <p>The Codeshack Team</p>
        <div class="footer">
            <p>&copy; 2024 Codeshack. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;

export const inviteText = `
You're Invited to Join a Team!

Hi there,

{{_user_}} has invited you to join their team on Codeshack.

Please login and accept the invitation.

We look forward to seeing you collaborate!

The Codeshack Team
`;
