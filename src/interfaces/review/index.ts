import { UserInterface } from 'interfaces/user';
import { ChargingStationInterface } from 'interfaces/charging-station';
import { GetQueryInterface } from 'interfaces';

export interface ReviewInterface {
  id?: string;
  rating: number;
  comment?: string;
  user_id?: string;
  charging_station_id?: string;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  charging_station?: ChargingStationInterface;
  _count?: {};
}

export interface ReviewGetQueryInterface extends GetQueryInterface {
  id?: string;
  comment?: string;
  user_id?: string;
  charging_station_id?: string;
}
