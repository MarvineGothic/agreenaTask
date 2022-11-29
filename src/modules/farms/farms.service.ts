import { Farm } from "./entities/farm.entity";
import dataSource from "orm/orm.config";
import { Repository } from "typeorm";
import { User } from "modules/users/entities/user.entity";
import { CoordinatesArray, MapService } from "middlewares/mapService/MapService";
import { GoogleMapService } from "middlewares/mapService/google/googleMapService";

type FarmResponse = {
  name: string;
  address: string;
  owner: string;
  size: number;
  yield: number;
  drivingDistance: number;
}

export class FarmService {
  private readonly farmsRepository: Repository<Farm>;
  private readonly mapService: MapService;

  constructor () {
    this.farmsRepository = dataSource.getRepository(Farm);
    this.mapService = new GoogleMapService();
  }

  public async getAllFarms(user: User): Promise<FarmResponse[]> {
    const userCoordinates = JSON.parse(user.coordinates) as CoordinatesArray;

    const allFarms = await this.farmsRepository.find({
      relations: { owner: true }
    });

    const result = [];

    for (const farm of allFarms) {
      const farmCoordinates = JSON.parse(farm.coordinates) as CoordinatesArray;

      const drivingDistance = await this.mapService.calculateDrivingDistanceInMeters([userCoordinates], [farmCoordinates]);

      result.push({
        name: farm.name,
        address: farm.address,
        owner: farm.owner.email,
        size: farm.size,
        yield: farm.yield,
        drivingDistance,
      })
    }

    return result;
  }
}
