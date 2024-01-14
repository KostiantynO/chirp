import { auth, SignInButton } from '@clerk/nextjs';

import { CreatePostWizard } from './_components/CreatePostWizard';
import { Feed } from './_components/Feed';

const Home = () => {
  const user = auth();

  if (!user) return null;

  return (
    <>
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
    </>
  );
};

export default Home;
