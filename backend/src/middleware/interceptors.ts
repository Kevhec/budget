/* eslint-disable func-names */
import { RequestHandler } from 'express';

interface FormattedBody<T> {
  status: number,
  data?: T,
  error?: string,
}

const responseInterceptor: RequestHandler = (req, res, next) => {
  const oldDotJson = res.json;
  const oldStatusCode = res.status;

  let { statusCode } = res;

  res.status = function (code) {
    statusCode = code;
    return oldStatusCode.call(this, code);
  };

  res.json = function (body) {
    const formattedBody: FormattedBody<typeof body> = {
      status: statusCode,
    };

    if (statusCode >= 400) {
      formattedBody.error = body;
    } else {
      formattedBody.data = body;
    }
    // Call the original res.send method with the formatted body
    return oldDotJson.call(res, formattedBody);
  };

  next();
};

export default responseInterceptor;
