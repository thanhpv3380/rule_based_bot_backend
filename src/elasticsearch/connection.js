const elasticsearch = require('elasticsearch');

const {
  ELASTIC_HOST,
  ELASTIC_PORT,
  ELASTIC_USERNAME,
  ELASTIC_PASSWORD,
} = process.env;

const client = new elasticsearch.Client({
  hosts: [`${ELASTIC_HOST}:${ELASTIC_PORT}`],
  httpAuth: `${ELASTIC_USERNAME}:${ELASTIC_PASSWORD}`,
});

module.exports = client;
