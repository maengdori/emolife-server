const API_URL = 'https://emolife-server-production.up.railway.app';

const feed = document.getElementById('feed');
const boardButtons = document.querySelectorAll('.board-btn');
const writeBtn = document.getElementById('writeBtn');
const channelNameDiv = document.getElementById('channelName');

const params = new URLSearchParams(window.location.search);
let currentBoard = params.get('board') || 'career';

const channelMap = {
    career: '진로 고민 채널',
    love: '연애 고민 채널',
    friendship: '우정 고민 채널'
};

channelNameDiv.textContent = channelMap[currentBoard] || currentBoard;

const colorMap = {
    career: '#4CAF50',
    love: '#E91E63',
    friendship: '#03A9F4'
};
channelNameDiv.style.color = colorMap[currentBoard] || '#000';

boardButtons.forEach(btn => {
    if (btn.dataset.board === currentBoard) btn.classList.add('active');

    btn.addEventListener('click', () => {
        const board = btn.dataset.board;
        window.location.href = `board.html?board=${board}`;
    });
});

writeBtn.addEventListener('click', () => {
    window.location.href = 'post.html';
});

async function loadPosts() {
    try {
        const res = await fetch(`${API_URL}/api/posts?board=${currentBoard}`);
        if (!res.ok) throw new Error('Failed to fetch posts');
        const posts = await res.json();
        feed.innerHTML = '';
        if (!posts.length) {
            feed.innerHTML = `<div class="empty">아직 게시물이 없습니다. 첫 글을 작성해보세요!</div>`;
            return;
        }
        posts.forEach(p => {
            const div = document.createElement('div');
            div.className = 'feed-item';
            const title = (p.text || '').slice(0, 60);
            div.innerHTML = `<a class="feed-link" href="post-detail.html?id=${p.id}&board=${currentBoard}">${escapeHtml(title)}${p.text.length > 60 ? '...' : ''}</a>
                             <div class="meta">❤️ ${p.likes} · 댓글 ${p.comments.length}</div>`;
            feed.appendChild(div);
        });
    } catch (err) {
        feed.innerHTML = `<div class="error">게시물을 불러오지 못했습니다. 서버 주소 및 CORS 설정을 확인하세요.</div>`;
        console.error(err);
    }
}

function escapeHtml(text) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return text.replace(/[&<>"']/g, m => map[m]);
}

loadPosts();
