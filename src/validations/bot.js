const { Joi, validate } = require('express-validation');

const create = {
  body: Joi.object({
    name: Joi.string().trim().lowercase().required(),
  }),
};

module.exports = {
  createValidate: validate(create, { keyByField: true }),
};
