export type Coordinates = {
  latitude: number;
  longitude: number;
};

export interface MapService {
  geocode(address: string): Promise<Coordinates | null>;
  calculateDrivingDistance(origins: Coordinates[], destinations: Coordinates[]): Promise<number>;
}
