export type LatLngString = string;

export interface MapService {
  geocode(address: string): Promise<LatLngString>;
  calculateDrivingDistanceInMeters(command: {origins: LatLngString[], destinations: LatLngString[]}): Promise<number>;
}
