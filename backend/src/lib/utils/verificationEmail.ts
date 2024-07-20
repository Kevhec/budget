import sendEmail from '../resend';

const frontendUrl = process.env.NODE_ENV === 'production'
  ? process.env.FRONTEND_URL_PRODUCTION
  : process.env.FRONTEND_URL_DEVELOPMENT;

const verificationEmail = async (to: string, token: string) => {
  try {
    const template = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Verification</title>
          <style>
            body {
              font-family: arial, 'helvetica neue', helvetica, sans-serif;
              background-color: #f0f0f0;
              margin: 0;
              padding: 0;
            }

            .container {
              max-width: 600px;
              margin: 20px auto;
              padding: 20px;
              background-color: #ffffff;
              border-radius: 5px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }

            h1 {
              font-weight: 700;
              font-size: 2rem;
              color: #333333;
              margin-bottom: 20px;
            }

            p {
              color: #666666;
              line-height: 1.6;
            }

            p:not(last-child) {
              margin-bottom: 1rem;
            }

            .button {
              display: block;
              width: fit-content;
              background-color: #007bff;
              color: #ffffff;
              text-decoration: none;
              padding: 10px 20px;
              margin-top: 20px;
              margin-inline: auto;
              border-radius: 5px;
            }

            .button:hover {
              background-color: #0056b3;
            }

            .small-text {
              font-size: .85rem;
              text-align: center;
            }

            .bold {
              font-size: 700;
            }
          </style>
        </head>

        <body>
          <div class="container">
            <h1>¡Hola!</h1>
            <p>Por favor verifica tu dirección de email para completar el proceso de registro en la aplicación <span class="bold">Budget</span>. ¡Sólo haz click en el siguiente enlace!</p>
            <a class="button" href="${frontendUrl}/verify?token=${token}" target="_blank">Verificar Email</a>
            <p class="small-text">Si no te registraste en este servicio, puede ignorar este email.</p>
            <p>¡Saludos!</p>
          </div>
        </body>
      </html>
    `;

    const response = await sendEmail('Budget <budget@kevhec.dev>', to, 'Verificación de cuenta', template);

    console.log(response);

    return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
      throw new Error(error.message);
    }

    return 0;
  }
};

export default verificationEmail;
