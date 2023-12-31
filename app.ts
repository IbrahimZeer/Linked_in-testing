import './config.js';
import createError from 'http-errors';
import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import dataSource from './db/dataSource.js';
import multer from 'multer';
import fs from 'fs';


import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js';
import jobsRouter from './routes/jobs.js';
import { authorize } from './middlewares/auth/authorize.js';

var app = express();

const PORT = 5000;

app.use(cors({
  origin: "http://localhost:3000"
}));

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'uploads/');
  },
  filename: (req, file, callback) => {
    callback(null, Date.now() + '-' + file.originalname)
  }
});

const upload = multer({ storage });

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);
app.use('/users', usersRouter);
// use authorize here to join authorize for all jobs routes
app.use('/jobs', authorize, jobsRouter);

app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    res.status(500).send("Failed Upload File!");
    return;
  }
  const fileURL = req.file.destination + req.file.filename;
  res.send({
    message: 'File Uploaded Successfully!',
    file: fileURL
  });
});

app.get('/file', (req, res) => {
  const fileName = req.query.name?.toString() || '';
  try {
    const data = fs.readFileSync('uploads/' + fileName, 'utf-8');
    const JSONData = JSON.parse(data) as any[];
    console.log("-----------------------");
    console.log(JSONData[0].author);
    console.log("-----------------------");
    res.send(JSONData);
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong");
  }
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err: any, req: any, res: any, next: any) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


app.listen(PORT, () => {
  logger(`App is listening on port ${PORT}`);
  console.log(`App is listening on port ${PORT}`);
  // console.log(process.env) // to read env file and console it
});

export default app;
