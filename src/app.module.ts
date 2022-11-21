import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BustabitModule } from "./bustabit/bustabit.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    BustabitModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
