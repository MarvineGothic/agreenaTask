import { CoordinatesArray, MapService } from "../MapService";
import { Client } from "@googlemaps/google-maps-services-js";
import config from "config/config";
import { UnprocessableEntityError } from "errors/errors";

export class GoogleMapService implements MapService {
  private readonly client: Client;

  constructor () {
    this.client = new Client();
  }

  public async geocode(address: string): Promise<CoordinatesArray> {
    const res = await this.client.geocode({
      params: {
        key: config.GOOGLE_MAPS_API_KEY,
        address,
      }
    });

    const results = res.data.results;

    if (!results) {
      throw new UnprocessableEntityError("Cannot get location coordinates from the address");
    }

    const location = results[0].geometry.location;

    return [location.lat, location.lng];
  }

  public async calculateDrivingDistanceInMeters(origins: CoordinatesArray[], destinations: CoordinatesArray[]): Promise<number> {
    const distanceMatrixResponse = await this.client.distancematrix({
      params: {
        key: config.GOOGLE_MAPS_API_KEY,
        origins,
        destinations,
      }
    });

    let distance = 0;

    for (const row of distanceMatrixResponse.data.rows) {
      for (const element of row.elements) {
        distance += element.distance.value;
      }
    }

    return distance;
  }
}
