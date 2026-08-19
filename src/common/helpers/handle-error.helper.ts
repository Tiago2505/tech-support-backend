import { HttpException, InternalServerErrorException } from "@nestjs/common";


export function handleError(error: any) {
    if (error instanceof HttpException) {
      throw error;
    }

    throw new InternalServerErrorException();
  }