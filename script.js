let game = new Chess();

// 駒の表示：スタントン風の駒文字を使う
// スタントン形の駒を部品から組み立てたSVG（BG=凹みの色）
const PIECE_SHAPES = {
    k: '<path d="M21.3 2.6h2.4v2.7h2.7v2.4h-2.7v2.7h-2.4V7.7h-2.7V5.3h2.7z"/><path d="M15.8 16.5c0-4.1 2.8-6.3 6.7-6.3s6.7 2.2 6.7 6.3z"/><path d="M14.6 16.5h15.8l-1 3.4H15.6z"/><path d="M15.4 18.2h14.2" fill="none" stroke="BG" stroke-width="0.9"/><path d="M15.6 19.9c1.3 4.6 1.9 7.6 2.1 10.7h9.6c.2-3.1.8-6.1 2.1-10.7z"/><path d="M15 30.6h15l1.6 3.8H13.4z"/><path d="M13.4 34.4h18.2l1.2 3.6H12.2z"/><path d="M11.2 38h22.6v4.2H11.2z"/>',
    q: '<circle cx="22.5" cy="5" r="1.6"/><circle cx="14.2" cy="9.4" r="1.15"/><circle cx="18.1" cy="8" r="1.15"/><circle cx="26.9" cy="8" r="1.15"/><circle cx="30.8" cy="9.4" r="1.15"/><path d="M13.2 15.8l.6-6 3.8 2.8 2-4 2.9 3.2 2.9-3.2 2 4 3.8-2.8.6 6z"/><path d="M14.6 15.8h15.8l.9 3.3H13.7z"/><path d="M15.9 19.1c1.2 4.2 1.7 6.9 1.9 9.7h9.4c.2-2.8.7-5.5 1.9-9.7z"/><path d="M15.6 28.8h13.8l1.5 3.7H14.1z"/><path d="M14.1 32.5h16.8l1.3 4.9H12.8z"/><path d="M11.8 37.4h21.4v4.8H11.8z"/>',
    r: '<path d="M13 16.2V6.8h4.6v3.4h3.3V6.8h3.2v3.4h3.3V6.8H32v9.4z"/><path d="M14.2 16.2h16.6l.7 3.1H13.5z"/><path d="M15 19.3c.5 3.8.8 7 1 10.2h13c.2-3.2.5-6.4 1-10.2z"/><path d="M14.6 29.5h15.8l1.3 3.9H13.3z"/><path d="M13.3 33.4h18.4l1.1 3.9H12.2z"/><path d="M11.4 37.3h22.2v4.9H11.4z"/>',
    b: '<circle cx="22.5" cy="3.9" r="1.7"/><path d="M22.5 6.2c4.3 2.9 6.6 6.5 6.6 10.3 0 3.5-2.9 5.9-6.6 5.9s-6.6-2.4-6.6-5.9c0-3.8 2.3-7.4 6.6-10.3z"/><path d="M19.2 12.4l6.8 6.8" fill="none" stroke="BG" stroke-width="2.2"/><path d="M15.9 22.4h13.2l1 3.3H14.9z"/><path d="M16.6 25.7c.7 2.2 1 4 1.2 6h9.4c.2-2 .5-3.8 1.2-6z"/><path d="M15.4 31.7h14.2l1.4 3.8H14z"/><path d="M14 35.5h17l1.2 3.4H12.8z"/><path d="M11.6 38.9h21.8v3.3H11.6z"/>',
    n: '<path d="M16.8 33.5c.1-3 .5-4.9 1.8-6.7 1-1.4 1.3-2.9.7-4.5l-4.7-1.4c-1.7-.5-2.5-1.9-2.2-3.6.2-1.4 1.1-2.4 2.5-3.5l4.9-4.6c1.5-1.4 2.8-2.8 3.8-4.3l1.8 1.5 2.2 3.9c2.7 2.4 4.3 6 4.4 9.9 0 1.8-.6 3.2-1.8 4.4l-3.6 1.6c1 3.2 1.8 6.7 2.3 10.3z"/><circle cx="23.4" cy="12.2" r="1.05" fill="BG" stroke="none"/><circle cx="14.9" cy="17.6" r="0.75" fill="BG" stroke="none"/><path d="M27.3 9.6c1.8 1.9 2.8 4.2 3.1 6.8" fill="none" stroke="BG" stroke-width="1.1"/><path d="M13.1 19.9l3.3.7" fill="none" stroke="BG" stroke-width="0.9"/><path d="M13.2 33.5h18.6l1.3 3.8H11.9z"/><path d="M11.2 37.8h22.6v4.4H11.2z"/>',
    p: '<circle cx="22.5" cy="11.8" r="5.1"/><path d="M17.9 17.6h9.2l.9 3H17z"/><path d="M17.6 20.6c.4 3.4.7 6.2.9 9.2h8c.2-3 .5-5.8.9-9.2z"/><path d="M15.8 29.8h13.4l1.5 4H14.3z"/><path d="M12.6 33.8h19.8l1 3.9H11.6z"/><path d="M11 37.7h23v4.5H11z"/>'
};
function pieceSVG(type, color) {
    const light = color === 'w';
    const gid = light ? 'gradGold' : 'gradBlue';
    const stroke = light ? '#6e5210' : '#22384e';
    const bg = light ? '#8a6a1d' : '#2c475f';
    const shapes = PIECE_SHAPES[type].split('BG').join(bg);
    const defs = light
        ? '<defs><linearGradient id="gradGold" x1="0" y1="0" x2="0.55" y2="1"><stop offset="0" stop-color="#f7e3a1"/><stop offset="0.45" stop-color="#dcb95f"/><stop offset="1" stop-color="#ad8327"/></linearGradient></defs>'
        : '<defs><linearGradient id="gradBlue" x1="0" y1="0" x2="0.55" y2="1"><stop offset="0" stop-color="#aecfe8"/><stop offset="0.45" stop-color="#5f829e"/><stop offset="1" stop-color="#314d68"/></linearGradient></defs>';
    return `<svg viewBox="0 0 45 45" class="piece-svg" aria-hidden="true">${defs}<ellipse cx="22.5" cy="41.8" rx="12.5" ry="1.8" fill="#000" opacity="0.16" stroke="none"/><g fill="url(#${gid})" stroke="${stroke}" stroke-width="1.3" stroke-linejoin="round" stroke-linecap="round">${shapes}</g></svg>`;
}

const PIECE_VALUES = { p: 10, n: 30, b: 30, r: 50, q: 90, k: 1000 };

// プレイヤーと「初めに動かした色」の対応
// P1 が最初に動かす色は金（'w'）、P2 が最初に動かす色は青（'b'）とする。
// 自分の色の駒で相手の色のキングを取った場合だけ勝利になる。
// 逆に、相手の色の駒を操作しているときに自分の色のキングを取る手は禁止する。
const PLAYER_COLORS = { P1: 'w', P2: 'b' };
const COLOR_OWNERS = { w: 'P1', b: 'P2' };

const MODE_LABELS = {
    'pvp': 'P1 vs P2｜2人対戦 (ローカル)',
    'online': 'オンライン対戦｜離れた相手と対戦',
    'pvp-random': 'ランダム回転｜2人対戦 (特別ルール)',
    'cpu-random': 'ランダム回転｜CPU対戦 (特別ルール・中級)',
    'cpu-easy': 'CPU対戦 (Easy)｜初級',
    'cpu-normal': 'CPU対戦 (Normal)｜中級',
    'cpu-hard': 'CPU対戦 (Hard)｜上級・ミニマックス探索',
    'cpu-demon': 'CPU対戦 (鬼)｜深い先読み',
    'watch': 'CPU同士｜観戦モード'
};

function isRandomMode() { return selectedGameMode === 'pvp-random' || selectedGameMode === 'cpu-random'; }
function isOnlineMode() { return selectedGameMode === 'online'; }

// ゲーム状態
let selectedSquare = null;
let validMoves = [];
let isBoardRotated = false;
let moveCounter = 0;
let skipNextRotation = false;

let selectedGameMode = 'pvp';
let currentPlayer = 'P1';
let gameOver = false;
let winnerPlayer = null;
let winReason = null; // 'king' | 'checkmate' | 'resignation'
let p1Skips = 1;
let p2Skips = 1;
let p1Captures = 0;
let p2Captures = 0;

// 対戦データ（バランス検証用）
let moveHistory = [];
let historyStack = []; // 待った（アンドゥ）用スナップショット
let totalMovesCount = 0;
let rotationsCount = 0;
let statsRecorded = false;

// ランダム回転モード用：次の回転までの手数（プレイヤーには見せない）
let randomNextRotation = null;

// オンライン対戦用
// 設定（設定画面で変更し、localStorage に保存する）
const SETTINGS_KEY = 'rotatingChessSettingsV1';
const DEFAULT_SETTINGS = { theme: 'classic', initialSkips: 1, capturesForSkip: 3, randomMin: 1, randomMax: 4 };
let settings = { ...DEFAULT_SETTINGS };
try {
    if (typeof localStorage !== 'undefined') {
        const rawSettings = localStorage.getItem(SETTINGS_KEY);
        if (rawSettings) settings = { ...DEFAULT_SETTINGS, ...JSON.parse(rawSettings) };
    }
} catch (e) {}
function saveSettings() {
    try { if (typeof localStorage !== 'undefined') localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); } catch (e) {}
}

let lastMove = null;
let validMoveDetails = [];
let castlingRights = 'KQkq';
let epSquare = '-';
let positionCounts = {};
let drawReason = null;
let pendingPromotion = null;
let dragFromSquare = null;
let pendingOfferType = null;

let peer = null;
let onlineConn = null;
let myRole = 'P1';
let onlineRoomCode = '';
let onlineConnected = false;
let onlineSocket = null;
let onlineTransport = null; // 'socket'（自前サーバー）または 'peer'（PeerJS）
let isApplyingRemote = false;

// DOM要素
const menuScreen = document.getElementById('menu-screen');
const gameScreen = document.getElementById('game-screen');
const startBtn = document.getElementById('start-btn');
const backMenuBtn = document.getElementById('back-menu-btn');
const restartBtn = document.getElementById('restart-btn');
const modeItems = document.querySelectorAll('.mode-item');
const p2NameLabel = document.getElementById('p2-name-label');
const currentModeEl = document.getElementById('current-mode-display');

