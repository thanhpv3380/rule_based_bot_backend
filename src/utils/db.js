const findAll = async ({
  model,
  key,
  searchFields,
  query,
  offset, // offset = (pageIndex - 1) * pageSize
  limit, // pageSize
  fields, // select
  sort,
  populate, // ref model
  queryCommon,
} = {}) => {
  const newSort = sort ? sort.split(',') : ['createdAt_desc'];
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
    key ? { $or: s, ...query, ...queryCommon } : { ...query, ...queryCommon },
  );
  const total = await model.estimatedDocumentCount(queryCommon);
  const documents = await model
    .find(
      key ? { $or: s, ...query, ...queryCommon } : { ...query, ...queryCommon },
    )
    .populate(populate)
    .skip(offset || 0)
    .limit(limit || null)
    .sort(
      newSort
        ? JSON.parse(
            `{${newSort
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

const findByCondition = async (model, condition, fields) => {
  const document = await model
    .findOne(condition)
    .select(
      fields
        ? JSON.parse(`{${fields.map((element) => `"${element}":1`).join(',')}}`)
        : {},
    )
    .lean();
  return document;
};

module.exports = { findAll, findByCondition };
