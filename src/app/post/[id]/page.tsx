'use client';
import { useParams } from 'next/navigation';

const SinglePostPage = () => {
  const { id } = useParams<{ id: string }>();

  const a = JSON.stringify({ id }, null, 2)

  return <div>{a}</div>;
};

export default SinglePostPage;
