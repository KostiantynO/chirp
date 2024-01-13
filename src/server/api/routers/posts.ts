import { clerkClient } from '@clerk/nextjs/server';
import { TRPCError } from '@trpc/server';

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

import type { User } from '@clerk/nextjs/server';

const filterUserForClient = ({ id, username, imageUrl }: User) => ({
  id,
  username,
  imageUrl,
});

export const postsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.db.post.findMany({
      take: 100,
    });

    const users = (
      await clerkClient.users.getUserList({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        userId: posts.map(({ authorId }) => authorId),
        limit: 100,
      })
    ).map(filterUserForClient);

    console.log(users);

    return posts.map(post => {
      const author = users.find(({ id }) => id === post.authorId);

      if (!author?.username)
        throw new TRPCError({
          message: 'Author for post not found',
          code: 'INTERNAL_SERVER_ERROR',
        });

      return { post, author: { ...author, username: author.username } };
    });
  }),
});
