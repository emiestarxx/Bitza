// Bitza in-app chat widget (demo — localStorage-backed)
const CHAT_KEY = 'bitza-chat';
let chatPeer = 'Seller';

function chatInit() {
  if (document.getElementById('chatLauncher')) return;

  const launcher = document.createElement('button');
  launcher.className = 'chat-launcher';
  launcher.id = 'chatLauncher';
  launcher.innerHTML = '💬';
  launcher.onclick = () => toggleChat(true);
  document.body.appendChild(launcher);

  const panel = document.createElement('div');
  panel.className = 'chat-panel';
  panel.id = 'chatPanel';
  panel.innerHTML =
    '<div class="chat-header">' +
      '<span id="chatPeer">💬 Chat</span>' +
      '<button onclick="toggleChat(false)">✕</button>' +
    '</div>' +
    '<div class="chat-body" id="chatBody"></div>' +
    '<div class="chat-input-row">' +
      '<input id="chatInput" type="text" placeholder="Type a message..." />' +
      '<button class="chat-send" onclick="sendChat()">Send</button>' +
    '</div>';
  document.body.appendChild(panel);

  const input = document.getElementById('chatInput');
  input.addEventListener('keydown', e => { if (e.key === 'Enter') sendChat(); });

  renderChat();
}

function openChat(peer) {
  chatPeer = peer || 'Seller';
  const header = document.getElementById('chatPeer');
  if (header) header.textContent = '💬 ' + chatPeer;
  toggleChat(true);
}

function toggleChat(open) {
  const panel = document.getElementById('chatPanel');
  if (!panel) return;
  if (open) {
    panel.classList.add('open');
    const header = document.getElementById('chatPeer');
    if (header) header.textContent = '💬 ' + chatPeer;
    setTimeout(() => document.getElementById('chatInput')?.focus(), 100);
  } else {
    panel.classList.remove('open');
  }
}

function getChatLog() {
  try { return JSON.parse(localStorage.getItem(CHAT_KEY)) || []; }
  catch { return []; }
}
function saveChatLog(log) {
  localStorage.setItem(CHAT_KEY, JSON.stringify(log));
}

function renderChat() {
  const body = document.getElementById('chatBody');
  if (!body) return;
  const log = getChatLog();
  if (log.length === 0) {
    body.innerHTML = '<div class="chat-msg them">Hi! Ask me anything about this item. 💚</div>';
    return;
  }
  body.innerHTML = log.map(m =>
    '<div class="chat-msg ' + (m.from === 'me' ? 'me' : 'them') + '">' + m.text + '</div>'
  ).join('');
  body.scrollTop = body.scrollHeight;
}

function sendChat() {
  const input = document.getElementById('chatInput');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;
  const log = getChatLog();
  log.push({ from: 'me', text, ts: Date.now() });
  saveChatLog(log);
  input.value = '';
  renderChat();
  // Fake reply
  setTimeout(() => {
    const log2 = getChatLog();
    log2.push({ from: 'them', text: 'Thanks! Still available. When can you come see it?', ts: Date.now() });
    saveChatLog(log2);
    renderChat();
  }, 900);
}

document.addEventListener('DOMContentLoaded', chatInit);
