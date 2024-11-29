import { Model, Includeable, ModelStatic } from 'sequelize';

interface Options {
  models: {
    identifier: string
    model: ModelStatic<Model>
    attributes?: string[]
    as?: string
  }[];
}

function parseIncludes(includeString: string, options: Options): Includeable[] {
  if (!includeString) return [];

  const includesArr = includeString.split(',');

  const includedModels: Includeable[] = [];

  options.models.forEach((item) => {
    if (includesArr.includes(item.identifier)) {
      includedModels.push({
        model: item.model,
        attributes: item.attributes,
        as: item.as,
      });
    }
  });

  return includedModels;
}

export default parseIncludes;
