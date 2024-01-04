const User = require('../models/user');
const ValidationError = require('../errors/ValidationError');
const NotFoundError = require('../errors/NotFoundError');

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
