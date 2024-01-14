import { clerkClient } from '@clerk/nextjs/server';
import { TRPCError } from '@trpc/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { z } from 'zod';

import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from '~/server/api/trpc';
import { filterUserForClient } from '~/server/helpers/filterUserForClient';

import type { Post } from '@prisma/client';

const addUserDataToPosts = async (posts: Post[]) => {
  const users = (
    await clerkClient.users.getUserList({
      userId: posts.map(({ authorId }) => authorId),
      limit: 100,
    })
  ).map(filterUserForClient);

  return posts.map(post => {
    const author = users.find(({ id }) => id === post.authorId);

    if (!author?.username)
      throw new TRPCError({
        message: 'Author for post not found',
        code: 'INTERNAL_SERVER_ERROR',
      });

    return { post, author: { ...author, username: author.username } };
  });
};

// 3 requests per 1 minute
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, '1 m'),
  analytics: false,
  prefix: '@upstash/ratelimit',
});

export const postsRouter = createTRPCRouter({
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const post = await ctx.db.post.findUnique({
        where: { id: Number(input.id) },
      });
      if (!post) throw new TRPCError({ code: 'NOT_FOUND' });

      return (await addUserDataToPosts([post]))[0];
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.db.post.findMany({
      take: 100,
      orderBy: [{ createdAt: 'desc' }],
    });

    return addUserDataToPosts(posts);
  }),

  create: privateProcedure
    .input(
      z.object({
        content: z.string().emoji('Only emojis are allowed').min(1).max(280),
      })
    )
    .mutation(async ({ ctx, input: { content } }) => {
      const { userId } = ctx;

      const { success } = await ratelimit.limit(userId);
      if (!success) throw new TRPCError({ code: 'TOO_MANY_REQUESTS' });

      const post = await ctx.db.post.create({
        data: {
          authorId: userId,
          content,
        },
      });

      return post;
    }),

  getPostsByUsedId: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(({ ctx, input }) =>
      ctx.db.post
        .findMany({
          where: {
            authorId: input.userId,
          },
          take: 100,
          orderBy: [{ createdAt: 'desc' }],
        })
        .then(addUserDataToPosts)
    ),
});
