import nodemailer from 'nodemailer';

// Gmail SMTP configuration (FREE - works with any recipient!)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER!,
    pass: process.env.GMAIL_APP_PASSWORD!,
  },
});

const FROM = process.env.GMAIL_USER!;

export interface SendMatchEmailParams {
  toEmail: string;
  toName: string;
  candidateName: string;
  candidateAge: number;
  candidateCity: string;
  candidateDesignation: string;
  candidateCompany: string;
  magicLink: string;
  introEmailBody: string;
}

/**
 * Send match notification email to client via Gmail SMTP
 */
export async function sendMatchEmail(params: SendMatchEmailParams): Promise<boolean> {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log('📤 Sending email via Gmail SMTP to:', params.toEmail);
    }
    
    await transporter.sendMail({
      from: `The Date Crew <${FROM}>`,
      to: params.toEmail,
      subject: `We found a potential match for you — ${params.candidateName}`,
      html: buildMatchEmailHTML(params),
    });
    
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Email sent successfully');
    }
    return true;
  } catch (error) {
    console.error('❌ Gmail SMTP error:', error);
    return false;
  }
}

/**
 * Build beautiful HTML email template
 */
function buildMatchEmailHTML(params: SendMatchEmailParams): string {
  const initial = params.candidateName.charAt(0).toUpperCase();
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>A potential match from The Date Crew</title>
</head>
<body style="margin:0;padding:0;background:#f9f7f4;font-family:'Helvetica Neue',Arial,sans-serif;">
  
  <!-- Header -->
  <div style="background:#1a1a2e;padding:32px;text-align:center;">
    <h1 style="color:#ffffff;font-size:24px;margin:0;font-weight:300;letter-spacing:2px;">
      THE DATE CREW
    </h1>
    <p style="color:#a0a0b8;font-size:12px;margin:8px 0 0;letter-spacing:1px;">
      MATCHMAKING · CURATED FOR YOU
    </p>
  </div>
  
  <!-- Main content -->
  <div style="max-width:560px;margin:0 auto;padding:40px 24px;">
    
    <!-- Greeting -->
    <h2 style="color:#1a1a2e;font-size:22px;font-weight:400;margin:0 0 8px;">
      Dear ${params.toName},
    </h2>
    <p style="color:#555;font-size:15px;line-height:1.7;margin:0 0 32px;">
      We are delighted to share that we have found a potential match for you.
      Please take a moment to review their profile.
    </p>
    
    <!-- Match preview card -->
    <div style="background:#ffffff;border-radius:16px;padding:28px;box-shadow:0 2px 16px rgba(0,0,0,0.06);margin-bottom:32px;">
      
      <!-- Avatar + name -->
      <div style="display:flex;align-items:center;gap:16px;margin-bottom:20px;">
        <div style="width:64px;height:64px;border-radius:50%;background:#7c3aed;display:flex;align-items:center;justify-content:center;font-size:24px;color:#fff;font-weight:500;flex-shrink:0;">
          ${initial}
        </div>
        <div>
          <h3 style="margin:0;color:#1a1a2e;font-size:20px;font-weight:600;">
            ${params.candidateName}
          </h3>
          <p style="margin:4px 0 0;color:#888;font-size:14px;">
            ${params.candidateAge} years · ${params.candidateCity}
          </p>
        </div>
      </div>
      
      <!-- Key details -->
      <div style="border-top:1px solid #f0f0f0;padding-top:20px;display:grid;gap:12px;">
        <div style="display:flex;gap:8px;">
          <span style="color:#888;font-size:13px;min-width:100px;">Profession</span>
          <span style="color:#1a1a2e;font-size:13px;font-weight:500;">
            ${params.candidateDesignation} at ${params.candidateCompany}
          </span>
        </div>
      </div>
    </div>
    
    <!-- Intro email body -->
    <div style="background:#faf8ff;border-left:3px solid #7c3aed;border-radius:0 8px 8px 0;padding:20px 24px;margin-bottom:32px;">
      <p style="color:#555;font-size:15px;line-height:1.8;margin:0;white-space:pre-line;">
        ${params.introEmailBody}
      </p>
    </div>
    
    <!-- CTA Button -->
    <div style="text-align:center;margin-bottom:32px;">
      <a href="${params.magicLink}"
         style="display:inline-block;background:#7c3aed;color:#ffffff;text-decoration:none;
               padding:16px 40px;border-radius:50px;font-size:16px;font-weight:500;
               letter-spacing:0.5px;">
        View Full Profile & Respond
      </a>
      <p style="color:#aaa;font-size:12px;margin:16px 0 0;">
        This link expires in 7 days
      </p>
    </div>
    
    <!-- Footer note -->
    <div style="border-top:1px solid #eee;padding-top:24px;text-align:center;">
      <p style="color:#aaa;font-size:12px;line-height:1.6;margin:0;">
        You are receiving this email because you are a client of The Date Crew.<br>
        If you have any questions, please contact your matchmaker directly.
      </p>
    </div>
    
  </div>
  
  <!-- Footer -->
  <div style="background:#1a1a2e;padding:24px;text-align:center;margin-top:40px;">
    <p style="color:#666;font-size:12px;margin:0;">
      © 2025 The Date Crew · Crafting meaningful connections
    </p>
  </div>

</body>
</html>
  `.trim();
}
