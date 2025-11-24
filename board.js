const SERVER_URL = 'https://emolife-server-production.up.railway.app';
const feed = document.getElementById('feed');
const channelName = document.getElementById('channelName');
const boardButtons = document.querySelectorAll('.board-btn');

let currentBoard = 'career';

// 게시물 불러오기
async function loadPosts(board) {
  try {
    const res = await fetch(`${SERVER_URL}/posts?board=${board}`, { credentials: 'include' });
    if (!res.ok) throw new Error('게시물을 불러오지 못했습니다.');
    const posts = await res.json();

    if(posts.length === 0) {
      feed.innerHTML = '<p>게시물이 없습니다.</p>';
      return;
    }

    let html = '';
    posts.forEach(p => {
      html += `<div class="post">
                 <p>${p.text}</p>
                 <button onclick="deletePost('${p.id}')">삭제</button>
               </div>`;
    });
    feed.innerHTML = html;
    channelName.textContent = getBoardName(board);
  } catch (err) {
    feed.innerHTML = `<p style="color:red;">${err.message}</p>`;
  }
}

// 게시판 버튼 클릭 이벤트
boardButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    currentBoard = btn.dataset.board;
    loadPosts(currentBoard);
  });
});

function getBoardName(board) {
  switch(board) {
    case 'career': return '진로 고민';
    case 'love': return '연애 고민';
    case 'friendship': return '관계 고민';
    case 'etc': return '기타 고민';
    default: return '게시판';
  }
}

// 게시글 삭제
async function deletePost(id) {
  try {
    const res = await fetch(`${SERVER_URL}/posts/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    if (!res.ok) throw new Error('삭제 실패');
    loadPosts(currentBoard);
  } catch (err) {
    alert(err.message);
  }
}

// 초기 로드
loadPosts(currentBoard);
