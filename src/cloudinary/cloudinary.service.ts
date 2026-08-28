import { Injectable } from '@nestjs/common';
import { handleError } from 'src/common';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CloudinaryService {
  constructor(configService: ConfigService) {
    cloudinary.config({
      cloud_name: configService.get('CLOUDINARY_CLOUD_NAME'),
      api_key: configService.get('CLOUDINARY_API_KEY'),
      api_secret: configService.get('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadImages(files: Express.Multer.File[], folder: string) {
    try {
      const result = await Promise.all(
        files.map((file) =>
          cloudinary.uploader.upload(
            `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
            {
              folder: folder,
              resource_type: 'image',
            },
          ),
        ),
      );

      return result.map((image) => ({
        publicId: image.public_id,
        secureUrl: image.secure_url,
      }));
    } catch (error) {
      console.log(error);
      handleError(error);
    }
  }
}
