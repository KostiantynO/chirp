import { auth, SignInButton, SignOutButton,   } from '@clerk/nextjs';

const Home = async () => {
  const user = auth();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div>
        {!user && <SignInButton />}
        {!!user && <SignOutButton />}
      </div>
    </main>
  );
};

export default Home;
