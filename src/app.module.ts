import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';

import dbConfig from './db/config';

@Module({
  imports: [MongooseModule.forRoot(dbConfig.db_connection_string)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
