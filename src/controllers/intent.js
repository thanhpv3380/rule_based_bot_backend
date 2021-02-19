const intentService = require('../services/intent');

const create = async (req, res) => {
  const { name, patterns, isMappingAction, mappingAction, isActive, parameters, groupIntentId } = req.body;
  let data = {
    name,
    isActive,
    patterns,
    isMappingAction,
    mappingAction,
    parameters,
  }
  const intent = await intentService.createIntent({ data, groupIntentId });
  return res.send({ status: 1, result: intent });
};

const update = async (req, res) => {
  const { name,
    isActive,
    patterns,
    isMappingAction,
    mappingAction,
    parameters,
    groupIntentId
   } = req.body;
  const { id } = req.param;
  var data = {
    name,
    isActive,
    patterns,
    isMappingAction,
    mappingAction,
    parameters
  }
  const intent = await intentService.updateIntent({id ,data, groupIntentId});
  return res.send({ status: 1, result: intent });
};

const updatePatternOfIntent = async (req, res) => {
  const { id } = req.params;
  const {
    pattern
  } = req.body;
  const intent = await intentService.updatePatternOfIntent({id ,pattern});
  return res.send({ status: 1, result: intent });
}

const getIntent = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const intent = await intentService.findIntentById(id);
  res.send({ status: 1, result: intent });
};


const deleteIntent = async(req, res) => {
  const { id } = req.params;
  await intentService.deleteIntentById(id);
  res.send({ status: 1 });
}

const deletePatternOfIntent = async (req, res) => {
  const { id } = req.params;
  await intentService.deletePatternOfIntentById(id);
  res.send({ status: 1 });
}

module.exports = { create, update, updatePatternOfIntent, deletePatternOfIntent, getIntent, deleteIntent };
