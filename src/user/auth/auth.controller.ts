import {
  Body,
  Controller,
  Param,
  ParseEnumPipe,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { GenerateProductKeyDto, SignInDto, SignUpDto } from '../dtos/auth.dto';
import { UserType } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup/:userType')
  async signUp(
    @Body() body: SignUpDto,
    @Param('userType', new ParseEnumPipe(UserType)) userType: UserType,
  ) {
    if (userType !== UserType.BUYER) {
      if (!body.productKey) {
        throw new UnauthorizedException({
          message: 'you are not allowed to do this',
        });
      }

      const validateProductKey = `${body.email}-${userType}-${process.env.PRODUCT_KEY_SECRETE}`;
      const isValidProductKey = await bcrypt.compare(
        validateProductKey,
        body.productKey,
      );

      if (!isValidProductKey) {
        throw new UnauthorizedException({
          message: 'you are not allowed to do this',
        });
      }
    }
    return this.authService.signUp(body, userType);
  }

  @Post('/signin')
  signIn(@Body() body: SignInDto) {
    return this.authService.signIn(body);
  }

  @Post('/key')
  generateProductKey(@Body() body: GenerateProductKeyDto) {
    const { email, userType } = body;
    return this.authService.generateProductKey(email, userType);
  }
}
