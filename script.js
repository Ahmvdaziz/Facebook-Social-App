// ══════════════════════════════════════════════════════════════
// ──  FACEBOOK SOCIAL APP - MAIN APPLICATION  ──
// ══════════════════════════════════════════════════════════════

// ── DATA & STATE MANAGEMENT ──
const currentUser = { 
  id: 1,
  name: "Ahmed Aziz", 
  initial: "A", 
  color: "#1877f2",
  bio: "Software Engineer | Tech Enthusiast",
  followers: 245,
  following: 180,
  profileImage: "https://i.pravatar.cc/150?img=1"
};

const appState = {
  filterType: 'all',
  searchQuery: '',
  sortBy: 'recent',
  notificationCount: 3,
  selectedPostId: null,
  userLikes: new Set(),
  userFollowing: new Set([2, 3, 4, 5]),
};

// ── UTILITY FUNCTIONS ──
function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getTimeAgo(time) {
  const timeMap = {
    'Just now': 0,
    '2 hours ago': 2,
    '4 hours ago': 4,
    '6 hours ago': 6,
    'Yesterday': 24
  };
  return timeMap[time] || 0;
}

function formatDate(date) {
  const now = new Date();
  const postDate = new Date(date);
  const diffMins = Math.floor((now - postDate) / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
  return `${Math.floor(diffMins / 1440)}d ago`;
}

function generateRandomColor() {
  const colors = ['#e91e8c', '#6200ea', '#ff5722', '#0097a7', '#388e3c', '#f57c00', '#c2185b'];
  return colors[Math.floor(Math.random() * colors.length)];
}

function debounce(func, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

const initialPosts = [
  {
    id: 1,
    author: "Ahmed Sayed",
    authorId: 2,
    initial: "A",
    color: "#e91e8c",
    time: "2 hours ago",
    text: "Just had an amazing hike in the mountains! Nature is truly breathtaking. 🌄",
    image: "https://picsum.photos/seed/hike/600/400",
    likes: 42,
    reactions: { like: 35, love: 7, wow: 0, sad: 0, angry: 0 },
    comments: [
      { name: "Shahd Mohamed", text: "Looks amazing! Which trail?" },
      { name: "Ahmed Aziz", text: "I love hiking! So jealous 😍" }
    ],
    liked: false,
    showComments: false,
    editable: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    edited: false,
    shares: 12,
    isPrivate: false,
    location: "Mountain Peak Trail"
  },
  {
    id: 2,
    author: "Shahd Mohamed",
    authorId: 3,
    initial: "S",
    color: "#6200ea",
    time: "4 hours ago",
    text: "Just finished building my first full-stack app. Feels great to ship something! 🚀",
    image: null,
    likes: 87,
    reactions: { like: 70, love: 15, wow: 2, sad: 0, angry: 0 },
    comments: [
      { name: "Ahmed Aziz", text: "Congrats! What stack did you use?" }
    ],
    liked: false,
    showComments: false,
    editable: false,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    edited: false,
    shares: 23,
    isPrivate: false,
    location: null
  },
  {
    id: 3,
    author: "Ahmed Aziz",
    authorId: 1,
    initial: "A",
    color: "#ff5722",
    time: "6 hours ago",
    text: "Made homemade pasta for the first time today. Definitely not perfect but it tasted incredible! 🍝",
    image: "https://picsum.photos/seed/pasta/600/400",
    likes: 134,
    reactions: { like: 110, love: 20, wow: 4, sad: 0, angry: 0 },
    comments: [],
    liked: false,
    showComments: false,
    editable: true,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    edited: false,
    shares: 45,
    isPrivate: false,
    location: "Home Kitchen"
  },
  {
    id: 4,
    author: "Omar Hassan",
    authorId: 4,
    initial: "O",
    color: "#0097a7",
    time: "Yesterday",
    text: "Beautiful sunset from my balcony tonight. Sometimes you just have to stop and appreciate the little things. 🌅",
    image: "https://picsum.photos/seed/sunset/600/400",
    likes: 210,
    reactions: { like: 170, love: 35, wow: 5, sad: 0, angry: 0 },
    comments: [
      { name: "Ahmed Sayed", text: "Wow that view is stunning!" },
      { name: "Shahd Mohamed", text: "Where do you live? Amazing!" }
    ],
    liked: false,
    showComments: false,
    editable: false,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    edited: false,
    shares: 67,
    isPrivate: false,
    location: "Downtown"
  },
  {
    id: 5,
    author: "Ahmed Sayed",
    authorId: 2,
    initial: "A",
    color: "#e91e8c",
    time: "1 day ago",
    text: "New JavaScript framework just dropped. Performance improvements are insane! #WebDevelopment",
    image: null,
    likes: 156,
    reactions: { like: 140, love: 10, wow: 6, sad: 0, angry: 0 },
    comments: [],
    liked: false,
    showComments: false,
    editable: false,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    edited: false,
    shares: 89,
    isPrivate: false,
    location: null
  }
];

const users = [
  { id: 1, name: "Ahmed Aziz",    initial: "A", color: "#e91e8c", online: true, bio: "Engineer", followers: 245, verified: true },
  { id: 2, name: "Ahmed Sayed",   initial: "A", color: "#6200ea", online: true, bio: "Designer", followers: 512, verified: false },
  { id: 3, name: "Shahd Mohamed", initial: "S", color: "#ff5722", online: false, bio: "Developer", followers: 423, verified: false },
  { id: 4, name: "Omar Hassan",   initial: "O", color: "#0097a7", online: true, bio: "Photographer", followers: 876, verified: true },
  { id: 5, name: "Eve Martinez",  initial: "E", color: "#388e3c", online: true, bio: "Marketer", followers: 342, verified: false },
  { id: 6, name: "Frank Turner",  initial: "F", color: "#f57c00", online: false, bio: "Entrepreneur", followers: 654, verified: true },
  { id: 7, name: "Grace Kim",     initial: "G", color: "#c2185b", online: true, bio: "Artist", followers: 789, verified: false }
];

const contacts = users.map(u => ({ ...u }));

const friendRequests = [
  { id: 8, name: "John Doe", initial: "J", color: "#00796b", photo: "https://i.pravatar.cc/150?img=8", status: "pending" },
  { id: 9, name: "Sarah Smith", initial: "S", color: "#d32f2f", photo: "https://i.pravatar.cc/150?img=9", status: "pending" }
];

const notifications = [
  { id: 1, type: 'like', user: 'Ahmed Sayed', action: 'liked your post', time: '5 min ago', read: false },
  { id: 2, type: 'comment', user: 'Shahd Mohamed', action: 'commented on your post', time: '15 min ago', read: false },
  { id: 3, type: 'follow', user: 'Omar Hassan', action: 'started following you', time: '1 hour ago', read: true }
];

const trendingTopics = [
  { id: 1, topic: '#WebDevelopment', posts: 2345, trending: true },
  { id: 2, topic: '#JavaScript', posts: 5678, trending: true },
  { id: 3, topic: '#ReactJS', posts: 3456, trending: true },
  { id: 4, topic: '#WebDesign', posts: 2109, trending: false },
  { id: 5, topic: '#FrontEnd', posts: 1876, trending: false }
];

const suggestedUsers = [
  { id: 8, name: "John Doe", initial: "J", color: "#00796b", mutualFriends: 12 },
  { id: 9, name: "Sarah Smith", initial: "S", color: "#d32f2f", mutualFriends: 8 },
  { id: 10, name: "Mike Wilson", initial: "M", color: "#ff6f00", mutualFriends: 15 }
];

let posts = [...initialPosts];
let nextId = posts.length + 1;
let nextNotificationId = notifications.length + 1;

// ══════════════════════════════════════════════════════════════
// ──  SEARCH & FILTER FUNCTIONS  ──
// ══════════════════════════════════════════════════════════════

function searchPosts(query) {
  appState.searchQuery = query.toLowerCase();
  filterAndSortPosts();
}

function filterPostsByType(type) {
  appState.filterType = type;
  filterAndSortPosts();
}

function filterAndSortPosts() {
  let filtered = posts.filter(post => {
    const matchesSearch = appState.searchQuery === '' || 
      post.text.toLowerCase().includes(appState.searchQuery) ||
      post.author.toLowerCase().includes(appState.searchQuery);
    
    const matchesFilter = appState.filterType === 'all' ||
      (appState.filterType === 'trending' && post.likes > 100) ||
      (appState.filterType === 'friends' && appState.userFollowing.has(post.authorId)) ||
      (appState.filterType === 'recent' && true);
    
    return matchesSearch && matchesFilter;
  });

  if (appState.sortBy === 'trending') {
    filtered.sort((a, b) => b.likes - a.likes);
  } else if (appState.sortBy === 'recent') {
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } else if (appState.sortBy === 'popular') {
    filtered.sort((a, b) => (b.likes + b.comments.length) - (a.likes + a.comments.length));
  }

  renderPosts(filtered);
}

function searchUsers(query) {
  const resultsContainer = document.getElementById('search-results');
  if (!resultsContainer) return;

  const filtered = users.filter(u => 
    u.name.toLowerCase().includes(query.toLowerCase())
  );

  resultsContainer.innerHTML = filtered.map(u => `
    <div class="user-search-result">
      <div class="avatar-small" style="background:${u.color}">${u.initial}</div>
      <div class="user-info">
        <div class="user-name">${escapeHtml(u.name)} ${u.verified ? '✓' : ''}</div>
        <div class="user-bio">${u.followers} followers</div>
      </div>
      <button class="btn-follow" onclick="toggleFollowUser(${u.id})">
        ${appState.userFollowing.has(u.id) ? 'Following' : 'Follow'}
      </button>
    </div>
  `).join('');
}

// ══════════════════════════════════════════════════════════════
// ──  NOTIFICATION & ALERT FUNCTIONS  ──
// ══════════════════════════════════════════════════════════════

function addNotification(type, user, action) {
  const notification = {
    id: nextNotificationId++,
    type,
    user,
    action,
    time: 'Just now',
    read: false
  };
  notifications.unshift(notification);
  appState.notificationCount++;
  updateNotificationBadge();
  showNotificationToast(user, action);
}

function showNotificationToast(user, action) {
  const toast = document.createElement('div');
  toast.className = 'notification-toast';
  toast.innerHTML = `<strong>${user}</strong> ${action}`;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function updateNotificationBadge() {
  const badge = document.querySelector('.notification-badge');
  if (badge) {
    badge.textContent = appState.notificationCount;
    badge.style.display = appState.notificationCount > 0 ? 'block' : 'none';
  }
}

function clearNotifications() {
  notifications.forEach(n => n.read = true);
  appState.notificationCount = 0;
  updateNotificationBadge();
}

// ══════════════════════════════════════════════════════════════
// ──  CONTACTS & FRIENDS FUNCTIONS  ──
// ══════════════════════════════════════════════════════════════

function renderContacts() {
  const container = document.getElementById("contacts");
  if (!container) return;
  
  container.innerHTML = contacts.map(c => `
    <div class="contact-item" onclick="openUserProfile(${c.id})">
      <div class="contact-avatar" style="background:${c.color}">
        ${c.initial}
        ${c.online ? '<span class="online-dot"></span>' : ''}
      </div>
      <span class="contact-name">${escapeHtml(c.name)}</span>
    </div>
  `).join('');
}

function toggleFollowUser(userId) {
  if (appState.userFollowing.has(userId)) {
    appState.userFollowing.delete(userId);
    addNotification('unfollow', 'You', `unfollowed user`);
  } else {
    appState.userFollowing.add(userId);
    addNotification('follow', 'You', `started following user`);
  }
}

function acceptFriendRequest(requestId) {
  const request = friendRequests.find(r => r.id === requestId);
  if (request) {
    request.status = 'accepted';
    contacts.push({ id: requestId, name: request.name, initial: request.initial, color: request.color, online: false });
    friendRequests.splice(friendRequests.indexOf(request), 1);
    showNotificationToast('Success', `Added ${request.name} as friend`);
  }
}

function rejectFriendRequest(requestId) {
  const request = friendRequests.find(r => r.id === requestId);
  if (request) {
    friendRequests.splice(friendRequests.indexOf(request), 1);
    showNotificationToast('Rejected', `Declined friend request from ${request.name}`);
  }
}

// ══════════════════════════════════════════════════════════════
// ──  POST RENDERING & MANAGEMENT  ──
// ══════════════════════════════════════════════════════════════

function renderPosts(postsToRender = posts) {
  const container = document.getElementById("posts-container");
  if (!container) return;
  
  if (postsToRender.length === 0) {
    container.innerHTML = '<div class="no-posts">No posts found. Try adjusting your filters!</div>';
    return;
  }
  
  container.innerHTML = postsToRender.map(post => {
    const isOwn = post.authorId === currentUser.id;
    const totalReactions = Object.values(post.reactions || {}).reduce((a, b) => a + b, 0) || post.likes;
    
    return `
    <div class="post-card" id="post-${post.id}">
      <div class="post-header">
        <div class="avatar-small" style="background:${post.color}">${post.initial}</div>
        <div class="post-info">
          <div class="name">${escapeHtml(post.author)} ${post.authorId <= 4 ? '✓' : ''}</div>
          <div class="time">🌐 ${post.time} ${post.edited ? '(Edited)' : ''}</div>
          ${post.location ? `<div class="post-location">📍 ${escapeHtml(post.location)}</div>` : ''}
        </div>
        <div class="post-menu-wrapper">
          <button class="post-menu" onclick="openPostMenu(${post.id})">•••</button>
          <div class="post-menu-dropdown" id="menu-${post.id}">
            ${isOwn ? `
              <div class="menu-item" onclick="editPost(${post.id})">✏️ Edit</div>
              <div class="menu-item" onclick="deletePost(${post.id})">🗑️ Delete</div>
              <div class="menu-item" onclick="togglePrivacy(${post.id})">🔒 ${post.isPrivate ? 'Make Public' : 'Make Private'}</div>
            ` : `
              <div class="menu-item" onclick="reportPost(${post.id})">⚠️ Report</div>
              <div class="menu-item" onclick="blockUser(${post.authorId})">🚫 Block User</div>
            `}
            <div class="menu-item" onclick="copyPostLink(${post.id})">🔗 Copy Link</div>
          </div>
        </div>
      </div>
      <div class="post-text">${escapeHtml(post.text)}</div>
      ${post.image ? `
        <div class="post-image">
          <img src="${post.image}" alt="Post image" loading="lazy" onclick="expandImage(this)"/>
        </div>` : ''}
      <div class="post-stats">
        <span class="stat-item" onclick="showReactionsList(${post.id})">
          ${post.reactions ? Object.keys(post.reactions).map(r => post.reactions[r] > 0 ? '👍' : '').join('') : ''}
          ${totalReactions} ${totalReactions === 1 ? 'Reaction' : 'Reactions'}
        </span>
        <span class="stat-item" onclick="toggleComments(${post.id})">
          💬 ${post.comments.length} ${post.comments.length === 1 ? 'Comment' : 'Comments'}
        </span>
        <span class="stat-item">
          ↗️ ${post.shares} ${post.shares === 1 ? 'Share' : 'Shares'}
        </span>
      </div>
      <div class="post-actions">
        <button onclick="openReactionsMenu(${post.id})" class="reaction-btn ${post.liked ? 'liked' : ''}">
          👍 Like
        </button>
        <button onclick="toggleComments(${post.id})">
          💬 Comment
        </button>
        <button onclick="openShareModal(${post.id})">
          ↗️ Share
        </button>
        <button onclick="savePost(${post.id})">
          🔖 Save
        </button>
      </div>
      <div class="comments-section ${post.showComments ? 'open' : ''}" id="comments-${post.id}">
        <div class="comments-list">
          ${post.comments.map((c, idx) => `
            <div class="comment-item">
              <div class="avatar-small" style="width:32px;height:32px;font-size:13px;background:#65676b">
                ${c.name.charAt(0)}
              </div>
              <div class="comment-bubble">
                <div class="c-name">${escapeHtml(c.name)}</div>
                <div class="c-text">${escapeHtml(c.text)}</div>
                <div class="comment-meta">
                  <span onclick="likeComment(${post.id}, ${idx})">Like</span>
                  <span>·</span>
                  <span>1m</span>
                  <span>·</span>
                  <button class="reply-btn" onclick="replyToComment(${post.id}, ${idx})">Reply</button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
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
  `}).join('');
}

// ══════════════════════════════════════════════════════════════
// ──  POST INTERACTION FUNCTIONS  ──
// ══════════════════════════════════════════════════════════════

function openReactionsMenu(postId) {
  const post = posts.find(p => p.id === postId);
  if (!post) return;

  const modal = document.createElement('div');
  modal.className = 'modal-overlay open';
  modal.innerHTML = `
    <div class="reactions-menu">
      <h3>React to this post</h3>
      <div class="reactions-grid">
        <div class="reaction-option" onclick="reactToPost(${postId}, 'like')">
          <span class="reaction-emoji">👍</span>
          <span class="reaction-name">Like</span>
        </div>
        <div class="reaction-option" onclick="reactToPost(${postId}, 'love')">
          <span class="reaction-emoji">❤️</span>
          <span class="reaction-name">Love</span>
        </div>
        <div class="reaction-option" onclick="reactToPost(${postId}, 'wow')">
          <span class="reaction-emoji">😮</span>
          <span class="reaction-name">Wow</span>
        </div>
        <div class="reaction-option" onclick="reactToPost(${postId}, 'sad')">
          <span class="reaction-emoji">😢</span>
          <span class="reaction-name">Sad</span>
        </div>
        <div class="reaction-option" onclick="reactToPost(${postId}, 'angry')">
          <span class="reaction-emoji">😠</span>
          <span class="reaction-name">Angry</span>
        </div>
      </div>
    </div>
  `;
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });
  
  document.body.appendChild(modal);
}

function reactToPost(postId, reactionType) {
  const post = posts.find(p => p.id === postId);
  if (!post) return;
  
  if (!post.reactions) post.reactions = { like: 0, love: 0, wow: 0, sad: 0, angry: 0 };
  post.reactions[reactionType]++;
  post.liked = true;
  post.likes++;
  
  addNotification('reaction', post.author, `reacted to your post`);
  document.querySelector('.modal-overlay.open')?.remove();
  filterAndSortPosts();
}

function toggleLike(id) {
  posts = posts.map(p => {
    if (p.id === id) {
      const liked = !p.liked;
      return { ...p, liked, likes: liked ? p.likes + 1 : Math.max(0, p.likes - 1) };
    }
    return p;
  });
  filterAndSortPosts();
}

function openPostMenu(postId) {
  const menu = document.getElementById(`menu-${postId}`);
  if (menu) {
    menu.classList.toggle('show');
    // Close other menus
    document.querySelectorAll('.post-menu-dropdown.show').forEach(m => {
      if (m.id !== `menu-${postId}`) m.classList.remove('show');
    });
  }
}

function editPost(postId) {
  const post = posts.find(p => p.id === postId);
  if (!post) return;
  
  const newText = prompt('Edit your post:', post.text);
  if (newText && newText.trim() !== '') {
    post.text = newText;
    post.edited = true;
    addNotification('edit', 'You', `edited your post`);
    filterAndSortPosts();
  }
}

function deletePost(postId) {
  if (confirm('Are you sure you want to delete this post?')) {
    posts = posts.filter(p => p.id !== postId);
    filterAndSortPosts();
    showNotificationToast('Deleted', 'Your post has been deleted');
  }
}

function togglePrivacy(postId) {
  const post = posts.find(p => p.id === postId);
  if (post) {
    post.isPrivate = !post.isPrivate;
    filterAndSortPosts();
  }
}

function savePost(postId) {
  const post = posts.find(p => p.id === postId);
  if (post) {
    showNotificationToast('Saved', `Post from ${post.author} has been saved`);
  }
}

function reportPost(postId) {
  showNotificationToast('Reported', 'Post has been reported to moderators');
}

function blockUser(userId) {
  const user = users.find(u => u.id === userId);
  if (user) {
    showNotificationToast('Blocked', `${user.name} has been blocked`);
  }
}

function copyPostLink(postId) {
  const link = `${window.location.href}?post=${postId}`;
  navigator.clipboard.writeText(link).then(() => {
    showNotificationToast('Copied', 'Post link copied to clipboard');
    openPostMenu(postId);
  });
}

function expandImage(imgElement) {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay open';
  modal.innerHTML = `<img src="${imgElement.src}" class="expanded-image" onclick="this.parentElement.remove()">`;
  document.body.appendChild(modal);
}

function showReactionsList(postId) {
  const post = posts.find(p => p.id === postId);
  if (!post || !post.reactions) return;
  
  const details = Object.entries(post.reactions)
    .filter(([_, count]) => count > 0)
    .map(([type, count]) => `👍 ${type}: ${count}`)
    .join('\n');
  
  alert(`Reactions:\n${details || 'No reactions yet'}`);
}

function likeComment(postId, commentIndex) {
  const post = posts.find(p => p.id === postId);
  if (post && post.comments[commentIndex]) {
    post.comments[commentIndex].likes = (post.comments[commentIndex].likes || 0) + 1;
    renderPosts(posts);
  }
}

function replyToComment(postId, commentIndex) {
  const reply = prompt('Reply to this comment:');
  if (reply && reply.trim() !== '') {
    const post = posts.find(p => p.id === postId);
    if (post) {
      post.comments[commentIndex].replies = post.comments[commentIndex].replies || [];
      post.comments[commentIndex].replies.push({ name: currentUser.name, text: reply });
      renderPosts(posts);
    }
  }
}

function toggleComments(id) {
  posts = posts.map(p =>
    p.id === id ? { ...p, showComments: !p.showComments } : p
  );
  filterAndSortPosts();
  if (posts.find(p => p.id === id).showComments) {
    setTimeout(() => {
      const input = document.getElementById(`comment-input-${id}`);
      if (input) input.focus();
    }, 0);
  }
}

function submitComment(id) {
  const input = document.getElementById(`comment-input-${id}`);
  const text = input.value.trim();
  if (!text) return;
  
  posts = posts.map(p => {
    if (p.id === id) {
      addNotification('comment', currentUser.name, `commented on ${p.author}'s post`);
      return {
        ...p,
        showComments: true,
        comments: [...p.comments, { name: currentUser.name, text, likes: 0 }]
      };
    }
    return p;
  });
  
  input.value = "";
  filterAndSortPosts();
}

function handleCommentKey(event, id) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    submitComment(id);
  }
}

