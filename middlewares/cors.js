const allowedCors = [
  'https://localhost:3000',
  'http://localhost:3000',
  'https://api.alexmovies.nomoredomainsmonster.ru',
  'http://api.alexmovies.nomoredomainsmonster.ru',
  'https://alexmovies.nomoredomainsmonster.ru',
  'http://alexmovies.nomoredomainsmonster.ru',
];

const cors = (req, res, next) => {
  const { origin } = req.headers;
  const { method } = req;

  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  const requestHeaders = req.headers['access-control-request-headers'];

  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);

    return res.end();
  }

  return next();
};

module.exports = cors;
