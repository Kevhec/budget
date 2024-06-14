import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models';
import { guestSchema, userSchema } from '../schemas/user';

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
    if (newUser) {
      const token = jwt.sign({ id: newUser.id }, process.env.SECRET_KEY || '', {
        expiresIn: '7d',
      });

      res.cookie('jwt', token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      // Send user
      return res.status(201).json(newUser);
    }
    return res.status(409).json('Details are not correct');
  } catch (e: any) {
    console.error(e.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user by their email
    const user = await User.findOne({
      where: {
        email,
      },
    });

    // If user is found, compare provided password with bcrypt
    if (user) {
      const isSame = await bcrypt.compare(password, user.password);

      // If match generate a jwt using secret key
      if (isSame) {
        const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY || '', {
          expiresIn: '7d',
        });

        res.cookie('jwt', token, {
          maxAge: 7 * 24 * 60 * 60 * 1000,
          httpOnly: true,
        });

        // send user data
        return res.status(201).send(user);
      }

      return res.status(401).send('Authentication failed');
    }
    return res.status(401).send('Authentication failed');
  } catch (error: any) {
    console.error(error.message);
    return res.status(500).json('Internal server error');
  }
};

const loginAsGuest = async (req: Request, res: Response) => {
  const { error, value } = guestSchema.validate(req.body);

  if (error) {
    return res.status(400).json(error.details[0].message);
  }

  try {
    const newGuest = await User.create({
      ...value,
      role: 'guest',
    });

    const token = jwt.sign({ id: newGuest.id }, process.env.SECRET_KEY || '', {
      expiresIn: '7d',
    });

    res.cookie('jwt', token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    // Send user
    return res.status(201).json(newGuest);
  } catch (e: any) {
    return res.status(500).json('Internal server error');
  }
};

export {
  signUp,
  login,
  loginAsGuest,
};
