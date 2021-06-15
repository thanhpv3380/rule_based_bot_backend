const botService = require('../services/bot');

const getAllBotByRole = async (req, res) => {
  const { sort } = req.query;
  const { user } = req;
  const { bots, metadata } = await botService.findAllBotByRole({
    userId: user._id,
    sort,
  });

  return res.send({ status: 1, result: { bots, metadata } });
};

const addPermission = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  console.log(id);
  const bot = await botService.addPermission(id, data);
  return res.send({ status: 1, result: { bot } });
};

const deletePermission = async (req, res) => {
  const { id, userId } = req.params;
  const bot = await botService.deletePermission(id, userId);
  return res.send({ status: 1, result: { bot } });
};

const getBotById = async (req, res) => {
  const { id: botId } = req.params;
  const { user } = req;
  const bot = await botService.findBotById({ botId, userId: user._id });
  return res.send({ status: 1, result: { bot } });
};

const createBot = async (req, res) => {
  const { user } = req;
  const { name, description } = req.body;
  const bot = await botService.createBot(user._id, { name, description });
  return res.send({ status: 1, result: { bot } });
};

const updateBot = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const { user } = req;
  const bot = await botService.updateBot(id, user._id, data);
  return res.send({ status: 1, result: { bot } });
};

const deleteBot = async (req, res) => {
  const { id } = req.params;
  await botService.deleteBot(id);
  return res.send({ status: 1 });
};

const getBotByToken = async (req, res) => {
  const { botToken } = req.query;
  const bot = await botService.findBotByToken(botToken);
  return res.send({ status: 1, result: bot });
};

const getRoleInBot = async (req, res) => {
  const { id } = req.params;
  const { user } = req;

  const role = await botService.findRoleInBot({ botId: id, userId: user._id });
  return res.send({ status: 1, result: { role } });
};

const getExportFile = async (req, res) => {
  const { id } = req.params;
  const { data, name } = await botService.getFileExportOfBot(id);
  res.set('Content-Type', 'application/octet-stream');
  res.set('Content-Disposition', `attachment; filename=${name}.zip`);
  res.set('Content-Length', data.length);
  res.send(data);
};

const importFile = async (req, res) => {
  const { id } = req.params;
  const file = req.files;
  const data = await botService.importFile(id, file);
  return res.send({ status: 1, result: data });
};

const testCaseEntity = (req, res) => {
  // console.log('test case');
  const test = 100000;
  let S = '';
  while (S.length < test - 6) {
    S += 'a';
  }
  S += 'Hà Nội';
  const Ws = ['Hồ Chí Minh', 'Thái Bình', 'Yên Bái', 'Hà Giang', 'Lào Cai'];
  // console.log(Ws);
  // Ws.push('Hà Nội');
  // let regex = '/|';
  // for (let i = 0; i < test / 5; i += 1) {
  //   if (i === test / 5 - 1) {
  //     break;
  //   }
  //   for (const w of Ws) {
  //     regex = `${regex + w}|`;
  //   }
  // }
  // regex += `Hà Nội|/`;
  // console.time();
  // S.match(regex);
  // console.timeEnd();
  // console.log(regex);
  const wTest = 'Hà Nội';
  let mTest = 0;
  let iTest = 0;
  const TTest = [];
  TTest.length = S.length;
  TTest[0] = -1;
  console.time();
  let check = false;
  for (let j = 0; j < test / 5; j += 1) {
    if (j === test / 5 - 1) {
      break;
    }
    for (const w of Ws) {
      let m = 0;
      let i = 0;
      const T = [];
      T.length = S.length;
      T[0] = -1;
      while (m + i < S.length) {
        if (w[i] === S[m + i]) {
          i += 1;
          if (i === w.length) {
            check = true;
            break;
          }
        } else if (T[i] > -1) {
          i = T[i];
          m = m + i - T[i];
        } else {
          i = 0;
          m += 1;
        }
      }
      if (check) {
        break;
      }
    }
  }
  while (mTest + iTest < S.length) {
    if (wTest[iTest] === S[mTest + iTest]) {
      iTest += 1;
      if (iTest === wTest.length) {
        check = true;
        console.timeEnd();
        break;
      }
    } else if (TTest[iTest] > -1) {
      iTest = TTest[iTest];
      mTest = mTest + iTest - TTest[iTest];
    } else {
      iTest = 0;
      mTest += 1;
    }
  }
  // console.log('so khớp');
  // console.time();
  // for (const w of Ws) {
  //   const result1 = S.indexOf(w);
  //   if (result1 >= 0) {
  //     S.slice(result1, w.length);
  //     break;
  //   }
  // }
  // console.log('index of');
  // console.timeEnd();
  return res.send({ status: 1 });
};

module.exports = {
  getAllBotByRole,
  getBotById,
  createBot,
  updateBot,
  deleteBot,
  getBotByToken,
  getRoleInBot,
  addPermission,
  deletePermission,
  getExportFile,
  importFile,
  testCaseEntity,
};
