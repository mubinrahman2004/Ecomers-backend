const emailVerifyTemplate = ({ otp }) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Email Verification</title>

  <style>
    body {
      margin: 0;
      padding: 0;
      background: linear-gradient(135deg, #4f46e5, #3b82f6);
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    .wrapper {
      width: 100%;
      padding: 30px 15px;
    }

    .card {
      max-width: 520px;
      margin: auto;
      background: #ffffff;
      border-radius: 14px;
      overflow: hidden;
      box-shadow: 0 25px 60px rgba(0,0,0,0.2);
    }

    .header {
      background: linear-gradient(135deg, #2563eb, #4f46e5);
      color: #ffffff;
      padding: 30px;
      text-align: center;
    }

    .header h1 {
      margin: 0;
      font-size: 26px;
      letter-spacing: 0.5px;
    }

    .content {
      padding: 30px;
      text-align: center;
      color: #333;
    }

    .content p {
      font-size: 15px;
      line-height: 1.7;
      margin: 12px 0;
      color: #555;
    }

    .otp-box {
      margin: 30px auto;
      display: inline-block;
      padding: 16px 34px;
      font-size: 34px;
      letter-spacing: 8px;
      font-weight: 700;
      color: #2563eb;
      background: #eef2ff;
      border-radius: 10px;
      border: 1px dashed #c7d2fe;
    }

    .note {
      font-size: 14px;
      color: #666;
    }

    .footer {
      background: #f8fafc;
      padding: 18px;
      text-align: center;
      font-size: 12px;
      color: #888;
    }

    @media (max-width: 480px) {
      .otp-box {
        font-size: 28px;
        letter-spacing: 6px;
        padding: 14px 26px;
      }
    }
  </style>
</head>

<body>
  <div class="wrapper">
    <div class="card">

      <div class="header">
        <h1>Email Verification</h1>
      </div>

      <div class="content">
        <p>Hello 👋</p>

        <p>
          Use the following One-Time Password (OTP) to verify your email address.
        </p>

        <div class="otp-box">${otp}</div>

        <p class="note">
          ⏱ This OTP is valid for <strong>3 minutes</strong> only.
          <br />
          🔒 Do not share this code with anyone.
        </p>
      </div>

      <div class="footer">
        © ${new Date().getFullYear()} Node E-Commerce • All rights reserved
      </div>

    </div>
  </div>
</body>
</html>
`;
};

module.exports = { emailVerifyTemplate };
