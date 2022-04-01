import { Resolver, Query, Args, Subscription, Mutation } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { PUB_SUB } from '@modules/pub-sub/pub-sub.module';
import { Inject, UseGuards } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { UpdateUserInput } from './dto/update-user.input';
import { GqlAuthGuard, GqlAuthGuardOptional } from '@modules/auth/gql-auth.guard';
import { CurrentUser } from '@modules/utils/current-user';
import { AuthService } from '@modules/auth/auth.service';
import { UploadService } from '@modules/upload/upload.service';
@Resolver(() => User)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly uploadService: UploadService,
    @Inject(PUB_SUB) private pubSub: PubSub,
  ) {}

  @Query(() => User, { name: 'user', nullable: true })
  async findOne(@Args('address', { type: () => String }) address: string) {
    const data = await this.usersService.findOne(address);
    return data;
  }

  @UseGuards(GqlAuthGuardOptional)
  @Query(() => Boolean)
  async checkLogin(@CurrentUser() user: User) {
    return !!user;
  }

  @Query(() => [User])
  async topSellers() {
    return this.usersService.getTopSellers();
  }

  updateProfile() {
    this.pubSub.publish('profileUpdated', { profileUpdated: { address: '' } });
  }

  @Subscription(() => User)
  profileUpdated() {
    return this.pubSub.asyncIterator('profileUpdated');
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => User)
  async updateUser(@CurrentUser() user: User, @Args('input') input: UpdateUserInput) {
    let profileImage: string;
    if (input.profileImage) {
      profileImage = await this.uploadService.uploadFile(input.profileImage);
    }
    await this.usersService.update(user.address, input, profileImage);
    return this.usersService.findOne(user.address);
  }

  @Mutation(() => Boolean)
  async createUser(@Args('address') address: string) {
    const nonce = AuthService.createNonce();
    await this.usersService.create({
      address,
      nonce,
    });
  }
}
