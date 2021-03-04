/* eslint-disable radix */
const findAll = async ({
  model,
  key,
  searchFields,
  query,
  offset,
  limit,
  fields,
  sort = ['createdAt_desc'],
  populate,
} = {}) => {
  const s =
    searchFields &&
    searchFields
      .filter(
        (field) =>
          !(
            model.schema.paths[field].instance === 'Number' &&
            // eslint-disable-next-line no-restricted-globals
            isNaN(parseInt(key, 10))
          ),
      )
      .map((field) => {
        return model.schema.paths[field].instance === 'Number'
          ? { [field]: parseInt(key, 10) }
          : { [field]: new RegExp(key, 'g') };
      });

  const count = await model.countDocuments(
    key ? { $or: s, ...query } : { ...query },
  );
  const total = await model.estimatedDocumentCount();
  const documents = await model
    .find(key ? { $or: s, ...query } : { ...query })
    .populate(populate)
    .skip(parseInt(offset) || 0)
    .limit(parseInt(limit) || null)
    .sort(
      sort
        ? JSON.parse(
            `{${sort
              .map((element) => {
                const field = element.substring(0, element.lastIndexOf('_'));
                const value =
                  element.substring(element.lastIndexOf('_') + 1) === 'asc'
                    ? 1
                    : -1;
                return `"${field}":${value}`;
              })
              .join(',')}}`,
          )
        : { _id: 1 },
    )
    .select(
      fields
        ? JSON.parse(`{${fields.map((element) => `"${element}":1`).join(',')}}`)
        : {},
    )
    .lean();

  return {
    data: documents,
    metadata: { count, total },
  };
};

const findByCondition = async (model, condition, fields, populate) => {
  const document = await model
    .findOne(condition)
    .populate(populate)
    .select(
      fields
        ? JSON.parse(`{${fields.map((element) => `"${element}":1`).join(',')}}`)
        : {},
    )
    .lean();
  return document;
};

module.exports = { findAll, findByCondition };