// ══════════════════════════════════════════════════════════════
// ──  SHARE & MODAL FUNCTIONS  ──
// ══════════════════════════════════════════════════════════════

function openShareModal(postId) {
  const post = posts.find(p => p.id === postId);
  if (!post) return;

  const modalOverlay = document.createElement('div');
  modalOverlay.className = 'modal-overlay open';
  modalOverlay.innerHTML = `
    <div class="share-modal">
      <div class="modal-header">
        <h3>Share this post</h3>
        <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">✕</button>
      </div>
      <div class="share-options">
        <div class="share-option" onclick="shareToFacebook(${postId})">
          <span class="share-icon">👥</span>
          <div class="share-text-wrap">
            <div class="share-text">Share on Feed</div>
            <div class="share-desc">Share with your friends</div>
          </div>
        </div>
        <div class="share-option" onclick="shareViaMessenger(${postId})">
          <span class="share-icon">💬</span>
          <div class="share-text-wrap">
            <div class="share-text">Send via Messenger</div>
            <div class="share-desc">Send to a friend privately</div>
          </div>
        </div>
        <div class="share-option" onclick="sendViaEmail(${postId})">
          <span class="share-icon">📧</span>
          <div class="share-text-wrap">
            <div class="share-text">Send via Email</div>
            <div class="share-desc">Share with email</div>
          </div>
        </div>
        <div class="share-option" onclick="copyShareLink(${postId})">
          <span class="share-icon">🔗</span>
          <div class="share-text-wrap">
            <div class="share-text">Copy Link</div>
            <div class="share-desc">Copy post link to clipboard</div>
          </div>
        </div>
      </div>
    </div>
  `;

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) modalOverlay.remove();
  });

  document.body.appendChild(modalOverlay);
}

