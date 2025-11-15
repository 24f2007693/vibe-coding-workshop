/*
Simple image gallery with like / dislike per image.
- Votes are stored in localStorage under key "simple-gallery:v1"
- CSV export includes: image_name,image_link,status
*/

const STORAGE_KEY = 'simple-gallery:v1';

// Edit or extend this list with any image name + link you like.
// Using picsum.photos for placeholder images. Replace with your own links if desired.
const IMAGES = [
  { name: 'Foggy Lake', link: 'https://picsum.photos/id/1018/1200/800' },
  { name: 'City at Night', link: 'https://picsum.photos/id/1011/1200/800' },
  { name: 'Mountains', link: 'https://picsum.photos/id/1003/1200/800' },
  { name: 'Desert', link: 'https://picsum.photos/id/1002/1200/800' },
  { name: 'Forest Trail', link: 'https://picsum.photos/id/1015/1200/800' },
  { name: 'River Bridge', link: 'https://picsum.photos/id/1025/1200/800' },
  { name: 'Sunset Field', link: 'https://picsum.photos/id/1024/1200/800' },
  { name: 'Blue Ocean', link: 'https://picsum.photos/id/1016/1200/800' }
];

// load state from localStorage (map image_link -> {status: 'like'|'dislike'|'', ts: <ISO>})
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse storage:', e);
    return {};
  }
}
function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

const galleryEl = document.getElementById('gallery');
const downloadCsvBtn = document.getElementById('downloadCsv');
const clearAllBtn = document.getElementById('clearAll');

let state = loadState();

function renderGallery() {
  galleryEl.innerHTML = '';
  IMAGES.forEach(img => {
    const imgState = state[img.link] || { status: '' };
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <img loading="lazy" src="${img.link}" alt="${escapeHtml(img.name)}">
      <div class="meta">
        <div>
          <div class="title">${escapeHtml(img.name)}</div>
          <a href="${img.link}" target="_blank" rel="noopener noreferrer" style="font-size:12px;color:#2374e1;">Open image</a>
        </div>
        <div class="actions">
          <button class="icon-btn like ${imgState.status === 'like' ? 'active' : ''}" title="Like">👍 <span class="count like-count">${imgState.status === 'like' ? 1 : 0}</span></button>
          <button class="icon-btn dislike ${imgState.status === 'dislike' ? 'active' : ''}" title="Dislike">👎 <span class="count dislike-count">${imgState.status === 'dislike' ? 1 : 0}</span></button>
        </div>
      </div>
    `;
    // event delegation for the two buttons
    const likeBtn = card.querySelector('.icon-btn.like');
    const dislikeBtn = card.querySelector('.icon-btn.dislike');

    likeBtn.addEventListener('click', () => toggleVote(img.link, 'like', likeBtn, dislikeBtn));
    dislikeBtn.addEventListener('click', () => toggleVote(img.link, 'dislike', likeBtn, dislikeBtn));

    galleryEl.appendChild(card);
  });
}

function toggleVote(link, vote, likeBtn, dislikeBtn) {
  const existing = state[link] ? state[link].status : '';
  if (existing === vote) {
    // clear vote
    delete state[link];
  } else {
    state[link] = { status: vote, ts: new Date().toISOString() };
  }
  saveState(state);
  renderGallery();
}

function downloadCsv() {
  // CSV header: image_name, image_link, status
  const rows = [['image_name', 'image_link', 'status']];
  IMAGES.forEach(img => {
    const st = state[img.link] ? state[img.link].status : '';
    // sanitize commas and quotes by quoting fields and escaping quotes
    rows.push([img.name, img.link, st]);
  });
  const csv = rows.map(row => row.map(escapeCsv).join(',')).join('\r\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  const dt = new Date().toISOString().replace(/[:.]/g, '-');
  a.download = `image-votes-${dt}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function clearAllVotes() {
  if (!confirm('Clear all stored likes/dislikes? This cannot be undone.')) return;
  state = {};
  saveState(state);
  renderGallery();
}

// small helpers
function escapeCsv(value) {
  if (value == null) return '';
  const s = String(value);
  if (/[",\r\n]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}
function escapeHtml(s) {
  return String(s)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;')
    .replace(/'/g,'&#039;');
}

// wire up buttons
downloadCsvBtn.addEventListener('click', downloadCsv);
clearAllBtn.addEventListener('click', clearAllVotes);

// initial render
renderGallery();
