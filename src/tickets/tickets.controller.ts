import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Req,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto, UpdateTicketDto } from './dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { UpdateTicketParams } from './interfaces';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('images', 5, {
      storage: memoryStorage(),
      limits: {
        files: 5,
      },
      fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image')) {
          cb(null, true);
        } else {
          cb(null, false);
        }
      },
    }),
  )
  create(
    @Body() createTicketDto: CreateTicketDto,
    @UploadedFiles() images: Express.Multer.File[],
    @Req() req: Request,
  ) {
    return this.ticketsService.create(
      createTicketDto,
      images,
      (req as any).user.id,
    );
  }

  @Get()
  findAll() {
    return this.ticketsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ticketsService.findOne(id);
  }

  @Get('search/:term')
  findByTerm(@Param('term') term: string) {
    return this.ticketsService.findByTerm(term);
  }

  @Patch(':id')
  @UseInterceptors(
    FilesInterceptor('newImages', 5, {
      storage: memoryStorage(),
      limits: {
        files: 5,
      },
      fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image')) {
          cb(null, true);
        } else {
          cb(null, false);
        }
      },
    }),
  )
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTicketDto: UpdateTicketDto,
    @Req() req: Request,
    @UploadedFiles() newImages: Express.Multer.File[]
  ) {

    const updateParams: UpdateTicketParams = {
      id,
      updateTicketDto,
      newImages,
      updatedBy: (req as any).user.id
    }


    return this.ticketsService.update(
      updateParams
    );
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    return this.ticketsService.remove(id, (req as any).user.id);
  }

  @Post('resolve/:id')
  resolve(@Param('id', ParseIntPipe) id: number) {
    return this.ticketsService.resolve(id);
  }

  @Post('close/:id')
  close(@Param('id', ParseIntPipe) id: number) {
    return this.ticketsService.close(id);
  }
}
