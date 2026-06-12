const asyncHandler = function (fn) {
  return function (req, res, next) {
    fn(req, res, next)
      .catch((error) => {
        next(error);
      });
  };
};

export default asyncHandler;