import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateAccountInput } from "./dtos/create-account.dto";
import { LoginInput, LoginOutput } from "./dtos/login.dto";
import { User } from "./entities/user.entity";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class UsersService{
    constructor(
        @InjectRepository(User) private readonly users:Repository<User>,
        private readonly configservice: ConfigService,
    ){}

    
    async createAccount({email, password, name, role}: CreateAccountInput): Promise<string|undefined>{
        try{
            const checker = await this.users.findOne({email});
            if(checker){
                return "error";
            }             
            await this.users.save(this.users.create({email, password,name, role}));          

        }catch(e){
            return "error";
        }

    } 

    async login({ email, password }: LoginInput): Promise<LoginOutput> {
        try {
          const user = await this.users.findOne(
            { email },
            { select: ['id', 'password'] },
          );
          if (!user) {
            return {
              result: false,
              error: 'There is no User',
            };
          }
          const passwordCorrect = await user.checkPassword(password);
          if (!passwordCorrect) {
            return {
                result: false,
              error: 'Wrong password',
            };
          }  
         
        } catch (e) {
          return {
            result: false,
            error: "Can't log user in.",
          };
        }
      }


}


