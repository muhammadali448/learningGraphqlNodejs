import "reflect-metadata";
import {
  Resolver,
  Query,
  Mutation,
  Arg,
  Ctx,
  FieldResolver,
  Root,
  Int,
  InputType,
  Field,
} from "type-graphql";
import { IsEmail } from "class-validator";
import { Post } from "./Post";
import { User } from "./User";
import { Context } from "./context";

@InputType()
class SignupUserInput {
  @Field({ nullable: true })
  name: string;

  @Field()
  @IsEmail()
  email: string;
}

@Resolver(User)
export class UserResolver {
  @FieldResolver()
  async posts(@Root() user: User, @Ctx() ctx: Context): Promise<Post[]> {
    return ctx.prisma.user
      .findOne({
        where: {
          id: user.id,
        },
      })
      .post();
  }

  @Mutation((returns) => User)
  async signupUser(
    @Arg("data") data: SignupUserInput,
    @Ctx() ctx: Context
  ): Promise<User> {
    return ctx.prisma.user.create({
      data,
    });
  }

  @Query((returns) => User, { nullable: true })
  async user(@Arg("id", (type) => Int) id: number, @Ctx() ctx: Context) {
    return ctx.prisma.user.findOne({
      where: { id: id },
    });
  }
}
