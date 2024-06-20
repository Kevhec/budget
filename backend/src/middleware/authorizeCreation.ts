import { Request, Response, NextFunction } from 'express';
import { Model, ModelStatic } from 'sequelize';

function authorizeCreation(
  relatedModel?: ModelStatic<Model>,
  relatedIdField?: string,
) {
  return (async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user } = req;
      const relatedId = req.body[relatedIdField || ''];

      if (relatedId) {
        const relatedElement = await relatedModel?.findOne({
          where: {
            id: relatedId,
            UserId: user?.id,
          },
        });

        if (!relatedElement) {
          return res.status(403).json('Forbidden: You can not create in this resource');
        }

        req.relatedElement = relatedElement;
      }

      return next();
    } catch (error: any) {
      console.error('ERROR: ', error.message);
      return res.status(401).json('Invalid token');
    }
  });
}

export default authorizeCreation;
