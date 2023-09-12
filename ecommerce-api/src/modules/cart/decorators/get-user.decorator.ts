import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

export const GetUser = createParamDecorator(
  async (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const jwtService = new JwtService({
      secret: process.env.JWT_SECRET || '', // replace with your own secret key
    });
    const token = request.headers.authorization?.split(' ')[1];
    if (!token) return null;
    try {
      const payload = jwtService.verify(token);
      console.log(payload)
      return payload;
      
    } catch (err) {
      return null;
    }
    
  },
);
