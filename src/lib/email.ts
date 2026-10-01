import nodemailer from 'nodemailer';

interface SendEmailParams {
  to: string;
  name?: string;
  code: string;
  type: 'register' | 'reset';
}

const GMAIL_SENDER = process.env.GMAIL_USER || 'no-reply.cvbagus@gmail.com';
const GMAIL_PASSWORD = process.env.GMAIL_APP_PASSWORD;

/**
 * Send OTP Verification or Password Reset email using Gmail SMTP (no-reply.cvbagus@gmail.com)
 */
export async function sendVerificationEmail({ to, name, code, type }: SendEmailParams) {
  const isReset = type === 'reset';
  const subject = isReset
    ? `[cvbagus.id] Kode Reset Kata Sandi Anda: ${code}`
    : `[cvbagus.id] Kode Verifikasi Pendaftaran: ${code}`;

  const greeting = name ? `Halo, <b>${name}</b>!` : 'Halo!';
  const title = isReset ? 'Reset Kata Sandi Akun' : 'Verifikasi Akun Baru';
  const description = isReset
    ? 'Kami menerima permintaan untuk mereset kata sandi akun Anda di <b>cvbagus.id</b>. Gunakan kode 6 digit berikut untuk membuat kata sandi baru:'
    : 'Terima kasih telah mendaftar di <b>cvbagus.id</b>. Gunakan kode 6 digit di bawah ini untuk memverifikasi alamat email Anda dan mulai membuat CV profesional:';

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 40px 10px;">
        <tr>
          <td align="center">
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 540px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
              
              <!-- HEADER -->
              <tr>
                <td style="background: linear-gradient(135deg, #059669 0%, #0d9488 100%); padding: 32px 24px; text-align: center;">
                  <div style="display: inline-block; background-color: rgba(255,255,255,0.2); width: 48px; height: 48px; line-height: 48px; border-radius: 14px; color: #ffffff; font-size: 22px; font-weight: 800; margin-bottom: 12px;">
                    CB
                  </div>
                  <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">
                    cvbagus<span style="color: #a7f3d0;">.id</span>
                  </h1>
                  <p style="margin: 6px 0 0 0; color: #d1fae5; font-size: 13px;">
                    Platform Pembuat CV Standar ATS & Profesional
                  </p>
                </td>
              </tr>

              <!-- BODY -->
              <tr>
                <td style="padding: 32px 28px;">
                  <h2 style="margin: 0 0 16px 0; color: #0f172a; font-size: 18px; font-weight: 700;">
                    ${title}
                  </h2>
                  <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 1.6; color: #475569;">
                    ${greeting}
                  </p>
                  <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.6; color: #475569;">
                    ${description}
                  </p>

                  <!-- OTP BADGE -->
                  <div style="background-color: #f0fdf4; border: 2px dashed #86efac; border-radius: 16px; padding: 24px; text-align: center; margin-bottom: 24px;">
                    <div style="font-size: 12px; font-weight: 600; color: #166534; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">
                      Kode Verifikasi Anda
                    </div>
                    <div style="font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #065f46;">
                      ${code}
                    </div>
                  </div>

                  <p style="margin: 0 0 8px 0; font-size: 12px; color: #64748b; line-height: 1.5;">
                    ⚠️ <b>Penting:</b> Kode ini berlaku selama 15 menit. Jangan berikan kode ini kepada siapa pun demi keamanan akun Anda.
                  </p>
                  <p style="margin: 0; font-size: 12px; color: #64748b; line-height: 1.5;">
                    Jika Anda tidak merasa melakukan pendaftaran atau permintaan reset di cvbagus.id, silakan abaikan email ini.
                  </p>
                </td>
              </tr>

              <!-- FOOTER -->
              <tr>
                <td style="background-color: #f1f5f9; padding: 20px 24px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 11px; color: #64748b; line-height: 1.5;">
                  <p style="margin: 0 0 4px 0;">
                    Dikirim secara otomatis dari <b>${GMAIL_SENDER}</b>
                  </p>
                  <p style="margin: 0;">
                    © 2026 cvbagus.id — Solusi Pembuatan CV Profesional & Ramah ATS.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  // Fallback: If App Password is not yet configured, log for local dev & return gracefully
  if (!GMAIL_PASSWORD) {
    console.warn(
      `\n[EMAIL NOTICE] GMAIL_APP_PASSWORD belum dikonfigurasi di environment variable.` +
        `\nEmail untuk: ${to}` +
        `\nTipe: ${type}` +
        `\nKode OTP: ${code}` +
        `\nPengirim: ${GMAIL_SENDER}\n`
    );
    return {
      success: true,
      simulated: true,
      message: 'Email disimulasikan karena GMAIL_APP_PASSWORD belum diisi.',
    };
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: GMAIL_SENDER,
        pass: GMAIL_PASSWORD.replace(/\s+/g, ''), // remove spaces if copied with spaces
      },
    });

    const info = await transporter.sendMail({
      from: `"cvbagus.id" <${GMAIL_SENDER}>`,
      to,
      subject,
      html: htmlContent,
    });

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error: any) {
    console.error('Gagal mengirim email via Gmail SMTP:', error);
    return {
      success: false,
      error: error?.message || 'Gagal mengirim email.',
    };
  }
}
