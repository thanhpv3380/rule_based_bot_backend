const multer = require('multer');
const path = require('path');

const CustomError = require('../errors/CustomError');
const errorCodes = require('../errors/code');
const { mkDirByPathSync } = require('../utils/file');
const { generateRandomString } = require('../utils/random');
const { splitDate } = require('../utils/date');
const configs = require('../configs');
const {
  DESTINATION,
  IMAGES_FOLDER,
  AUDIO_FOLDER,
  VIDEO_FOLDER,
  OTHER_FOLDER,
} = require('../constants');

const filetypes = /jpeg|jpg|png|gif|mp3|wma|wav|audio\/vnd.wave|acc|m4a|flac|mp4|mpg|mpeg|mov|wmv|flv|f4v|plain|pdf|msword|vnd.openxmlformats-officedocument.wordprocessingml.document|vnd.ms-powerpoint|vnd.openxmlformats-officedocument.presentationml.presentation|vnd.ms-excel|vnd.openxmlformats-officedocument.spreadsheetml.sheet|application\/zip|application\/x-xz|application\/x-7z-compressed|application\/x-rar-compressed/;
const fileExts = /jpeg|jpg|png|gif|mp3|wma|wav|acc|m4a|flac|mp4|mpg|mpeg|mov|wmv|flv|f4v|txt|pdf|doc|docx|ppt|pptx|xls|xlsx|zip|7z|rar/;

function specifyDestination(mimetype, year, month, day) {
  const SUFFIX_PATH = `${year}/${month}/${day}`;
  let destination = `${DESTINATION}/${OTHER_FOLDER}/${SUFFIX_PATH}`;

  if (/image/.test(mimetype))
    destination = `${DESTINATION}/${IMAGES_FOLDER}/${SUFFIX_PATH}`;

  if (/audio/.test(mimetype))
    destination = `${DESTINATION}/${AUDIO_FOLDER}/${SUFFIX_PATH}`;

  if (/video/.test(mimetype))
    destination = `${DESTINATION}/${VIDEO_FOLDER}/${SUFFIX_PATH}`;

  return destination;
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let destination;

    const customDestination = req.body.destination;
    if (customDestination) {
      destination = `${DESTINATION}/${customDestination}`;
    } else {
      const today = new Date();
      const { year, month, day } = splitDate(today);
      destination = specifyDestination(file.mimetype, year, month, day);
    }
    mkDirByPathSync(destination);

    return cb(null, destination);
  },
  filename: (req, file, cb) => {
    const name = req.body.name || generateRandomString(16);
    const extension = path.extname(file.originalname);
    const filename = `${name}${extension}`;
    return cb(null, filename);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const mimetype = filetypes.test(file.mimetype);
    const extname = fileExts.test(
      path.extname(file.originalname).toLowerCase(),
    );
    if (mimetype && extname) {
      return cb(null, true);
    }
    return cb(
      new CustomError(
        errorCodes.INVALID_FILE_TYPE,
        `File upload only support the following filetypes: ${filetypes}`,
      ),
    );
  },
  limits: {
    fileSize: configs.FILE_SIZE_LIMITED,
  },
});

module.exports = { upload };
