'use client';
import { LoadingPage } from '~/app/_components/loading';
import { api } from '~/trpc/react';

import { PostView } from './PostView';

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