function shareToFacebook(postId) {
  const post = posts.find(p => p.id === postId);
  if (!post) return;
  
  const newShare = {
    id: nextId++,
    author: currentUser.name,
    authorId: currentUser.id,
    initial: currentUser.initial,
    color: currentUser.color,
    time: "Just now",
    text: `Shared: "${post.text.substring(0, 100)}..."`,
    image: post.image,
    likes: 0,
    reactions: { like: 0, love: 0, wow: 0, sad: 0, angry: 0 },
    comments: [],
    liked: false,
    showComments: false,
    editable: true,
    createdAt: new Date(),
    edited: false,
    shares: 0,
    isPrivate: false,
    location: null
  };
  
  posts.unshift(newShare);
  addNotification('share', currentUser.name, `shared a post from ${post.author}`);
  
  const modal = document.querySelector('.modal-overlay.open');
  if (modal) modal.remove();
  
  showNotificationToast('Shared', 'Post shared to your feed!');
  filterAndSortPosts();
}

function shareViaMessenger(postId) {
  const post = posts.find(p => p.id === postId);
  showNotificationToast('Ready', `Open Messenger to share post by ${post.author}`);
  document.querySelector('.modal-overlay.open')?.remove();
}

function sendViaEmail(postId) {
  const post = posts.find(p => p.id === postId);
  showNotificationToast('Ready', `Share link: ${window.location.href}?post=${postId}`);
  document.querySelector('.modal-overlay.open')?.remove();
}

