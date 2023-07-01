import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { chargingStationValidationSchema } from 'validationSchema/charging-stations';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.charging_station
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getChargingStationById();
    case 'PUT':
      return updateChargingStationById();
    case 'DELETE':
      return deleteChargingStationById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getChargingStationById() {
    const data = await prisma.charging_station.findFirst(convertQueryToPrismaUtil(req.query, 'charging_station'));
    return res.status(200).json(data);
  }

  async function updateChargingStationById() {
    await chargingStationValidationSchema.validate(req.body);
    const data = await prisma.charging_station.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteChargingStationById() {
    const data = await prisma.charging_station.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
