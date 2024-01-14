'use client';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Image from 'next/image';
import Link from 'next/link';

import type { RouterOutputs } from '~/trpc/shared';

dayjs.extend(relativeTime);

type PostWithUser = RouterOutputs['posts']['getAll'][number];

export const PostView = ({
  author: { imageUrl, username },
  post: { id, content, createdAt },
}: PostWithUser) => {
  const authorHandle = `@${username}`;
  const postRelativeUrl = `post/${id}`;
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
          <Link href={authorHandle}>
            <span>{authorHandle}</span>
          </Link>

          <Link href={postRelativeUrl}>
            <span className="font-thin">{posted}</span>
          </Link>
        </div>

        <span className="text-2xl">{content}</span>
      </div>
    </div>
  );
};
