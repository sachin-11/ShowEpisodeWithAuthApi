const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const colors = require('colors');
const cookieParser = require('cookie-parser');
const fileupload = require('express-fileupload');
const errorHandler = require('./middleware/error');

const morgan = require('morgan');
const connectDB = require('./config/db');

//load env vars

dotenv.config({ path: './config/config.env' });

//Connect to database

connectDB();

//route files

const show = require('./routes/show');
const episode = require('./routes/episode');
const auth = require('./routes/auth');

const app = express();

app.use(express.json());

//Cookie Parser
app.use(cookieParser());

//Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//File uploading

app.use(fileupload(path.join(__dirname, 'public')));

//set static folder
//app.use(express.static);

//Mount routes
app.use('/api/v1/show', show);
app.use('/api/v1/episode', episode);
app.use('/api/v1/auth', auth);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  );
});

//Handle unhandle promise rejection

process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  //close server
  server.close(() => process.exit(1));
});
