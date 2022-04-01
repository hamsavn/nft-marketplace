import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '@modules/users/users.module';
import { AuthModule } from '@modules/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UtilsModule } from '@modules/utils/utils.module';
import { MetadataModule } from '@modules/metadata/metadata.module';
import configuration from '@config/configuration';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { PubSubModule } from '@modules/pub-sub/pub-sub.module';
import { EthersEventModule } from '@modules/ethers-event/ethers-event.module';
import { UploadModule } from '@modules/upload/upload.module';
import { NftModule } from '@modules/nft/nft.module';
import { TradingHistoryModule } from '@modules/trading-history/trading-history.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      cache: true,
      isGlobal: true,
      load: [configuration],
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const isProduction = configService.get<boolean>('isProduction');
        const isDevGraphql = isProduction ? !!configService.get<string>('DEV_GRAPHQL') : true;
        return {
          autoSchemaFile: true,
          playground: isDevGraphql,
          introspection: isDevGraphql,
          context: ({ req, res }) => {
            return { req, res };
          },
          subscriptions: {
            'graphql-ws': true,
          },
        };
      },
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return configService.get<TypeOrmModuleOptions>('typeOrmConfig');
      },
    }),
    PubSubModule,
    UsersModule,
    AuthModule,
    UtilsModule,
    MetadataModule,
    EthersEventModule,
    UploadModule,
    NftModule,
    TradingHistoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
