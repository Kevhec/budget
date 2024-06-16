import { Request, Response, NextFunction } from 'express';
import { Model, ModelStatic } from 'sequelize';

function authorizeAccess(
  model: ModelStatic<Model>,
) {
  return (async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user } = req;
      const { id } = req.body;

      const element = await model.findOne({
        where: {
          id,
          UserId: user?.id,
        },
      });

      if (!element) {
        return res.status(403).json('Forbidden: You do not have access to this resource');
      }

      req.element = element;

      return next();
    } catch (error: any) {
      return res.status(401).json('Invalid token');
    }
  });
}

export default authorizeAccess;
