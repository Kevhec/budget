import jwt from 'jsonwebtoken';

function generateJWT(payload: any, expiration?: string | number) {
  return jwt.sign(payload, process.env.SECRET_KEY || '', {
    expiresIn: expiration,
  });
}

export default generateJWT;
