const CustomError = require('../errors/CustomError');
const errorCodes = require('../errors/code');

const intentDao = require('../daos/intent');
const groupIntentDao = require('../daos/groupIntent'); 
 
const createIntent = async ({
  data, groupIntentId, botId,
}) => {
  const intentExist = await intentDao.findIntentByName({ name : data.name });
  if (intentExist) {
    throw new CustomError(errorCodes.INTENT_NAME_EXIST);
  }
  const intent = await intentDao.createIntent(data);
  if(!groupIntentId){
    await groupIntentDao.createGroupIntent({ botId, isGroup: false});
  } else {
    await groupActionDao.addIntentInGroup(groupIntentId, intent.id);
  }
  return intent;
};

const updateIntent = async ({
  id, data, groupIntentId
}) => {
  const intentNameExist = await intentDao.findIntentByName({ name : intent.name });
  if(intentNameExist.id !== id){
    throw new CustomError(errorCodes.INTENT_NAME_EXIST);
  } 
  const intent = await intentDao.updateIntent(id, data);
  if(groupIntentId !== null){
    await groupIntentDao.removeIntentInGroup(groupIntentId, id);
    await groupIntentDao.addIntentInGroup(groupIntentId, id);  
  }
  return intent;
};

// const findIntentByUserId = async (userId) => {
//   const createBy = userId;
//   const intent = await intentnDao.findIntent(createBy);
//   return intent;
// };

const findIntentById = async (id) => {
    const intent = await intentnDao.findIntentById(id);
    if (!action) {
      throw new CustomError(errorCodes.INTENT_NOT_EXIST);
    }
    return action;
};

const deleteIntentById = async (id) => {
  await intentnDao.deleteIntent(id);
};

module.exports = {
  createIntent,
  updateIntent,
//   findIntentByUserId,
  findIntentById,
  deleteIntentById,
};
