import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { ConfigService } from '@nestjs/config';
import { agentPrompt } from './prompts';
import { technicalDiagnosisFormat } from './formats/technical-diagnosis.format';

@Injectable()
export class OpenaiService {
  private readonly openAi!: OpenAI;

  constructor(private readonly configService: ConfigService) {
    this.openAi = new OpenAI({
      apiKey: this.configService.get<string>('OPEN_AI_KEY'),
    });
  }

  async getTechnicalDiagnosis(problemDescription: string) {
    const response = await this.openAi.responses.create({
      model: 'gpt-5.6-luna',
      input: problemDescription,
      text: {
        format: technicalDiagnosisFormat
      }
    });

    return response.output_text;
  }
  async getAgentResponse(message: string, tools: any[], previousResponseId?: string) {
    return await this.openAi.responses.create({
      model: 'gpt-5.6-luna',
      input: message,
      instructions: agentPrompt,
      previous_response_id: previousResponseId,
      tools,
    });
  }

  async getAgentFinalResponse(
    previousResponseId: string,
    functionCallOutput: any,
  ) {
    return await this.openAi.responses.create({
      model: 'gpt-5.6-luna',
      previous_response_id: previousResponseId,
      input: [functionCallOutput],
    });
  }
}
