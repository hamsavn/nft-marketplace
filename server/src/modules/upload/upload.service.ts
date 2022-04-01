import axios from 'axios';
import { Injectable } from '@nestjs/common';
import FormData = require('form-data');
import { createReadStream, unlink, createWriteStream } from 'fs';
import path = require('path');
import { FileUpload } from 'graphql-upload';
import { v4 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { CreateMetadataInput } from '@modules/metadata/dto/create-metadata.input';
import sizeOf from 'image-size';
import { promisify } from 'util';

const sizeOfAsync = promisify(sizeOf);

export interface PinataResponse {
  IpfsHash: string;
  PinSize: number;
  Timestamp: number;
}

export interface Metadata {
  name: string;
  keyvalues: {
    name: string;
    description: string;
    image: string;
  };
}

@Injectable()
export class UploadService {
  private urlPinFile = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
  private urlPinJson = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
  private urlUnpinFile = `https://api.pinata.cloud/pinning/unpin`;
  private urlStorage = `https://gateway.pinata.cloud/ipfs/`;
  private absolutePath = path.resolve(`./uploads`);
  private secretkey = '';
  private apiKey = '';

  constructor(private configService: ConfigService) {
    this.secretkey = this.configService.get('PINATA_API_SECRET');
    this.apiKey = this.configService.get('PINATA_API_KEY');
  }

  async uploadFile(file: FileUpload): Promise<string> {
    const createReadStream = await file;
    const fileName = `${v4()}-${createReadStream.filename}`;

    return new Promise(async (resolve, reject) => {
      createReadStream
        .createReadStream()
        .pipe(createWriteStream(`${this.absolutePath}/${fileName}`))
        .on('finish', async () => {
          resolve(fileName);
        })
        .on('error', (error) => {
          reject(error.message);
        });
    });
  }

  async getImageSize(fileName: string) {
    return await sizeOfAsync(`${this.absolutePath}/${fileName}`);
  }

  async pinToPinata(filename: string, input: Omit<CreateMetadataInput, 'media'>) {
    const resultImageUpload = await this.pinFileToPinata(`${this.absolutePath}/${filename}`);

    const mediaFileHash = (resultImageUpload.data as PinataResponse).IpfsHash;
    const mediaUrl = `${this.urlStorage}${mediaFileHash}`;

    const metadata = {
      name: input.title,
      keyvalues: {
        name: input.title,
        description: input.description,
        image: mediaUrl,
      },
    };

    const resultMetadataUpload = await axios.post(this.urlPinJson, metadata, {
      headers: {
        pinata_api_key: this.apiKey,
        pinata_secret_api_key: this.secretkey,
      },
    });

    return {
      hash: (resultMetadataUpload.data as PinataResponse).IpfsHash,
      url: mediaUrl,
    };
  }

  async modifyInPinata(
    ipfsHash: string,
    isUpdateImage: boolean,
    title: string,
    description: string,
    filename?: string,
  ) {
    try {
      let bodyData: any;
      let newFileURL: string;
      //   const { fileURL, status, id } = await this.nftService.findOne(
      //     `${this.urlStorage}${ipfsHash}`,
      //   );
      const fileURL = '';
      if (isUpdateImage) {
        // upload new image
        let resultImageUpload = await this.pinFileToPinata(`${this.absolutePath}/${filename}`);

        // get hash of old image from database
        const hashOfImage = fileURL.substring(34);

        // unpin old image
        await axios.delete(`${this.urlUnpinFile}/${hashOfImage}`, {
          headers: {
            pinata_api_key: this.apiKey,
            pinata_secret_api_key: this.secretkey,
          },
        });

        // new metadata content
        bodyData = {
          name: title,
          keyvalues: {
            name: title,
            description,
            image: `${this.urlStorage}${(resultImageUpload.data as PinataResponse).IpfsHash}`,
          },
        };
      } else {
        // new metadata content
        bodyData = {
          name: title,
          keyvalues: {
            name: title,
            description,
            image: fileURL,
          },
        };
      }

      let resultMetadataUpload = await axios.post(this.urlPinJson, bodyData, {
        headers: {
          pinata_api_key: this.apiKey,
          pinata_secret_api_key: this.secretkey,
        },
      });

      // unpin old metadata
      await axios.delete(`${this.urlUnpinFile}/${ipfsHash}`, {
        headers: {
          pinata_api_key: this.apiKey,
          pinata_secret_api_key: this.secretkey,
        },
      });

      return `${isUpdateImage ? newFileURL : fileURL}`;
    } catch (error) {
      return error;
    }
  }

  async pinFileToPinata(pathFolder: string) {
    let data = new FormData();
    data.append('file', createReadStream(pathFolder));
    let resultImageUpload = await axios.post(this.urlPinFile, data, {
      headers: {
        'Content-Type': `multipart/form-data; boundary=${data.getBoundary()}`,
        pinata_api_key: this.apiKey,
        pinata_secret_api_key: this.secretkey,
      },
    });

    // unlink(pathFolder, (err) => {
    //   if (err) throw err;
    // });

    return resultImageUpload;
  }

  async queryMetadata(CID: string): Promise<Metadata> {
    const endpoint = `${this.urlStorage}${CID}`;
    const { data } = await axios.get(endpoint);

    return data as Metadata;
  }

  async pinMetadata(metadata: Metadata): Promise<PinataResponse> {
    const endpoint = this.urlPinJson;
    const apiKey = this.apiKey;
    const secretkey = this.secretkey;

    const { data } = await axios.post(endpoint, metadata, {
      headers: {
        pinata_api_key: apiKey,
        pinata_secret_api_key: secretkey,
      },
    });

    return data as PinataResponse;
  }

  async pinImage(file: FileUpload) {
    const filename = await this.uploadFile(file);

    const { data } = await this.pinFileToPinata(`${this.absolutePath}/${filename}`);
    const IpfsHash = (data as PinataResponse).IpfsHash;
    const imageUrl = `${this.urlStorage}${IpfsHash}`;

    return {
      imageUrl,
      filename,
    };
  }
}
