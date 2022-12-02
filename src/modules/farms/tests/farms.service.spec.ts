import { Express } from "express";
import http, { Server } from "http";
import config from "config/config";
import { setupServer } from "server/server";
import ds from "orm/orm.config";
import { FarmsService } from "../farms.service";
import { disconnectAndClearDatabase } from "helpers/utils";
import { faker } from "@faker-js/faker";
import { CreateUserDto } from "modules/users/dto/create-user.dto";
import { UsersService } from "modules/users/users.service";
import { GeneratedFarm, generateFarms } from "./testUtils";
import { User } from "modules/users/entities/user.entity";

describe(("FarmsService"), () => {
  let app: Express;
  let server: Server;

  let farmsService: FarmsService;
  let usersService: UsersService;

  beforeAll(() => {
    app = setupServer();
    server = http.createServer(app).listen(config.APP_PORT);
  });

  afterAll(() => {
    server.close();
  });

  beforeEach(async () => {
    await ds.initialize();
    farmsService = new FarmsService();
    usersService = new UsersService();
  });

  afterEach(async () => {
    await disconnectAndClearDatabase(ds);
  });

  describe((".getAllFarms"), () => {
    let user: User;
    const createUserDto: CreateUserDto = {
      email: faker.internet.email(),
      password: "password",
      address: "address"
    };

    beforeEach(async () => {
      user = await usersService.createUser(createUserDto);
    });

    it(("should return empty array if no farms"), async () => {
      const farms = await farmsService.getAllFarms({
        user,
        sort: "",
        filter: "",
      });

      expect(farms).toEqual([]);
    });

    describe(("should return farms"), () => {
      let farms: GeneratedFarm[];

      beforeEach(async () => {
        farms = await generateFarms(ds, usersService);
      });

      it(("without query parameters"), async () => {
        const result = await farmsService.getAllFarms({
          user,
          sort: "",
          filter: "",
        });

        for (const farm of farms) {
          expect(result).toContainEqual(farm);
        }
      });

      it(("and sort by name - from a to z"), async () => {
        const result = await farmsService.getAllFarms({
          user,
          sort: "name",
          filter: "",
        });

        const isSorted = result[0].name <= result[1].name;
        expect(isSorted).toEqual(true);
      });

      it(("and sort by date - newest first"), async () => {
        const result = await farmsService.getAllFarms({
          user,
          sort: "date",
          filter: "",
        });

        expect(result[0]).not.toEqual(farms[0]);
      });

      it(("and sort by driving distance - closest first"), async () => {
        const result = await farmsService.getAllFarms({
          user,
          sort: "driving_distance",
          filter: "",
        });

        const isSorted = result[0].drivingDistance < result[1].drivingDistance;
        expect(isSorted).toEqual(true);
      });

      it(("and filter outliers"), async () => {
        const result = await farmsService.getAllFarms({
          user,
          sort: "driving_distance",
          filter: "",
        });

        const isSorted = result[0].drivingDistance < result[1].drivingDistance;
        expect(isSorted).toEqual(true);
      });
    });
  });

  describe((".findAllWithSort"), () => {
    let farms: GeneratedFarm[];

    beforeEach(async () => {
      farms = await generateFarms(ds, usersService);
    });

    it(("get farms and sort by name - from a to z"), async () => {
      const result = await farmsService.findAllWithSort({
        sort: "name",
        filter: "",
      });

      const isSorted = result[0].name <= result[1].name;
      expect(isSorted).toEqual(true);
    });

    it(("get farms and sort by date - newest first"), async () => {
      const result = await farmsService.findAllWithSort({
        sort: "date",
        filter: "",
      });

      expect(result[0]).not.toEqual(farms[0]);
    });
  });
});