function copyShareLink(postId) {
  const shareLink = `${window.location.href.split('?')[0]}?post=${postId}`;
  navigator.clipboard.writeText(shareLink).then(() => {
    showNotificationToast('Copied', 'Link copied to clipboard!');
    document.querySelector('.modal-overlay.open')?.remove();
  }).catch(err => {
    console.error('Failed to copy:', err);
  });
}

// ══════════════════════════════════════════════════════════════
// ──  USER PROFILE FUNCTIONS  ──
// ══════════════════════════════════════════════════════════════

function openUserProfile(userId) {
  const user = users.find(u => u.id === userId);
  if (!user) return;
  
  const modal = document.createElement('div');
  modal.className = 'modal-overlay open';
  modal.innerHTML = `
    <div class="profile-modal">
      <div class="profile-header">
        <div class="profile-banner" style="background: linear-gradient(135deg, ${user.color}, #f0f2f5)"></div>
        <div class="profile-info">
          <div class="avatar-large" style="background:${user.color}; width: 80px; height: 80px;">${user.initial}</div>
          <div class="profile-details">
            <h2>${escapeHtml(user.name)} ${user.verified ? '✓' : ''}</h2>
            <p>${user.bio}</p>
            <div class="profile-stats">
              <div class="stat"><strong>${user.followers}</strong> Followers</div>
              <div class="stat"><strong>${appState.userFollowing.size}</strong> Following</div>
            </div>
          </div>
          <button class="btn-follow" onclick="toggleFollowUser(${user.id}); this.closest('.modal-overlay').remove()">
            ${appState.userFollowing.has(user.id) ? '✓ Following' : '+ Follow'}
          </button>
        </div>
      </div>
      <div class="profile-posts">
        <h3>Recent Posts</h3>
        ${posts.filter(p => p.authorId === userId).slice(0, 3).map(p => `
          <div class="mini-post">
            <p>${p.text.substring(0, 100)}...</p>
            <small>${p.time}</small>
          </div>
        `).join('') || '<p>No posts yet</p>'}
      </div>
    </div>
  `;
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });
  
  document.body.appendChild(modal);
}

