const API_URL = 'https://emolife-server-production.up.railway.app';

const submitPost = document.getElementById('submitPost');
const cancelPost = document.getElementById('cancelPost');
const postInput = document.getElementById('postInput');
const boardSelect = document.getElementById('boardSelect');
const anonymous = document.getElementById('anonymous');

submitPost.addEventListener('click', async () => {
    const text = postInput.value.trim();
    const board = boardSelect.value;
    if (!text) return alert('글 입력 필요');

    const postData = {
        text,
        board,
        anonymous: anonymous.checked,
        tags: (document.getElementById('tags').value || '').split(',').map(t => t.trim()).filter(Boolean)
    };

    try {
        const res = await fetch(`${API_URL}/api/posts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(postData)
        });
        if (!res.ok) throw new Error('POST failed');
        alert('글 게시 완료!');
        window.location.href = `board.html?board=${board}`;
    } catch (err) {
        alert('서버에 글을 게시하지 못했습니다.');
        console.error(err);
    }
});

cancelPost.addEventListener('click', () => {
    if (confirm('작성을 취소하시겠습니까?')) window.location.href = `board.html?board=${boardSelect.value}`;
});
