import mongoose from "mongoose";

const BlogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  excerpt: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  readMoreUrl: {
    type: String,
    default: '#'
  }
});

const BlogPost = mongoose.model('BlogPost', BlogPostSchema);
export default BlogPost;