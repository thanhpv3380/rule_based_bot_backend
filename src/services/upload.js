const multer = require('multer');
const path = require('path');

const CustomError = require('../errors/CustomError');
const errorCodes = require('../errors/code');
const { mkDirByPathSync } = require('../utils/file');
const { generateRandomString } = require('../utils/random');

const DESTINATION = 'public';
const IMAGES_FOLDER = 'images';
const AUDIO_FOLDER = 'audios';
const VIDEO_FOLDER = 'videos';
const OTHER_FOLDER = 'others';

const filetypes = /jpeg|jpg|png|gif|mp3|wma|wav|acc|m4a|flac|mp4|mpg|mpeg|mov|wmv|flv|f4v|plain|pdf|msword|vnd.openxmlformats-officedocument.wordprocessingml.document|vnd.ms-powerpoint|vnd.openxmlformats-officedocument.presentationml.presentation|vnd.ms-excel|vnd.openxmlformats-officedocument.spreadsheetml.sheet/;
const fileExts = /jpeg|jpg|png|gif|mp3|wma|wav|acc|m4a|flac|mp4|mpg|mpeg|mov|wmv|flv|f4v|txt|pdf|doc|docx|ppt|pptx|xls|xlsx/;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const today = new Date();
    const year = today.getFullYear();
    const month =
      today.getMonth() + 1 < 10
        ? `0${today.getMonth() + 1}`
        : today.getMonth() + 1;
    const day = today.getDate() < 10 ? `0${today.getDate()}` : today.getDate();

    let destination = `${DESTINATION}/${OTHER_FOLDER}/${year}/${month}/${day}`;

    if (/image/.test(file.mimetype))
      destination = `${DESTINATION}/${IMAGES_FOLDER}/${year}/${month}/${day}`;

    if (/audio/.test(file.mimetype))
      destination = `${DESTINATION}/${AUDIO_FOLDER}/${year}/${month}/${day}`;

    if (/video/.test(file.mimetype))
      destination = `${DESTINATION}/${VIDEO_FOLDER}/${year}/${month}/${day}`;

    mkDirByPathSync(destination);

    return cb(null, destination);
  },
  filename: (req, file, cb) => {
    const filename = `${generateRandomString(16)}${path.extname(
      file.originalname,
    )}`;
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
    fileSize: 10 * 1024 * 1024,
  },
});

module.exports = { upload };
