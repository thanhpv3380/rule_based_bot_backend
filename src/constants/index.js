module.exports = {
  A_WEEK: 7 * 86400 * 1000,
  DEFAULT: 1,
  GROUP: 2,
  GROUP_SINGLE: 3,
  GROUP_SINGLE_NAME: 'Not in Group',
  GROUP_SYSTEM_INTENT: 'System group intent',
  GROUP_SYSTEM_ACTION: 'System group action',
  GROUP_SYSTEM_ENTITY: 'System group entity',

  DEFAULT_REPLY: 'Xin lỗi tôi không hiểu ý bạn',

  INTENT_SYSTEM: 'Bắt đầu',
  ACTION_SYSTEM: 'Bắt đầu',

  PATTERN_SYSTEM: ['Bắt đầu'],
  ACTION_SYSTEM_TEXT: 'Im lặng',

  ENTITY_NAME_NONE: 'none',
  PATTERN_ENTITY_NONE: /^[a-zA-Z1-9àáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/,

  RECEIVE_QUEUE: 'request-rule-bot',
  SEND_QUEUE: 'live-chat',
  EXCHANGE: 'request-rule-bot',

  NODE_START: 'START',
  NODE_INTENT: 'INTENT',
  NODE_CONDITION: 'CONDITION',
  NODE_ACTION: 'ACTION',

  EQUAL: '=',
  GREATER: '>',
  LESS_THAN: '<',
  DIFFERENT: '!=',
  START_WITH: 'start with',
  OPERATOR_AND: 'and',
  OPERATOR_OR: 'or',

  ACTION_TEXT: 'TEXT',
  ACTION_MEDIA: 'MEDIA',
  ACTION_JSON_API: 'JSON_API',
  ACTION_OPTION: 'OPTION',

  STATUS_DEFAULT: 'DEFAULT',
  STATUS_ANSWERED: 'ANSWERED',
  STATUS_SILENCE: 'SILENCE',
  STATUS_NOT_UNDERSTAND: 'NOT UNDERSTAND',
  STATUS_NEED_CONFIRM: 'NEED CONFIRM',

  ROLE_EDITOR: 'EDITOR',
  ROLE_OWNER: 'OWNER',
};
