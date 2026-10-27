import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express'

export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost): void{
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = 
        exception.getStatus ? 
        exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
        const rawResponse = exception.getResponse ? exception.getResponse() : null;
        const message = 
        rawResponse && typeof rawResponse === 'object' && 'message' in rawResponse
        ? (rawResponse as any).message
        : exception.message || null;

        response
        .status(status)
        .json({
            success: false,
            statusCode: status,
            message,
            path: request.url,
            timestamp: new Date().toISOString(),
        });
    }
}