const boardEl = document.getElementById('board');
const turnEl = document.getElementById('current-turn');
const movesLeftEl = document.getElementById('moves-left');
const p1SkipsEl = document.getElementById('p1-skips');
const p2SkipsEl = document.getElementById('p2-skips');
const p1CapturesEl = document.getElementById('p1-captures');
const p2CapturesEl = document.getElementById('p2-captures');
const skipBtn = document.getElementById('skip-btn');
const messageEl = document.getElementById('message');
const winOverlayEl = document.getElementById('win-overlay');
const winTextEl = document.getElementById('win-text');
const winSubEl = document.getElementById('win-sub');
const onlinePanelEl = document.getElementById('online-panel');
const onlineStatusEl = document.getElementById('online-status');
const copyUrlBtn = document.getElementById('copy-url-btn');
const onlineJoinBoxEl = document.getElementById('online-join-box');
const roomCodeInputEl = document.getElementById('room-code-input');
const undoBtn = document.getElementById('undo-btn');
const resignBtn = document.getElementById('resign-btn');
const exportBtn = document.getElementById('export-btn');
const moveHistoryEl = document.getElementById('move-history');
const statsSummaryEl = document.getElementById('stats-summary');
const statsResetBtn = document.getElementById('stats-reset-btn');
const settingsScreen = document.getElementById('settings-screen');
const dataScreen = document.getElementById('data-screen');
const settingsBackBtn = document.getElementById('settings-back-btn');
const dataBackBtn = document.getElementById('data-back-btn');
const menuSettingsBtn = document.getElementById('menu-settings-btn');
const menuDataBtn = document.getElementById('menu-data-btn');
const gameSettingsBtn = document.getElementById('game-settings-btn');
const promotionModalEl = document.getElementById('promotion-modal');
const dangerWarningEl = document.getElementById('danger-warning');
const drawBtn = document.getElementById('draw-btn');
const p1CapturedEl = document.getElementById('p1-captured');
const p2CapturedEl = document.getElementById('p2-captured');
const p1MaterialEl = document.getElementById('p1-material');
const p2MaterialEl = document.getElementById('p2-material');
const captureGoalEls = document.querySelectorAll('.capture-goal');
const statsGraphEl = document.getElementById('stats-graph');
const battleStartBtn = document.getElementById('battle-start-btn');
const battleProgressEl = document.getElementById('battle-progress');
const battleResultEl = document.getElementById('battle-result');
const chatToggleBtn = document.getElementById('chat-toggle-btn');
const chatPanelEl = document.getElementById('chat-panel');
const chatMessagesEl = document.getElementById('chat-messages');
const chatInputEl = document.getElementById('chat-input');
const chatSendBtn = document.getElementById('chat-send-btn');
const rematchBtn = document.getElementById('rematch-btn');
const offerPanelEl = document.getElementById('offer-panel');
const offerTextEl = document.getElementById('offer-text');
const offerAcceptBtn = document.getElementById('offer-accept-btn');
const offerDeclineBtn = document.getElementById('offer-decline-btn');

// UIイベント設定
modeItems.forEach((item) => {
    item.addEventListener('click', () => {
        modeItems.forEach(c => c.classList.remove('selected'));
        item.classList.add('selected');
        selectedGameMode = item.dataset.mode;
        if (onlineJoinBoxEl) {
            onlineJoinBoxEl.classList.toggle('hidden', selectedGameMode !== 'online');
        }
    });
});

window.addEventListener('keydown', (e) => {
    if (!menuScreen.classList.contains('hidden')) {
        if (/^[1-9]$/.test(e.key)) {
            const idx = parseInt(e.key) - 1;
            if (modeItems[idx]) modeItems[idx].click();
        } else if (e.key === 'Enter') {
            startBtn.click();
        }
    }
});

startBtn.addEventListener('click', () => {
    menuScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    p2NameLabel.textContent = (selectedGameMode.startsWith('cpu') || isWatchMode()) ? 'P2 (CPU)' : 'P2 (相手)';
    updateModeDisplay();
    initGame();
    if (isOnlineMode()) setupOnline();
    if (isWatchMode()) { updateWatchUI(); startWatch(); }
    else { pauseWatch(); updateWatchUI(); }
});

function updateModeDisplay() {
    if (!currentModeEl) return;
    let label = MODE_LABELS[selectedGameMode] || selectedGameMode;
    if (isOnlineMode()) {
        label += onlineRoomCode ? `｜ルーム: ${onlineRoomCode}｜あなたは ${myRole}` : `｜あなたは ${myRole}`;
    }
    currentModeEl.textContent = `プレイ中のモード：${label}`;
    currentModeEl.dataset.mode = selectedGameMode;
    if (onlinePanelEl) onlinePanelEl.classList.toggle('hidden', !isOnlineMode());
}

function getPlayerLabel(player) {
    if (isWatchMode()) return player === 'P1' ? 'P1 (CPU)' : 'P2 (CPU)';
    if (player === 'P1') return 'P1 (あなた)';
    return selectedGameMode.startsWith('cpu') ? 'P2 (CPU)' : 'P2 (相手)';
}

backMenuBtn.addEventListener('click', () => {
    pauseWatch();
    teardownOnline();
    gameScreen.classList.add('hidden');
    menuScreen.classList.remove('hidden');
    updateStatsDisplay();
});

restartBtn.addEventListener('click', () => {
    initGame();
    broadcastState();
    if (isWatchMode()) { updateWatchUI(); startWatch(); }
    else { pauseWatch(); updateWatchUI(); }
});

// ===== 画面遷移（メニュー／ゲーム／設定／データ） =====
let settingsReturnTo = 'menu';
function showScreen(name) {
    if (name !== 'game') pauseWatch();
    menuScreen.classList.toggle('hidden', name !== 'menu');
    gameScreen.classList.toggle('hidden', name !== 'game');
    if (settingsScreen) settingsScreen.classList.toggle('hidden', name !== 'settings');
    const gs = document.getElementById('guide-screen');
    if (gs) gs.classList.toggle('hidden', name !== 'guide');
    if (dataScreen) dataScreen.classList.toggle('hidden', name !== 'data');
    if (name === 'data') { updateStatsDisplay(); renderStatsGraph(); }
}
if (menuSettingsBtn) menuSettingsBtn.addEventListener('click', () => { settingsReturnTo = 'menu'; syncSettingsUI(); showScreen('settings'); });
if (gameSettingsBtn) gameSettingsBtn.addEventListener('click', () => { settingsReturnTo = 'game'; syncSettingsUI(); showScreen('settings'); });
if (settingsBackBtn) settingsBackBtn.addEventListener('click', () => showScreen(settingsReturnTo));
if (menuDataBtn) menuDataBtn.addEventListener('click', () => showScreen('data'));
if (dataBackBtn) dataBackBtn.addEventListener('click', () => showScreen('menu'));

// ===== 設定の反映 =====
function applyTheme() {
    document.body.dataset.theme = settings.theme;
    document.querySelectorAll('input[name="theme"]').forEach(r => { r.checked = (r.value === settings.theme); });
}
function syncSettingsUI() {
    applyTheme();
    const setVal = (id, v) => { const el = document.getElementById(id); if (el) el.value = String(v); };
    setVal('setting-initial-skips', settings.initialSkips);
    setVal('setting-captures-for-skip', settings.capturesForSkip);
    setVal('setting-random-min', settings.randomMin);
    setVal('setting-random-max', settings.randomMax);
}
document.querySelectorAll('input[name="theme"]').forEach(r => {
    r.addEventListener('change', () => { settings.theme = r.value; saveSettings(); applyTheme(); });
});
[['setting-initial-skips', 'initialSkips'], ['setting-captures-for-skip', 'capturesForSkip'],
 ['setting-random-min', 'randomMin'], ['setting-random-max', 'randomMax']].forEach(([id, key]) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('change', () => {
        settings[key] = parseInt(el.value, 10);
        if (settings.randomMin > settings.randomMax) settings.randomMax = settings.randomMin;
        saveSettings(); syncSettingsUI();
    });
});
applyTheme();

function initGame() {
    game = new Chess();
    selectedSquare = null;
    validMoves = [];
    isBoardRotated = false;
    moveCounter = 0;
    skipNextRotation = false;

    currentPlayer = 'P1';
    gameOver = false;
    winnerPlayer = null;
    winReason = null;
    p1Skips = settings.initialSkips;
    p2Skips = settings.initialSkips;
    p1Captures = 0;
    p2Captures = 0;

    moveHistory = [];
    historyStack = [];
    totalMovesCount = 0;
    rotationsCount = 0;
    statsRecorded = false;
    randomNextRotation = isRandomMode() ? drawRandomRotationCountdown() : null;
    lastMove = null;
    validMoveDetails = [];
    castlingRights = 'KQkq';
    epSquare = '-';
    positionCounts = {};
    drawReason = null;
    pendingPromotion = null;
    if (promotionModalEl) promotionModalEl.classList.add('hidden');
    recordPosition();

    updateModeDisplay();
    if (messageEl) messageEl.textContent = '';
    boardEl.classList.remove('rotate-180');
    skipBtn.textContent = '回転を止める (スキップ予約)';
    skipBtn.style.backgroundColor = '#3b82f6';
    renderBoard();
}

function getBottomPieceColor() {
    return isBoardRotated ? 'b' : 'w';
}

// そのプレイヤーが今操作できる駒の色。P1は画面下側、P2は画面上側の色を操作し、
// 両者が1手ずつ動かして盤面が回転すると、操作する色が入れ替わる
function getActivePieceColor(player) {
    const p = player || currentPlayer;
    const bottom = getBottomPieceColor();
    return p === 'P1' ? bottom : (bottom === 'w' ? 'b' : 'w');
}

// ランダム回転モード：次の回転まで 1〜4 手を秘密に抽選する（画面には出さない）
function drawRandomRotationCountdown() {
    const min = Math.max(1, settings.randomMin);
    const max = Math.max(min, settings.randomMax);
    return min + Math.floor(Math.random() * (max - min + 1));
}

