'use client';

import { useState } from 'react';

import { api } from '~/trpc/react';

import type { ChangeEvent, FormEvent } from 'react';

export const CreatePostForm = () => {
  const [input, setInput] = useState('');

  const utils = api.useUtils();

  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    async onSuccess() {
      setInput('');
      await utils.posts.getAll.invalidate();
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

      <button type="submit" disabled={isPosting}>
        Post
      </button>
    </form>
  );
};
