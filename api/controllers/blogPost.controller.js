import BlogPost from "../models/blogPost.model.js";

export const getBlogPosts = async (req, res) => {
  try {
    const blogPosts = await BlogPost.find().sort({ date: -1 });
    res.json(blogPosts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

export const createBlogPost = async (req, res) => {
  try {
    const { title, excerpt, content, author, readMoreUrl } = req.body;

    const newBlogPost = new BlogPost({
      title,
      excerpt,
      content,
      author,
      readMoreUrl,
    });

    const blogPost = await newBlogPost.save();
    res.json(blogPost);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
