export function errorHandler(status, message) {
    const error = new Error();
    error.message = message;
    error.success = false;
    error.statusCode = status;
    return error;
}
