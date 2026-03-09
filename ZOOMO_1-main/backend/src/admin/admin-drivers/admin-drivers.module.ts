import { Module } from "@nestjs/common";
import { AdminDriversController } from "./admin-drivers.controller";
import { AdminDriversService } from "./admin-drivers.service";
import { PrismaModule } from "../../common/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [AdminDriversController],
  providers: [AdminDriversService],
})
export class AdminDriversModule {}
