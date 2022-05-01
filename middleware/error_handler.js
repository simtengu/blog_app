
const errorHandlerMiddleware = (err, req, res, next) => {

    
        if (err.name === 'ValidationError') {
            const msg = Object.values(err.errors)
                .map((item) => item.message)
                .join(',');

           return   res.status(400).json({ message: msg })
          
        }
        if (err.code && err.code === 11000) {
            const msg = `${Object.keys(
                err.keyValue
            )} entered has already been taken, please enter another one`
           return res.status(400).json({ message: msg })
            
        }

        res.status(500).json({ message: err.message })
    
}

module.exports = errorHandlerMiddleware;
