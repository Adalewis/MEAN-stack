const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true }
});
//collection name will be posts because is plaural of Post
module.exports = mongoose.model('Post', postSchema);
