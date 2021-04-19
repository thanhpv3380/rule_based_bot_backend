const slotService = require('../services/slot');

const getAllSlot = async (req, res) => {
  const { bot } = req;
  const { fields, sort } = req.query;

  const { slots, metadata } = await slotService.findAllSlot({
    botId: bot.id,
    fields,
    sort,
  });
  return res.send({ status: 1, result: { slots, metadata } });
};

const getSlotById = async (req, res) => {
  const { id } = req.params;
  const slot = await slotService.findSlotById(id);
  return res.send({ status: 1, result: { slot } });
};

const createSlot = async (req, res) => {
  const { bot } = req;
  const { name, dataType, slotType, customData } = req.body;
  const slot = await slotService.createSlot({
    name,
    dataType,
    slotType,
    customData,
    botId: bot.id,
  });
  return res.send({ status: 1, result: { slot } });
};

const updateSlot = async (req, res) => {
  const { id } = req.params;
  const { bot } = req;
  const data = req.body;
  const slot = await slotService.updateSlot(id, data, bot.id);
  return res.send({ status: 1, result: { slot } });
};

const deleteSlot = async (req, res) => {
  const { id } = req.params;
  await slotService.deleteSlot(id);
  return res.send({ status: 1 });
};

module.exports = {
  getAllSlot,
  getSlotById,
  createSlot,
  updateSlot,
  deleteSlot,
};
