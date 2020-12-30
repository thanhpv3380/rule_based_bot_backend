const groupActionService = require('../services/groupAction');

const getAllGroupAction = async (req, res) => {
  const { actions, metadata } = await groupActionService.findAll();
  return res.send({ status: 1, results: { actions, metadata } });
};

const getGroupActionById = async (req, res) => {
  const { id } = req.params;
  const groupAction = await groupActionService.findById({ id });
  return res.send({ status: 1, results: groupAction });
};

const createGroupAction = async (req, res) => {
  const { name } = req.body;
  const groupAction = await groupActionService.createGroupAction({ name });
  return res.send({ status: 1, results: groupAction });
};

const updateGroupAction = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const groupAction = await groupActionService.updateGroupAction({ id, name });
  return res.send({ status: 1, results: groupAction });
};

const deleteGroupAction = async (req, res) => {
  const { id } = req.params;
  await groupActionService.deleteGroupAction({ id });
  return res.send({ status: 1 });
};

module.exports = {
  getAllGroupAction,
  getGroupActionById,
  createGroupAction,
  updateGroupAction,
  deleteGroupAction,
};
