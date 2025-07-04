const errorHandler =(statusCode,message) =>{
  const error = new Error();
  console.log(message);
  error.message = message,
  error.statusCode = statusCode
  return error;
}

module.exports = {errorHandler};