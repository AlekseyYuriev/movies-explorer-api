const Movie = require('../models/movie');
const ValidationError = require('../errors/ValidationError');
const NotFoundError = require('../errors/NotFoundError');
const BanError = require('../errors/BanError');

module.exports.getMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find({ owner: req.user._id });

    return res.send(movies);
  } catch (error) {
    return next(error);
  }
};

module.exports.createMovie = async (req, res, next) => {
  try {
    const newMovie = new Movie({ ...req.body, owner: req.user._id });

    return res.status(201).send(await newMovie.save());
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new ValidationError('Ошибка валидации полей'));
    }

    return next(error);
  }
};

module.exports.deleteMovie = async (req, res, next) => {
  try {
    const { movieId } = req.params;
    const movie = await Movie.findById(movieId).populate('owner');

    if (!movie) {
      throw new NotFoundError('Фильм с таким id не найден');
    }

    const ownerId = movie.owner.id;
    const userId = req.user._id;

    if (ownerId !== userId) {
      throw new BanError('Нельзя удалять фильмы других пользователей');
    }

    await Movie.findByIdAndDelete(movieId);

    return res.send(movie);
  } catch (error) {
    return next(error);
  }
};
