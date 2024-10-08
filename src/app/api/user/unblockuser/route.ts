import DBConn from '@/lib/DBConn';
import { verifyToken } from '@/lib/jwt';
import { follow_UnfollowUser } from '@/middlewares/userZod';
import userModel from '@/models/userModel';
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export const PUT = async (req: Request) => {
  const verifyUser = verifyToken(process.env.JWT_SECRET as string, req);

  if (!verifyUser) {
    return NextResponse.json(
      {
        state: 'error',
        message: "Can't unblock this user, login first.",
      },
      {
        status: 401,
      },
    );
  }

  const userId = verifyUser.id;

  const data = await req.json();

  if (!data) {
    return NextResponse.json(
      {
        state: 'error',
        message: "Can't continue without id info to unblock.",
      },
      {
        status: 400,
      },
    );
  }

  try {
    const validateData = follow_UnfollowUser.parse(data);

    await DBConn();

    const foundUser = userModel.findById(validateData.id);

    if (!foundUser) {
      return NextResponse.json(
        {
          state: 'error',
          message: 'No user found with this id.',
        },
        {
          status: 400,
        },
      );
    }

    const retrieveUser = await userModel.findOne({ _id: userId });

    if (!retrieveUser.blockedUsers.includes(validateData.id)) {
      return NextResponse.json(
        {
          state: 'error',
          message: 'You did not block this user.',
        },
        {
          status: 403,
        },
      );
    }

    await userModel.findByIdAndUpdate(userId, {
      $pull: {
        blockedUsers: validateData.id,
      },
    });

    return NextResponse.json(
      {
        state: 'success',
        message: 'User unblocked',
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    if (error instanceof ZodError) {
      console.error('Unblock user validation failed', error.errors);
      return NextResponse.json(
        {
          state: 'error',
          message: 'Unblock user validation failed.',
          errors: error.errors[0].message,
        },
        {
          status: 400,
        },
      );
    }

    console.error('Unblock user failed', error);
    return NextResponse.json(
      {
        state: 'error',
        message: 'Something went wrong.',
      },
      {
        status: 500,
      },
    );
  }
};
