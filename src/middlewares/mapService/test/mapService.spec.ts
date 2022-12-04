import config from "config/config";
import { Express } from "express";
import { setupServer } from "server/server";
import { fakeLatitude, fakeLongitude } from "helpers/utils";
import http, { Server } from "http";
import { Client, DistanceMatrixResponse, GeocodeResponse } from "@googlemaps/google-maps-services-js";
import { GoogleMapService } from "../google/GoogleMapService";
import { faker } from "@faker-js/faker";
import { MapServiceError } from "errors/errors";

describe(("GoogleMapService"), () => {
  let app: Express;
  let server: Server;

  let googleMapService: GoogleMapService;
  let client: Client;

  beforeAll(() => {
    app = setupServer();
    server = http.createServer(app).listen(config.APP_PORT);
  });

  afterAll(() => {
    server.close();
  });

  beforeEach(() => {
    googleMapService = new GoogleMapService();
    client = googleMapService.getClient();
  });

  describe((".geocode"), () => {
    it(("should throw MapServiceError"), async () => {
      const geocodeSpy = jest.spyOn(client, "geocode");

      const geocodeReturnValue = {
        data: {
          results: [{
            geometry: {
              location: {
                lat: fakeLatitude(),
                lng: fakeLongitude(),
              },
            }
          }],
          status: "ZERO_RESULTS",
        }
      } as GeocodeResponse;

      geocodeSpy.mockReturnValueOnce(Promise.resolve(geocodeReturnValue));

      await googleMapService.geocode(faker.datatype.string()).catch((error: Error) => {
        expect(error).toBeInstanceOf(MapServiceError);
        expect(error.message).toEqual("Cannot get location coordinates from the address");
      });
    });

    it(("should return coordinates"), async () => {
      const geocodeSpy = jest.spyOn(client, "geocode");

      const coordinates = {
        lat: fakeLatitude(),
        lng: fakeLongitude(),
      };

      const geocodeReturnValue = {
        data: {
          results: [{
            geometry: {
              location: { ...coordinates },
            }
          }],
          status: "OK",
        }
      } as GeocodeResponse;

      geocodeSpy.mockReturnValueOnce(Promise.resolve(geocodeReturnValue));

      const result = await googleMapService.geocode(faker.datatype.string());

      expect(result).toEqual(`${coordinates.lat},${coordinates.lng}`)
    });
  });

  describe((".calculateDrivingDistanceInMeters"), () => {
    it(("should calculate distance in meters"), async () => {
      const geocodeSpy = jest.spyOn(client, "distancematrix");
      
      let totalDistance = 0;

      const rows = [];

      for (let i = 0; i < 2; i++) {
        const elements = [];

        for (let j = 0; j < 2; j++) {
          const value = faker.datatype.number();
          elements.push({ distance: { value } });
          totalDistance += value;
        }

        rows.push({ elements });
      }

      const distanceMatrixResponse = {
        data: {
          rows,
        }
      };

      geocodeSpy.mockReturnValueOnce(Promise.resolve(distanceMatrixResponse as DistanceMatrixResponse));

      const result = await googleMapService.calculateDrivingDistanceInMeters({
        origins: [faker.datatype.string()],
        destinations: [faker.datatype.string()],
      });

      expect(result).toEqual(totalDistance)
    });
  });
}
);
