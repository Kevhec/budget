import { CookieOptions, type Response } from 'express';

const setCookie = (res: Response, name: string, val: string, options: CookieOptions = {}) => {
  const defaultOptions: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // true if in production
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // 'None' for production, 'Lax' for development
    // Domain can be specified if needed
  };

  // Merge default options with provided options
  const cookieOptions = { ...defaultOptions, ...options };

  res.cookie(name, val, cookieOptions);
};

export default setCookie;
