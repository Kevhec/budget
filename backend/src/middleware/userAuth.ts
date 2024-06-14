// importing modules
import { RequestHandler } from 'express';
import { User } from '../models';
// Assigning db.users to User variable

// Function to check if username or email already exist in the database
// this is to avoid having two users with the same username and email
const saveUser: RequestHandler = async (req, res, next) => {
  // search the database to see if user exist
  try {
    // checking if email already exist
    const emailCheck = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    // if email exist in the database respond with a status of 409
    if (emailCheck) {
      return res.status(409).json(
        'The email address is already in use. Please use a different email address or log in to your existing account.',
      );
    }

    return next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// exporting module
export default saveUser;
