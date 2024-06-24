import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_APY_KEY);

const sendEmail = async (from: string, to: string, subject: string, html: string) => {
  try {
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
    });

    if (error) {
      return error;
    }

    return data;
  } catch (error: any) {
    console.error(error.message);
    throw new Error(error.message);
  }
};

export default sendEmail;