function sanitizeEpForColor(color) {
    if (!epSquare || epSquare === '-') return '-';
    if (color === 'w' && epSquare[1] === '6') return epSquare;
    if (color === 'b' && epSquare[1] === '3') return epSquare;
    return '-';
}
function buildActiveFen(color) {
    return `${game.fen().split(' ')[0]} ${color} ${castlingRights} ${sanitizeEpForColor(color)} 0 1`;
}
function buildFenFromBoard(boardOnly, color) {
    return `${boardOnly} ${color} ${castlingRights} ${sanitizeEpForColor(color)} 0 1`;
}

function positionKey() {
    return game.fen().split(' ')[0] + '|' + getActivePieceColor() + '|' + currentPlayer;
}
function recordPosition() {
    const k = positionKey();
    positionCounts[k] = (positionCounts[k] || 0) + 1;
    return positionCounts[k];
}
function isOnlyKingsLeft() {
    const board = game.board();
    for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) {
        const p = board[r][c];
        if (p && p.type !== 'k') return false;
    }
    return true;
}
function hasAnyLegalMove(color) {
    const board = game.board();
    for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) {
        const p = board[r][c];
        if (p && p.color === color) {
            const sq = String.fromCharCode(97 + c) + (8 - r);
            if (getSimulatedMoves(sq, color).length > 0) return true;
        }
    }
    return false;
}

// ゲーム状態のスナップショット（待った・オンライン同期で共用）
function snapshotState() {
    return {
        boardFen: game.fen(),
        isBoardRotated, moveCounter, skipNextRotation,
        currentPlayer, gameOver, winnerPlayer, winReason,
        p1Skips, p2Skips, p1Captures, p2Captures,
        selectedGameMode, moveHistory: JSON.parse(JSON.stringify(moveHistory)),
        totalMovesCount, rotationsCount, statsRecorded, randomNextRotation,
        lastMove, castlingRights, epSquare,
        positionCounts: JSON.parse(JSON.stringify(positionCounts)), drawReason
    };
}

function restoreState(snap) {
    if (!snap) return;
    game = new Chess();
    try { game.load(snap.boardFen); } catch (e) { /* 配置だけでも復元を試みる */ 
        try { game.load(snap.boardFen.split(' ')[0] + ' w - - 0 1'); } catch (e2) {}
    }
    isBoardRotated = !!snap.isBoardRotated;
    moveCounter = snap.moveCounter || 0;
    skipNextRotation = !!snap.skipNextRotation;
    currentPlayer = snap.currentPlayer || 'P1';
    gameOver = !!snap.gameOver;
    winnerPlayer = snap.winnerPlayer || null;
    winReason = snap.winReason || null;
    p1Skips = snap.p1Skips; p2Skips = snap.p2Skips;
    p1Captures = snap.p1Captures; p2Captures = snap.p2Captures;
    if (snap.selectedGameMode) selectedGameMode = snap.selectedGameMode;
    moveHistory = snap.moveHistory || [];
    totalMovesCount = snap.totalMovesCount || 0;
    rotationsCount = snap.rotationsCount || 0;
    statsRecorded = !!snap.statsRecorded;
    randomNextRotation = (snap.randomNextRotation === undefined ? null : snap.randomNextRotation);
    lastMove = snap.lastMove || null;
    castlingRights = snap.castlingRights || 'KQkq';
    epSquare = snap.epSquare || '-';
    positionCounts = snap.positionCounts || {};
    drawReason = snap.drawReason || null;
    selectedSquare = null;
    validMoves = [];
    if (isBoardRotated) boardEl.classList.add('rotate-180');
    else boardEl.classList.remove('rotate-180');
    skipBtn.textContent = skipNextRotation ? '回転停止予約中！' : '回転を止める (スキップ予約)';
    skipBtn.style.backgroundColor = skipNextRotation ? '#ef4444' : '#3b82f6';
    updateModeDisplay();
    renderBoard();
}

// 引き分けでゲームを終える共通処理
function finishDraw(reason) {
    gameOver = true;
    winnerPlayer = null;
    winReason = 'draw';
    drawReason = reason;
    selectedSquare = null;
    validMoves = [];
    validMoveDetails = [];
    recordGameResult();
    renderBoard();
    broadcastState();
}

// 勝利でゲームを終える共通処理
function finishGame(winner, reason) {
    gameOver = true;
    winnerPlayer = winner;
    winReason = reason;
    selectedSquare = null;
    validMoves = [];
    recordGameResult();
    renderBoard();
    broadcastState();
}

let dragDropped = false;
let touchDrag = null;
let suppressNextClick = false;
let hintSquares = [];
let pointerHintSquare = null;
function clearDragHints() {
    hintSquares.forEach(el => el.classList.remove('valid-move', 'valid-capture', 'drag-selected'));
    hintSquares = [];
}
function showDragHints(from) {
    clearDragHints();
    const moves = getSimulatedMoves(from, getActivePieceColor());
    moves.forEach(m => {
        const el = boardEl.querySelector(`[data-square="${m.to}"]`);
        if (el) {
            el.classList.add(m.captured ? 'valid-capture' : 'valid-move');
            hintSquares.push(el);
        }
    });
    const fromEl = boardEl.querySelector(`[data-square="${from}"]`);
    if (fromEl) {
        fromEl.classList.add('drag-selected');
        hintSquares.push(fromEl);
    }
}

function renderBoard() {
    boardEl.innerHTML = '';
    const board = game.board();

    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const squareEl = document.createElement('div');
            const squareName = String.fromCharCode(97 + c) + (8 - r);
            const isWhiteSq = (r + c) % 2 === 0;

            squareEl.className = `square ${isWhiteSq ? 'white-sq' : 'black-sq'}`;
            squareEl.dataset.square = squareName;

            if (selectedSquare === squareName) squareEl.classList.add('selected');
            if (lastMove && (lastMove.from === squareName || lastMove.to === squareName)) squareEl.classList.add('last-move');
            if (validMoves.includes(squareName)) {
                const detail = validMoveDetails.find(m => m.to === squareName);
                squareEl.classList.add(detail && detail.captured ? 'valid-capture' : 'valid-move');
            }

            const piece = board[r][c];
            if (piece) {
                const pieceEl = document.createElement('span');
                pieceEl.className = `piece piece-${piece.color}`;
                pieceEl.innerHTML = pieceSVG(piece.type, piece.color);
                pieceEl.draggable = true;
                squareEl.appendChild(pieceEl);
                if ((piece.type === 'k') && isKingInCheck(game.fen(), piece.color)) {
                    squareEl.classList.add('king-check');
                }
            }

            squareEl.addEventListener('click', () => handleSquareClick(squareName));
            squareEl.addEventListener('pointerdown', (e) => {
                if (isWatchMode()) return;
                const pc = game.get(squareName);
                if (pc && pc.color === getActivePieceColor() && !gameOver) {
                    pointerHintSquare = squareName;
                    showDragHints(squareName);
                    if (e.pointerType === 'touch' || e.pointerType === 'pen') {
                        touchDrag = { from: squareName, active: false, target: null, x: e.clientX, y: e.clientY };
                    }
                }
            });
            squareEl.addEventListener('dragstart', (e) => {
                const pc = game.get(squareName);
                if (pc && pc.color === getActivePieceColor() && !gameOver) {
                    dragFromSquare = squareName;
                    dragDropped = false;
                    if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move';
                    showDragHints(squareName);
                } else {
                    dragFromSquare = null;
                }
            });
            squareEl.addEventListener('dragend', () => {
                if (dragFromSquare && !dragDropped) renderBoard();
                dragFromSquare = null;
                dragDropped = false;
                pointerHintSquare = null;
            });
            squareEl.addEventListener('dragover', (e) => { e.preventDefault(); squareEl.classList.add('drag-over'); });
            squareEl.addEventListener('dragleave', () => squareEl.classList.remove('drag-over'));
            squareEl.addEventListener('drop', (e) => {
                e.preventDefault();
                squareEl.classList.remove('drag-over');
                if (dragFromSquare && dragFromSquare !== squareName) {
                    const moves = getSimulatedMoves(dragFromSquare, getActivePieceColor());
                    if (moves.some(m => m.to === squareName)) {
                        dragDropped = true;
                        attemptMove(dragFromSquare, squareName);
                    }
                }
                dragFromSquare = null;
            });
            boardEl.appendChild(squareEl);
        }
    }

    const playerLabel = getPlayerLabel(currentPlayer);
    const currentSkips = currentPlayer === 'P1' ? p1Skips : p2Skips;
    const bottomColorName = getActivePieceColor() === 'w' ? '金' : '青';

    turnEl.textContent = `${playerLabel} の番 [操作する色: ${bottomColorName}]`;
    // ランダム回転モードでは「回転まであと何手か」を伏せる
    movesLeftEl.textContent = isRandomMode() ? '？' : (2 - moveCounter);

    p1SkipsEl.textContent = p1Skips;
    p2SkipsEl.textContent = p2Skips;
    p1CapturesEl.textContent = p1Captures;
    p2CapturesEl.textContent = p2Captures;

    skipBtn.disabled = gameOver || currentSkips <= 0 || skipNextRotation;
    if (undoBtn) undoBtn.disabled = historyStack.length === 0 || (isOnlineMode() && !onlineConnected);
    if (resignBtn) resignBtn.disabled = gameOver;
    if (drawBtn) drawBtn.disabled = gameOver;
    if (rematchBtn) rematchBtn.classList.toggle('hidden', !(isOnlineMode() && gameOver && onlineConnected));
    captureGoalEls.forEach(el => { el.textContent = settings.capturesForSkip; });

    renderCapturedPieces();
    updateDangerWarning();
    renderMoveHistory();
    updateWinOverlay();
    checkWinConditions();
}

function renderCapturedPieces() {
    if (!p1CapturedEl || !p2CapturedEl) return;
    const by = { P1: [], P2: [] };
    const val = { P1: 0, P2: 0 };
    moveHistory.forEach(h => {
        if (h.captured) {
            by[h.player].push(h);
            val[h.player] += PIECE_VALUES[h.captured] || 0;
        }
    });
    const fill = (player, el) => {
        el.innerHTML = '';
        by[player].forEach(h => {
            const sp = document.createElement('span');
            sp.className = 'captured-piece piece-' + (h.capturedColor || 'w');
            sp.innerHTML = pieceSVG(h.captured, h.capturedColor || 'w');
            el.appendChild(sp);
        });
    };
    fill('P1', p1CapturedEl);
    fill('P2', p2CapturedEl);
    const diff = val.P1 - val.P2;
    if (p1MaterialEl) p1MaterialEl.textContent = diff > 0 ? `+${diff}` : '';
    if (p2MaterialEl) p2MaterialEl.textContent = diff < 0 ? `+${-diff}` : '';
}

