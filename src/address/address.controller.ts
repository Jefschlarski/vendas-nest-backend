import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AddressDto } from './dto/address.dto';
import { AddressService } from './address.service';
import { Address } from './entities/address.entity';
import { Roles } from '../decorators/roles.decorator';
import { UserType } from '../user/enum/user-type.enum';
import { UserId } from '../decorators/user-id.decorator';


@Roles(UserType.User)
@Controller('address')
export class AddressController {

    constructor(
        private readonly addressService: AddressService,
    ){}

    @Post()
    @UsePipes(ValidationPipe)
    async create(@Body() addressDto: AddressDto,  @UserId() userId: number,): Promise<Address>
    {
        return this.addressService.create(addressDto, userId)
    }
}
