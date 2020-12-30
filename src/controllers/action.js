const actionService = require('../services/action');

const getAllActions = async (req, res) => {
  const { id } = req.params;
  const actions = await actionService.findAll({ id });
  return res.send({ status: 1, result: actions });
};

const getActionById = async (req, res) => {};

const addAction = async (req, res) => {};

const updateAction = async (req, res) => {};

const deleteAction = async (req, res) => {};

module.exports = {
  getAllActions,
  getActionById,
  addAction,
  updateAction,
  deleteAction,
};
