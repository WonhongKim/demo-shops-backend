import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreData } from 'src/core/entities/core.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { IsString } from 'class-validator';
import { Shops } from './shops.entity';

@InputType('MallTypeEntity', { isAbstract: true })
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

  @Field(() => [Shops], { nullable: true })
  @OneToMany(
    () => Shops,
    shop => shop.malltype,
  )
  shops: Shops[];
}
