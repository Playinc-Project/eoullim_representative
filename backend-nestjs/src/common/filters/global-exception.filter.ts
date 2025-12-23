import { 
  ExceptionFilter, 
  Catch, 
  ArgumentsHost, 
  HttpException, 
  HttpStatus,
  Logger
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error = 'Unknown error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        message = (exceptionResponse as any).message || exception.message;
        error = (exceptionResponse as any).error || exception.name;
      }
    } else if (exception instanceof Error) {
      // 비즈니스 로직 에러 처리 (Spring Boot와 동일)
      if (exception.message.includes('이미 존재하는 이메일')) {
        status = HttpStatus.CONFLICT;
        message = exception.message;
        error = 'Duplicate Email';
      } else if (exception.message.includes('찾을 수 없습니다')) {
        status = HttpStatus.NOT_FOUND;
        message = exception.message;
        error = 'Not Found';
      } else if (exception.message.includes('권한이 없습니다') || exception.message.includes('비밀번호가 일치하지 않습니다')) {
        status = HttpStatus.UNAUTHORIZED;
        message = exception.message;
        error = 'Unauthorized';
      } else {
        message = exception.message;
        error = exception.name;
      }
    }

    // 로깅 (Spring Boot와 동일)
    this.logger.error(
      `${request.method} ${request.url} - ${status} - ${error}: ${message}`,
      exception instanceof Error ? exception.stack : undefined,
    );

    // Spring Boot와 동일한 응답 형식
    response.status(status).json({
      timestamp: new Date().toISOString(),
      status,
      error,
      message,
      path: request.url,
    });
  }
}