function openCurrentUserProfile() {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay open';
  modal.innerHTML = `
    <div class="profile-modal">
      <div class="profile-header">
        <div class="profile-banner" style="background: linear-gradient(135deg, ${currentUser.color}, #42b883)"></div>
        <div class="profile-info">
          <div class="avatar-large" style="background:${currentUser.color}; width: 80px; height: 80px;">${currentUser.initial}</div>
          <div class="profile-details">
            <h2>${currentUser.name}</h2>
            <p>${currentUser.bio}</p>
            <div class="profile-stats">
              <div class="stat"><strong>${currentUser.followers}</strong> Followers</div>
              <div class="stat"><strong>${currentUser.following}</strong> Following</div>
            </div>
          </div>
          <button class="btn-edit-profile" onclick="editCurrentUserProfile()">✏️ Edit Profile</button>
        </div>
      </div>
      <div class="profile-posts">
        <h3>My Posts</h3>
        ${posts.filter(p => p.authorId === currentUser.id).map(p => `
          <div class="mini-post">
            <p>${p.text.substring(0, 100)}...</p>
            <small>${p.time}</small>
          </div>
        `).join('') || '<p>No posts yet</p>'}
      </div>
    </div>
  `;
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });
  
  document.body.appendChild(modal);
}

function editCurrentUserProfile() {
  const newBio = prompt('Edit your bio:', currentUser.bio);
  if (newBio !== null) {
    currentUser.bio = newBio;
    showNotificationToast('Updated', 'Profile bio updated');
  }
}

