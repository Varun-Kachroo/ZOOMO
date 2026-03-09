


import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  UseGuards,
  Req
} from '@nestjs/common';
import { AddressService } from './address.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';


@Controller("addresses")
@UseGuards(JwtAuthGuard)
export class AddressController {
  constructor(private addressService: AddressService) {}

  @Get()
  async getUserAddresses(@Req() req) {
    return this.addressService.getUserAddresses(req.user.id);
  }

  @Post()
  async createAddress(@Req() req, @Body() body) {
    return this.addressService.createAddress(req.user.id, body);
  }

  @Patch(":id")
  async updateAddress(@Req() req, @Param("id") id: string, @Body() body) {
    return this.addressService.updateAddress(id, req.user.id, body);
  }

  @Delete(":id")
  async deleteAddress(@Req() req, @Param("id") id: string) {
    return this.addressService.deleteAddress(id, req.user.id);
  }
}

