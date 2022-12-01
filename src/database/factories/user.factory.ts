import { fakeLatitude, fakeLongitude, hashPassword } from "helpers/utils";
import { User } from "modules/users/entities/user.entity";
import { setSeederFactory } from "typeorm-extension";

export default setSeederFactory(User, async (faker) => {
  const user = new User();

  user.email = faker.internet.email();
  user.hashedPassword = await hashPassword("password");
  user.address = `${faker.address.streetAddress()} ${faker.address.city()} ${faker.address.country()}`;
  user.coordinates = `${fakeLatitude()},${fakeLongitude()}`;

  return user;
})
