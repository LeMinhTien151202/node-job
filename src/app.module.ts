import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
// @ts-ignore
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';
import { CompaniesModule } from './companies/companies.module';
import { JobsModule } from './jobs/jobs.module';
import { FilesModule } from './files/files.module';
import { ResumesModule } from './resumes/resumes.module';
import { PermissionsModule } from './permissions/permissions.module';
import { RolesModule } from './roles/roles.module';
import mongoose from 'mongoose';
import mongooseDelete from 'mongoose-delete';
@Module({
  imports: [UsersModule,
     MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
        
      }),
      inject: [ConfigService],
    }),
  ConfigModule.forRoot({
    isGlobal: true,
  }),
  AuthModule,
  CompaniesModule,
  JobsModule,
  FilesModule,
  ResumesModule,
  PermissionsModule,
  RolesModule,
],
  controllers: [AppController],
  providers: [AppService, 
  //   {
  //   // Global guard toàn controller
  //   provide: APP_GUARD,
  //   useClass: JwtAuthGuard,
  // },
],
})
export class AppModule {}
