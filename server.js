const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/family-chores', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


const usersRoute = require('./routes/users');
const choresRoute = require('./routes/chores');
const categoriesRoute = require('./routes/categories');

app.use('/api/users', usersRoute);
app.use('/api/chores', choresRoute);
app.use('/api/categories', categoriesRoute);
