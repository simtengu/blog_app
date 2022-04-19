const { CustomApiError } = require('../errors');
const errorHandlerMiddleware = (err, req, res, next) => {

    if (err instanceof CustomApiError) {
        res.status(err.statusCode).json({ message: err.message })

    } else {
        if (err.name === 'ValidationError') {
            const msg = Object.values(err.errors)
                .map((item) => item.message)
                .join(',');

            res.status(400).json({ message: msg })
            return;
        }
        if (err.code && err.code === 11000) {
            const msg = `${Object.keys(
                err.keyValue
            )} entered has already been taken, please enter another one`
            res.status(400).json({ message: msg })
            return;
        }

        res.status(500).json({ message: err.message })
    }
}

module.exports = errorHandlerMiddleware;
