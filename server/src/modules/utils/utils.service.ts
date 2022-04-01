import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilsService {
  convertJwtExpirationTimeToSeconds(expirationTime: string): number {
    const timeUnit: string = expirationTime.charAt(expirationTime.length - 1);
    switch (timeUnit) {
      case 's': // seconds
        return Number(expirationTime.substring(0, expirationTime.length - 1));
      case 'h': // hours
        return Number(expirationTime.substring(0, expirationTime.length - 1)) * 60 * 60;
      case 'd': // days
        return Number(expirationTime.substring(0, expirationTime.length - 1)) * 24 * 60 * 60;
      default:
        // milliseconds
        return Number(expirationTime) / 1000;
    }
  }
}