// ══════════════════════════════════════════════════════════════
// ──  CREATE POST MODAL & INITIALIZATION  ──
// ══════════════════════════════════════════════════════════════

const postModal   = document.getElementById("postModal");
const openModalBtn = document.getElementById("openModalBtn");
const closeModal  = document.getElementById("closeModal");
const postText    = document.getElementById("postText");
const submitPost  = document.getElementById("submitPost");

if (openModalBtn) {
  openModalBtn.addEventListener("click", () => {
    if (postModal) {
      postModal.classList.add("open");
      postText.focus();
    }
  });
}

if (closeModal) {
  closeModal.addEventListener("click", () => {
    if (postModal) {
      postModal.classList.remove("open");
      postText.value = "";
      submitPost.disabled = true;
    }
  });
}

if (postModal) {
  postModal.addEventListener("click", (e) => {
    if (e.target === postModal) {
      postModal.classList.remove("open");
      postText.value = "";
      submitPost.disabled = true;
    }
  });
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && postModal && postModal.classList.contains("open")) {
    postModal.classList.remove("open");
    postText.value = "";
    submitPost.disabled = true;
  }
});

if (postText) {
  postText.addEventListener("input", () => {
    if (submitPost) {
      submitPost.disabled = postText.value.trim() === "";
    }
  });
}

