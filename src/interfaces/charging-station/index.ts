import { ReviewInterface } from 'interfaces/review';
import { GetQueryInterface } from 'interfaces';

export interface ChargingStationInterface {
  id?: string;
  location: string;
  description?: string;
  charging_ports: number;
  charging_type: string;
  image?: string;
  created_at?: any;
  updated_at?: any;
  review?: ReviewInterface[];

  _count?: {
    review?: number;
  };
}

export interface ChargingStationGetQueryInterface extends GetQueryInterface {
  id?: string;
  location?: string;
  description?: string;
  charging_type?: string;
  image?: string;
}
