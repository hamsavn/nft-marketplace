import { Module } from '@nestjs/common';
import { MetadaResolver } from './metada.resolver';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from '@modules/users/users.module';
import { NftModule } from '@modules/nft/nft.module';
import { UploadModule } from '@modules/upload/upload.module';
import { MetadataService } from './metadata.service';
import { Metadata } from './entities/metadata.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [
    TypeOrmModule.forFeature([Metadata]),
    ConfigModule,
    UsersModule,
    NftModule,
    UploadModule,
  ],
  providers: [MetadaResolver, MetadataService],
  exports: [MetadataService],
})
export class MetadataModule {}
