import { Global, Module } from '@nestjs/common';
import { BustabitGateway } from "./bustabit.gateway";
import { HandleDataBustabit } from "./handle-data-bustabit";

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [BustabitGateway, HandleDataBustabit],
  exports: [BustabitGateway],
})
export class BustabitModule {}
