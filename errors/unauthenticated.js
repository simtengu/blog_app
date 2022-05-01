const CustomApiError = require('./customError');
class UnAuthenticatedError extends CustomApiError {
    constructor(message){
        super(message);
        this.statusCode = 401;
    }
}

module.exports = UnAuthenticatedError;