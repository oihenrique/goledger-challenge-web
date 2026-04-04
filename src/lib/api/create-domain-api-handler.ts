import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import type { ZodType } from 'zod';

import {
  createAssets,
  deleteAsset,
  readAsset,
  readAssetHistory,
  searchAssets,
  updateAsset,
} from '@/lib/api/gateway-client';
import { allowMethod, handleApiError } from '@/lib/api/api-route';
import { assetTypes, type AssetType } from '@/shared/types';
import {
  createHistoryRouteSchema,
  createReadRouteSchema,
  searchRouteSchema,
} from '@/shared/schemas';

interface DomainApiHandlerConfig {
  assetType: AssetType;
  createSchema: ZodType;
  updateSchema: ZodType;
  keySchema: ZodType;
  buildSearchSelector?: (body: Record<string, unknown>) => Record<string, unknown>;
}

const actionMethods = {
  search: 'POST',
  read: 'POST',
  history: 'POST',
  create: 'POST',
  update: 'PUT',
  delete: 'DELETE',
} as const;

export function createDomainApiHandler(
  config: DomainApiHandlerConfig,
): NextApiHandler {
  return async function handler(req: NextApiRequest, res: NextApiResponse) {
    const action = req.query.action;

    if (typeof action !== 'string' || !(action in actionMethods)) {
      res.status(404).json({
        error: 'API action not found.',
        status: 404,
      });
      return;
    }

    const expectedMethod = actionMethods[action as keyof typeof actionMethods];

    if (!allowMethod(req, res, expectedMethod)) {
      return;
    }

    try {
      switch (action) {
        case 'search': {
          const body = searchRouteSchema.parse(req.body ?? {});
          const selector = config.buildSearchSelector
            ? config.buildSearchSelector(body)
            : {
                '@assetType': config.assetType,
              };

          const result = await searchAssets({
            query: {
              selector,
              limit: body.limit,
              bookmark: body.bookmark,
            },
            resolve: body.resolve,
          });

          res.status(200).json(result);
          return;
        }

        case 'read': {
          const body = createReadRouteSchema(config.keySchema).parse(req.body);

          const result = await readAsset({
            key: body.key,
            resolve: body.resolve,
          });

          res.status(200).json(result);
          return;
        }

        case 'history': {
          const body = createHistoryRouteSchema(config.keySchema).parse(
            req.body,
          );

          const result = await readAssetHistory({
            key: body.key,
          });

          res.status(200).json(result);
          return;
        }

        case 'create': {
          const asset = config.createSchema.parse(req.body);

          const result = await createAssets({
            asset: [asset],
          });

          res.status(201).json(result);
          return;
        }

        case 'update': {
          const update = config.updateSchema.parse(req.body);

          const result = await updateAsset({
            update,
          });

          res.status(200).json(result);
          return;
        }

        case 'delete': {
          const key = config.keySchema.parse(req.body);

          const result = await deleteAsset({
            key,
          });

          res.status(200).json(result);
          return;
        }

        default: {
          res.status(404).json({
            error: 'API action not found.',
            status: 404,
          });
        }
      }
    } catch (error) {
      handleApiError(error, res);
    }
  };
}

export const supportedAssetTypes = assetTypes;
