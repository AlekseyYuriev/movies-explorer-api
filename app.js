const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { errors } = require('celebrate');
const helmet = require('helmet');
const handleError = require('./middlewares/handleError');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const router = require('./routes');
const limiter = require('./middlewares/rateLimit');

dotenv.config();

const app = express();

const { PORT = 3000, MONGO_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;

mongoose.connect(MONGO_URL)
  .then(() => console.log('MongoDB in process'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);
app.use(helmet());
app.use(limiter);
app.use(router);
app.use(errorLogger);
app.use(errors());
// app.use(handleError);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
