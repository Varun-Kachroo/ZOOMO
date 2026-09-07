import {
    Controller,
    Post,
    Query,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('upload')
@UseGuards(JwtAuthGuard)
@Roles('MERCHANT')
export class UploadController {
    constructor(private readonly uploadService: UploadService) { }

    // POST /upload/image?folder=restaurants   (or ?folder=dishes)
    @Post('image')
    @UseInterceptors(
        FileInterceptor('file', {
            limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
        }),
    )
    async uploadImage(
        @UploadedFile() file: Express.Multer.File,
        @Query('folder') folder: 'restaurants' | 'dishes' = 'restaurants',
    ) {
        const url = await this.uploadService.uploadImage(file, folder);
        return { url };
    }
}