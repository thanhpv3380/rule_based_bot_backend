const express = require('express');
const path = require('path');
const compression = require('compression');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const fileupload = require('express-fileupload');

const camelCaseReq = require('./middlewares/camelCaseReq');
const omitReq = require('./middlewares/omitReq');
const snakeCaseRes = require('./middlewares/snakeCaseRes');
const errorHandler = require('./middlewares/errorHandler');

require('dotenv').config();
require('./models');

const { PORT } = require('./configs');

const app = express();

app.use(cors());
app.use(helmet());
app.use(compression());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(camelCaseReq);
app.use(omitReq);
app.use(snakeCaseRes());
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(fileupload());

require('./routes')(app);
// require('./messageQueue/index');

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
