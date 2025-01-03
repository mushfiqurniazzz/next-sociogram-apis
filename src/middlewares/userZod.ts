import { z } from 'zod';

const userSignup = z.object({
  name: z.string().min(1, 'Name is required.'),
  userName: z.string().min(1, 'Username is required.'),
  email: z.string().email('Invalid email format.'),
  telePhone: z.string().optional().nullable(),
  gender: z.enum(['male', 'female']),
  bio: z.string().optional().nullable(),
  following: z
    .array(z.string().min(24, 'Invalid id format.'))
    .optional()
    .nullable(),
  password: z.string().min(6, 'Password is required of 6 characters.'),
  confirmPassword: z.string().min(6, 'Password is required of 6 characters.'),
});

const userLogin = z
  .object({
    userName: z.string().optional(),
    email: z.string().optional(),
    telePhone: z.string().optional(),
    password: z.string().min(6, 'Password is required of 6 characters.'),
  })
  .refine((data) => data.userName || data.email || data.telePhone, {
    message: 'At least one field must be provided.',
  });

const updateProfile = z.object({
  name: z.string().min(1, 'Name is required.'),
  userName: z.string().min(1, 'Username is required.'),
  email: z.string().email('Invalid email format.'),
  telePhone: z.string().optional(),
  gender: z.enum(['male', 'female']),
  profilePic: z.string().url().optional(),
  bio: z.string(),
});

const follow_UnfollowUser = z.object({
  id: z.string().min(24, 'Invalid id format.'),
});

const verificationCodeAuth = z.object({
  email: z.string().email('Invalid email format.'),
  code: z.string().min(6, 'Code should be of 6 characters'),
});

const verificationCodeDelete = z.object({
  code: z.string().min(6, 'Code should be of 6 characters'),
});

const updatePassword = z.object({
  previousPassword: z.string().min(6, 'Password is required of 6 characters.'),
  newPassword: z.string().min(6, 'Password is required of 6 characters.'),
  confirmNewPassword: z
    .string()
    .min(6, 'Password is required of 6 characters.'),
});

const forgotPassword = z.object({
  code: z.string().min(6, 'Code should be of 6 characters'),
  newPassword: z.string().min(6, 'Password is required of 6 characters.'),
  confirmNewPassword: z
    .string()
    .min(6, 'Password is required of 6 characters.'),
});

export {
  userSignup,
  userLogin,
  updateProfile,
  follow_UnfollowUser,
  verificationCodeAuth,
  verificationCodeDelete,
  updatePassword,
  forgotPassword,
};
