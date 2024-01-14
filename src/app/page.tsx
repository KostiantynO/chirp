import { auth, SignInButton } from '@clerk/nextjs';

import { CreatePostWizard } from './_components/CreatePostWizard';
import { Feed } from './_components/Feed';

const Home = () => {
  const user = auth();

  if (!user) return null;

  return (
    <main className="flex h-screen justify-center ">
      <div className="h-full w-full border-x border-slate-400 md:max-w-2xl">
        <div className="flex gap-6 border-b border-slate-400 p-4 pr-12">
          {!user && (
            <div className="flex justify-center">
              <SignInButton />
            </div>
          )}
          {!!user && (
            <>
              <CreatePostWizard />
            </>
          )}
        </div>

        <Feed />
      </div>
    </main>
  );
};

export default Home;
