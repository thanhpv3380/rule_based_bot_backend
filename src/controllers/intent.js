const intentService = require('../services/intent');

const create = async (req, res) => {
  const { name, patterns, isMappingAction, mappingAction, isActive, parameters, groupIntentId } = req.body;
  var data = {
    name : name,
    isActive : isActive,
    patterns : patterns,
    isMappingAction : isMappingAction,
    mappingAction : mappingAction,
    parameters: parameters,
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
    name : name,
    isActive : isActive,
    patterns : patterns,
    isMappingAction : isMappingAction,
    mappingAction : mappingAction,
    parameters: parameters
  }
  const intent = await intentService.updateIntent({id ,data, groupIntentId});
  return res.send({ status: 1, result: intent });
};

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

module.exports = { create, update, getIntent, deleteIntent };
