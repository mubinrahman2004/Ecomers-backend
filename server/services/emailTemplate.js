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
const resetPassEmailTem=({otp})=>{
  return `<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td style="padding: 20px 0 30px 0;">
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; border: 1px solid #cccccc; background-color: #ffffff;">
                    <tr>
                        <td align="center" bgcolor="#4A90E2" style="padding: 40px 0 30px 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                            পাসওয়ার্ড রিসেট করুন
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 40px 30px 40px 30px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td style="color: #333333; font-size: 18px;">
                                        প্রিয় ইউজার,
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 20px 0 30px 0; color: #555555; font-size: 16px; line-height: 24px;">
                                        আমরা আপনার অ্যাকাউন্ট থেকে পাসওয়ার্ড রিসেট করার একটি অনুরোধ পেয়েছি। নিচে আপনার ওটিপি (OTP) কোডটি দেওয়া হলো। এটি পরবর্তী ৫ মিনিটের জন্য কার্যকর থাকবে।
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center">
                                        <a href="${otp}" style="background-color: #f8f9fa; border: 2px dashed #4A90E2; padding: 15px; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #4A90E2; display: inline-block;">
                                          
                                        </a>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 30px 0 0 0; color: #555555; font-size: 14px; line-height: 20px;">
                                        আপনি যদি এই অনুরোধটি না করে থাকেন, তবে এই ইমেইলটি ইগনোর করুন। আপনার পাসওয়ার্ড পরিবর্তন হবে না।
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#eeeeee" style="padding: 30px 30px 30px 30px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td style="color: #999999; font-size: 12px; text-align: center;">
                                        &copy; 2026 আপনার কোম্পানি নাম। সর্বস্বত্ব সংরক্ষিত।
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>`
}

module.exports = { emailVerifyTemplate,resetPassEmailTem };
