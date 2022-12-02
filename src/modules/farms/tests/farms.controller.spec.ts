/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import config from "config/config";
import { Express } from "express";
import { setupServer } from "server/server";
import { disconnectAndClearDatabase } from "helpers/utils";
import http, { Server } from "http";
import ds from "orm/orm.config";
import supertest, { SuperAgentTest } from "supertest";
import { faker } from "@faker-js/faker";
import { UsersService } from "modules/users/users.service";
import { sign } from "jsonwebtoken";
import { generateFarms } from "./testUtils";

describe(("FarmsController"), () => {
  let app: Express;
  let agent: SuperAgentTest;
  let server: Server;

  const farmsEndpoint = "/api/v1/farms";

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
    agent = supertest.agent(app);

    usersService = new UsersService();
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

      const farms = await generateFarms(ds, usersService);

      const res = await agent.get(farmsEndpoint).set("Authorization", token);

      expect(res.statusCode).toBe(200);
      expect(res.body).toMatchObject(farms);
    });
  });

  describe(("GET /farms?sort="), () => {
    it(("should sort by name - from a to z"), async () => {
      const token = await authorize();

      await generateFarms(ds, usersService);

      const res = await agent.get(`${farmsEndpoint}?sort=name`).set("Authorization", token);

      const isSorted = res.body[0].name <= res.body[1].name;
      expect(res.statusCode).toBe(200);
      expect(isSorted).toEqual(true);
    });

    it(("should sort by date - newest first"), async () => {
      const token = await authorize();

      const farms = await generateFarms(ds, usersService);

      const res = await agent.get(`${farmsEndpoint}?sort=date`).set("Authorization", token);

      expect(res.statusCode).toBe(200);
      expect(res.body[0]).not.toEqual(farms[0]);
    });

    it(("should sort by driving distance - closest first"), async () => {
      const token = await authorize();

      await generateFarms(ds, usersService);

      const res = await agent.get(`${farmsEndpoint}?sort=driving_distance`).set("Authorization", token);

      const isSorted = res.body[0].drivingDistance < res.body[1].drivingDistance;
      expect(res.statusCode).toBe(200);
      expect(isSorted).toEqual(true);
    });
  })

  describe(("GET /farms?filter="), () => {
    it(("should filter by outliers"), async () => {
      const token = await authorize();

      const farms = await generateFarms(ds, usersService);

      const res = await agent.get(`${farmsEndpoint}?filter=outliers`).set("Authorization", token);

      expect(res.statusCode).toBe(200);
      expect(res.body).not.toContain(farms[2]);
    });
  });
});