function updateDangerWarning() {
    if (!dangerWarningEl) return;
    if (gameOver) { dangerWarningEl.classList.add('hidden'); return; }
    const msgs = [];
    try {
        const sim = new Chess(buildActiveFen(getActivePieceColor()));
        const kingCap = sim.moves({ verbose: true }).find(m => m.captured === 'k');
        if (kingCap) {
            if (isRandomMode() || isWinningKingCapture(kingCap, currentPlayer)) {
                msgs.push('キングを取れる手があります！');
            } else {
                msgs.push('注意: キングが狙われています（相手の駒でのキング取得は禁止手です）');
            }
        }
    } catch (e) {}
    if (msgs.length) {
        dangerWarningEl.textContent = msgs.join(' ');
        dangerWarningEl.classList.remove('hidden');
    } else {
        dangerWarningEl.classList.add('hidden');
    }
}

function renderMoveHistory() {
    if (!moveHistoryEl) return;
    moveHistoryEl.innerHTML = '';
    moveHistory.forEach((h) => {
        const li = document.createElement('li');
        li.textContent = `${h.player}: ${h.san || (h.from + '→' + h.to)}`;
        moveHistoryEl.appendChild(li);
    });
    moveHistoryEl.scrollTop = moveHistoryEl.scrollHeight;
}

const WIN_REASON_TEXT = { king: 'キング撃破！', checkmate: 'チェックメイト！', resignation: '相手の投了' };

function updateWinOverlay() {
    if (!winOverlayEl) return;
    if (gameOver && winReason === 'draw') {
        winOverlayEl.classList.remove('hidden');
        winOverlayEl.classList.remove('show');
        void winOverlayEl.offsetWidth;
        winOverlayEl.classList.add('show');
        if (winTextEl) winTextEl.textContent = '引き分け';
        if (winSubEl) winSubEl.textContent = drawReason || '引き分け';
        return;
    }
    if (gameOver && winnerPlayer) {
        winOverlayEl.classList.remove('hidden');
        // アニメーションを毎回再生させる
        winOverlayEl.classList.remove('show');
        void winOverlayEl.offsetWidth;
        winOverlayEl.classList.add('show');
        if (winTextEl) winTextEl.textContent = `${getPlayerLabel(winnerPlayer)} の勝利！`;
        if (winSubEl) winSubEl.textContent = WIN_REASON_TEXT[winReason] || 'ゲーム終了';
    } else {
        winOverlayEl.classList.add('hidden');
        winOverlayEl.classList.remove('show');
    }
}

// 禁止手かどうか：相手の色の駒で、自分の色のキングを取る手は選べないようにする
// （chess.js は captured: 'k' の手を生成するので、ここで除外しないと実際に取れてしまう）
function isForbiddenKingCapture(move, player) {
    if (!move || move.captured !== 'k') return false;
    // 動かす駒の色の持ち主が今のプレイヤーでない ＝ 相手の色の駒で自分のキングを取る手
    return COLOR_OWNERS[move.color] !== player;
}

function filterForbiddenKingCaptures(moves, player) {
    // ランダム回転モードでは「初めの色」は関係ないので、この禁止手は適用しない
    if (isRandomMode()) return moves;
    return moves.filter(m => !isForbiddenKingCapture(m, player));
}

// 勝利になるキング取得かどうか：自分の色の駒で相手の色のキングを取る手
function isWinningKingCapture(move, player) {
    if (!move || move.captured !== 'k') return false;
    return COLOR_OWNERS[move.color] === player;
}

// 徹底的に検証されたダイレクト移動先計算（ライブラリ拒否の回避）
function getSimulatedMoves(square, color) {
    try {
        const simGame = new Chess(buildActiveFen(color));
        const moves = simGame.moves({ square: square, verbose: true });
        return filterForbiddenKingCaptures(moves, currentPlayer);
    } catch (e) {
        return [];
    }
}

// 着手の入口：プロモーションのときは駒を選んでから実行する
function attemptMove(from, to) {
    const piece = game.get(from);
    if (piece && piece.type === 'p' && (to[1] === '8' || to[1] === '1')) {
        pendingPromotion = { from, to };
        if (promotionModalEl) { promotionModalEl.classList.remove('hidden'); return; }
    }
    executeMoveCustom(from, to);
}

document.querySelectorAll('.promotion-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        if (!pendingPromotion) return;
        const { from, to } = pendingPromotion;
        pendingPromotion = null;
        if (promotionModalEl) promotionModalEl.classList.add('hidden');
        executeMoveCustom(from, to, btn.dataset.piece);
    });
});

function handleSquareClick(square) {
    if (isWatchMode()) return;
    if (suppressNextClick) { suppressNextClick = false; return; }
    if (gameOver || game.game_over()) return;
    if (selectedGameMode.startsWith('cpu') && currentPlayer === 'P2') return;
    if (isOnlineMode()) {
        if (!onlineConnected) return; // 相手の接続待ち
        if (currentPlayer !== myRole) return; // 自分の手番だけ操作できる
    }

    // 移動の実行
    if (selectedSquare) {
        if (validMoves.includes(square)) {
            const fromSq = selectedSquare;
            selectedSquare = null;
            validMoves = [];
            validMoveDetails = [];
            renderBoard();
            attemptMove(fromSq, square);
            return;
        }
    }

    // 自分が操作できる色の駒をクリックした場合
    const piece = game.get(square);
    const bottomColor = getActivePieceColor();

    if (piece && piece.color === bottomColor) {
        selectedSquare = square;
        const moves = getSimulatedMoves(square, bottomColor);
        validMoves = moves.map(m => m.to);
        validMoveDetails = moves;
    } else {
        selectedSquare = null;
        validMoves = [];
        validMoveDetails = [];
    }

    renderBoard();
}

// 確実に着手を反映させる安全移動関数
function executeMoveCustom(from, to, promotion) {
    if (gameOver) return;
    // オンライン対戦では、接続が完了していて自分の手番のときだけ着手できる（クリック／ドラッグ共通）
    if (isOnlineMode() && (!onlineConnected || currentPlayer !== myRole)) return;

    const targetPiece = game.get(to);
    const movingPiece = game.get(from);
    const currentColor = getActivePieceColor();

    // 安全装置：相手の色の駒で自分の色のキングを取る手は、ここでも実行させない
    // （ランダム回転モードでは初めの色が関係ないため適用しない）
    if (!isRandomMode() && targetPiece && targetPiece.type === 'k' && movingPiece) {
        const attemptedMove = { color: movingPiece.color, captured: 'k' };
        if (isForbiddenKingCapture(attemptedMove, currentPlayer)) {
            return;
        }
    }

    const activeFen = buildActiveFen(currentColor);

    const simGame = new Chess(activeFen);
    const moveObj = simGame.move({ from, to, promotion: promotion || 'q' });

    if (moveObj) {
        // 待った用に、着手前の状態を保存する
        historyStack.push(snapshotState());

        // 最新状態をメインインスタンスにそのままロード
        game.load(simGame.fen());
        // キャスリング権とアンパッサン対象マスは着手結果から引き継ぐ（回転しても保持）
        const fenPartsAfter = simGame.fen().split(' ');
        if (fenPartsAfter[2]) castlingRights = fenPartsAfter[2];
        if (fenPartsAfter[3]) epSquare = fenPartsAfter[3];
        lastMove = { from, to };
        totalMovesCount++;
        moveHistory.push({
            n: totalMovesCount, player: currentPlayer, color: currentColor,
            from, to,
            captured: moveObj.captured || null,
            capturedColor: moveObj.captured ? (currentColor === 'w' ? 'b' : 'w') : null,
            san: moveObj.san
        });

        if (moveObj.captured) {
            if (currentPlayer === 'P1') {
                p1Captures++;
                if (p1Captures >= settings.capturesForSkip) { p1Skips++; p1Captures = 0; }
            } else {
                p2Captures++;
                if (p2Captures >= settings.capturesForSkip) { p2Skips++; p2Captures = 0; }
            }
        }

        // ===== 勝利判定 =====
        if (isRandomMode()) {
            // 特別ルール：今動かしている側の駒でキングを取るか、
            // 相手の色のキングをチェックメイトしたら、そのプレイヤーの勝利。
            // 「初めに触っていた色」は関係ない。
            if (targetPiece && targetPiece.type === 'k') {
                finishGame(currentPlayer, 'king');
                return;
            }
            const opponentColor = currentColor === 'w' ? 'b' : 'w';
            if (isKingCheckmated(game.fen(), opponentColor)) {
                finishGame(currentPlayer, 'checkmate');
                return;
            }
        } else {
            // 通常ルール：自分の色の駒で相手の色のキングを取ったら、その場でゲーム終了
            // （従来はチェックメイトしか見ていなかったため、キングを取っても続行していた）
            if (targetPiece && targetPiece.type === 'k' && isWinningKingCapture(moveObj, currentPlayer)) {
                finishGame(currentPlayer, 'king');
                return;
            }
        }

        // ===== 盤面回転 =====
        if (isRandomMode()) {
            moveCounter++;
            if (randomNextRotation !== null) randomNextRotation--;

            if (randomNextRotation !== null && randomNextRotation <= 0) {
                if (skipNextRotation) {
                    skipNextRotation = false;
                    skipBtn.textContent = '回転を止める (スキップ予約)';
                    skipBtn.style.backgroundColor = '#3b82f6';
                } else {
                    isBoardRotated = !isBoardRotated;
                    rotationsCount++;
                    if (isBoardRotated) boardEl.classList.add('rotate-180');
                    else boardEl.classList.remove('rotate-180');
                }
                moveCounter = 0;
                randomNextRotation = drawRandomRotationCountdown();
            }
        } else {
            moveCounter++;

            if (moveCounter >= 2) {
                moveCounter = 0;

                if (skipNextRotation) {
                    skipNextRotation = false;
                    skipBtn.textContent = '回転を止める (スキップ予約)';
                    skipBtn.style.backgroundColor = '#3b82f6';
                } else {
                    isBoardRotated = !isBoardRotated;
                    rotationsCount++;
                    if (isBoardRotated) boardEl.classList.add('rotate-180');
                    else boardEl.classList.remove('rotate-180');
                }
            }
        }

        currentPlayer = currentPlayer === 'P1' ? 'P2' : 'P1';
        renderBoard();
        broadcastState();

        // 引き分け判定（キングのみ／千日手／ステイルメイト）
        if (!gameOver) {
            if (isOnlyKingsLeft()) { finishDraw('両者キングのみ'); return; }
            if (recordPosition() >= 3) { finishDraw('同じ局面が3回（千日手）'); return; }
            if (!hasAnyLegalMove(getActivePieceColor())) { finishDraw('ステイルメイト'); return; }
        }

        if (!gameOver && !game.game_over() && selectedGameMode.startsWith('cpu') && currentPlayer === 'P2') {
            setTimeout(makeCpuMove, 500);
        }
    }
}

