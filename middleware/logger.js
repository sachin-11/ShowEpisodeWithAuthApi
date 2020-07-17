//@desc Logs req to console

const logger = (req, res, next) => {
  console.log('middleware run');
  next();
};

module.exports = logger;