if (submitPost) {
  submitPost.addEventListener("click", () => {
    const text = postText.value.trim();
    if (!text) return;
    
    const newPost = {
      id: nextId++,
      author: currentUser.name,
      authorId: currentUser.id,
      initial: currentUser.initial,
      color: currentUser.color,
      time: "Just now",
      text,
      image: null,
      likes: 0,
      reactions: { like: 0, love: 0, wow: 0, sad: 0, angry: 0 },
      comments: [],
      liked: false,
      showComments: false,
      editable: true,
      createdAt: new Date(),
      edited: false,
      shares: 0,
      isPrivate: false,
      location: null
    };
    
    posts = [newPost, ...posts];
    postText.value = "";
    submitPost.disabled = true;
    if (postModal) postModal.classList.remove("open");
    
    addNotification('post', currentUser.name, 'created a new post');
    filterAndSortPosts();
  });
}

// ── NAV BUTTONS ACTIVE STATE ──
document.querySelectorAll(".nav-center button").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".nav-center button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
  });
});

// ── SIDEBAR INTERACTIONS ──
document.addEventListener('DOMContentLoaded', () => {
  const profileAvatar = document.querySelector('.avatar-small');
  if (profileAvatar) {
    profileAvatar.addEventListener('click', openCurrentUserProfile);
  }
});