function checkWinConditions() {
    // 終了している場合は、その結果を毎回表示し続ける
    // （以前はこの関数が render のたびにメッセージを消していた）
    if (gameOver && winReason === 'draw') {
        messageEl.textContent = `引き分け（${drawReason || '引き分け'}）`;
        return;
    }
    if (gameOver && winnerPlayer) {
        if (winReason === 'king') {
            if (isRandomMode()) {
                messageEl.textContent = `★ ${getPlayerLabel(winnerPlayer)} の勝利！(キング撃破)`;
            } else {
                const loserColorName = PLAYER_COLORS[winnerPlayer] === 'w' ? '青' : '金';
                messageEl.textContent = `★ ${getPlayerLabel(winnerPlayer)} の勝利！(${loserColorName}キング撃破)`;
            }
        } else if (winReason === 'checkmate') {
            messageEl.textContent = `★ ${getPlayerLabel(winnerPlayer)} の勝利！(チェックメイト)`;
        } else if (winReason === 'resignation') {
            messageEl.textContent = `★ ${getPlayerLabel(winnerPlayer)} の勝利！(相手の投了)`;
        } else {
            messageEl.textContent = `★ ${getPlayerLabel(winnerPlayer)} の勝利！`;
        }
        return;
    }

    // ランダム回転モードの勝敗は着手直後にだけ判定する
    // （描画のたびに判定すると、自分の手でないチェックメイトで誤終了するため）
    if (isRandomMode()) {
        messageEl.textContent = isKingInCheck(game.fen(), 'w') || isKingInCheck(game.fen(), 'b') ? 'チェック！' : '';
        return;
    }

    const currentFen = game.fen();
    const blackKingCheckmate = isKingCheckmated(currentFen, 'b');
    const whiteKingCheckmate = isKingCheckmated(currentFen, 'w');

    if (blackKingCheckmate) {
        gameOver = true;
        winnerPlayer = 'P1';
        winReason = 'checkmate';
        recordGameResult();
        updateWinOverlay();
        messageEl.textContent = '★ P1 (あなた) の勝利！(チェックメイト)';
    } else if (whiteKingCheckmate) {
        gameOver = true;
        winnerPlayer = 'P2';
        winReason = 'checkmate';
        recordGameResult();
        updateWinOverlay();
        messageEl.textContent = `★ ${getPlayerLabel('P2')} の勝利！(チェックメイト)`;
    } else if (isKingInCheck(currentFen, 'w') || isKingInCheck(currentFen, 'b')) {
        messageEl.textContent = 'チェック！';
    } else {
        messageEl.textContent = '';
    }
}

function isKingInCheck(fenStr, kingColor) {
    try {
        const fenParts = fenStr.split(' ');
        fenParts[1] = kingColor;
        fenParts[3] = '-';
        const tempGame = new Chess(fenParts.join(' '));
        return tempGame.in_check();
    } catch (e) {
        return false;
    }
}

function isKingCheckmated(fenStr, kingColor) {
    try {
        const fenParts = fenStr.split(' ');
        fenParts[1] = kingColor;
        fenParts[3] = '-';
        const tempGame = new Chess(fenParts.join(' '));
        return tempGame.in_checkmate();
    } catch (e) {
        return false;
    }
}

function chooseCpuMove(player, levelKey) {
    const color = getActivePieceColor(player);
    const activeFen = buildActiveFen(color);
    let simGame;
    try { simGame = new Chess(activeFen); } catch (e) { return null; }
    const moves = filterForbiddenKingCaptures(simGame.moves({ verbose: true }), player);
    if (moves.length === 0) return null;

    // 回転停止権の使用判断（そのプレイヤーの残り回数を使う）
    const skipsLeft = player === 'P1' ? p1Skips : p2Skips;
    if (skipsLeft > 0 && !skipNextRotation) {
        const useSkip = levelKey === 'cpu-demon'
            ? (Math.random() < 0.4 || simGame.in_check())
            : (Math.random() < 0.2);
        if (useSkip) {
            skipNextRotation = true;
            if (player === 'P1') p1Skips--; else p2Skips--;
            skipBtn.textContent = '回転停止予約中！';
            skipBtn.style.backgroundColor = '#ef4444';
        }
    }

    let selectedMove = null;
    if (levelKey === 'cpu-easy') {
        selectedMove = moves[Math.floor(Math.random() * moves.length)];
    } else if (levelKey === 'cpu-normal') {
        const captureMoves = moves.filter(m => m.captured);
        selectedMove = captureMoves.length > 0 ? captureMoves[Math.floor(Math.random() * captureMoves.length)] : moves[Math.floor(Math.random() * moves.length)];
    } else if (levelKey === 'cpu-hard' || levelKey === 'cpu-demon') {
        // ミニマックス法＋α-β探索（上級：合計2手先、鬼：合計3手先まで読む）
        const depth = levelKey === 'cpu-demon' ? 2 : 1; // ルートの1手＋この深さ
        let bestScore = -Infinity;
        let alpha = -Infinity;
        const ordered = orderMovesForSearch(moves);
        ordered.forEach(m => {
            if (isWinningKingCapture(m, player)) {
                selectedMove = m;
                bestScore = Infinity;
                return;
            }
            const testGame = new Chess(activeFen);
            testGame.move(m);
            const childBoard = testGame.fen().split(' ')[0];
            const score = minimaxAlphaBeta(childBoard, 1, depth, alpha, Infinity, false, color, player);
            if (score > bestScore) {
                bestScore = score;
                selectedMove = m;
            }
            if (score > alpha) alpha = score;
        });
    }
    if (!selectedMove) selectedMove = moves[Math.floor(Math.random() * moves.length)];
    return selectedMove;
}

function makeCpuMove() {
    if (gameOver) return;
    const level = selectedGameMode === 'cpu-random' ? 'cpu-normal' : selectedGameMode;
    const mv = chooseCpuMove('P2', level);
    if (mv) executeMoveCustom(mv.from, mv.to);
}

// ===== CPU同士の観戦モード =====
let watchTimer = null;
let watchPlaying = false;
function isWatchMode() { return selectedGameMode === 'watch'; }
function watchLevelFor(player) {
    const sel = document.getElementById(player === 'P1' ? 'watch-p1-level' : 'watch-p2-level');
    return sel ? sel.value : 'cpu-normal';
}
function watchDelay() {
    const sel = document.getElementById('watch-speed');
    return sel ? parseInt(sel.value, 10) : 1000;
}
function stopWatchTimer() {
    if (watchTimer) { clearTimeout(watchTimer); watchTimer = null; }
}
function scheduleWatch() {
    stopWatchTimer();
    if (!watchPlaying || !isWatchMode() || gameOver) return;
    watchTimer = setTimeout(watchStep, watchDelay());
}
function watchStep() {
    if (!watchPlaying || !isWatchMode() || gameOver) return;
    const mv = chooseCpuMove(currentPlayer, watchLevelFor(currentPlayer));
    if (!mv) { pauseWatch(); return; }
    executeMoveCustom(mv.from, mv.to);
    if (!gameOver) scheduleWatch();
    else pauseWatch();
}
function startWatch() {
    if (!isWatchMode()) return;
    watchPlaying = true;
    updateWatchUI();
    scheduleWatch();
}
function pauseWatch() {
    watchPlaying = false;
    stopWatchTimer();
    updateWatchUI();
}
function updateWatchUI() {
    const panel = document.getElementById('watch-panel');
    if (panel) panel.classList.toggle('hidden', !isWatchMode());
    const btn = document.getElementById('watch-toggle-btn');
    if (btn) btn.textContent = watchPlaying ? '一時停止' : '再開する';
}

function evaluateBoard(chessObj, cpuColor) {
    let score = 0;
    const board = chessObj.board();
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const p = board[r][c];
            if (p) {
                const val = PIECE_VALUES[p.type] || 0;
                if (p.color === cpuColor) score += val;
                else score -= val;
            }
        }
    }
    return score;
}

// 探索用：取れる駒の価値が高い手を先に調べると α-β枝刈りがよく効く
function orderMovesForSearch(moves) {
    return [...moves].sort((a, b) => ((PIECE_VALUES[b.captured] || 0) - (PIECE_VALUES[a.captured] || 0)));
}

