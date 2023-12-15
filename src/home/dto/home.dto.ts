/* eslint-disable prettier/prettier */
import { PropertyType } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

export class HomeResponseDto {
  id: number;
  address: string;

  @Exclude()
  number_of_bedrooms: number;

  @Expose({ name: 'numberOfBedrooms' })
  numberOfBedrooms() {
    return this.number_of_bedrooms;
  }

  @Exclude()
  number_of_bathrooms: number;

  @Expose({ name: 'numberOfBathrooms' })
  numberOfBathrooms() {
    return this.number_of_bathrooms;
  }
  city: string;

  @Exclude()
  listed_data: Date;

  price: number;
  image: string;

  @Exclude()
  land_size: number;

  @Expose({ name: 'landSize' })
  landSize() {
    return this.landSize;
  }

  propertyType: PropertyType;

  @Exclude()
  created: Date;
  @Exclude()
  updated_at: Date;
  @Exclude()
  realtor_id: number;

  constructor(partial: Partial<HomeResponseDto>) {
    Object.assign(this, partial);
  }
}
