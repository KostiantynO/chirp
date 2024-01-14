import { currentUser } from '@clerk/nextjs';
import Image from 'next/image';

import { CreatePostForm } from './CreatePostForm';

export const CreatePostWizard = async () => {
  const user = await currentUser();

  if (!user) return null;

  const { imageUrl, username } = user;

  return (
    <div className="flex w-full gap-3">
      <Image
        src={imageUrl}
        alt={`${username}'s avatar`}
        className="h-14 w-14 rounded-full"
        width="56"
        height="56"
        priority
      />
      <CreatePostForm />
    </div>
  );
};