// ── SEARCH FUNCTIONALITY ──
const searchInput = document.querySelector('input[placeholder*="search"]');
if (searchInput) {
  searchInput.addEventListener('input', debounce((e) => {
    searchPosts(e.target.value);
  }, 300));
}

// ── TRENDING TAGS SIDEBAR ──
function renderTrendingTopics() {
  const container = document.getElementById('trending-topics');
  if (!container) return;
  
  container.innerHTML = `
    <h3 style="padding: 12px; font-size: 15px;">Trending</h3>
    ${trendingTopics.map(t => `
      <div class="trending-item" onclick="searchPosts('${t.topic.substring(1)}')">
        <div class="trending-topic">${t.topic}</div>
        <div class="trending-count">${t.posts.toLocaleString()} posts</div>
      </div>
    `).join('')}
  `;
}

// ── SUGGESTED USERS SIDEBAR ──
function renderSuggestedUsers() {
  const container = document.getElementById('suggested-users');
  if (!container) return;
  
  container.innerHTML = `
    <h3 style="padding: 12px; font-size: 15px;">People You May Know</h3>
    ${suggestedUsers.map(u => `
      <div class="suggested-user-item">
        <div class="avatar-small" style="background:${u.color}">${u.initial}</div>
        <div class="suggested-info">
          <div class="suggested-name">${u.name}</div>
          <div class="mutual-friends">${u.mutualFriends} mutual friends</div>
        </div>
        <button class="btn-add-friend" onclick="toggleFollowUser(${u.id}); renderSuggestedUsers()">+ Add</button>
      </div>
    `).join('')}
  `;
}

// ── FRIEND REQUESTS ──
function renderFriendRequests() {
  const container = document.getElementById('friend-requests');
  if (!container || friendRequests.length === 0) return;
  
  container.innerHTML = `
    <h3 style="padding: 12px; font-size: 15px;">Friend Requests</h3>
    ${friendRequests.map(r => `
      <div class="friend-request-item">
        <div class="avatar-small" style="background:${r.color}">${r.initial}</div>
        <div class="request-info">
          <div class="request-name">${r.name}</div>
          <div class="request-actions">
            <button class="btn-confirm" onclick="acceptFriendRequest(${r.id}); renderFriendRequests()">Confirm</button>
            <button class="btn-delete" onclick="rejectFriendRequest(${r.id}); renderFriendRequests()">Delete</button>
          </div>
        </div>
      </div>
    `).join('')}
  `;
}

// ── NOTIFICATIONS PANEL ──
function openNotificationsPanel() {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay open';
  modal.innerHTML = `
    <div class="notifications-panel">
      <div class="panel-header">
        <h3>Notifications</h3>
        <button class="btn-clear" onclick="clearNotifications(); this.closest('.modal-overlay').remove()">Clear All</button>
      </div>
      <div class="notifications-list">
        ${notifications.map(n => `
          <div class="notification-item ${n.read ? 'read' : ''}">
            <div class="notification-content">
              <strong>${n.user}</strong> ${n.action}
            </div>
            <small>${n.time}</small>
          </div>
        `).join('') || '<p>No notifications</p>'}
      </div>
    </div>
  `;
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });
  
  document.body.appendChild(modal);
}

// ── FILTER & SORT ──
function setupFilterButtons() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterPostsByType(btn.dataset.filter);
    });
  });
}

// ══════════════════════════════════════════════════════════════
// ──  INITIALIZATION  ──
// ══════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Facebook App Initialized');
  
  renderContacts();
  renderPosts();
  renderTrendingTopics();
  renderSuggestedUsers();
  renderFriendRequests();
  setupFilterButtons();
  updateNotificationBadge();
  
  // Auto-refresh notifications periodically
  setInterval(() => {
    updateNotificationBadge();
  }, 5000);
  
  // Handle notification bell click
  const notificationBell = document.querySelector('.nav-right [title="Notifications"]');
  if (notificationBell) {
    notificationBell.addEventListener('click', openNotificationsPanel);
  }
  
  // Handle user avatar click
  const avatarSmall = document.querySelector('.nav-right .avatar-small');
  if (avatarSmall) {
    avatarSmall.addEventListener('click', openCurrentUserProfile);
  }
});
