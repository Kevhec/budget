import convert from './utils/convert';

const SESSION_EXPIRATION_TIME_DAYS = convert(120, 'hour', 'day');
const REMEMBER_ME_EXPIRATION_TIME_DAYS = 30;

const dateStringRegex = /^\d{4}-(0[1-9]|1[0-2])$/;

export {
  REMEMBER_ME_EXPIRATION_TIME_DAYS,
  SESSION_EXPIRATION_TIME_DAYS,
  dateStringRegex,
};
