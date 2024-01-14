export const metadata = {
  title: 'post',
};

const SinglePostPage = ({ params: { id } }: { params: { id: string } }) => {
  const a = JSON.stringify({ id }, null, 2);

  return <div>{a}</div>;
};

export default SinglePostPage;
