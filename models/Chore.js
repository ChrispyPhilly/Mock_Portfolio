const mongoose = require('mongoose');

const choreSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
});

module.exports = mongoose.model('Chore', choreSchema);
