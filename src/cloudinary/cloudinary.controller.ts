import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFiles,
  Query,
} from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

@Controller('uploads')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('images')
  @UseInterceptors(
    FilesInterceptor('files', 5, {
      storage: memoryStorage(),
      limits: {
        files: 5
      },
      fileFilter: (req, file, cb)=>{
        if(file.mimetype.startsWith('image')){
          cb(null, true);
        }else{
          cb(null, false);
        }
      }
    }),
  )
  uploadImages(@Query('folder') folder: string = 'tickets', @UploadedFiles() files: Express.Multer.File[]) {
    return this.cloudinaryService.uploadImages(files, folder);
  }
}
