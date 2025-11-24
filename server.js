const express = require('express');
const fs = require('fs');
const session = require('express-session');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
secret: "emolife_secret",
resave: false,
saveUninitialized: true
}));

const PORT = process.env.PORT || 3000;

// ------------------------
// 기본 게시글 API
// ------------------------

// 전체 게시글 불러오기
app.get('/posts', (req, res) => {
let posts = [];
try {
posts = JSON.parse(fs.readFileSync('posts.json', 'utf8'));
} catch (err) {
posts = [];
}
res.json(posts);
});

// 게시글 추가 (프론트 write.js와 연동)
app.post('/posts', (req, res) => {
const { text } = req.body;
let posts = [];
try {
posts = JSON.parse(fs.readFileSync('posts.json', 'utf8'));
} catch (err) {
posts = [];
}

```
const newPost = {
    id: Date.now().toString(),
    text
};
posts.push(newPost);
fs.writeFileSync('posts.json', JSON.stringify(posts, null, 2));
res.json({ success: true, post: newPost });
```

});

// ------------------------
// 관리자 기능
// ------------------------

// 관리자 로그인
app.post('/admin/login', (req, res) => {
const { password } = req.body;
if (password === process.env.ADMIN_PASSWORD) {
req.session.isAdmin = true;
res.json({ success: true });
} else {
res.json({ success: false });
}
});

// 관리자 인증 미들웨어
function adminOnly(req, res, next) {
if (req.session.isAdmin) next();
else res.status(403).json({ message: '관리자 권한 없음' });
}

// 게시글 삭제 (관리자용)
app.delete('/posts/:id', adminOnly, (req, res) => {
const postId = req.params.id;
let posts = [];
try {
posts = JSON.parse(fs.readFileSync('posts.json', 'utf8'));
} catch (err) {
posts = [];
}

```
posts = posts.filter(p => p.id !== postId);
fs.writeFileSync('posts.json', JSON.stringify(posts, null, 2));
res.json({ success: true });
```

});

// ------------------------
// 서버 시작
// ------------------------
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
});
