import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { UserType } from '@prisma/client';
import * as jwt from 'jsonwebtoken';
import { SignInParams, SignUpParams } from 'src/types/baseTypes';

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}

  async signUp(
    { name, phone, email, password }: SignUpParams,
    userType: UserType,
  ) {
    const userExists = await this.prismaService.user.findUnique({
      where: {
        email: email,
      },
    });

    if (userExists) {
      throw new ConflictException({
        message: 'User with this email already exist',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prismaService.user.create({
      data: {
        name,
        phone,
        email,
        password: hashedPassword,
        user_type: userType,
      },
    });

    return this.generateJWT(name, user.id);
  }

  async signIn({ email, password }: SignInParams) {
    const userExists = await this.prismaService.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!userExists) {
      throw new HttpException(
        {
          message: 'Invalid email or password provided',
        },
        400,
      );
    }

    const hashedPassword = userExists.password;
    const isValidPassword = await bcrypt.compare(password, hashedPassword);

    if (!isValidPassword) {
      throw new HttpException(
        {
          message: 'Invalid email or password provided',
        },
        400,
      );
    }

    return this.generateJWT(userExists.name, userExists.id);
  }

  private async generateJWT(name: string, id: number) {
    return jwt.sign(
      {
        name,
        id,
      },
      process.env.JWT_SECRETE,
      {
        expiresIn: '1h',
      },
    );
  }

  generateProductKey(email: string, userType: UserType) {
    //generate a key using this combination
    const hashedString = `${email}-${userType}-${process.env.PRODUCT_KEY_SECRETE}`;

    return bcrypt.hash(hashedString, 10);
  }
}
