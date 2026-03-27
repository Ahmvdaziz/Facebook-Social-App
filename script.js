// ── DATA ──
const currentUser = { name: "Ahmed Aziz", initial: "A", color: "#1877f2" };

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const initialPosts = [
  {
    id: 1,
    author: "Ahmed Sayed",
    initial: "A",
    color: "#e91e8c",
    time: "2 hours ago",
    text: "Just had an amazing hike in the mountains! Nature is truly breathtaking. 🌄",
    image: "https://picsum.photos/seed/hike/600/400",
    likes: 42,
    comments: [
      { name: "Shahd Mohamed", text: "Looks amazing! Which trail?" },
      { name: "Ahmed Aziz", text: "I love hiking! So jealous 😍" }
    ],
    liked: false,
    showComments: false
  },
  {
    id: 2,
    author: "Shahd Mohamed",
    initial: "S",
    color: "#6200ea",
    time: "4 hours ago",
    text: "Just finished building my first full-stack app. Feels great to ship something! 🚀",
    image: null,
    likes: 87,
    comments: [
      { name: "Ahmed Aziz", text: "Congrats! What stack did you use?" }
    ],
    liked: false,
    showComments: false
  },
  {
    id: 3,
    author: "Ahmed Aziz",
    initial: "A",
    color: "#ff5722",
    time: "6 hours ago",
    text: "Made homemade pasta for the first time today. Definitely not perfect but it tasted incredible! 🍝",
    image: "https://picsum.photos/seed/pasta/600/400",
    likes: 134,
    comments: [],
    liked: false,
    showComments: false
  },
  {
    id: 4,
    author: "Omar Hassan",
    initial: "O",
    color: "#0097a7",
    time: "Yesterday",
    text: "Beautiful sunset from my balcony tonight. Sometimes you just have to stop and appreciate the little things. 🌅",
    image: "https://picsum.photos/seed/sunset/600/400",
    likes: 210,
    comments: [
      { name: "Ahmed Sayed", text: "Wow that view is stunning!" },
      { name: "Shahd Mohamed", text: "Where do you live? Amazing!" }
    ],
    liked: false,
    showComments: false
  }
];

const contacts = [
  { name: "Ahmed Aziz",    initial: "A", color: "#e91e8c", online: true },
  { name: "Ahmed Sayed",   initial: "A", color: "#6200ea", online: true },
  { name: "Shahd Mohamed", initial: "S", color: "#ff5722", online: false },
  { name: "Omar Hassan",   initial: "O", color: "#0097a7", online: true },
  { name: "Eve Martinez",  initial: "E", color: "#388e3c", online: true },
  { name: "Frank Turner",  initial: "F", color: "#f57c00", online: false },
  { name: "Grace Kim",     initial: "G", color: "#c2185b", online: true }
];

let posts = [...initialPosts];
let nextId = posts.length + 1;

// ── RENDER CONTACTS ──
function renderContacts() {
  const container = document.getElementById("contacts");
  container.innerHTML = contacts.map(c => `
    <div class="contact-item">
      <div class="contact-avatar" style="background:${c.color}">
        ${c.initial}
        ${c.online ? '<span class="online-dot"></span>' : ''}
      </div>
      <span class="contact-name">${c.name}</span>
    </div>
  `).join('');
}

// ── RENDER POSTS ──
function renderPosts() {
  const container = document.getElementById("posts-container");
  container.innerHTML = posts.map(post => `
    <div class="post-card" id="post-${post.id}">
      <div class="post-header">
        <div class="avatar-small" style="background:${post.color}">${post.initial}</div>
        <div class="post-info">
          <div class="name">${escapeHtml(post.author)}</div>
          <div class="time">🌐 ${post.time}</div>
        </div>
        <button class="post-menu">•••</button>
      </div>
      <div class="post-text">${escapeHtml(post.text)}</div>
      ${post.image ? `
        <div class="post-image">
          <img src="${post.image}" alt="Post image" loading="lazy"/>
        </div>` : ''}
      <div class="post-stats">
        <span onclick="toggleLike(${post.id})">
          👍 ${post.likes} ${post.likes === 1 ? 'Like' : 'Likes'}
        </span>
        <span onclick="toggleComments(${post.id})">
          💬 ${post.comments.length} ${post.comments.length === 1 ? 'Comment' : 'Comments'}
        </span>
      </div>
      <div class="post-actions">
        <button onclick="toggleLike(${post.id})" class="${post.liked ? 'liked' : ''}">
          👍 Like
        </button>
        <button onclick="toggleComments(${post.id})">
          💬 Comment
        </button>
        <button onclick="openShareModal(${post.id})">
          ↗️ Share
        </button>
      </div>
      <div class="comments-section ${post.showComments ? 'open' : ''}" id="comments-${post.id}">
        ${post.comments.map(c => `
          <div class="comment-item">
            <div class="avatar-small" style="width:32px;height:32px;font-size:13px;background:#65676b">
              ${c.name.charAt(0)}
            </div>
            <div class="comment-bubble">
              <div class="c-name">${escapeHtml(c.name)}</div>
              <div class="c-text">${escapeHtml(c.text)}</div>
            </div>
          </div>
        `).join('')}
        <div class="comment-input-wrap">
          <div class="avatar-small" style="width:32px;height:32px;font-size:13px">${currentUser.initial}</div>
          <input
            class="comment-input"
            type="text"
            placeholder="Write a comment..."
            id="comment-input-${post.id}"
            onkeydown="handleCommentKey(event, ${post.id})"
          />
          <button class="comment-send" onclick="submitComment(${post.id})">➤</button>
        </div>
      </div>
    </div>
  `).join('');
}

