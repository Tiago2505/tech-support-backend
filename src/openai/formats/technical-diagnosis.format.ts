export const technicalDiagnosisFormat = {
  type: 'json_schema' as const,
  name: 'diagnostic-response',
  strict: true,

  schema: {
    type: 'object',

    properties: {
      possibleCauses: {
        type: 'array',
        items: {
          type: 'string',
        },
      },

      diagnosticSteps: {
        type: 'array',
        items: {
          type: 'string',
        },
      },

      recommendedSolutions: {
        type: 'array',
        items: {
          type: 'string',
        },
      },

      difficulty: {
        type: 'string',
        enum: ['LOW', 'MEDIUM', 'HIGH'],
      },
    },

    required: [
      'possibleCauses',
      'diagnosticSteps',
      'recommendedSolutions',
      'difficulty',
    ],

    additionalProperties: false,
  },
};
