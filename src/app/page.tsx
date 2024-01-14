import { auth, SignInButton, SignOutButton } from '@clerk/nextjs';

import { CreatePostWizard } from './_components/CreatePostWizard';
import { Feed } from './_components/Feed';

const Home = () => {
  const user = auth();

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
