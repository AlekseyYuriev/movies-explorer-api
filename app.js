const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { errors } = require('celebrate');
const json = require('express').json();
const helmet = require('helmet');
const handleError = require('./middlewares/handleError');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const router = require('./routes');
const limiter = require('./middlewares/rateLimit');

dotenv.config();

const app = express();

const { NODE_ENV, PORT, MONGO_URL } = process.env;

mongoose.connect(NODE_ENV ? MONGO_URL : 'mongodb://127.0.0.1:27017/bitfilmsdb')
  .then(() => console.log('MongoDB in process'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

app.use(json);
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);
app.use(helmet());
app.use(limiter);
app.use(router);
app.use(errorLogger);
app.use(errors());
app.use(handleError);

app.listen(PORT, () => {
  console.log(`App listening on port ${NODE_ENV ? PORT : 3000}`);
});
