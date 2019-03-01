module.exports = function (options) {
  return function(req, res, next) {
    let greet = 'Hello';
    if (options['upper']) greet = greet.toUpperCase();

    console.log(greet, req.url);

    next();
  };
};
