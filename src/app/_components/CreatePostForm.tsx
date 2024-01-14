'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

import { api } from '~/trpc/react';

import { LoadingSpinner } from './loading';

import type { ChangeEvent, FormEvent } from 'react';

export const CreatePostForm = () => {
  const [input, setInput] = useState('');

  const utils = api.useUtils();

  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    async onSuccess() {
      setInput('');
      await utils.posts.getAll.invalidate();
    },
    onError(error) {
      const errorMessage =
        error.data?.zodError?.fieldErrors.content?.[0] ?? 'Failed to post!';

      toast.error(errorMessage);
    },
  });

  const onChangeSetInput = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate({ content: input });
  };

  return (
    <form className="flex w-full gap-3" onSubmit={onSubmit}>
      <input
        type="text"
        value={input}
        placeholder="Type some emojis!"
        className="grow bg-transparent outline-none"
        disabled={isPosting}
        onChange={onChangeSetInput}
      />

      {input && !isPosting && (
        <button type="submit" disabled={isPosting}>
          Post
        </button>
      )}

      {isPosting && (
        <div className="flex items-center justify-center ">
          <LoadingSpinner size={20} />
        </div>
      )}
    </form>
  );
};
