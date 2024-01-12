import { auth, SignInButton, SignOutButton } from '@clerk/nextjs';

import { api } from '~/trpc/server';

const Home = async () => {
  const user = auth();

  const posts = await api.post.getAll.query();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div>
        {!user && <SignInButton />}
        {!!user && <SignOutButton />}
      </div>

      <div>
        {posts?.map(({ content, id }) => <div key={id}>{content}</div>)}
      </div>
    </main>
  );
};

export default Home;
