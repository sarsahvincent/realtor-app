/* eslint-disable prettier/prettier */
import { PropertyType, UserType } from '@prisma/client';

export interface SignInParams {
  email: string;
  password: string;
}

export interface GenerateProductKeyParams {
  email: string;
  userType: UserType;
}

export interface SignUpParams {
  name: string;
  email: string;
  password: string;
  phone: string;
}

export interface GetHomesParam {
  city?: string;
  price?: {
    gte?: number;
    lte?: number;
  };
  propertyType: PropertyType;
}
