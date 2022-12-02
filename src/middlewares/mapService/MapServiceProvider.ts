import config from "config/config";
import { DummyMapService } from "./dummy/DummyMapService";
import { GoogleMapService } from "./google/GoogleMapService";

export class MapServiceProvider {
  public static getService() {
    if (config.MAP_SERVICE_PROVIDER === "google") {
      return new GoogleMapService();
    }
    
    return new DummyMapService();
  }
}
