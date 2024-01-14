import type { User } from '@clerk/nextjs/server';

export const filterUserForClient = ({ id, username, imageUrl }: User) => ({
  id,
  username,
  imageUrl,
});
