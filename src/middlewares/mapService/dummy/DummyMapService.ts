/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { LatLngString, MapService } from "../MapService";

export class DummyMapService implements MapService {
  public async geocode(_address: string): Promise<LatLngString> {
    return Promise.resolve(`0,0`);
  }

  public async calculateDrivingDistanceInMeters(_command: {
    origins: LatLngString[],
    destinations: LatLngString[],
  }): Promise<number> {
    return Promise.resolve(0);
  }
}
