import config from "config/config";
import { DataSource, DataSourceOptions } from "typeorm";
import { SeederOptions } from "typeorm-extension";
import MainSeeder from "database/seeds/main.seed";

const options: DataSourceOptions & SeederOptions = {
  type: "postgres",
  entities: ["src/**/**/entities/**/*.ts"],
  synchronize: false,
  migrations: ["src/**/**/migrations/**/*.ts"],
  host: config.DB_HOST,
  port: config.DB_PORT,
  username: config.DB_USERNAME,
  password: config.DB_PASSWORD,
  database: config.DB_NAME,

  seeds: [MainSeeder],
};

export default new DataSource(options);
