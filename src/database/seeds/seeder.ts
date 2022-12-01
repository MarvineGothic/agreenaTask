import { Farm } from "modules/farms/entities/farm.entity";
import { User } from "modules/users/entities/user.entity";
import { DataSource } from "typeorm";
import { Seeder, SeederFactoryManager } from "typeorm-extension";
import { faker } from "@faker-js/faker";
import { fakeLatitude, fakeLongitude } from "helpers/utils";

export default class UserFarmSeeder implements Seeder {
  public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<any> {
    const userFactory = factoryManager.get(User);

    const repository = dataSource.getRepository(Farm);

    for (let i = 0; i < 4; i++) {
      await repository.insert({
        address: `${faker.address.streetAddress()} ${faker.address.city()} ${faker.address.country()}`,
        coordinates: `${fakeLatitude()},${fakeLongitude()}`,
        name: faker.word.noun(),
        size: faker.datatype.float(),
        yield: faker.datatype.float(),
        owner: await userFactory.save(),
      })
    }
  }
}
