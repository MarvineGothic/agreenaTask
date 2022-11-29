/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { CoordinatesArray, MapService } from "../MapService";

export class DummyMapService implements MapService {
  public async geocode(_address: string): Promise<CoordinatesArray> {
    return Promise.resolve([0, 0]);
  }

  public async calculateDrivingDistanceInMeters(_origins: CoordinatesArray[], _destinations: CoordinatesArray[]): Promise<number> {
    return Promise.resolve(0);
  }
}
