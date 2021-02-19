const CustomError = require('../errors/CustomError');
const errorCodes = require('../errors/code');

const intentDao = require('../daos/intent');
const groupIntentDao = require('../daos/groupIntent'); 
const intent = require('../models/intent');
 
const createIntent = async ({
  data, groupIntentId, botId,
}) => {
  const intentExist = await intentDao.findIntentByName({ name : data.name });
  console.log(intentExist, "tt")
  if (intentExist) {
    throw new CustomError(errorCodes.INTENT_NAME_EXIST);
  }
  const intent = await intentDao.createIntent(data);
  if(!groupIntentId){
    await groupIntentDao.createGroupIntent({ botId, isGroup: false, intentId : [intent.id] });
  } else {
    await groupActionDao.addIntentInGroup(groupIntentId, intent.id);
  }
  return intentExist;
};

const updateIntent = async ({
  id, data, groupIntentId
}) => {
  const intentNameExist = await intentDao.findIntentByName({ name : intent.name });
  if(intentNameExist.id !== id) {
    throw new CustomError(errorCodes.INTENT_NAME_EXIST);
  } 
  const intent = await intentDao.updateIntent(id, data);
  if(groupIntentId !== null) {
    await groupIntentDao.removeIntentInGroup(groupIntentId, id);
    await groupIntentDao.addIntentInGroup(groupIntentId, id);  
  }
  return intent;
};

const updatePatternOfIntent = async ({
  id, pattern
}) => {
  let intent = await intentDao.findIntentById(id);
  if(!intent) {
    throw new CustomError(errorCodes.INTENT_NOT_EXIST);
  } 
  if(intent.patterns.includes(pattern)){
    throw new CustomError(errorCodes.PATTERN_EXIST);
  }
  intent.patterns.push(pattern);
  await intentDao.updateIntent(id, intent);
  return intent;
}

// const findIntentByUserId = async (userId) => {
//   const createBy = userId;
//   const intent = await intentnDao.findIntent(createBy);
//   return intent;
// };

const findIntentById = async (id) => {
    const intent = await intentDao.findIntentById(id);
    if (!intent) {
      throw new CustomError(errorCodes.INTENT_NOT_EXIST);
    }
    return intent;
};

const deleteIntentById = async (id) => {
  await intentnDao.deleteIntent(id);
};

const deletePatternOfIntentById = async ({id, pattern}) => {
  let intent = await intentDao.findIntentById(id);
  if(!intent) {
    throw new CustomError(errorCodes.INTENT_NOT_EXIST);
  } 
  const patterns = intent.patterns;
  let index = patterns.indexOf(pattern);
  if(index < 1) {
    throw new CustomError(errorCodes.PATTERN_NOT_FOUND);
  }
  const newPatterns = patterns.filter(item => item !== pattern);
  intent.patterns = newPatterns;
  await intentDao.updateIntent(id, intent);
  return intent;
}

module.exports = {
  createIntent,
  updateIntent,
  updatePatternOfIntent,
//   findIntentByUserId,
  findIntentById,
  deleteIntentById,
  deletePatternOfIntentById,
};
