import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';

import dbConfig from './db/config';
import { AuthModule } from './features/auth/auth.module';

@Module({
  imports: [MongooseModule.forRoot(dbConfig.db_connection_string), AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
