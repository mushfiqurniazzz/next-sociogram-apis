import { z } from 'zod';

const createPost = z.object({
  caption: z.string().min(1, 'Caption cannot be empty.').optional().nullable(),
});

const reactPost = z.object({
  postId: z.string().min(24, 'Invalid id format.'),
});

const updatePost = z.object({
  postId: z.string().min(24, 'Invalid id format.'),
  caption: z.string().optional().nullable(),
});

export { createPost, reactPost, updatePost };
