import type { NextApiRequest, NextApiResponse } from 'next';
import { ZodError } from 'zod';

import { GatewayApiError } from '@/lib/api/gateway-client';

export function allowMethod(
  req: NextApiRequest,
  res: NextApiResponse,
  expectedMethod: 'GET' | 'POST' | 'PUT' | 'DELETE',
): boolean {
  if (req.method === expectedMethod) {
    return true;
  }

  res.setHeader('Allow', expectedMethod);
  res.status(405).json({
    error: `Method ${req.method} not allowed for this route.`,
    status: 405,
  });

  return false;
}

export function handleApiError(error: unknown, res: NextApiResponse): void {
  if (error instanceof ZodError) {
    res.status(400).json({
      error: 'Invalid request payload.',
      status: 400,
      details: error.flatten(),
    });
    return;
  }

  if (error instanceof GatewayApiError) {
    res.status(error.status).json({
      error: error.message,
      status: error.status,
    });
    return;
  }

  console.error(error);

  res.status(500).json({
    error: 'Internal server error.',
    status: 500,
  });
}
