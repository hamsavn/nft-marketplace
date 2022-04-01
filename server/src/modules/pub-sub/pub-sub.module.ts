import { ConfigService } from '@nestjs/config';
import { PostgresPubSub } from 'graphql-postgres-subscriptions';
import { Global, Module } from '@nestjs/common';
import { Client } from 'pg';
import { PostgresConnectionCredentialsOptions } from 'typeorm/driver/postgres/PostgresConnectionCredentialsOptions';

export const PUB_SUB = 'PUB_SUB';

@Global()
@Module({
  providers: [
    {
      provide: PUB_SUB,
      useFactory: async (configService: ConfigService) => {
        const typeOrmConfig =
          configService.get<PostgresConnectionCredentialsOptions>('typeOrmConfig');
        const client = new Client({
          database: typeOrmConfig.database,
          user: typeOrmConfig.username,
          password: typeOrmConfig.password,
          port: typeOrmConfig.port,
          host: typeOrmConfig.host,
        });

        await client.connect();
        const pubsub = new PostgresPubSub({ client });
        return pubsub;
      },
      inject: [ConfigService],
    },
  ],
  exports: [PUB_SUB],
})
export class PubSubModule {}
