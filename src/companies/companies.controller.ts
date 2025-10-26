import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from 'src/files/files.service';
import { UnprocessableEntityException } from '@nestjs/common';
import { MulterConfigService } from 'src/files/multer.config';

@Controller('companies')
export class CompaniesController {
  constructor(
    private readonly companiesService: CompaniesService,
    private readonly filesService: FilesService
  ) {}

  @Post()
  create(@Body() createCompanyDto: CreateCompanyDto, @User() user: IUser) {
    return this.companiesService.create(createCompanyDto, user);
  }

  @Get()
  // @Public()
  @ResponseMessage('Lấy danh sách công ty thành công')
  findAll(@Query("current") currentPage: string,
  @Query("pageSize") limit: string,
  @Query() qs: string) {
    return this.companiesService.findAll(+currentPage, +limit, qs);
  }

  @Get(':id')
  // @Public()
  findOne(@Param('id') id: string,) {
    return this.companiesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, 
  @Body() updateCompanyDto: UpdateCompanyDto,
  @User() user: IUser) {
    return this.companiesService.update(id, updateCompanyDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.companiesService.remove(id, user);
  }

  @Post(':id/upload-logo')
  @ResponseMessage('Upload logo thành công')
  @UseInterceptors(FileInterceptor('fileUpload'))
  async uploadLogo(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @User() user: IUser
  ) {
    // Validate file
    if (!file) {
      throw new UnprocessableEntityException('No file uploaded');
    }

    if (!/^image\/(jpe?g|png|gif)$/i.test(file.mimetype)) {
      throw new UnprocessableEntityException('Invalid file type. Only jpeg, jpg, png, gif allowed');
    }

    if (file.size > 1024 * 1024) {
      throw new UnprocessableEntityException('File too large. Maximum size is 1MB');
    }

    // Upload file và lấy đường dẫn
    const uploadResult = this.filesService.uploadCompanyLogo(file);
    
    // Cập nhật logo trong company
    const updatedCompany = await this.companiesService.updateLogo(id, uploadResult.path, user);

    return {
      message: 'Logo uploaded and updated successfully',
      company: updatedCompany,
      file: uploadResult
    };
  }
}
