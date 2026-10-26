const {StatusCodes} = require('http-status-codes')

class ServiceError extends Error {
    constructor(message="Something went wrong",
        explanation = "service layer errors",
        statusCode = StatusCodes.INTERNAL_SERVER_ERROR) {
            super();
        this.name = 'ServiecError';
        this.message = message;
        this.explanation = explanation;
        this.statusCode = statusCode;

    }
}
module.exports = ServiceError;