// script.js からの分割（オンライン受信・チャット・招待参加・対戦シミュレーション）
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
document.querySelectorAll('.level-chip').forEach(chip => {
    chip.addEventListener('click', () => {
        cpuVariantLevel = chip.dataset.level;
        document.querySelectorAll('.level-chip').forEach(c => c.classList.toggle('selected', c === chip));
        refreshModeSummaries();
    });
});
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
        let score = evaluateBoard(tg, player === 'P1' ? 'w' : 'b');
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
                        min = Math.min(min, evaluateBoard(og, player === 'P1' ? 'w' : 'b'));
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
        if (isKingCheckmated(sg.fen(), 'b') && sPlayer === 'P1' && color === 'w') return { winner: 'P1', moves };
        if (isKingCheckmated(sg.fen(), 'w') && sPlayer === 'P2' && color === 'b') return { winner: 'P2', moves };
        sCounter++;
        if (sCounter >= 2) {
            sCounter = 0;
            if (sSkipNext) sSkipNext = false; else sRotated = !sRotated;
        }
        sPlayer = sPlayer === 'P1' ? 'P2' : 'P1';
    }
    return { winner: null, moves };
}
