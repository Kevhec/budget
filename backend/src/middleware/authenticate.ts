import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../database/models';

interface JWTPayload {
  id: string
}

const authenticate: RequestHandler = async (req, res, next) => {
  const sessionCookie = req.cookies.jwt;

  if (!sessionCookie) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decodedJWT = jwt.verify(sessionCookie, process.env.SECRET_KEY || '') as JWTPayload;
    const user = await User.findByPk(decodedJWT.id, {
      attributes: {
        exclude: ['password'],
      },
    });

    if (!user) {
      return res.status(401).json('User not found');
    }

    req.user = user;

    return next();
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('ERROR: ', error.message);
    }
    return res.status(401).json('Invalid token');
  }
};

export default authenticate;
