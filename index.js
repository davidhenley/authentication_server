const express = require('express'),
      app = express(),
      morgan = require('morgan'),
      cors = require('cors'),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose'),
      port = process.env.PORT || 3090,
      router = require('./router');

mongoose.connect('mongodb://localhost:27017/users');

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cors());

router(app);

app.listen(port);
console.log('Magic happens on port', port);
