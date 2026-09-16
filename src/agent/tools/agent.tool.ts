export const tools = [
  {
    type: 'function' as const,
    name: 'createTicket',
    description:
      'Crea un ticket de soporte técnico cuando el usuario desea reportar un problema.',
    strict: true,

    parameters: {
      type: 'object',

      properties: {
        title: {
          type: 'string',
          description:
            'Título corto y descriptivo del problema. Es obligatorio.',
        },

        description: {
          type: 'string',
          description: 'Descripción detallada del problema. Es obligatorio.',
        },

        deviceType: {
          type: ['string', 'null'],
          enum: [
            'LAPTOP',
            'DESKTOP',
            'PRINTER',
            'MONITOR',
            'PHONE',
            'TABLET',
            'SERVER',
            'NETWORK_DEVICE',
            'OTHER',
          ],
          description:
            'Tipo de dispositivo. Debe usar exactamente uno de los valores permitidos. Si no se conoce, usar null.',
        },

        deviceBrand: {
          type: ['string', 'null'],
          description:
            'Marca del dispositivo. Si el usuario no la conoce, usar null.',
        },

        deviceModel: {
          type: ['string', 'null'],
          description:
            'Modelo del dispositivo. Si el usuario no lo conoce, usar null.',
        },

        operatingSystem: {
          type: ['string', 'null'],
          enum: [
            'WINDOWS',
            'MACOS',
            'LINUX',
            'ANDROID',
            'IOS',
            'CHROME_OS',
            'OTHER',
          ],
          description:
            'Sistema operativo. Debe usar exactamente uno de los valores permitidos. Si no se conoce, usar null.',
        },
      },

      required: [
        'title',
        'description',
        'deviceType',
        'deviceBrand',
        'deviceModel',
        'operatingSystem',
      ],

      additionalProperties: false,
    },
  },

  {
    type: 'function' as const,
    name: 'getTicket',
    description:
      'Obtiene un ticket de soporte técnico específico cuando el usuario solicita consultar los detalles de un ticket.',
    strict: true,
    parameters: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          description: 'ID del ticket que el usuario desea consultar.',
        },
      },
      required: ['id'],
      additionalProperties: false,
    },
  },
];
