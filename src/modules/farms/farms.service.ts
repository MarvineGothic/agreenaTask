import { Farm } from "./entities/farm.entity";
import dataSource from "orm/orm.config";
import { Repository } from "typeorm";
import { User } from "modules/users/entities/user.entity";
import { CoordinatesArray, MapService } from "middlewares/mapService/MapService";
// import { GoogleMapService } from "middlewares/mapService/google/googleMapService";
import { DummyMapService } from "middlewares/mapService/dummy/DummyMapService";

type FarmResponse = {
  name: string;
  address: string;
  owner: string;
  size: number;
  yield: number;
  drivingDistance: number;
}

type GetAllFarmsCommand = {
  user: User,
  sort: string,
  filter: string,
}

export class FarmService {
  private readonly farmsRepository: Repository<Farm>;
  private readonly mapService: MapService;

  constructor () {
    this.farmsRepository = dataSource.getRepository(Farm);
    this.mapService = new DummyMapService();
  }

  public async getAllFarms(command: GetAllFarmsCommand): Promise<FarmResponse[]> {
    const userCoordinates = JSON.parse(command.user.coordinates) as CoordinatesArray;
    console.log(command)

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
