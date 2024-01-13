import { auth, currentUser, SignInButton, SignOutButton } from '@clerk/nextjs';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Image from 'next/image';

import { api } from '~/trpc/server';

import { LoadingPage, LoadingSpinner } from './_components/loading';

import type { RouterOutputs } from '~/trpc/shared';

dayjs.extend(relativeTime);

const CreatePostWizard = async () => {
  const user = await currentUser();
  if (!user) return null;
  const { imageUrl, username } = user;

  return (
    <div className="flex w-full  gap-3">
      <Image
        src={imageUrl}
        alt={`${username}'s avatar`}
        className="h-14 w-14 rounded-full"
        width="56"
        height="56"
      />

      <input
        type="text"
        className="grow bg-transparent outline-none"
        placeholder="Type some emojis!"
      />
    </div>
  );
};

type PostWithUser = RouterOutputs['posts']['getAll'][number];

const PostView = ({
  author: { imageUrl, username },
  post: { id, content, createdAt },
}: PostWithUser) => (
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
        <span>{`@${username}`}</span>
        <span className="font-thin">{`• ${dayjs(createdAt).fromNow()}`}</span>
      </div>

      <span>{content}</span>
    </div>
  </div>
);

const Feed = async () => {
  const posts = await api.posts.getAll.query();
  if (!posts) return <LoadingPage />;
  if (!posts.length) return <div>No posts</div>;

  return (
    <div className="flex flex-col">
      {posts?.map(fullPost => (
        <PostView key={fullPost.post.id} {...fullPost} />
      ))}
    </div>
  );
};

const Home = async () => {
  const user = auth();

  // start fetching asap
  api.posts.getAll.query().catch(console.error);

  if (!user) return null;

  return (
    <main className="flex h-screen justify-center ">
      <div className="h-full w-full border-x border-slate-400 md:max-w-2xl">
        <div className="flex border-b border-slate-400 p-4">
          {!user && (
            <div className="flex justify-center">
              <SignInButton />
            </div>
          )}
          {!!user && (
            <>
              <CreatePostWizard />
              <SignOutButton />
            </>
          )}
        </div>

        <Feed />
      </div>
    </main>
  );
};

export default Home;
