import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';
import { CompaniesModule } from './companies/companies.module';
import { JobsModule } from './jobs/jobs.module';
import { FilesModule } from './files/files.module';
import { ResumesModule } from './resumes/resumes.module';




@Module({
  imports: [
    // [MongooseModule.forRoot(process.env.MONGO_URI), ConfigModule.forRoot({ isGlobal: true })],

    // MongooseModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useFactory: async (configService: ConfigService) => ({
    //     // console.log('MONGODB_URI =', configService.get<string>('MONGODB_URI')),
    //     uri: configService.get<string>('MONGODB_URI'),

    //   }),
    //   inject: [ConfigService],
    // }),


    // MongooseModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: async (configService: ConfigService) => {
    //     console.log('MONGODB_URI =', configService.get<string>('MONGODB_URI'));

    //     return {
    //       uri: configService.get<string>('MONGODB_URI'),
    //       connectionFactory: (connection) => {
    //         connection.plugin(softDeletePlugin);
    //         return connection;
    //       },
    //       retryAttempts: 1,
    //       retryDelay: 1000,

    //     };
    //   },

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        connectionFactory: (connection) => {
          connection.plugin(softDeletePlugin);
          return connection;
        },
        retryAttempts: 1,
        retryDelay: 1000,
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    AuthModule,
    CompaniesModule,
    JobsModule,
    FilesModule,
    ResumesModule,
  ],
  controllers: [AppController, UserController],
  providers: [AppService,
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard,
    // }
  ],
})
export class AppModule { }
