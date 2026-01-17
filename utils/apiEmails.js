import axios from "axios";

const textConfirmation = `This is a confirmation email that we receive your information.`;

export function createBodyEmail(name, email, phone, message) {
    return `
    Full Name: ${name}<br/>
    Email: ${email}<br/>
    Phone: ${phone}<br/>
    Message: ${message}<br/>
  `;
  }

export async function sendEmail(fromName, to, replyTo, subject, body, confirmationEmail = false) {
    const bodyEmail = `${body} ${confirmationEmail ? textConfirmation : ''}`;
    await axios.post(process.env.NEXT_PUBLIC_API_EMAIL, {
        fromName, 
        to, 
        replyTo, 
        subject, 
        body: bodyEmail,
        code: '', 
        token: process.env.NEXT_PUBLIC_API_EMAIL_TOKEN,
        cc: '', 
        bcc: '',
        local: true
    })
    .then(({ data }) => {
        console.log('data', data)
    })
  }