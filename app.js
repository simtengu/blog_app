const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');

require('dotenv').config();
require('express-async-errors')
const express = require('express')
const app = express();
//connection to db
const connectDb = require('./db/connect');
//routers........................ 
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const postRouter = require('./routes/post');

//middlewares....................... 
const notFoundMiddleware = require('./middleware/not_found');
const authMiddleware = require('./middleware/authentication');
const errorHandlerMiddleware = require("./middleware/error_handler");

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());
app.use('/uploads', express.static('uploads'))
app.get('/', (req, res) => {
  res.send('welcome to simtengu blog app')
})

//register app routes........ 
app.use('/api', authRouter);
app.use('/api', postRouter);
app.use('/api', authMiddleware, userRouter);
//register errorhandler middleware 
//register not found middleware 
app.use(errorHandlerMiddleware);
app.use(notFoundMiddleware);

const port = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDb(process.env.MONGO_URI);
    // console.log('connected to mongo db');
    app.listen(port, () => {
      console.log(`app is listening on port ${port}`);
    })

  } catch (error) {
    console.log('Server cannot start.....something went wrong ');
  }

}

start();