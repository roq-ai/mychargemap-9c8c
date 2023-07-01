import * as yup from 'yup';

export const chargingStationValidationSchema = yup.object().shape({
  location: yup.string().required(),
  description: yup.string(),
  charging_ports: yup.number().integer().required(),
  charging_type: yup.string().required(),
  image: yup.string(),
});
