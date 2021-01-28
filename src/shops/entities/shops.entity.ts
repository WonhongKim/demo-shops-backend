import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreData } from 'src/core/entities/core.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { IsString } from 'class-validator';
import { MallType } from './mallType.entity';
import { User } from 'src/users/entities/user.entity';

@InputType('shopsEntity', { isAbstract: true })
@ObjectType()
@Entity()
export class Shops extends CoreData {
  @Column()
  @Field(() => String)
  @IsString()
  name: string;

  @Column()
  @Field(() => String)
  @IsString()
  address: string;

  @Column()
  @Field(() => String)
  @IsString()
  phoneNumber: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  @IsString()
  coverImage: string;

  @Field(() => MallType, { nullable: true })
  @ManyToOne(
    () => MallType,
    malltype => malltype.shops,
    { nullable: true, onDelete: 'SET NULL' },
  )
  malltype: MallType;

  @Field(() => User)
  @ManyToOne(
    () => User,
    user => user.shops,
    { onDelete: 'CASCADE' },
  )
  owner: User;
}
