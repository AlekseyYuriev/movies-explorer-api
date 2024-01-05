const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const router = require('./routes');
const handleError = require('./middlewares/handleError');

const { PORT = 3000, MONGO_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;

dotenv.config();

const app = express();

mongoose.connect(MONGO_URL)
  .then(() => console.log('MongoDB in process'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);
app.use(errors());
app.use(handleError);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
