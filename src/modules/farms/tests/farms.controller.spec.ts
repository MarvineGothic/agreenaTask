/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import config from "config/config";
import { Express } from "express";
import { setupServer } from "server/server";
import { disconnectAndClearDatabase, fakeLatitude, fakeLongitude } from "helpers/utils";
import http, { Server } from "http";
import ds from "orm/orm.config";
import supertest, { SuperAgentTest } from "supertest";
import { faker } from "@faker-js/faker";
import { Farm } from "../entities/farm.entity";
import { CreateUserDto } from "modules/users/dto/create-user.dto";
import { UsersService } from "modules/users/users.service";
import { sign } from "jsonwebtoken";

describe(("FarmsController"), () => {
  let app: Express;
  let agent: SuperAgentTest;
  let server: Server;

  const farmsEndpoint = "/api/v1/farms";

  let usersService: UsersService;
  // let farmsService: FarmsService;

  beforeAll(() => {
    app = setupServer();
    server = http.createServer(app).listen(config.APP_PORT);
  });

  afterAll(() => {
    server.close();
  });

  beforeEach(async () => {
    await ds.initialize();
    agent = supertest.agent(app);

    usersService = new UsersService();
    // farmsService = new FarmsService();
  });

  afterEach(async () => {
    await disconnectAndClearDatabase(ds);
  });

  const authorize = async () => {
    const user = await usersService.createUser({
      email: faker.internet.email(),
      password: "password",
      address: "address"
    });

    const token = sign(
      {
        id: user.id,
        email: user.email,
      },
      config.JWT_SECRET,
      { expiresIn: config.JWT_EXPIRES_AT },
    );

    return `Bearer ${token}`;
  }

  const generateFarms = async () => {
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

      const createFarmDto = {
        address: `${faker.address.streetAddress()} ${faker.address.city()} ${faker.address.country()}`,
        name: `${namePrefix}${faker.word.noun()}`,
        size: faker.datatype.float(),
        yield: farmYield,
        owner: user,
      };

      await farmsRepository.insert({
        ...createFarmDto,
        createdAt: i === 0 ? faker.date.past() : faker.date.recent(),
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

  describe(("GET /farms"), () => {
    it(("should return 'Unauthorized' response"), async () => {
      const res = await agent.get(farmsEndpoint);

      expect(res.statusCode).toBe(401);
    });

    it(("should return empty array if no farms"), async () => {
      const token = await authorize();
      const res = await agent.get(farmsEndpoint).set("Authorization", token);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual([]);
    });

    it(("should return an array of farms"), async () => {
      const token = await authorize();

      const farms = await generateFarms();

      const res = await agent.get(farmsEndpoint).set("Authorization", token);

      expect(res.statusCode).toBe(200);
      expect(res.body).toMatchObject(farms);
    });
  });

  describe(("GET /farms?sort="), () => {
    it(("should sort by name - from a to z"), async () => {
      const token = await authorize();

      await generateFarms();

      const res = await agent.get(`${farmsEndpoint}?sort=name`).set("Authorization", token);

      const isSorted = res.body[0].name <= res.body[1].name;
      expect(res.statusCode).toBe(200);
      expect(isSorted).toEqual(true);
    });

    it(("should sort by date - newest first"), async () => {
      const token = await authorize();

      const farms = await generateFarms();

      const res = await agent.get(`${farmsEndpoint}?sort=date`).set("Authorization", token);

      expect(res.statusCode).toBe(200);
      expect(res.body[0]).toEqual(farms[1]);
    });

    it(("should sort by driving distance - closest first"), async () => {
      const token = await authorize();

      await generateFarms();

      const res = await agent.get(`${farmsEndpoint}?sort=driving_distance`).set("Authorization", token);

      const isSorted = res.body[0].drivingDistance < res.body[1].drivingDistance;
      expect(res.statusCode).toBe(200);
      expect(isSorted).toEqual(true);
    });
  })


  describe(("GET /farms?filter="), () => {
    it(("should filter by outliers"), async () => {
      const token = await authorize();

      const farms = await generateFarms();

      const res = await agent.get(`${farmsEndpoint}?filter=outliers`).set("Authorization", token);

      expect(res.statusCode).toBe(200);
      expect(res.body).not.toContain(farms[2]);
    });
  });
});