// ── TOGGLE LIKE ──
function toggleLike(id) {
  posts = posts.map(p => {
    if (p.id === id) {
      const liked = !p.liked;
      return { ...p, liked, likes: liked ? p.likes + 1 : p.likes - 1 };
    }
    return p;
  });
  renderPosts();
}

// ── TOGGLE COMMENTS ──
function toggleComments(id) {
  posts = posts.map(p =>
    p.id === id ? { ...p, showComments: !p.showComments } : p
  );
  renderPosts();
  if (posts.find(p => p.id === id).showComments) {
    const input = document.getElementById(`comment-input-${id}`);
    if (input) input.focus();
  }
}

// ── SUBMIT COMMENT ──
function submitComment(id) {
  const input = document.getElementById(`comment-input-${id}`);
  const text = input.value.trim();
  if (!text) return;
  posts = posts.map(p => {
    if (p.id === id) {
      return {
        ...p,
        showComments: true,
        comments: [...p.comments, { name: currentUser.name, text }]
      };
    }
    return p;
  });
  renderPosts();
}

function handleCommentKey(event, id) {
  if (event.key === 'Enter') submitComment(id);
}

// ── SHARE FUNCTIONALITY ──
function openShareModal(postId) {
  const post = posts.find(p => p.id === postId);
  if (!post) return;

  const modalOverlay = document.createElement('div');
  modalOverlay.className = 'modal-overlay open';
  modalOverlay.innerHTML = `
    <div class="share-modal">
      <h4>Share this post</h4>
      <div class="share-option" onclick="shareToFacebook(${postId})">
        <span class="share-icon">👥</span>
        <span class="share-text">Share on Feed</span>
      </div>
      <div class="share-option" onclick="shareViaMessenger(${postId})">
        <span class="share-icon">💬</span>
        <span class="share-text">Send via Messenger</span>
      </div>
      <div class="share-option" onclick="copyShareLink(${postId})">
        <span class="share-icon">🔗</span>
        <span class="share-text">Copy Link</span>
      </div>
      <div style="margin-top: 12px; text-align: right;">
        <button onclick="this.closest('.modal-overlay').remove()" style="background: #e4e6eb; border: none; padding: 8px 16px; border-radius: 8px; cursor: pointer;">Close</button>
      </div>
    </div>
  `;

  // Close on overlay click
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) modalOverlay.remove();
  });

  document.body.appendChild(modalOverlay);
}

function shareToFacebook(postId) {
  const post = posts.find(p => p.id === postId);
  alert(`Shared "${post.text.substring(0, 50)}..." to your feed!`);
  document.querySelector('.modal-overlay.open')?.remove();
}

function shareViaMessenger(postId) {
  const post = posts.find(p => p.id === postId);
  alert(`Opened Messenger to share post by ${post.author}`);
  document.querySelector('.modal-overlay.open')?.remove();
}

function copyShareLink(postId) {
  const shareLink = `${window.location.href}?post=${postId}`;
  navigator.clipboard.writeText(shareLink).then(() => {
    // Show notification
    const notification = document.createElement('div');
    notification.className = 'copy-notification';
    notification.textContent = '✓ Link copied to clipboard!';
    document.body.appendChild(notification);
    document.querySelector('.modal-overlay.open')?.remove();
    setTimeout(() => notification.remove(), 3000);
  });
}

// ── MODAL ──
const postModal   = document.getElementById("postModal");
const openModalBtn = document.getElementById("openModalBtn");
const closeModal  = document.getElementById("closeModal");
const postText    = document.getElementById("postText");
const submitPost  = document.getElementById("submitPost");

openModalBtn.addEventListener("click", () => {
  postModal.classList.add("open");
  postText.focus();
});

closeModal.addEventListener("click", () => {
  postModal.classList.remove("open");
  postText.value = "";
  submitPost.disabled = true;
});

postModal.addEventListener("click", (e) => {
  if (e.target === postModal) {
    postModal.classList.remove("open");
    postText.value = "";
    submitPost.disabled = true;
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && postModal.classList.contains("open")) {
    postModal.classList.remove("open");
    postText.value = "";
    submitPost.disabled = true;
  }
});

postText.addEventListener("input", () => {
  submitPost.disabled = postText.value.trim() === "";
});

submitPost.addEventListener("click", () => {
  const text = postText.value.trim();
  if (!text) return;
  const newPost = {
    id: nextId++,
    author: currentUser.name,
    initial: currentUser.initial,
    color: currentUser.color,
    time: "Just now",
    text,
    image: null,
    likes: 0,
    comments: [],
    liked: false,
    showComments: false
  };
  posts = [newPost, ...posts];
  postText.value = "";
  submitPost.disabled = true;
  postModal.classList.remove("open");
  renderPosts();
});

// ── NAV BUTTONS ACTIVE STATE ──
document.querySelectorAll(".nav-center button").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".nav-center button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
  });
});

// ── INIT ──
document.addEventListener('DOMContentLoaded', () => {
  renderContacts();
  renderPosts();
});
// ── NAV BUTTONS ACTIVE STATE ──
document.querySelectorAll(".nav-center button").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".nav-center button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
  });
});

// ── INIT ──
document.addEventListener('DOMContentLoaded', () => {
  renderContacts();
  renderPosts();
});
// ── NAV BUTTONS ACTIVE STATE ──
document.querySelectorAll(".nav-center button").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".nav-center button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
  });
});

// ── INIT ──
document.addEventListener('DOMContentLoaded', () => {
  renderContacts();
  renderPosts();
});
