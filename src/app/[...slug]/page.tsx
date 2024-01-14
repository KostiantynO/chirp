import Image from 'next/image';

import { api } from '~/trpc/server';

import type { Metadata } from 'next';

type Props = {
  params: { slug: string[] };
};

const checkSlug = (slug?: string) => {
  if (!slug) {
    throw new Error('No slug');
  }

  const decoded = decodeURIComponent(slug);

  if (!decoded.startsWith('@')) {
    throw new Error('username should start with @');
  }

  return decoded.replace('@', '');
};

export const generateMetadata = async ({
  params: {
    slug: [firstParam],
  },
}: Props): Promise<Metadata> => ({ title: checkSlug(firstParam) });

const ProfilePage = async ({
  params: {
    slug: [firstParam],
  },
}: Props) => {
  const name = checkSlug(firstParam);

  const user = await api.profile.getUserByUsername.query({
    username: name,
  });

  if (!user) {
    return <div>No user info</div>;
  }

  const { username, imageUrl } = user;

  const nameHandle = `@${username}`;

  return (
    <>
      <div className="relative h-36 bg-slate-600">
        <Image
          src={imageUrl}
          alt={`${username}s avatar`}
          width={128}
          height={128}
          className="absolute bottom-0 left-0 -mb-16 ml-4 rounded-full border-4 border-black bg-black"
          priority
        />
      </div>
      <div className="h-16" />
      <div className="p-4 text-2xl font-bold">{nameHandle}</div>
      <div className="w-full border-b border-slate-400" />
    </>
  );
};

export default ProfilePage;
