import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { CoreData } from 'src/core/entities/core.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';
import { IsEmail, IsEnum, IsString } from 'class-validator';

export enum Role {
  Admin = 'Admin',
  Owner = 'Owner',
  Staff = 'Staff',
  Customer = 'Customer',
}

registerEnumType(Role, { name: 'Role' });

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class User extends CoreData {
  @Column()
  @Field(() => String)
  @IsEmail()
  email: string;

  @Column()
  @Field(() => String)
  @IsString()
  password: string;

  @Column()
  @Field(() => String)
  @IsString()
  name: string;

  @Column({ type: 'enum', enum: Role })
  @Field(() => Role)
  @IsEnum(Role)
  role: Role;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password) {
      try {
        this.password = await bcrypt.hash(this.password, 10);
      } catch (e) {
        throw new InternalServerErrorException();
      }
    }
  }

  async checkPassword(aPassword: string): Promise<boolean> {
    try {
      const ok = await bcrypt.compare(aPassword, this.password);
      return ok;
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}
