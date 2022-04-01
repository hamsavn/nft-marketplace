import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MetadataMap } from './dto/create-metadata-map.input';
import { Metadata } from './entities/metadata.entity';

@Injectable()
export class MetadataService {
  constructor(
    @InjectRepository(Metadata)
    private metadataRepository: Repository<Metadata>,
  ) {}
  create(input: MetadataMap) {
    return this.metadataRepository.insert(input);
  }

  findOne(pinataUrl: string) {
    return this.metadataRepository.findOne({ pinataUrl });
  }
}
