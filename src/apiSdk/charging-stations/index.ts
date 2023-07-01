import axios from 'axios';
import queryString from 'query-string';
import { ChargingStationInterface, ChargingStationGetQueryInterface } from 'interfaces/charging-station';
import { GetQueryInterface } from '../../interfaces';

export const getChargingStations = async (query?: ChargingStationGetQueryInterface) => {
  const response = await axios.get(`/api/charging-stations${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createChargingStation = async (chargingStation: ChargingStationInterface) => {
  const response = await axios.post('/api/charging-stations', chargingStation);
  return response.data;
};

export const updateChargingStationById = async (id: string, chargingStation: ChargingStationInterface) => {
  const response = await axios.put(`/api/charging-stations/${id}`, chargingStation);
  return response.data;
};

export const getChargingStationById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/charging-stations/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteChargingStationById = async (id: string) => {
  const response = await axios.delete(`/api/charging-stations/${id}`);
  return response.data;
};
