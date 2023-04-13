import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PhotoEntity } from './interfaces/photo.entity';
import { ObjType, PhotoInput } from './interfaces/photo.input';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { createWriteStream } from 'fs';
import { join } from 'path';
import { HikeService } from '../hike/hike.service';
import { UserService } from '../user/user.service';
import { FilesService } from '../file/file.service';
import { PointOfInterestService } from '../pointOfInterest/poi.service';
import { CategoryService } from '../category/category.service';

@Injectable()
export class PhotoService {
    constructor(
        @InjectRepository(PhotoEntity) private photoRepository: Repository<PhotoEntity>,
        @Inject(HikeService) private readonly hikeService: HikeService,
        @Inject(UserService) private readonly userService: UserService,
        @Inject(CategoryService) private readonly categoryService: CategoryService,
        @Inject(PointOfInterestService) private readonly poiService: PointOfInterestService,
        @Inject(FilesService) private readonly filesService: FilesService
    ) {}

    async create(query: PhotoInput): Promise<PhotoEntity> {
        const photo = new PhotoEntity();
        if (query.objType === ObjType.USER) {
            photo.user = await this.userService.findById(query.objId);
            if (!photo.user) {
                throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            }
        } else if (query.objType === ObjType.HIKE) {
            photo.hike = await this.hikeService.findById(query.objId);
            if (!photo.hike) {
                throw new HttpException('Hike not found', HttpStatus.NOT_FOUND);
            }
        } else if (query.objType === ObjType.CATEGORY) {
            photo.category = await this.categoryService.findById(query.objId);
            if (!photo.category) {
                throw new HttpException('Tag not found', HttpStatus.NOT_FOUND);
            }
        } else if (query.objType === ObjType.POINTOFINTEREST) {
            photo.pointOfInterest = await this.poiService.findById(query.objId);
            if (!photo.pointOfInterest) {
                throw new HttpException('Point of interest not found', HttpStatus.NOT_FOUND);
            }
        }
        const { createReadStream, filename } = await query.file;
        const filetype = filename.split('.').pop();
        if (filetype !== 'png' && filetype !== 'jpg' && filetype !== 'jpeg') {
            console.log(filetype);
            throw new HttpException('Only photo files are allowed', HttpStatus.BAD_REQUEST);
        }
        const localfilename = this.filesService.worker.nextId().toString() + '.' + filetype;
        await new Promise(async (resolve) => {
            createReadStream()
                .pipe(createWriteStream(join(process.cwd(), `./data/photos/${localfilename}`)))
                .on('finish', () => resolve({}))
                .on('error', () => {
                    new HttpException('Could not save image', HttpStatus.BAD_REQUEST);
                });
        });
        photo.filename = localfilename;
        return await this.photoRepository.save(photo);
    }

    async findOne(id: string): Promise<PhotoEntity> {
        return await this.photoRepository.findOne({ where: { id } });
    }

    async remove(id: string): Promise<PhotoEntity> {
        const tag = await this.photoRepository.findOne({ where: { id } });
        await this.photoRepository.delete(id);
        return tag;
    }
}
