import { UnprocessableEntityError } from "errors/errors";
import { DeepPartial, FindOptionsWhere, Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "./entities/user.entity";
import dataSource from "orm/orm.config";
import { MapService } from "middlewares/mapService/MapService";
import { hashPassword } from "helpers/utils";
import { DummyMapService } from "middlewares/mapService/dummy/DummyMapService";

export class UsersService {
  private readonly usersRepository: Repository<User>;
  private readonly mapService: MapService;

  constructor () {
    this.usersRepository = dataSource.getRepository(User);
    this.mapService = new DummyMapService();
  }

  public async createUser(data: CreateUserDto): Promise<User> {
    const { email, password, address } = data;

    const existingUser = await this.findOneBy({ email: email });
    if (existingUser) throw new UnprocessableEntityError("A user for the email already exists");

    const hashedPassword = await hashPassword(password);

    const coordinates = await this.mapService.geocode(address);

    const userData: DeepPartial<User> = { email, hashedPassword, address, coordinates };

    const newUser = this.usersRepository.create(userData);
    return this.usersRepository.save(newUser);
  }

  public async findOneBy(param: FindOptionsWhere<User>): Promise<User | null> {
    return this.usersRepository.findOneBy({ ...param });
  }
}
