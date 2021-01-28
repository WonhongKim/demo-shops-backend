import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreData } from 'src/core/entities/core.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { IsString } from 'class-validator';
import { Shops } from './shops.entity';

@InputType('mallTypeEntity', { isAbstract: true })
@ObjectType()
@Entity()
export class MallType extends CoreData {
  @Column()
  @Field(() => String)
  @IsString()
  name: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  @IsString()
  coverImage: string;

  @Field(() => [Shops])
  @OneToMany(
    () => Shops,
    shops => shops.owner,
  )
  shops: Shops[];
}
