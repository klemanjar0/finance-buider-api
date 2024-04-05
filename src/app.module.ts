import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';

import dbConfig from './db/config';
import { AuthModule } from './features/auth/auth.module';
import { AccountModule } from './features/account/account.module';

@Module({
  imports: [
    MongooseModule.forRoot(dbConfig.db_connection_string),
    AuthModule,
    AccountModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
