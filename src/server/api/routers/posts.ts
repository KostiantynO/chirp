import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

export const postsRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => ctx.db.post.findMany()),
});
