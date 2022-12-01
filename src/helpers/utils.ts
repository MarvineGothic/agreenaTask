import { DataSource } from "typeorm";
import * as bcrypt from "bcrypt";
import config from "config/config";
import { faker } from "@faker-js/faker";

export const disconnectAndClearDatabase = async (ds: DataSource): Promise<void> => {
  const { entityMetadatas } = ds;

  await Promise.all(entityMetadatas.map(data => ds.query(`truncate table "${data.tableName}" cascade`)));
  await ds.destroy();
};

export const hashPassword = async (password: string, salt_rounds = config.SALT_ROUNDS): Promise<string> => {
  const salt = await bcrypt.genSalt(salt_rounds);
  return bcrypt.hash(password, salt);
}

export const fakeLatitude = (): number => {
  return faker.datatype.float({ min: -90, max: 90, precision: 0.0000001 })
}

export const fakeLongitude = (): number => {
  return faker.datatype.float({ min: -180, max: 180, precision: 0.0000001 });
}
