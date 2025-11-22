const API_URL = 'https://emolife-server-production.up.railway.app';

const postContentEl = document.getElementById('postContent');
const likeBtn = document.getElementById('likeBtn');
const commentForm = document.getElementById('commentForm');
const commentInput = document.getElementById('commentInput');
const commentsDiv = document.getElementById('comments');
const backToBoard = document.getElementById('backToBoard');

const params = new URLSearchParams(window.location.search);
const postId = params.get('id');
const board = params.get('board');

if (board) {
  // back link include board param
  backToBoard.href = `board.html?board=${encodeURIComponent(board)}`;
}

async function loadPost() {
  try {
    const res = await fetch(`${API_URL}/api/posts`);
    if (!res.ok) throw new Error('Failed to fetch');
    const posts = await res.json();
    const post = posts.find(p => p.id == postId);
    if (!post) {
      postContentEl.innerHTML = '<p>글을 찾을 수 없습니다.</p>';
      return;
    }

    postContentEl.innerHTML = `<h2 class="post-title">${escapeHtml((post.text || '').slice(0,80))}${post.text.length > 80 ? '...' : ''}</h2>
                               <p class="post-body">${escapeHtml(post.text)}</p>
                               <p class="board-label">채널: ${escapeHtml(board || '')}</p>`;

    commentsDiv.innerHTML = post.comments.map(c => `<div class="comment-item">- ${escapeHtml(c.text)}</div>`).join('') || '<div class="empty">댓글이 없습니다.</div>';
    likeBtn.textContent = `👍 ${post.likes}`;
  } catch (err) {
    postContentEl.innerHTML = '<p>게시글을 불러오는 중 오류가 발생했습니다.</p>';
    console.error(err);
  }
}

likeBtn.addEventListener('click', async () => {
  try {
    await fetch(`${API_URL}/api/posts/${postId}/like`, { method: 'POST' });
    await loadPost();
  } catch (err) {
    alert('좋아요 처리 실패');
    console.error(err);
  }
});

commentForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const text = commentInput.value.trim();
  if (!text) return;
  try {
    await fetch(`${API_URL}/api/posts/${postId}/comment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    commentInput.value = '';
    await loadPost();
  } catch (err) {
    alert('댓글 등록 실패');
    console.error(err);
  }
});

function escapeHtml(text) {
  if (!text) return '';
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return text.toString().replace(/[&<>"']/g, m => map[m]);
}

// Mobile fixed comment bar support
const commentFixedBar = document.getElementById('commentFixedBar');
const commentInputFixed = document.getElementById('commentInputFixed');
const commentSubmitFixed = document.getElementById('commentSubmitFixed');

// Show fixed bar on small screens
function checkFixedBar() {
  if (window.matchMedia && window.matchMedia('(max-width:600px)').matches) {
    if (commentFixedBar) commentFixedBar.style.display = 'flex';
  } else {
    if (commentFixedBar) commentFixedBar.style.display = 'none';
  }
}
window.addEventListener('resize', checkFixedBar);
checkFixedBar();

if (commentSubmitFixed) {
  commentSubmitFixed.addEventListener('click', async () => {
    const text = commentInputFixed.value.trim();
    if (!text) return;
    try {
      await fetch(`${API_URL}/api/posts/${postId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      commentInputFixed.value = '';
      await loadPost();
    } catch (err) {
      alert('댓글 등록 실패');
      console.error(err);
    }
  });
}

loadPost();
