import { Field, ObjectType } from '@nestjs/graphql';
import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
export class CoreData {
  @PrimaryGeneratedColumn()
  @Field(type => Number)
  id: number;

  @CreateDateColumn()
  @Field(type => String)
  createdDate: Date;

  @UpdateDateColumn()
  @Field(type => String)
  updatedDate: Date;
}
