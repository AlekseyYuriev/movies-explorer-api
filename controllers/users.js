const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const ValidationError = require('../errors/ValidationError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');
const AuthorisationError = require('../errors/AuthorisationError');

const SOLT_ROUNDS = 10;
const MONGO_DUPLACATE_ERROR_CODE = 11000;

const { JWT_SECRET, NODE_ENV } = process.env;

module.exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      throw new NotFoundError('Пользователь по id не найден');
    }

    return res.send(user);
  } catch (error) {
    if (error.name === 'CastError') {
      next(new ValidationError('Ошибка валидации полей'));
    }

    return next(error);
  }
};

module.exports.updateUser = async (req, res, next) => {
  try {
    const { email, name } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { email, name },
      { new: true, runValidators: true },
    );

    if (!user) {
      throw new NotFoundError('Пользователь по id не найден');
    }

    return res.send(user);
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new ValidationError('Ошибка валидации полей'));
    }

    return next(error);
  }
};

module.exports.createUser = async (req, res, next) => {
  try {
    const { email, name, password } = req.body;
    const hash = await bcrypt.hash(password, SOLT_ROUNDS);
    let newUser = await User.create({
      email, name, password: hash,
    });
    newUser = newUser.toObject();
    delete newUser.password;
    return res.status(201).send(newUser);
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new ValidationError('Ошибка валидации полей'));
    }

    if (error.code === MONGO_DUPLACATE_ERROR_CODE) {
      next(new ConflictError('Такой пользователь уже существует'));
    }

    return next(error);
  }
};

module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const userLogin = await User.findOne({ email })
      .select('+password')
      .orFail(() => new AuthorisationError('Неверный email или пароль'));

    if (!userLogin) {
      throw new AuthorisationError('Неверный email или пароль');
    }

    const matched = await bcrypt.compare(String(password), userLogin.password);
    if (!matched) {
      throw new AuthorisationError('Неверный email или пароль');
    }

    const token = jwt.sign({ _id: userLogin._id }, NODE_ENV ? JWT_SECRET : 'dev_secret', { expiresIn: '7d' });

    return res.send({ token });
  } catch (error) {
    return next(error);
  }
};
