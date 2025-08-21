import handleError from "../utils/handleError.js";
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  // CastError: Handling invalid ObjectId
  if (err.name === "CastError") {
    const message = `Resource not found. Invalid: ${err.path}`;
    err = new handleError(message, 400);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const message = `This ${Object.keys(
      err.keyValue
    )} already registered. Please Login to continue`;
    err = new handleError(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

export default errorHandler;
