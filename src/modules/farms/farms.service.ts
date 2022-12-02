import { Farm } from "./entities/farm.entity";
import dataSource from "orm/orm.config";
import { Repository } from "typeorm";
import { User } from "modules/users/entities/user.entity";
import { MapService } from "middlewares/mapService/MapService";
import { MapServiceProvider } from "middlewares/mapService/MapServiceProvider";

type FarmResponse = {
  name: string;
  address: string;
  owner: string;
  size: number;
  yield: number;
  drivingDistance: number;
}

type SortCommand = {
  sort: string;
  filter: string;
}

type GetAllFarmsCommand = SortCommand & {
  user: User,
}

export class FarmService {
  private readonly farmsRepository: Repository<Farm>;
  private readonly mapService: MapService;

  constructor () {
    this.farmsRepository = dataSource.getRepository(Farm);
    this.mapService = MapServiceProvider.getService();
  }

  public async getAllFarms(command: GetAllFarmsCommand): Promise<FarmResponse[]> {
    const userCoordinates = command.user.coordinates;

    const allFarms = await this.findAllWithSort({
      sort: command.sort,
      filter: command.filter,
    });

    let farmsResult = []
    const farms = [];
    let totalYield = 0;

    for (const farm of allFarms) {
      const farmCoordinates = farm.coordinates;

      const drivingDistance = await this.mapService.calculateDrivingDistanceInMeters({
        origins: [userCoordinates],
        destinations: [farmCoordinates]
      });

      farms.push({
        name: farm.name,
        address: farm.address,
        owner: farm.owner.email,
        size: farm.size,
        yield: farm.yield,
        drivingDistance,
      })

      if (command.filter === "outliers") {
        totalYield += Number(farm.yield);
        console.log(totalYield)
      }
    }

    farmsResult = farms;

    if (command.filter === "outliers") {
      const averageYield = totalYield / farms.length;

      farmsResult = farms.filter((farm) => {
        const perCent = Math.abs(farm.yield - averageYield) * 100 / averageYield;
        console.log(perCent, averageYield)
        if (perCent < 30) {
          return farm;
        }
      });
    }

    if (command.sort === "driving_distance") {
      farmsResult = farms.sort((farmA, farmB) => farmA.drivingDistance - farmB.drivingDistance)
    }

    return farmsResult;
  }

  public async findAllWithSort(command: SortCommand): Promise<Farm[]> {
    let sortConfig = {};

    if (command.sort === "name") {
      sortConfig = {
        order: {
          name: "ASC"
        }
      }
    } else if (command.sort === "date") {
      sortConfig = {
        order: {
          createdAt: "DESC"
        }
      }
    }

    return this.farmsRepository.find({
      relations: { owner: true },
      ...sortConfig,
    });
  }
}
