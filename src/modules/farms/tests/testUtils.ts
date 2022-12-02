import { faker } from "@faker-js/faker";
import { fakeLatitude, fakeLongitude } from "helpers/utils";
import { CreateUserDto } from "modules/users/dto/create-user.dto";
import { UsersService } from "modules/users/users.service";
import { DataSource } from "typeorm";
import { CreateFarmDto } from "../dto/create-farm.dto";
import { Farm } from "../entities/farm.entity";

export type GeneratedFarm = CreateFarmDto & {
  owner: string;
  drivingDistance: number;
}

export const generateFarms = async (ds: DataSource, usersService: UsersService): Promise<GeneratedFarm[]> => {
  const farmsRepository = ds.getRepository(Farm);
  const responseArray = [];

  for (let i = 0; i < 3; i++) {
    const createUserDto: CreateUserDto = {
      email: faker.internet.email(),
      password: "password",
      address: "address"
    };

    const user = await usersService.createUser(createUserDto);

    const namePrefix = i === 0 ? "b" : "a";
    let farmYield = 100;

    if (i === 0) {
      farmYield = 80;
    } else if (i === 2) {
      farmYield = 140;
    }

    const createFarmDto: CreateFarmDto = {
      address: `${faker.address.streetAddress()} ${faker.address.city()} ${faker.address.country()}`,
      name: `${namePrefix}${faker.word.noun()}`,
      size: faker.datatype.float(),
      yield: farmYield,
    };

    await farmsRepository.insert({
      ...createFarmDto,
      owner: user,
      createdAt: i === 0 ? faker.date.past() : faker.date.soon(),
      coordinates: `${fakeLatitude()},${fakeLongitude()}`,
    });

    responseArray.push({
      ...createFarmDto,
      owner: user.email,
      drivingDistance: expect.any(Number),
    });
  }

  return responseArray;
}
