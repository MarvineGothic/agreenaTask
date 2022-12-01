/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { LatLngString, MapService } from "../MapService";
import { fakeLatitude, fakeLongitude } from "helpers/utils";

export class DummyMapService implements MapService {
  public async geocode(_address: string): Promise<LatLngString> {
    return Promise.resolve(`${fakeLatitude()},${fakeLongitude()}`);
  }

  public async calculateDrivingDistanceInMeters(_command: {
    origins: LatLngString[],
    destinations: LatLngString[],
  }): Promise<number> {
    return Promise.resolve(0);
  }
}
