const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();


app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/skillbridge')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB error:', err));


app.use('/api/auth', require('./routes/auth'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/upload', require('./routes/upload'));


app.get('/', (req, res) => {
  res.json({ 
    message: 'SkillBridge LMS API Running!',
    version: '1.0',
    team: 'Depressed Developers'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});