const codes = require('./code');

const getErrorMessage = (code) => {
  switch (code) {
    case codes.USER_NOT_FOUND:
      return 'User is not found';
    case codes.WRONG_PASSWORD:
      return 'Wrong password';
    case codes.ITEM_EXIST:
      return 'Item existed';
    case codes.ITEM_NOT_CHANGE:
      return 'Item not change';
    case codes.ITEM_NAME_EXIST:
      return 'Name is exist';
    default:
      return null;
  }
};

module.exports = getErrorMessage;
