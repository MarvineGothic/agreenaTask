import { Farm } from "./entities/farm.entity";
import dataSource from "orm/orm.config";
import { Repository } from "typeorm";
import { User } from "modules/users/entities/user.entity";
import { MapService } from "middlewares/mapService/MapService";
import { DummyMapService } from "middlewares/mapService/dummy/DummyMapService";

type FarmResponse = {
  name: string;
  address: string;
  owner: string;
  size: number;
  yield: number;
  drivingDistance: number;
}

type SortAndFilterCommand = {
  sort: string;
  filter: string;
}

type GetAllFarmsCommand = SortAndFilterCommand & {
  user: User,
}

export class FarmService {
  private readonly farmsRepository: Repository<Farm>;
  private readonly mapService: MapService;

  constructor () {
    this.farmsRepository = dataSource.getRepository(Farm);
    this.mapService = new DummyMapService();
  }

  public async getAllFarms(command: GetAllFarmsCommand): Promise<FarmResponse[]> {
    const userCoordinates = command.user.coordinates;

    const allFarms = await this.findAllWithSortAndFilter({
      sort: command.sort,
      filter: command.filter,
    });

    const result = [];

    for (const farm of allFarms) {
      const farmCoordinates = farm.coordinates;

      const drivingDistance = await this.mapService.calculateDrivingDistanceInMeters({
        origins: [userCoordinates],
        destinations: [farmCoordinates]
      });

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

  public async findAllWithSortAndFilter(command: SortAndFilterCommand): Promise<Farm[]> {
    console.log(command)
    return this.farmsRepository.find({
      relations: { owner: true }
    });
  }
}
