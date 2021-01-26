import { Field } from "@nestjs/graphql";
import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export class CoreData {

    @PrimaryGeneratedColumn()
    @Field(type => Number)
    id:number;

    @CreateDateColumn()
    @Field(type => String)
    createdDate:Date;

    @UpdateDateColumn()
    @Field(type => String)
    updatedDate:Date;
}