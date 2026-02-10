import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();
/**
 * Envía un correo electrónico usando SMTP
 * @param {Object} opts - Opciones del correo
 * @returns {Promise<Object>} Resultado del envío
 */
export async function sendEmail({
    fromName,
    from = process.env.SMTP_FROM || user,
    to,
    subject,
    html,
    replyTo,
    attachments,
}) {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
        });
        const fromEmail = process.env.SMTP_FROM || from || process.env.SMTP_USER;
        const info = await transporter.sendMail({
            from: `${fromName} <${fromEmail}>`,
            to,
            subject,
            html,
            replyTo,
            attachments,
        });

        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('SMTP Error:', error.message);
        return { success: false, error: error.message };
    }
}


