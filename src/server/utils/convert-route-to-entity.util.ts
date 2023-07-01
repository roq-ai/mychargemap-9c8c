const mapping: Record<string, string> = {
  accounts: 'account',
  'charging-stations': 'charging_station',
  reviews: 'review',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