// 探索の ply 目に、その手番のプレイヤーが操作できる色。
// ルート（ply=0）は CPU(P2) の手で rootColor はその時点の CPU の操作色。
// 2手ごとの回転による下側の色の入れ替わりも、ルート時点の moveCounter から計算する。
// ※探索内では回転停止権の消費までは再現せず、回転スケジュールのみを近似する
function getSearchActiveColor(ply, rootColor, rootPlayer) {
    const rp = rootPlayer || 'P2';
    const rotations = Math.floor((moveCounter + ply) / 2) - Math.floor(moveCounter / 2);
    const rootBottom = rp === 'P1' ? rootColor : (rootColor === 'w' ? 'b' : 'w');
    const bottom = rotations % 2 === 0 ? rootBottom : (rootBottom === 'w' ? 'b' : 'w');
    const nodePlayer = ply % 2 === 0 ? rp : (rp === 'P2' ? 'P1' : 'P2');
    return nodePlayer === 'P1' ? bottom : (bottom === 'w' ? 'b' : 'w');
}
// ミニマックス法＋α-β探索。評価はルートで CPU が動かした色を基準にする。
// maximizing=true が CPU (P2) の手番、false が相手 (P1) の手番。
function minimaxAlphaBeta(boardOnly, ply, depth, alpha, beta, maximizing, rootColor, rootPlayer) {
    const rp = rootPlayer || 'P2';
    const activeColor = getSearchActiveColor(ply, rootColor, rp);
    const nodePlayer = maximizing ? rp : (rp === 'P2' ? 'P1' : 'P2');
    let nodeGame;
    try {
        nodeGame = new Chess(buildFenFromBoard(boardOnly, activeColor));
    } catch (e) {
        return 0;
    }

    if (depth <= 0) return evaluateBoard(nodeGame, rootColor);

    const moves = filterForbiddenKingCaptures(nodeGame.moves({ verbose: true }), nodePlayer);
    if (moves.length === 0) return evaluateBoard(nodeGame, rootColor);

    const ordered = orderMovesForSearch(moves);

    if (maximizing) {
        let value = -Infinity;
        for (const m of ordered) {
            if (isWinningKingCapture(m, nodePlayer)) return 100000 - ply;
            const child = new Chess(buildFenFromBoard(boardOnly, activeColor));
            child.move(m);
            value = Math.max(value, minimaxAlphaBeta(child.fen().split(' ')[0], ply + 1, depth - 1, alpha, beta, false, rootColor, rp));
            alpha = Math.max(alpha, value);
            if (alpha >= beta) break; // βカット
        }
        return value;
    } else {
        let value = Infinity;
        for (const m of ordered) {
            if (isWinningKingCapture(m, nodePlayer)) return -100000 + ply;
            const child = new Chess(buildFenFromBoard(boardOnly, activeColor));
            child.move(m);
            value = Math.min(value, minimaxAlphaBeta(child.fen().split(' ')[0], ply + 1, depth - 1, alpha, beta, true, rootColor, rp));
            beta = Math.min(beta, value);
            if (alpha >= beta) break; // αカット
        }
        return value;
    }
}

skipBtn.addEventListener('click', () => {
    if (isWatchMode()) return;
    if (isOnlineMode() && currentPlayer !== myRole) return;
    const currentSkips = currentPlayer === 'P1' ? p1Skips : p2Skips;
    if (!gameOver && currentSkips > 0 && !skipNextRotation) {
        skipNextRotation = true;
        if (currentPlayer === 'P1') p1Skips--;
        else p2Skips--;

        skipBtn.textContent = '回転停止予約中！';
        skipBtn.style.backgroundColor = '#ef4444';
        renderBoard();
        broadcastState();
    }
});

// ===== 待った（1手戻す） =====
if (undoBtn) {
    undoBtn.addEventListener('click', () => {
        if (isWatchMode()) return;
        if (historyStack.length === 0) return;
        let snap = historyStack.pop();
        // CPU対戦では、自分の手番まで2手分戻す
        if (selectedGameMode.startsWith('cpu') && snap.currentPlayer === 'P2' && historyStack.length > 0) {
            snap = historyStack.pop();
        }
        restoreState(snap);
        broadcastState();
    });
}

// ===== 投了 =====
if (resignBtn) {
    resignBtn.addEventListener('click', () => {
        if (isWatchMode()) return;
        if (gameOver) return;
        const loser = isOnlineMode() ? myRole : currentPlayer;
        const winner = loser === 'P1' ? 'P2' : 'P1';
        finishGame(winner, 'resignation');
    });
}

// ===== 引き分け =====
if (drawBtn) {
    drawBtn.addEventListener('click', () => {
        if (isWatchMode()) return;
        if (gameOver) return;
        if (isOnlineMode()) {
            if (onlineConnected) {
                sendOnline({ type: 'draw-offer' });
                setOnlineStatus('引き分けを申し出ました。相手の返事を待っています');
            }
            return;
        }
        finishDraw('同意による引き分け');
    });
}

