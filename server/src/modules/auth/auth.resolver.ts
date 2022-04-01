import { Args, Context, Mutation, Resolver, Query } from '@nestjs/graphql';
import { Auth } from '@modules/auth/entities/auth.entity';
import { AuthService } from '@modules/auth/auth.service';
import { CreateAuthInput } from '@modules/auth/dto/create-auth.input';
import { ConfigService } from '@nestjs/config';
import { UtilsService } from '@modules/utils/utils.service';

@Resolver()
export class AuthResolver {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
    private utilsService: UtilsService,
  ) {}

  @Mutation(() => Auth)
  async createAuth(
    @Args('createAuthInput') createAuthInput: CreateAuthInput,
    @Context() context: any,
  ): Promise<Auth> {
    const auth = await this.authService.create(createAuthInput);

    const expirationTime: string = this.configService.get<string>('JWT_EXPIRATION_TIME');
    const maxAge: number = this.utilsService.convertJwtExpirationTimeToSeconds(expirationTime);

    let cookieHeader: string;
    if (this.configService.get<boolean>('isProduction')) {
      cookieHeader = `access_token=${auth.token}; Path=/; Max-Age=${maxAge}; HttpOnly`;
    } else {
      cookieHeader = `access_token=${auth.token}; Path=/; Max-Age=${maxAge}; HttpOnly; SameSite=None; Secure`;
    }

    context.res.setHeader('set-cookie', cookieHeader);

    return auth;
  }

  @Mutation(() => Boolean)
  async logout(@Context() context: any): Promise<boolean> {
    const cookieHeader = `access_token=; Path=/; Max-Age=0; HttpOnly`;
    context.res.setHeader('set-cookie', cookieHeader);
    return true;
  }

  @Query(() => String)
  getNonce(@Args('address', { type: () => String }) address: string): Promise<string> {
    return this.authService.getAuthMessageByUser(address);
  }
}
