'use client';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Image from 'next/image';

import { LoadingPage } from '~/app/_components/loading';
import { api } from '~/trpc/react';

import type { RouterOutputs } from '~/trpc/shared';

dayjs.extend(relativeTime);

type PostWithUser = RouterOutputs['posts']['getAll'][number];

const PostView = ({
  author: { imageUrl, username },
  post: { id, content, createdAt },
}: PostWithUser) => {
  const authorHandle = `@${username}`;
  const posted = `• ${dayjs(createdAt).fromNow()}`;

  return (
    <div key={id} className="flex gap-3 border-b border-slate-400 p-4">
      <Image
        src={imageUrl}
        alt={`${username}'s avatar`}
        className="h-14 w-14 rounded-full"
        width="56"
        height="56"
      />
      <div className="flex flex-col">
        <div className="flex gap-1 text-slate-300">
          <span>{authorHandle}</span>
          <span className="font-thin">{posted}</span>
        </div>

        <span className="text-2xl">{content}</span>
      </div>
    </div>
  );
};

export const Feed = () => {
  const { data: posts, isLoading } = api.posts.getAll.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  if (isLoading) return <LoadingPage />;
  if (!posts) return <div>Error while fetching posts</div>;
  if (!posts.length) return <div>No posts</div>;

  return (
    <div className="flex flex-col">
      {posts?.map(fullPost => (
        <PostView key={fullPost.post.id} {...fullPost} />
      ))}
    </div>
  );
};
