import { HttpException, InternalServerErrorException } from "@nestjs/common";


export function handleError(error: any): never {
    if (error instanceof HttpException) {
      throw error;
    }

    throw new InternalServerErrorException();
  }