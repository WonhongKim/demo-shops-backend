import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreData } from 'src/core/entities/core.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { IsString } from 'class-validator';
import { Shops } from './shops.entity';

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class MallType extends CoreData {
  @Field(() => String)
  @Column({ unique: true })
  @IsString()
  name: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  @IsString()
  coverImage: string;

  @Field(() => String)
  @Column({ unique: true })
  @IsString()
  slug: string;

  @Field(type => [Shops], { nullable: true })
  @OneToMany(
    type => Shops,
    shop => shop.malltype,
  )
  shops: Shops[];
}