// ===== 対戦記録の書き出し（バランス検証用） =====
if (exportBtn) {
    exportBtn.addEventListener('click', () => {
        const data = {
            exportedAt: new Date().toISOString(),
            mode: selectedGameMode,
            modeLabel: MODE_LABELS[selectedGameMode] || selectedGameMode,
            winner: winnerPlayer,
            winReason,
            totalMoves: totalMovesCount,
            rotations: rotationsCount,
            captures: {
                P1: moveHistory.filter(h => h.player === 'P1' && h.captured).length,
                P2: moveHistory.filter(h => h.player === 'P2' && h.captured).length
            },
            skipsLeft: { P1: p1Skips, P2: p2Skips },
            history: moveHistory
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'rotating-chess-game.json';
        a.click();
        URL.revokeObjectURL(url);
    });
}

// ===== 対戦統計（localStorage に蓄積し、バランス検証に使う） =====
const STATS_KEY = 'rotatingChessStatsV1';
const DEFAULT_STATS = { games: 0, p1Wins: 0, p2Wins: 0, draws: 0, kingWins: 0, checkmateWins: 0, resignationWins: 0, totalMoves: 0, totalRotations: 0 };

function loadStats() {
    try {
        const raw = localStorage.getItem(STATS_KEY);
        if (raw) return { ...DEFAULT_STATS, ...JSON.parse(raw) };
    } catch (e) { /* 保存先が無ければ集計なしで動く */ }
    return { ...DEFAULT_STATS };
}

function saveStats(stats) {
    try { localStorage.setItem(STATS_KEY, JSON.stringify(stats)); } catch (e) {}
}

function recordGameResult() {
    if (selectedGameMode === 'watch') return;
    if (statsRecorded) return;
    if (!winnerPlayer && winReason !== 'draw') return;
    statsRecorded = true;
    const stats = loadStats();
    stats.games++;
    if (winnerPlayer === 'P1') stats.p1Wins++;
    else if (winnerPlayer === 'P2') stats.p2Wins++;
    if (winReason === 'draw') stats.draws = (stats.draws || 0) + 1;
    else if (winReason === 'king') stats.kingWins++;
    else if (winReason === 'checkmate') stats.checkmateWins++;
    else if (winReason === 'resignation') stats.resignationWins++;
    stats.totalMoves += totalMovesCount;
    stats.totalRotations += rotationsCount;
    saveStats(stats);
    updateStatsDisplay();
}

function updateStatsDisplay() {
    if (!statsSummaryEl) return;
    const s = loadStats();
    if (s.games === 0) {
        statsSummaryEl.textContent = 'まだ対戦データがありません。対戦が終わると自動で記録されます。';
        return;
    }
    const avgMoves = (s.totalMoves / s.games).toFixed(1);
    const avgRot = (s.totalRotations / s.games).toFixed(1);
    statsSummaryEl.textContent =
        `対戦数 ${s.games}｜P1勝利 ${s.p1Wins}｜P2勝利 ${s.p2Wins}｜引き分け ${s.draws || 0}｜決着: キング撃破 ${s.kingWins} / チェックメイト ${s.checkmateWins} / 投了 ${s.resignationWins}｜平均手数 ${avgMoves}｜平均回転数 ${avgRot}`;
    renderStatsGraph();
}

function renderStatsGraph() {
    if (!statsGraphEl) return;
    const st = loadStats();
    statsGraphEl.innerHTML = '';
    if (!st.games) return;
    const rows = [
        ['P1の勝利', st.p1Wins, ''],
        ['P2の勝利', st.p2Wins, 'fill-p2'],
        ['引き分け', st.draws || 0, 'fill-draw'],
        ['キング撃破', st.kingWins, 'fill-reason'],
        ['チェックメイト', st.checkmateWins, 'fill-reason'],
        ['投了', st.resignationWins, 'fill-reason']
    ];
    const max = Math.max(1, ...rows.map(r => r[1]));
    rows.forEach(([label, val, cls]) => {
        const row = document.createElement('div');
        row.className = 'graph-row';
        const lab = document.createElement('span'); lab.className = 'graph-label'; lab.textContent = label;
        const track = document.createElement('div'); track.className = 'graph-track';
        const fillEl = document.createElement('div'); fillEl.className = 'graph-fill ' + cls;
        fillEl.style.width = Math.round(val / max * 100) + '%';
        track.appendChild(fillEl);
        const valEl = document.createElement('span'); valEl.className = 'graph-value'; valEl.textContent = val + '回';
        row.appendChild(lab); row.appendChild(track); row.appendChild(valEl);
        statsGraphEl.appendChild(row);
    });
}

if (statsResetBtn) {
    statsResetBtn.addEventListener('click', () => {
        saveStats({ ...DEFAULT_STATS });
        updateStatsDisplay();
        renderStatsGraph();
    });
}
updateStatsDisplay();

// ===== オンライン対戦（PeerJS / WebRTC） =====
// サーバーを用意せず、PeerJS の無料公開ブローカーで接続する方式。
// ホストがルームコードを発行し、相手はコードか招待URLで参加する。
function generateRoomCode() {
    const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
    return code;
}

function setOnlineStatus(text) {
    if (onlineStatusEl) onlineStatusEl.textContent = `オンライン: ${text}`;
}

function setupOnline() {
    teardownOnline();
    if (typeof io !== 'undefined' && /^https?:$/.test(window.location.protocol)) {
        setupSocketOnline();
        return;
    }
    if (typeof Peer === 'undefined') {
        setOnlineStatus('通信ライブラリを読み込めませんでした。ネット接続を確認してください');
        return;
    }
    onlineTransport = 'peer';
    const inputCode = roomCodeInputEl ? roomCodeInputEl.value.trim().toUpperCase() : '';
    // URL の ?room=XXXX でも参加できる
    const urlCode = new URLSearchParams(window.location.search).get('room');

    if (inputCode || urlCode) {
        myRole = 'P2';
        onlineRoomCode = (inputCode || urlCode).toUpperCase();
        peer = new Peer();
        peer.on('open', () => {
            setOnlineStatus(`ルーム ${onlineRoomCode} のホストに接続中…（あなたは P2）`);
            attachOnlineConn(peer.connect('rotchess-' + onlineRoomCode, { reliable: true }));
        });
    } else {
        myRole = 'P1';
        onlineRoomCode = generateRoomCode();
        peer = new Peer('rotchess-' + onlineRoomCode);
        peer.on('open', () => {
            setOnlineStatus(`ルーム ${onlineRoomCode} を作成。相手の参加を待っています（あなたは P1）`);
            updateModeDisplay();
        });
        peer.on('connection', (conn) => attachOnlineConn(conn));
    }
    peer.on('error', (err) => {
        setOnlineStatus(`接続エラー（${err.type || 'unknown'}）。コードを確認してやり直してください`);
    });
    updateModeDisplay();
}

function handleOnlineData(data) {
    if (!data) return;
    if (data.type === 'snapshot') {
        isApplyingRemote = true;
        restoreState(data.snapshot);
        isApplyingRemote = false;
    } else if (data.type === 'hello' && myRole === 'P1') {
        broadcastState();
    } else if (data.type === 'chat') {
        appendChatMessage(false, data.text || '');
    } else if (data.type === 'draw-offer') {
        showOffer('draw', '相手が引き分けを申し出ています');
    } else if (data.type === 'draw-response') {
        if (data.accept) finishDraw('同意による引き分け');
        else setOnlineStatus('引き分けは断られました');
    } else if (data.type === 'rematch-request') {
        showOffer('rematch', '相手が再戦を希望しています（先手・後手が入れ替わります）');
    } else if (data.type === 'rematch-response') {
        if (data.accept) {
            myRole = myRole === 'P1' ? 'P2' : 'P1';
            initGame();
            broadcastState();
            setOnlineStatus(`再戦開始（あなたは ${myRole}）`);
        } else {
            setOnlineStatus('再戦は断られました');
        }
    }
}

function attachOnlineConn(conn) {
    onlineConn = conn;
    conn.on('open', () => {
        onlineConnected = true;
        setOnlineStatus(`接続しました。対戦開始（あなたは ${myRole}）`);
        if (myRole === 'P1') broadcastState();
        else sendOnline({ type: 'hello' });
    });
    conn.on('data', (data) => handleOnlineData(data));
    conn.on('close', () => {
        onlineConnected = false;
        setOnlineStatus('相手が切断しました');
    });
}

function sendOnline(obj) {
    if (onlineTransport === 'socket') {
        if (onlineSocket && onlineConnected) { try { onlineSocket.emit('relay', obj); } catch (e) {} }
    } else if (onlineConn && onlineConnected) {
        try { onlineConn.send(obj); } catch (e) {}
    }
}
function broadcastState() {
    if (!isOnlineMode() || isApplyingRemote || !onlineConnected) return;
    sendOnline({ type: 'snapshot', snapshot: snapshotState() });
}

function setupSocketOnline() {
    onlineTransport = 'socket';
    const inputCode = roomCodeInputEl ? roomCodeInputEl.value.trim().toUpperCase() : '';
    const urlCode = new URLSearchParams(window.location.search).get('room');
    try {
        onlineSocket = io();
    } catch (e) {
        setOnlineStatus('サーバーに接続できませんでした');
        return;
    }
    if (inputCode || urlCode) {
        myRole = 'P2';
        onlineRoomCode = (inputCode || urlCode).toUpperCase();
        setOnlineStatus(`ルーム ${onlineRoomCode} に参加中…（あなたは P2）`);
        onlineSocket.emit('join-room', onlineRoomCode);
    } else {
        myRole = 'P1';
        setOnlineStatus('ルームを作成中…（あなたは P1）');
        onlineSocket.emit('create-room');
    }
    onlineSocket.on('room-created', (code) => {
        onlineRoomCode = code;
        setOnlineStatus(`ルーム ${code} を作成。相手の参加を待っています（あなたは P1）`);
        updateModeDisplay();
    });
    onlineSocket.on('joined', () => {
        onlineConnected = true;
        setOnlineStatus(`接続しました。対戦開始（あなたは ${myRole}）`);
        updateModeDisplay();
    });
    onlineSocket.on('peer-joined', () => {
        onlineConnected = true;
        setOnlineStatus('接続しました。対戦開始（あなたは P1）');
        broadcastState();
        updateModeDisplay();
    });
    onlineSocket.on('peer-left', () => {
        onlineConnected = false;
        setOnlineStatus('相手が切断しました');
    });
    onlineSocket.on('join-error', (msg) => {
        setOnlineStatus(`参加できません: ${msg || 'ルームが見つかりません'}`);
    });
    onlineSocket.on('relay', (data) => handleOnlineData(data));
    onlineSocket.on('connect_error', () => {
        setOnlineStatus('サーバーに接続できません。サーバーが起動しているか確認してください');
    });
    updateModeDisplay();
}

function teardownOnline() {
    onlineConnected = false;
    onlineConn = null;
    onlineTransport = null;
    if (onlineSocket) {
        try { onlineSocket.disconnect(); } catch (e) {}
        onlineSocket = null;
    }
    if (peer) {
        try { peer.destroy(); } catch (e) {}
        peer = null;
    }
}

document.addEventListener('pointermove', (e) => {
    if (!touchDrag) return;
    if (!touchDrag.active) {
        const dx = e.clientX - touchDrag.x, dy = e.clientY - touchDrag.y;
        if (dx * dx + dy * dy < 100) return;
        touchDrag.active = true;
    }
    let target = null;
    if (document.elementFromPoint) {
        const el = document.elementFromPoint(e.clientX, e.clientY);
        const sqEl = el && el.closest ? el.closest('.square') : null;
        if (sqEl) target = sqEl.dataset.square;
    }
    touchDrag.target = target;
    boardEl.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
    if (target) {
        const tEl = boardEl.querySelector(`[data-square="${target}"]`);
        if (tEl) tEl.classList.add('drag-over');
    }
});
document.addEventListener('pointerup', () => {
    if (touchDrag) {
        const td = touchDrag;
        touchDrag = null;
        boardEl.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
        if (td.active) {
            suppressNextClick = true;
            if (td.target && td.target !== td.from) {
                const moves = getSimulatedMoves(td.from, getActivePieceColor());
                if (moves.some(m => m.to === td.target)) attemptMove(td.from, td.target);
            }
        }
    }
    if (pointerHintSquare && !dragFromSquare) {
        pointerHintSquare = null;
        clearDragHints();
    }
});
document.addEventListener('pointercancel', () => {
    if (pointerHintSquare && !dragFromSquare) {
        pointerHintSquare = null;
        clearDragHints();
    }
});

// ===== チャット =====
function appendChatMessage(mine, text) {
    if (!chatMessagesEl) return;
    const div = document.createElement('div');
    if (mine) div.className = 'chat-msg-me';
    div.textContent = (mine ? 'あなた: ' : '相手: ') + text;
    chatMessagesEl.appendChild(div);
    chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
}
function sendChat(text) {
    const t = (text || '').trim();
    if (!t) return;
    appendChatMessage(true, t);
    if (onlineConnected) {
        sendOnline({ type: 'chat', text: t });
    }
}
if (chatToggleBtn && chatPanelEl) {
    chatToggleBtn.addEventListener('click', () => chatPanelEl.classList.toggle('hidden'));
}
if (chatSendBtn && chatInputEl) {
    chatSendBtn.addEventListener('click', () => { sendChat(chatInputEl.value); chatInputEl.value = ''; });
    chatInputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { sendChat(chatInputEl.value); chatInputEl.value = ''; }
    });
}
document.querySelectorAll('.stamp-btn').forEach(btn => {
    btn.addEventListener('click', () => sendChat(btn.dataset.stamp));
});

// ===== 申し出（引き分け／再戦） =====
function showOffer(type, text) {
    pendingOfferType = type;
    if (offerTextEl) offerTextEl.textContent = text;
    if (offerPanelEl) offerPanelEl.classList.remove('hidden');
}
function hideOffer() {
    pendingOfferType = null;
    if (offerPanelEl) offerPanelEl.classList.add('hidden');
}
if (offerAcceptBtn) {
    offerAcceptBtn.addEventListener('click', () => {
        const type = pendingOfferType;
        hideOffer();
        if (!onlineConnected) return;
        if (type === 'draw') {
            sendOnline({ type: 'draw-response', accept: true });
            finishDraw('同意による引き分け');
        } else if (type === 'rematch') {
            sendOnline({ type: 'rematch-response', accept: true });
            myRole = myRole === 'P1' ? 'P2' : 'P1';
            initGame();
            broadcastState();
            setOnlineStatus(`再戦開始（あなたは ${myRole}）`);
        }
    });
}
if (offerDeclineBtn) {
    offerDeclineBtn.addEventListener('click', () => {
        const type = pendingOfferType;
        hideOffer();
        if (!onlineConnected || !type) return;
        sendOnline({ type: type + '-response', accept: false });
    });
}
if (rematchBtn) {
    rematchBtn.addEventListener('click', () => {
        if (onlineConnected) {
            sendOnline({ type: 'rematch-request' });
            setOnlineStatus('再戦をリクエストしました。相手の返事を待っています');
        }
    });
}

if (copyUrlBtn) {
    copyUrlBtn.addEventListener('click', () => {
        if (!onlineRoomCode) return;
        const base = window.location.href.split('?')[0].split('#')[0];
        const url = `${base}?room=${onlineRoomCode}`;
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(url).then(() => setOnlineStatus(`招待URLをコピーしました: ${url}`));
        } else {
            setOnlineStatus(`招待URL: ${url}`);
        }
    });
}

// ===== 招待URL（?room=コード）を開いたら、自動でオンライン参加する =====
(function autoJoinFromUrl() {
    try {
        const code = new URLSearchParams(window.location.search).get('room');
        if (!code) return;
        selectedGameMode = 'online';
        modeItems.forEach(c => c.classList.toggle('selected', c.dataset.mode === 'online'));
        if (onlineJoinBoxEl) onlineJoinBoxEl.classList.remove('hidden');
        menuScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        p2NameLabel.textContent = 'P2 (相手)';
        updateModeDisplay();
        initGame();
        setupOnline();
    } catch (e) {}
})();

