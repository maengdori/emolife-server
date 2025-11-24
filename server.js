const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// 메모리 DB (MVP용)
let posts = [];
let postId = 1;

app.get('/api/posts', (req, res) => {
  const board = req.query.board || 'career';
  const filtered = posts.filter(p => p.board === board);
  res.json(filtered);
});

app.post('/api/posts', (req, res) => {
  const { board, text, anonymous, tags } = req.body;
  if (!text) return res.status(400).json({ error: 'Text required' });
  const newPost = {
    id: postId++,
    board: board || 'career',
    text: text.trim(),
    likes: 0,
    comments: [],
    anonymous: !!anonymous,
    tags: tags || []
  };
  posts.unshift(newPost);
  res.status(201).json(newPost);
});

app.post('/api/posts/:id/like', (req, res) => {
  const id = Number(req.params.id);
  const post = posts.find(p => p.id === id);
  if (!post) return res.status(404).json({ error: 'Post not found' });
  post.likes += 1;
  res.json({ likes: post.likes });
});

app.post('/api/posts/:id/comment', (req, res) => {
  const id = Number(req.params.id);
  const { text } = req.body;
  const post = posts.find(p => p.id === id);
  if (!post) return res.status(404).json({ error: 'Post not found' });
  if (!text) return res.status(400).json({ error: 'Text required' });
  post.comments.push({ id: Date.now(), text: text.trim() });
  res.json(post);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
