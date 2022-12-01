/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { DataSource } from "typeorm";
import { runSeeder, Seeder, SeederFactoryManager } from "typeorm-extension";
import UserFarmSeeder from "./seeder";

export default class MainSeeder implements Seeder {
  public async run(dataSource: DataSource, _factoryManager: SeederFactoryManager): Promise<any> {
    await runSeeder(dataSource, UserFarmSeeder);
  }
}