// ===== CPU同士の自動対戦（データ画面・検証用簡易シミュレーション） =====
function simPickMove(mode, moves, fen, color, player, counter) {
    if (moves.length === 0) return null;
    const winning = moves.find(m => m.captured === 'k' && COLOR_OWNERS[m.color] === player);
    if (winning) return winning;
    if (mode === 'cpu-easy') return moves[Math.floor(Math.random() * moves.length)];
    if (mode === 'cpu-normal' || mode === 'cpu-random') {
        const caps = moves.filter(m => m.captured);
        const pool = caps.length ? caps : moves;
        return pool[Math.floor(Math.random() * pool.length)];
    }
    // 上級・鬼（簡易版）: 1手評価＋（鬼のみ）相手の最善応手まで読む
    let best = -Infinity, sel = moves[0];
    orderMovesForSearch(moves).forEach(m => {
        const tg = new Chess(fen);
        tg.move(m);
        let score = evaluateBoard(tg, color);
        if (mode === 'cpu-demon') {
            const boardOnly = tg.fen().split(' ')[0];
            const oppPlayer = player === 'P1' ? 'P2' : 'P1';
            const bottomNow = player === 'P1' ? color : (color === 'w' ? 'b' : 'w');
            const bottomNext = (counter + 1) % 2 === 0 ? (bottomNow === 'w' ? 'b' : 'w') : bottomNow;
            const oppColor = oppPlayer === 'P1' ? bottomNext : (bottomNext === 'w' ? 'b' : 'w');
            let oppFen;
            try { oppFen = new Chess(`${boardOnly} ${oppColor} - - 0 1`); } catch (e) { oppFen = null; }
            if (oppFen) {
                const oppMoves = oppFen.moves({ verbose: true })
                    .filter(om => !(om.captured === 'k' && COLOR_OWNERS[om.color] !== oppPlayer));
                if (oppMoves.some(om => om.captured === 'k')) {
                    score = -100000;
                } else if (oppMoves.length) {
                    let min = Infinity;
                    oppMoves.forEach(om => {
                        const og = new Chess(`${boardOnly} ${oppColor} - - 0 1`);
                        og.move(om);
                        min = Math.min(min, evaluateBoard(og, color));
                    });
                    score = min;
                }
            }
        }
        if (score > best) { best = score; sel = m; }
    });
    return sel;
}

function simulateBattleGame(modeA, modeB) {
    const sg = new Chess();
    let sRotated = false, sCounter = 0, sPlayer = 'P1', sSkipNext = false;
    const sSkips = { P1: settings.initialSkips, P2: settings.initialSkips };
    const sCaps = { P1: 0, P2: 0 };
    let moves = 0;
    while (moves < 160) {
        const bottomColor = sRotated ? 'b' : 'w';
        const color = sPlayer === 'P1' ? bottomColor : (bottomColor === 'w' ? 'b' : 'w');
        const fen = `${sg.fen().split(' ')[0]} ${color} - - 0 1`;
        let sim;
        try { sim = new Chess(fen); } catch (e) { break; }
        const legal = sim.moves({ verbose: true })
            .filter(m => !(m.captured === 'k' && COLOR_OWNERS[m.color] !== sPlayer));
        if (legal.length === 0) return { winner: null, moves };
        const mode = sPlayer === 'P1' ? modeA : modeB;
        if (sSkips[sPlayer] > 0 && !sSkipNext && mode === 'cpu-demon' && Math.random() < 0.3) {
            sSkipNext = true; sSkips[sPlayer]--;
        }
        const chosen = simPickMove(mode, legal, fen, color, sPlayer, sCounter);
        if (!chosen) return { winner: null, moves };
        const sim2 = new Chess(fen);
        const mo = sim2.move({ from: chosen.from, to: chosen.to, promotion: 'q' });
        if (!mo) return { winner: null, moves };
        sg.load(sim2.fen());
        moves++;
        if (mo.captured) {
            sCaps[sPlayer]++;
            if (sCaps[sPlayer] >= settings.capturesForSkip) { sSkips[sPlayer]++; sCaps[sPlayer] = 0; }
        }
        if (mo.captured === 'k') return { winner: sPlayer, moves };
        if (isKingCheckmated(sg.fen(), 'b')) return { winner: 'P1', moves };
        if (isKingCheckmated(sg.fen(), 'w')) return { winner: 'P2', moves };
        sCounter++;
        if (sCounter >= 2) {
            sCounter = 0;
            if (sSkipNext) sSkipNext = false; else sRotated = !sRotated;
        }
        sPlayer = sPlayer === 'P1' ? 'P2' : 'P1';
    }
    return { winner: null, moves };
}

let battleRunning = false;
if (battleStartBtn) {
    battleStartBtn.addEventListener('click', () => {
        if (battleRunning) return;
        const modeA = document.getElementById('battle-a').value;
        const modeB = document.getElementById('battle-b').value;
        const total = parseInt(document.getElementById('battle-games').value, 10);
        const nameOf = (m) => ({ 'cpu-easy': '初級', 'cpu-normal': '中級', 'cpu-hard': '上級', 'cpu-demon': '鬼' }[m] || m);
        const tally = { a: 0, b: 0, d: 0, moves: 0 };
        let i = 0;
        battleRunning = true;
        if (battleResultEl) battleResultEl.innerHTML = '';
        const step = () => {
            if (i >= total) {
                battleRunning = false;
                if (battleProgressEl) battleProgressEl.textContent = '完了';
                if (battleResultEl) {
                    battleResultEl.innerHTML =
                        `先手 ${nameOf(modeA)}: ${tally.a}勝 / 後手 ${nameOf(modeB)}: ${tally.b}勝 / 引き分け: ${tally.d}<br>` +
                        `平均手数: ${(tally.moves / total).toFixed(1)}手（先手・後手は固定で対戦）`;
                }
                return;
            }
            const r = simulateBattleGame(modeA, modeB);
            if (r.winner === 'P1') tally.a++; else if (r.winner === 'P2') tally.b++; else tally.d++;
            tally.moves += r.moves;
            i++;
            if (battleProgressEl) battleProgressEl.textContent = `対戦中… ${i} / ${total} 試合`;
            setTimeout(step, 30);
        };
        step();
    });
}


// 観戦パネルの操作
const watchToggleBtn = document.getElementById('watch-toggle-btn');
if (watchToggleBtn) {
    watchToggleBtn.addEventListener('click', () => {
        if (gameOver) return;
        if (watchPlaying) pauseWatch(); else startWatch();
    });
}
['watch-p1-level', 'watch-p2-level'].forEach(id => {
    const sel = document.getElementById(id);
    if (sel) sel.addEventListener('change', () => { /* 次の手から新しい強さが適用される */ });
});
const watchSpeedSel = document.getElementById('watch-speed');
if (watchSpeedSel) {
    watchSpeedSel.addEventListener('change', () => { if (watchPlaying) scheduleWatch(); });
}


// ===== 駒図鑑・ルール説明 =====
const GUIDE_PIECES = [
    { type: 'k', name: 'キング', value: '最重要（取られると負け）', desc: '全方向に1マス。このゲームのターゲットです。自分の色の駒で相手のキングを取れば勝利、チェックメイトでも勝利です。' },
    { type: 'q', name: 'クイーン', value: '9', desc: '縦・横・斜めに何マスでも進める最強の駒。攻撃の中心になります。' },
    { type: 'r', name: 'ルーク', value: '5', desc: '縦・横に何マスでも。キングとのキャスリングにも使います。' },
    { type: 'b', name: 'ビショップ', value: '3', desc: '斜めに何マスでも。ずっと同じ色のマスの上だけを進みます。' },
    { type: 'n', name: 'ナイト', value: '3', desc: 'L字に跳ぶ駒。他の駒を飛び越えられるのはナイトだけです。' },
    { type: 'p', name: 'ポーン', value: '1', desc: '前に1マス（最初の移動は2マスも可）。取る時は斜め前に進みます。相手陣地の端まで進むと昇格できます。' }
];
function guideTargets(type) {
    const c = 2, pts = [], caps = [];
    const straight = [[1,0],[-1,0],[0,1],[0,-1]];
    const diag = [[1,1],[1,-1],[-1,1],[-1,-1]];
    const slide = (ds) => ds.forEach(([dx,dy]) => { let x=c+dx, y=c+dy; while (x>=0 && x<5 && y>=0 && y<5) { pts.push(x+','+y); x+=dx; y+=dy; } });
    if (type === 'r') slide(straight);
    else if (type === 'b') slide(diag);
    else if (type === 'q') { slide(straight); slide(diag); }
    else if (type === 'k') [...straight, ...diag].forEach(([dx,dy]) => pts.push((c+dx)+','+(c+dy)));
    else if (type === 'n') [[1,2],[2,1],[-1,2],[-2,1],[1,-2],[2,-1],[-1,-2],[-2,-1]].forEach(([dx,dy]) => pts.push((c+dx)+','+(c+dy)));
    else if (type === 'p') { pts.push('2,1'); caps.push('1,1','3,1'); }
    return { pts: new Set(pts), caps: new Set(caps) };
}
let guideRendered = false;
function renderGuide() {
    const wrap = document.getElementById('guide-pieces');
    if (!wrap || guideRendered) return;
    guideRendered = true;
    GUIDE_PIECES.forEach(p => {
        const card = document.createElement('div');
        card.className = 'guide-card';
        const { pts, caps } = guideTargets(p.type);
        let cells = '';
        for (let y = 0; y < 5; y++) {
            for (let x = 0; x < 5; x++) {
                const key = x + ',' + y;
                const cls = ((x + y) % 2 === 0) ? 'mini-sq light' : 'mini-sq dark';
                let inner = '';
                if (x === 2 && y === 2) inner = pieceSVG(p.type, 'w');
                else if (caps.has(key)) inner = '<span class="mini-cap"></span>';
                else if (pts.has(key)) inner = '<span class="mini-dot"></span>';
                cells += `<div class="${cls}">${inner}</div>`;
            }
        }
        card.innerHTML =
            '<div class="guide-card-head">' +
                '<span class="guide-piece-img">' + pieceSVG(p.type, 'w') + '</span>' +
                '<span class="guide-piece-img">' + pieceSVG(p.type, 'b') + '</span>' +
                '<div><div class="guide-piece-name">' + p.name + '</div>' +
                '<div class="guide-piece-value">価値の目安：' + p.value + '</div></div>' +
            '</div>' +
            '<div class="mini-board">' + cells + '</div>' +
            '<p class="guide-piece-desc">' + p.desc + '</p>';
        wrap.appendChild(card);
    });
}
const menuGuideBtn = document.getElementById('menu-guide-btn');
if (menuGuideBtn) menuGuideBtn.addEventListener('click', () => { renderGuide(); showScreen('guide'); });
const guideBackBtn = document.getElementById('guide-back-btn');
if (guideBackBtn) guideBackBtn.addEventListener('click', () => showScreen('menu'));
