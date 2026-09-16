export const passwordResetTemplate = (code: string): string => `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Restablecimiento de contraseña</title>
</head>

<body style="
  margin: 0;
  padding: 0;
  background-color: #f4f6f8;
  font-family: Arial, Helvetica, sans-serif;
  color: #1f2937;
">

  <table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="background-color: #f4f6f8; padding: 40px 20px;"
  >
    <tr>
      <td align="center">

        <table
          width="100%"
          cellpadding="0"
          cellspacing="0"
          border="0"
          style="
            max-width: 520px;
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
          "
        >

          <tr>
            <td
              align="center"
              style="
                background-color: #4f46e5;
                padding: 32px 24px;
              "
            >
              <h1 style="
                margin: 0;
                color: #ffffff;
                font-size: 26px;
              ">
                Restablecer contraseña
              </h1>

              <p style="
                margin: 10px 0 0;
                color: #e0e7ff;
                font-size: 14px;
              ">
                Solicitud de cambio de contraseña
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding: 36px 32px;">

              <h2 style="
                margin: 0 0 16px;
                color: #111827;
                font-size: 22px;
              ">
                ¡Hola!
              </h2>

              <p style="
                margin: 0 0 16px;
                color: #4b5563;
                font-size: 15px;
                line-height: 1.6;
              ">
                Recibimos una solicitud para restablecer la contraseña
                de tu cuenta. Utiliza el siguiente código para continuar
                con el proceso:
              </p>

              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="margin: 28px 0;"
              >
                <tr>
                  <td align="center">

                    <div style="
                      display: inline-block;
                      background-color: #f3f4ff;
                      border: 2px dashed #4f46e5;
                      border-radius: 12px;
                      padding: 18px 32px;
                    ">
                      <span style="
                        color: #4f46e5;
                        font-size: 32px;
                        font-weight: 700;
                        letter-spacing: 8px;
                      ">
                        ${code}
                      </span>
                    </div>

                  </td>
                </tr>
              </table>

              <p style="
                margin: 0 0 12px;
                color: #4b5563;
                font-size: 14px;
                text-align: center;
              ">
                Este código es válido durante
                <strong>10 minutos</strong>.
              </p>

              <p style="
                margin: 24px 0 0;
                color: #6b7280;
                font-size: 13px;
                line-height: 1.6;
              ">
                Si tú no solicitaste restablecer tu contraseña,
                puedes ignorar este correo.
              </p>

            </td>
          </tr>

          <tr>
            <td
              align="center"
              style="
                background-color: #f9fafb;
                border-top: 1px solid #e5e7eb;
                padding: 22px 24px;
              "
            >
              <p style="
                margin: 0;
                color: #9ca3af;
                font-size: 12px;
              ">
                Este es un correo automático. Por favor, no respondas
                a este mensaje.
              </p>

              <p style="
                margin: 8px 0 0;
                color: #9ca3af;
                font-size: 12px;
              ">
                © ${new Date().getFullYear()} Watches
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
