import { LatLngString, MapService } from "../MapService";
import { Client } from "@googlemaps/google-maps-services-js";
import config from "config/config";
import { MapServiceError } from "errors/errors";

export class GoogleMapService implements MapService {
  private readonly client: Client;

  constructor () {
    this.client = new Client();
  }

  public async geocode(address: string): Promise<LatLngString> {
    const res = await this.client.geocode({
      params: {
        key: config.GOOGLE_MAPS_API_KEY,
        address,
      }
    });

    const results = res.data.results;

    if (res.data.status !== "OK" || !results) {
      throw new MapServiceError("Cannot get location coordinates from the address");
    }

    const location = results[0].geometry.location;

    return `${location.lat},${location.lng}`;
  }

  public async calculateDrivingDistanceInMeters(command: {
    origins: LatLngString[], destinations: LatLngString[],
  }): Promise<number> {
    const distanceMatrixResponse = await this.client.distancematrix({
      params: {
        key: config.GOOGLE_MAPS_API_KEY,
        origins: command.origins,
        destinations: command.destinations,
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

  public getClient(): Client {
    return this.client;
  }
}
