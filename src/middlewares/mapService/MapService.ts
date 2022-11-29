export type CoordinatesArray = [ number, number ];

export interface MapService {
  geocode(address: string): Promise<CoordinatesArray>;
  calculateDrivingDistanceInMeters(origins: CoordinatesArray[], destinations: CoordinatesArray[]): Promise<number>;
}
