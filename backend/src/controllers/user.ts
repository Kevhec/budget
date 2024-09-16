import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { User } from '../database/models';
import { guestSchema, userSchema } from '../database/schemas/user';
import generateJWT from '../lib/utils/generateJWT';
import convert from '../lib/utils/convert';
import { REMEMBER_ME_EXPIRATION_TIME_DAYS, SESSION_EXPIRATION_TIME_DAYS } from '../lib/constants';
import verificationEmail from '../lib/utils/verificationEmail';
import sanitizeObject from '../lib/utils/sanitizeObject';
import setCookie from '../lib/utils/setCookie';

const signUp = async (req: Request, res: Response) => {
  const { error, value } = userSchema.validate(req.body);

  if (error) {
    return res.status(400).json(error.details[0].message);
  }

  try {
    // Generate salt to properly hash the password
    const salt = await bcrypt.genSalt(10);

    // Apply a hashing process to the password
    const data = {
      ...value,
      password: await bcrypt.hash(value.password, salt),
    };

    // Create a new user,
    const newUser = await User.create(data);

    // If user is successfully created, generate a jwt using env secret key
    // and send it through a cookie to the client
    if (!newUser) {
      return res.status(409).json('Details are not correct');
    }

    // Testing email delivered@resend.dev
    await verificationEmail('delivered@resend.dev', newUser.token || '');

    const plainUserObj = newUser.toJSON();

    // Sanitize user object in order to avoid sending sensitive data to frontend
    const sanitizedUser = sanitizeObject(plainUserObj, ['password', 'token']);

    // Send user
    return res.status(201).json({ data: sanitizedUser });
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.error(e.message);
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const confirm = async (req: Request, res: Response) => {
  const { token } = req.params;

  try {
    // Find user which token matches the one sent to it's email
    const userToConfirm = await User.findOne({ where: { token } });

    if (!userToConfirm) {
      return res.status(404).json('Invalid or expired token.');
    }

    // Update user's record as a confirmed user
    await userToConfirm.update({
      token: null,
      confirmed: true,
    });

    return res.status(200).json({ data: 'User confirmed successfully.' });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    }
    return res.status(500).json('Internal server error');
  }
};

const logIn = async (req: Request, res: Response) => {
  try {
    const { email, password, remember } = req.body;

    // Set different token expiration time if user want's to be remembered
    const expirationTime = remember
      ? REMEMBER_ME_EXPIRATION_TIME_DAYS
      : SESSION_EXPIRATION_TIME_DAYS;

    // Find user by their email
    const user = await User.findOne({
      where: {
        email,
      },
    });

    // If user is found, compare provided password with bcrypt
    if (!user) {
      return res.status(401).json('Authentication failed');
    }
    const isSame = await bcrypt.compare(password, user.password);

    // If it's a match, generate a jwt and send it through a session cookie
    if (isSame) {
      const token = generateJWT({ id: user?.id }, convert(expirationTime, 'day', 'second'));

      res.cookie('jwt', token, {
        maxAge: convert(expirationTime, 'day', 'ms'),
        httpOnly: true,
        sameSite: 'none',
      });

      const plainUserObj = user.toJSON();

      // Sanitize user object to send it to client for profiling purposes
      const sanitizedUser = sanitizeObject(plainUserObj, ['password', 'token']);

      // send user data
      return res.status(201).json({ data: sanitizedUser });
    }
    return res.status(401).json('Authentication failed');
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    }
    return res.status(500).json('Internal server error');
  }
};

const logOut = async (req: Request, res: Response) => {
  const { user } = req;

  try {
    // If user is a guest delete it's account so db is not overloaded with guest accounts
    if (user?.role === 'guest') {
      await user.destroy();
    }

    // If it's a normal user just clear the session cookie
    res.clearCookie('jwt', { httpOnly: true });
    return res.status(200).json({ data: { message: 'Logged out successfully' } });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
    return res.status(500).json('Internal server error');
  }
};

const loginAsGuest = async (req: Request, res: Response) => {
  const { error, value } = guestSchema.validate(req.body);

  if (error) {
    return res.status(400).json(error.details[0].message);
  }

  // Create a new user with guest role and provided username
  try {
    const newGuest = await User.create({
      ...value,
      role: 'guest',
    });

    // generate jwt for guest user with one week expiration in order to avoid
    // unused guest users in database
    const token = generateJWT({ id: newGuest.id }, convert(7, 'day', 'second'));

    // set the same maxAge for cookies but in ms
    setCookie(res, 'jwt', token, {
      maxAge: convert(7, 'day', 'ms'),
    });

    const plainUserObj = newGuest.toJSON();

    const sanitizedUser = sanitizeObject(plainUserObj, ['password', 'token', 'email']);

    // Send user
    return res.status(201).json({ data: sanitizedUser });
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.error('Error: ', e.message);
    }
    return res.status(500).json('Internal server error');
  }
};

const getInfo = async (req: Request, res: Response) => {
  try {
    const { user } = req;

    if (!user) {
      return res.status(404).json('User not found.');
    }

    const plainUserObj = user.toJSON();

    // Remove sensitive or unnecessary data from user object to use for profiling purposes
    const sanitizedUser = sanitizeObject(plainUserObj, ['password', 'token', 'email']);

    return res.status(200).json({ data: sanitizedUser });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    }
    return res.status(500).json('Internal server error');
  }
};

export {
  signUp,
  confirm,
  logIn,
  logOut,
  loginAsGuest,
  getInfo,
};
