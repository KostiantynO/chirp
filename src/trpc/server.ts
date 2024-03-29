// eslint-disable-next-line import/order
import 'server-only';
import {
  createTRPCProxyClient,
  loggerLink,
  TRPCClientError,
} from '@trpc/client';
import { callProcedure } from '@trpc/server';
import { observable } from '@trpc/server/observable';
import { cookies } from 'next/headers';
import { cache } from 'react';

import { appRouter } from '~/server/api/root';
import { createTRPCContext } from '~/server/api/trpc';

import { transformer } from './shared';

import type { TRPCErrorResponse } from '@trpc/server/rpc';
import type { AppRouter } from '~/server/api/root';

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
const createContext = cache(() =>
  createTRPCContext({
    headers: new Headers({
      cookie: cookies().toString(),
      'x-trpc-source': 'rsc',
    }),
  })
);

export const api = createTRPCProxyClient<AppRouter>({
  transformer,
  links: [
    loggerLink({
      enabled: op =>
        process.env.NODE_ENV === 'development' ||
        (op.direction === 'down' && op.result instanceof Error),
    }),
    /**
     * Custom RSC link that lets us invoke procedures without using http requests. Since Server
     * Components always run on the server, we can just call the procedure as a function.
     */
    () =>
      ({ op: { path, input, type } }) =>
        observable(observer => {
          createContext()
            .then(ctx =>
              callProcedure({
                procedures: appRouter._def.procedures,
                path,
                rawInput: input,
                ctx,
                type,
              })
            )
            .then(data => {
              observer.next({ result: { data } });
              observer.complete();
            })
            .catch((cause: TRPCErrorResponse) => {
              observer.error(TRPCClientError.from(cause));
            });
        }),
  ],
});
