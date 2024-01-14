import { PostView } from '~/app/_components/PostView';
import { api } from '~/trpc/server';

import type { Metadata } from 'next';

interface Props {
  params: { id: string };
}

const getPost = async (id: string) =>
  await api.posts.getById.query({ id: Number(id) });

export const generateMetadata = async ({
  params: { id },
}: Props): Promise<Metadata> => {
  const post = await getPost(id);
  if (!post) return {};

  const {
    author: { username },
    post: { content },
  } = post;

  return { title: `${content} - ${username}` };
};

const SinglePostPage = async ({ params: { id } }: Props) => {
  const post = await getPost(id);
  if (!post) return null;

  return <PostView {...post} />;
};

export default SinglePostPage;
