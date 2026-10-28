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
    } else if (data.type === 'dice') {
        onlineDice.theirs = data.value;
        resolveOnlineDice();
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
        startOnlineDice();
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
        startOnlineDice();
    });
    onlineSocket.on('peer-joined', () => {
        onlineConnected = true;
        setOnlineStatus('接続しました。対戦開始（あなたは P1）');
        startOnlineDice();
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
    onlineDice = { mine: null, theirs: null, started: false };
    onlineDiceDone = false;
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
const doubleBtnEl = document.getElementById('double-btn');
if (doubleBtnEl) {
    doubleBtnEl.addEventListener('click', () => {
        if (gameOver || currentPlayer !== 'P2' || !p2DoubleMove) return;
        if (isOnlineMode() && myRole !== 'P2') return;
        if (isCpuGame() && cpuSide === 'P2') return;
        doubleMoveArmed = !doubleMoveArmed;
        messageEl.textContent = doubleMoveArmed ? '連続手番を予約しました。この手番のあと、もう1手動けます' : '連続手番の予約を取り消しました';
        renderBoard();
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
    // 自分の色の駒を取る手は選ばない（他に手がある場合）
    const ownColor = player === 'P1' ? 'w' : 'b';
    const nonOwnCaps = moves.filter(m => !m.captured || (m.color === 'w' ? 'b' : 'w') !== ownColor);
    if (nonOwnCaps.length) moves = nonOwnCaps;
    if (mode === 'cpu-easy') return moves[Math.floor(Math.random() * moves.length)];
    if (mode === 'cpu-normal' || mode === 'cpu-random') {
        const caps = moves.filter(m => m.captured);
        const pool = caps.length ? caps : moves;
        return pool[Math.floor(Math.random() * pool.length)];
    }
    // 上級・鬼（簡易版）: 1手評価＋（鬼のみ）相手の最善応手まで読む
    // 高速化：ルートの盤面は1つのインスタンスを使い回して move/undo する
    let best = -Infinity, sel = moves[0];
    const tg = new Chess(fen);
    orderMovesForSearch(moves).forEach(m => {
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
                } else {
                    // 高速化：応手は「取る手」だけを評価する（全応手だと鬼同士で激重になるため）。
                    // 盤面も1つのインスタンスを使い回して move/undo する。
                    const replies = oppMoves.filter(om => om.captured);
                    if (replies.length) {
                        let min = Infinity;
                        replies.forEach(om => {
                            oppFen.move(om);
                            min = Math.min(min, evaluateBoard(oppFen, player === 'P1' ? 'w' : 'b'));
                            oppFen.undo();
                        });
                        score = min;
                    }
                }
            }
        }
        if (score > best) { best = score; sel = m; }
        tg.undo();
    });
    return sel;
}

function simulateBattleGame(modeA, modeB) {
    const sg = new Chess();
    let sRotated = false, sCounter = 0, sPlayer = 'P1', sSkipNext = false;
    const sSkips = { P1: settings.initialSkips, P2: settings.initialSkips + 1 };
    const sCaps = { P1: 0, P2: 0 };
    let sGuardP2 = true;
    let sDoubleP2 = true;
    let sExtraNow = false;
    let sEndgame = false;
    const sCounts = {};
    let moves = 0;
    while (moves < 240) {
        const bottomColor = sRotated ? 'b' : 'w';
        const color = sEndgame ? (sPlayer === 'P1' ? 'w' : 'b') : (sPlayer === 'P1' ? bottomColor : (bottomColor === 'w' ? 'b' : 'w'));
        const posKey = sg.fen().split(' ')[0] + '|' + sPlayer + '|' + color;
        sCounts[posKey] = (sCounts[posKey] || 0) + 1;
        if (sCounts[posKey] >= 3) {
            if (!sEndgame) {
                sEndgame = true;
                for (const k in sCounts) delete sCounts[k];
            } else {
                const adjE = evaluateBoard(sg, 'w');
                if (adjE >= 50) return { winner: 'P1', moves, adjudicated: true };
                if (adjE <= -50) return { winner: 'P2', moves, adjudicated: true };
                return { winner: null, moves };
            }
        }
        const fen = `${sg.fen().split(' ')[0]} ${color} - - 0 1`;
        let sim;
        try { sim = new Chess(fen); } catch (e) { break; }
        const activeCount = sim.board().flat().filter(x => x && x.color === color).length;
        let legal = sim.moves({ verbose: true })
            .filter(m => !(m.captured === 'k' && COLOR_OWNERS[m.color] !== sPlayer));
        if (activeCount > 1) {
            const lk = legal.filter(m => !(m.piece === 'k' && m.color !== (sPlayer === 'P1' ? 'w' : 'b')));
            if (lk.length > 0) legal = lk;
        }
        if (legal.length === 0) return { winner: null, moves };
        const mode = sPlayer === 'P1' ? modeA : modeB;
        const sDanger = isKingInCheck(sg.fen(), sPlayer === 'P1' ? 'w' : 'b');
        if (sSkips[sPlayer] > 0 && !sSkipNext && ((sDanger && Math.random() < 0.85) || (mode === 'cpu-demon' && Math.random() < 0.3))) {
            sSkipNext = true; sSkips[sPlayer]--;
        }
        const isExtraMove = sExtraNow && sPlayer === 'P2';
        if (isExtraMove) sExtraNow = false;
        if (sGuardP2 && sPlayer === 'P1') {
            const wm = legal.find(m => m.captured === 'k' && COLOR_OWNERS[m.color] === 'P1');
            if (wm) {
                const lg = legal.filter(m => m !== wm);
                if (lg.length > 0) { legal = lg; sGuardP2 = false; }
            }
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
        if (sg.board().flat().every(x => !x || x.type === 'k')) return { winner: null, moves };
        if (!isExtraMove && !sEndgame) {
            sCounter++;
            if (sCounter >= 2) {
                sCounter = 0;
                if (sSkipNext) sSkipNext = false; else sRotated = !sRotated;
            }
        }
        let extraTurn = false;
        if (!sEndgame && sPlayer === 'P2' && sDoubleP2 && (mo.captured || isKingInCheck(sg.fen(), 'w'))) {
            sDoubleP2 = false;
            extraTurn = true;
            sExtraNow = true;
        }
        if (!extraTurn) sPlayer = sPlayer === 'P1' ? 'P2' : 'P1';
    }
    const adj = evaluateBoard(sg, 'w');
    if (adj >= 50) return { winner: 'P1', moves, adjudicated: true };
    if (adj <= -50) return { winner: 'P2', moves, adjudicated: true };
    return { winner: null, moves };
}

// script.js からの分割（CPUスキル・キャラパネル・図鑑・キャラ選択・観戦UI・駒図鑑）
function opponentNextColor(player) {
    // 相手が次の自分の手番で操作する色（回転の位相から計算）。ランダム回転では確定できないため null
    const opp = opponentOf(player);
    if (isNormalMode() || (typeof endgamePhase !== 'undefined' && endgamePhase)) return opp === 'P1' ? 'w' : 'b';
    if (isRandomMode()) return null;
    const nextRotated = (moveCounter + 1 >= 2) ? !isBoardRotated : isBoardRotated;
    const nextBottom = nextRotated ? 'b' : 'w';
    return opp === 'P1' ? nextBottom : (nextBottom === 'w' ? 'b' : 'w');
}
function maybeCpuUseSkill() { maybeUseSkillFor(cpuSide); }
function maybeUseSkillFor(player) {
    if (!isCharaMode() || charaUsed[player] || charaPhase || gameOver) return;
    const ch = charaOf(player);
    if (!ch) return;
    if (!skillUnlocked(player)) return;
    const rnd = Math.random();
    const activeColor = getActivePieceColor(player);
    const ownColor = player === 'P1' ? 'w' : 'b';
    const enemyColor = ownColor === 'w' ? 'b' : 'w';
    const opp = opponentOf(player);
    const oppNext = opponentNextColor(player);
    // 相手の色を操作している手番では、盤面の駒を操るスキルは意味を失う／逆効果になるため使わない
    const BOARD_KINDS = ['counter', 'transform', 'step', 'clone', 'swap', 'dashSlash', 'destroy', 'pushback', 'charm', 'exchange'];
    if (activeColor !== ownColor && BOARD_KINDS.includes(ch.kind)) return;
    switch (ch.kind) {
        case 'skip': case 'shield': applySkillEffect(player, {}); return;
        case 'extra': if (rnd < 0.3) applySkillEffect(player, {}); return;
        case 'freeze': case 'barrier': {
            // 相手が次に「自分の色」を操作する手番でないと、相手の取り／チェックを止める意味がない
            const oppOwnNext = oppNext === null || oppNext === (opp === 'P1' ? 'w' : 'b');
            if (totalMovesCount > 4 && rnd < 0.3 && oppOwnNext) applySkillEffect(player, {});
            return;
        }
        case 'revive': { const p = planRevive(player); if (p) applySkillEffect(player, p); return; }
        case 'revivePawns': { const p = planRevivePawns(player); if (p) applySkillEffect(player, p); return; }
        case 'convert': { const p = planConvert(player); if (p) applySkillEffect(player, p); return; }
        case 'clone': { const p = planClone(player); if (p) applySkillEffect(player, p); return; }
        case 'fortune': {
            const roll = Math.random();
            const hasLost = moveHistory.some(h => h.captured && h.capturedColor === ownColor && !h.revived);
            if (roll < 0.10 && hasLost) applySkillEffect(player, { mode: 'all' });
            else if (roll < 0.40) applySkillEffect(player, { mode: 'guard' });
            else if (roll < 0.80) {
                const warpSquare = planFortuneWarp(player);
                if (warpSquare) applySkillEffect(player, { mode: 'warp', square: warpSquare });
                else applySkillEffect(player, { mode: 'guard' });
            } else applySkillEffect(player, { mode: 'pawn', square: planKingGuardPawn(player) });
            return;
        }
        case 'reviveAll': { if (moveHistory.some(h => h.captured && h.capturedColor === ownColor && !h.revived)) applySkillEffect(player, {}); return; }
        case 'charm': {
            const targets = boardCells().filter(cell => cell.color === enemyColor && cell.type !== 'k' && cell.type !== 'q' && !charmWouldGiveCheck(cell.square, player));
            targets.sort((a, b) => (SKILL_PIECE_VALUES[b.type] || 0) - (SKILL_PIECE_VALUES[a.type] || 0));
            if (targets.length && rnd < 0.7) applySkillEffect(player, { square: targets[0].square });
            return;
        }
        case 'doom': {
            const tc = sleepTargetColorFor(player);
            let best = null, bv = -1;
            boardCells().forEach(cell => { if (cell.color === tc && cell.type !== 'k' && (SKILL_PIECE_VALUES[cell.type] || 0) > bv) { bv = SKILL_PIECE_VALUES[cell.type]; best = cell.square; } });
            if (best && rnd < 0.5) applySkillEffect(player, { square: best });
            return;
        }
        case 'pushback': {
            const targets = boardCells().filter(cell => cell.color === enemyColor && cell.type !== 'k');
            targets.sort((a, b) => (SKILL_PIECE_VALUES[b.type] || 0) - (SKILL_PIECE_VALUES[a.type] || 0));
            for (const cell of targets) {
                const c = squareCoords(cell.square);
                const backDir = cell.color === 'w' ? -1 : 1;
                const dest = coordsToSquare(c.f, c.r + backDir);
                if (dest && !game.get(dest)) { if (rnd < 0.5) applySkillEffect(player, { square: cell.square }); return; }
            }
            return;
        }
        case 'counter': {
            // 自分の色の駒にだけ付ける。相手が次に自分の色を操作して攻めてくる局面でのみ意味がある
            if (oppNext !== null && oppNext !== enemyColor) return;
            const own = boardCells().filter(cell => cell.color === ownColor && cell.type !== 'k');
            own.sort((a, b) => (SKILL_PIECE_VALUES[b.type] || 0) - (SKILL_PIECE_VALUES[a.type] || 0));
            if (own.length && rnd < 0.6) applySkillEffect(player, { square: own[0].square });
            return;
        }
        case 'dashSlash': {
            let bestMove = null, bestValue = -1;
            const ownPieces = boardCells().filter(cell => cell.color === activeColor && cell.type !== 'k');
            const targets = boardCells().filter(cell => cell.color === enemyColor && cell.type !== 'k');
            ownPieces.forEach(a => targets.forEach(b => {
                const ac = squareCoords(a.square), bc = squareCoords(b.square);
                const aligned = ac.f === bc.f || ac.r === bc.r || Math.abs(ac.f - bc.f) === Math.abs(ac.r - bc.r);
                if (aligned && (SKILL_PIECE_VALUES[b.type] || 0) > bestValue) { bestValue = SKILL_PIECE_VALUES[b.type]; bestMove = { a: a.square, b: b.square }; }
            }));
            if (bestMove && rnd < 0.65) applySkillEffect(player, bestMove);
            return;
        }
        case 'undo': if (historyStack.length >= 3 && rnd < 0.12) applySkillEffect(player, {}); return;
        case 'transform': {
            const bd = game.board(); const files = 'abcdefgh';
            for (let r = 0; r < 8; r++) for (let f = 0; f < 8; f++) { const cell = bd[r][f]; if (cell && cell.type === 'p' && cell.color === activeColor) { applySkillEffect(player, { square: files[f] + (8 - r) }); return; } }
            return;
        }
        case 'sleep': {
            const tc = sleepTargetColorFor(player);
            let best = null, bv = -1;
            boardCells().forEach(cell => { if (cell.color === tc && (SKILL_PIECE_VALUES[cell.type] || 0) > bv) { bv = SKILL_PIECE_VALUES[cell.type]; best = cell.square; } });
            if (best && rnd < 0.5) applySkillEffect(player, { square: best });
            return;
        }
        case 'destroy': {
            const targets = boardCells().filter(cell => cell.color === enemyColor && cell.type !== 'k');
            targets.sort((a, b) => (SKILL_PIECE_VALUES[b.type] || 0) - (SKILL_PIECE_VALUES[a.type] || 0));
            if (targets.length && rnd < 0.6) applySkillEffect(player, { square: targets[0].square });
            return;
        }
        case 'step': {
            const bd = game.board(); const files = 'abcdefgh';
            for (let r = 0; r < 8; r++) for (let f = 0; f < 8; f++) {
                const cell = bd[r][f];
                if (cell && cell.type === 'p' && cell.color === activeColor) {
                    const nr = cell.color === 'w' ? r - 1 : r + 1;
                    if (nr >= 0 && nr < 8 && !bd[nr][f]) { applySkillEffect(player, { a: files[f] + (8 - r), b: files[f] + (8 - nr) }); return; }
                }
            }
            return;
        }
        case 'exchange': {
            const bd = game.board(); const files = 'abcdefgh';
            for (let r = 0; r < 8; r++) for (let f = 0; f < 8; f++) { const cell = bd[r][f]; if (cell && cell.type === 'p' && cell.color === activeColor) { applySkillEffect(player, { square: files[f] + (8 - r), toType: 'r' }); return; } }
            return;
        }
        case 'swap': return;
    }
}
function renderCharaPanel() {
    const panel = document.getElementById('chara-panel');
    if (!panel) return;
    if (!isCharaMode()) { panel.classList.add('hidden'); return; }
    panel.classList.remove('hidden');
    ['P1', 'P2'].forEach(pl => {
        const key = pl.toLowerCase();
        const ch = charaOf(pl);
        const img = document.getElementById('chara-img-' + key);
        const nameEl = document.getElementById('chara-name-' + key);
        const skillEl = document.getElementById('chara-skill-' + key);
        const btn = document.getElementById('chara-btn-' + key);
        if (img) img.src = ch && typeof CHARA_IMAGES !== 'undefined' ? (CHARA_IMAGES[ch.id] || '') : '';
        if (nameEl) { nameEl.textContent = ch ? `${pl}：${ch.name}` : `${pl}：未選択`; nameEl.title = ch ? `${ch.name}（${ch.title}）` : ''; }
        if (skillEl) { skillEl.textContent = ch ? `スキル「${ch.skill}」` : ''; skillEl.title = ch ? `${ch.desc} ${unlockText(ch)}` : ''; }
        if (btn) {
            btn.disabled = !canUseSkillUI(pl);
            if (!ch) btn.textContent = 'スキル';
            else if (charaUsed[pl]) btn.textContent = `再使用：あと${3 - (skillRecharge[pl] || 0)}つ取る`;
            else if (!skillUnlocked(pl)) btn.textContent = `🔒 ${skillLockText(pl)}`;
            else btn.textContent = ch.skill;
        }
    });
}
['p1', 'p2'].forEach(k => {
    const b = document.getElementById('chara-btn-' + k);
    if (b) b.addEventListener('click', () => onSkillButton(k.toUpperCase()));
});

function openCharaLightbox(charaId) {
    const ch = CHARACTERS.find(c => c.id === charaId);
    if (!ch) return;
    const lb = document.getElementById('chara-lightbox');
    if (!lb) return;
    document.getElementById('lb-img').src = typeof CHARA_IMAGES !== 'undefined' ? (CHARA_IMAGES[ch.id] || '') : '';
    document.getElementById('lb-name').textContent = `${ch.name}（${ch.title}）`;
    document.getElementById('lb-skill').textContent = `スキル「${ch.skill}」`;
    document.getElementById('lb-desc').textContent = `${ch.desc} ${ch.profile || ''}`;
    lb.classList.remove('hidden');
    lb.style.display = 'flex';
    const cb = document.getElementById('lb-close'); if (cb) cb.onclick = closeCharaLightbox;
    const xb = document.getElementById('lb-close-x'); if (xb) xb.onclick = closeCharaLightbox;
    const im = document.getElementById('lb-img'); if (im) im.onclick = closeCharaLightbox;
}
function closeCharaLightbox() {
    const lb = document.getElementById('chara-lightbox');
    if (lb) { lb.classList.add('hidden'); lb.style.display = 'none'; }
}
function buildGuideChara() {
    const grid = document.getElementById('guide-chara-grid');
    if (!grid || grid.childElementCount > 0) return;
    CHARACTERS.forEach(ch => {
        const card = document.createElement('div');
        card.className = 'guide-chara-card';
        const imgSrc = typeof CHARA_IMAGES !== 'undefined' ? (CHARA_IMAGES[ch.id] || '') : '';
        card.innerHTML = `<img src="${imgSrc}" alt="${ch.name}"><div class="guide-chara-body"><div class="guide-chara-name">${ch.name} <span class="guide-chara-title">${ch.title}</span></div><div class="guide-chara-skill">スキル「${ch.skill}」：${ch.desc}</div><div class="guide-chara-unlock">${unlockText(ch)}</div><p class="guide-chara-profile">${ch.profile || ''}</p></div>`;
        const gimg = card.querySelector('img');
        if (gimg) { gimg.title = 'クリックで拡大'; gimg.addEventListener('click', () => openCharaLightbox(ch.id)); }
        grid.appendChild(card);
    });
}
buildGuideChara();
document.querySelectorAll('.guide-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.guide-tab').forEach(t => t.classList.toggle('selected', t === tab));
        ['pieces', 'rules', 'chara'].forEach(k => {
            const sec = document.getElementById('guide-tab-' + k);
            if (sec) sec.classList.toggle('hidden', tab.dataset.gtab !== k);
        });
    });
});
(function () {
    const lb = document.getElementById('chara-lightbox');
    if (lb) {
        lb.querySelector('.lb-backdrop').addEventListener('click', closeCharaLightbox);
        document.getElementById('lb-close').addEventListener('click', closeCharaLightbox);
        lb.addEventListener('click', (e) => { if (e.target === lb) closeCharaLightbox(); });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeCharaLightbox(); });
    }
    [['chara-img-p1', 'P1'], ['chara-img-p2', 'P2']].forEach(([id, pl]) => {
        const img = document.getElementById(id);
        if (img) { img.title = 'クリックで拡大'; img.addEventListener('click', () => { if (playerCharacters[pl]) openCharaLightbox(playerCharacters[pl]); }); }
    });
})();
function leaveCharaToMenu() {
    charaPhase = false;
    skillTargeting = null;
    if (isOnlineMode()) teardownOnline();
    updateCharaModalVisibility();
    showScreen('menu');
}
(function () {
    const b = document.getElementById('chara-modal-back');
    if (b) b.addEventListener('click', leaveCharaToMenu);
})();

function buildCharaGrid() {
    const grid = document.getElementById('chara-grid');
    if (!grid || grid.childElementCount > 0) return;
    CHARACTERS.forEach(ch => {
        const card = document.createElement('button');
        card.className = 'chara-card';
        card.dataset.chara = ch.id;
        const imgSrc = typeof CHARA_IMAGES !== 'undefined' ? (CHARA_IMAGES[ch.id] || '') : '';
        card.innerHTML = `<img src="${imgSrc}" alt="${ch.name}"><span class="chara-zoom-btn" title="立ち絵を拡大">🔍</span><span class="chara-card-name">${ch.name}</span><span class="chara-card-title">${ch.title}</span><span class="chara-card-skill">「${ch.skill}」${ch.desc}</span><span class="chara-card-unlock">${unlockText(ch)}</span>`;
        card.addEventListener('click', () => onCharaCardPick(ch.id));
        const zb = card.querySelector('.chara-zoom-btn');
        if (zb) zb.addEventListener('click', (e) => { e.stopPropagation(); openCharaLightbox(ch.id); });
        grid.appendChild(card);
    });
}
function openCharaSelection() {
    playerCharacters = { P1: null, P2: null };
    charaPhase = true;
    skillTargeting = null;
    buildCharaGrid();
    document.querySelectorAll('.chara-card').forEach(c => { c.disabled = false; });
    const title = document.getElementById('chara-modal-title');
    if (title) title.textContent = isOnlineMode() ? 'あなたのキャラを選んでください' : (isCpuGame() ? 'あなたのキャラを選んでください' : 'P1 のキャラを選んでください');
    updateCharaModalVisibility();
    renderCharaPanel();
}
function onCharaCardPick(id) {
    if (!charaPhase) return;
    const title = document.getElementById('chara-modal-title');
    if (isOnlineMode()) {
        if (playerCharacters[myRole]) return;
        playerCharacters[myRole] = id;
        broadcastState();
        if (playerCharacters.P1 && playerCharacters.P2) { charaPhase = false; }
        else if (title) title.textContent = '相手の選択を待っています…';
    } else if (isCpuGame()) {
        playerCharacters[humanSide()] = id;
        const rest = CHARACTERS.map(c => c.id).filter(x => x !== id);
        playerCharacters[cpuSide] = rest[Math.floor(Math.random() * rest.length)];
        charaPhase = false;
    } else {
        if (!playerCharacters.P1) {
            playerCharacters.P1 = id;
            document.querySelectorAll('.chara-card').forEach(c => { if (c.dataset.chara === id) c.disabled = true; });
            if (title) title.textContent = 'P2 のキャラを選んでください';
            renderCharaPanel();
            return;
        }
        playerCharacters.P2 = id;
        charaPhase = false;
    }
    renderBoard();
    if (isCpuGame() && !charaPhase && currentPlayer === cpuSide && !gameOver) setTimeout(makeCpuMove, 800);
}
function updateCharaModalVisibility() {
    const modal = document.getElementById('chara-modal');
    if (!modal) return;
    if (isCharaMode() && charaPhase) {
        buildCharaGrid();
        const title = document.getElementById('chara-modal-title');
        if (title && isOnlineMode()) {
            title.textContent = playerCharacters[myRole] ? '相手の選択を待っています…' : 'あなたのキャラを選んでください';
        }
        modal.classList.remove('hidden');
    } else {
        modal.classList.add('hidden');
    }
}

let battleRunning = false;
if (battleStartBtn) {
    battleStartBtn.addEventListener('click', () => {
        if (battleRunning) return;
        const modeA = document.getElementById('battle-a').value;
        const modeB = document.getElementById('battle-b').value;
        const total = parseInt(document.getElementById('battle-games').value, 10);
        const nameOf = (m) => ({ 'cpu-easy': '初級', 'cpu-normal': '中級', 'cpu-hard': '上級', 'cpu-demon': '鬼' }[m] || m);
        const tally = { a: 0, b: 0, d: 0, moves: 0, adj: 0 };
        let i = 0;
        battleRunning = true;
        if (battleResultEl) battleResultEl.innerHTML = '';
        const step = () => {
            if (i >= total) {
                battleRunning = false;
                if (battleProgressEl) battleProgressEl.textContent = '完了';
                if (battleResultEl) {
                    battleResultEl.innerHTML =
                        `先手 ${nameOf(modeA)}: ${tally.a}勝（${(tally.a / total * 100).toFixed(0)}%） / 後手 ${nameOf(modeB)}: ${tally.b}勝（${(tally.b / total * 100).toFixed(0)}%） / 引き分け: ${tally.d}<br>` +
                        `平均手数: ${(tally.moves / total).toFixed(1)}手（先手・後手は固定で対戦）※手数上限では形勢判定（判定勝ち ${tally.adj} 件）`;
                }
                return;
            }
            let r;
            try { r = simulateBattleGame(modeA, modeB); }
            catch (e) {
                battleRunning = false;
                if (battleProgressEl) battleProgressEl.textContent = 'エラーで停止しました（もう一度お試しください）';
                return;
            }
            if (r.winner === 'P1') tally.a++; else if (r.winner === 'P2') tally.b++; else tally.d++;
            if (r.adjudicated) tally.adj++;
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

// ===== 観戦モードの対戦記録と勝率 =====
const WATCH_KEY = 'rotatingChessWatchV1';
function loadWatchRecords() {
    try { return JSON.parse(localStorage.getItem(WATCH_KEY)) || []; } catch (e) { return []; }
}
function recordWatchResult(winner) {
    if (typeof isWatchMode !== 'function' || !isWatchMode()) return;
    const recs = loadWatchRecords();
    recs.push({ a: watchLevelFor('P1'), b: watchLevelFor('P2'), winner: winner || 'draw', ts: Date.now() });
    if (recs.length > 300) recs.splice(0, recs.length - 300);
    try { localStorage.setItem(WATCH_KEY, JSON.stringify(recs)); } catch (e) { /* 保存できない環境では無視 */ }
    renderWatchStats();
}
function renderCharaStats() {
    const box = document.getElementById('chara-stats');
    if (!box) return;
    const stats = loadStats();
    const cs = stats.chara || {};
    const entries = Object.entries(cs).filter(([, v]) => v.games > 0).sort((a, b) => b[1].games - a[1].games);
    if (!entries.length) {
        box.innerHTML = '<p class="screen-note">まだキャラ対戦の記録がありません。キャラ対戦が終わると、使ったキャラごとの勝率が表示されます。</p>';
        return;
    }
    const tierOf = (rate, games) => games < 3 ? null : rate >= 65 ? 'S' : rate >= 55 ? 'A' : rate >= 45 ? 'B' : 'C';
    const tiers = { S: [], A: [], B: [], C: [] };
    entries.forEach(([cid, v]) => {
        const rate = v.wins / v.games * 100;
        const tier = tierOf(rate, v.games);
        if (tier) tiers[tier].push({ cid, rate: rate.toFixed(1), games: v.games });
    });
    const tierHtml = ['S', 'A', 'B', 'C'].filter(k => tiers[k].length).map(k =>
        `<div class="watch-stat-row"><span class="ws-match">ティア ${k}</span><span class="ws-rec">${tiers[k].map(x => { const ch = CHARACTERS.find(c => c.id === x.cid); return `${ch ? ch.name : x.cid}（${x.rate}%）`; }).join('、')}</span></div>`
    ).join('');
    box.innerHTML = (tierHtml ? `<div class="watch-stat-row"><span class="ws-match">キャラティア表</span><span class="ws-games">3戦以上で判定</span></div>` + tierHtml : '') + entries.map(([cid, v]) => {
        const ch = CHARACTERS.find(c => c.id === cid);
        const name = ch ? ch.name : cid;
        const rate = (v.wins / v.games * 100).toFixed(1);
        return `<div class="watch-stat-row"><span class="ws-match">${name}</span><span class="ws-games">${v.games}戦</span><span class="ws-rec">${v.wins}勝（${rate}%）</span><span class="ws-draw">引分 ${v.draws || 0}</span></div>`;
    }).join('');
}

function renderWatchStats() {
    const box = document.getElementById('watch-stats');
    if (!box) return;
    const recs = loadWatchRecords();
    if (!recs.length) {
        box.innerHTML = '<p class="screen-note">まだ観戦の記録がありません。CPU同士の観戦で対戦が終わると、ここに勝率が表示されます。</p>';
        return;
    }
    const agg = {};
    recs.forEach(r => {
        const key = r.a + '|' + r.b;
        if (!agg[key]) agg[key] = { a: r.a, b: r.b, games: 0, p1: 0, p2: 0, draws: 0 };
        agg[key].games++;
        if (r.winner === 'P1') agg[key].p1++;
        else if (r.winner === 'P2') agg[key].p2++;
        else agg[key].draws++;
    });
    const pct = (n, g) => (g ? (n / g * 100).toFixed(1) : '0.0') + '%';
    const rows = Object.values(agg).sort((x, y) => y.games - x.games).map(g =>
        `<div class="watch-stat-row"><span class="ws-match">${CPU_LEVEL_NAMES[g.a] || g.a} vs ${CPU_LEVEL_NAMES[g.b] || g.b}</span>` +
        `<span class="ws-games">${g.games}戦</span>` +
        `<span class="ws-rec">P1 ${g.p1}勝（${pct(g.p1, g.games)}）</span>` +
        `<span class="ws-rec">P2 ${g.p2}勝（${pct(g.p2, g.games)}）</span>` +
        `<span class="ws-draw">引分 ${g.draws}</span></div>`).join('');
    box.innerHTML = `<p class="screen-note">観戦の対戦記録：全${recs.length}試合（P1の強さ × P2の強さ ごとの勝率）</p>` + rows;
}

// ===== 先手・後手決め（サイコロ） =====
let onlineDice = { mine: null, theirs: null, started: false };
let onlineDiceDone = false;
let watchDiceNote = '';
const DICE_FACES = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
function diceRoll() { return 1 + Math.floor(Math.random() * 6); }

function beginGameWithDice() {
    if (isOnlineMode()) { startSelectedGame(); return; }
    if (isWatchMode()) { watchDiceSwap(); startSelectedGame(); return; }
    const modal = document.getElementById('dice-modal');
    if (!modal) { startSelectedGame(); return; }
    const youName = document.getElementById('dice-you-name');
    const oppName = document.getElementById('dice-opp-name');
    if (youName) youName.textContent = isCpuGame() ? 'あなた' : 'プレイヤー1';
    if (oppName) oppName.textContent = isCpuGame() ? 'CPU' : 'プレイヤー2';
    const result = document.getElementById('dice-result');
    if (result) result.textContent = 'サイコロを振って、大きい目が出た方が先手（P1・金）になります';
    const go = document.getElementById('dice-go-btn');
    if (go) go.classList.add('hidden');
    const roll = document.getElementById('dice-roll-btn');
    if (roll) roll.classList.remove('hidden');
    modal.classList.remove('hidden');
}
(function initDiceModal() {
    const rollBtn = document.getElementById('dice-roll-btn');
    const goBtn = document.getElementById('dice-go-btn');
    const youEl = document.getElementById('dice-you');
    const oppEl = document.getElementById('dice-opp');
    const result = document.getElementById('dice-result');
    if (!rollBtn || !goBtn) return;
    rollBtn.addEventListener('click', () => {
        rollBtn.disabled = true;
        let ticks = 0;
        const iv = setInterval(() => {
            if (youEl) youEl.textContent = DICE_FACES[Math.floor(Math.random() * 6)];
            if (oppEl) oppEl.textContent = DICE_FACES[Math.floor(Math.random() * 6)];
            ticks++;
            if (ticks >= 8) {
                clearInterval(iv);
                const you = diceRoll(), opp = diceRoll();
                if (youEl) youEl.textContent = DICE_FACES[you - 1];
                if (oppEl) oppEl.textContent = DICE_FACES[opp - 1];
                rollBtn.disabled = false;
                if (you === opp) {
                    if (result) result.textContent = `あいこ（${you} vs ${opp}）！もう一度振ってください`;
                    return;
                }
                const youFirst = you > opp;
                if (isCpuGame()) cpuSide = youFirst ? 'P2' : 'P1';
                if (result) result.textContent = youFirst
                    ? `${you} vs ${opp} ― ${isCpuGame() ? 'あなた' : 'プレイヤー1'} の勝ち！先手（P1・金）です`
                    : `${you} vs ${opp} ― ${isCpuGame() ? 'CPU' : 'プレイヤー2'} の勝ち！${isCpuGame() ? 'CPUが先手（P1）、あなたは後手（P2）です' : 'プレイヤー2 が先手（P1・金）です'}`;
                rollBtn.classList.add('hidden');
                goBtn.classList.remove('hidden');
            }
        }, 80);
    });
    goBtn.addEventListener('click', () => {
        const modal = document.getElementById('dice-modal');
        if (modal) modal.classList.add('hidden');
        startSelectedGame();
    });
})();

// 観戦：試合ごとにサイコロで先手側を決め直す（強さの割り当てが入れ替わる）
function watchDiceSwap() {
    const a = diceRoll(), b = diceRoll();
    const s1 = document.getElementById('watch-p1-level');
    const s2 = document.getElementById('watch-p2-level');
    let swapped = false;
    if (b > a && s1 && s2) {
        const tmp = s1.value; s1.value = s2.value; s2.value = tmp;
        swapped = true;
    }
    watchDiceNote = `サイコロ ${a} vs ${b}：${b > a ? 'P2側が勝って先手の強さを入れ替え' : 'そのままの強さで対戦'}`;
    return swapped;
}

// オンライン：接続時にサイコロを振り合い、大きい目が P1
function startOnlineDice() {
    if (onlineDice.started || onlineDiceDone) return;
    onlineDice.started = true;
    onlineDice.mine = diceRoll();
    sendOnline({ type: 'dice', value: onlineDice.mine });
    setOnlineStatus(`サイコロで先手を決めています…（あなたの目: ${onlineDice.mine}）`);
    resolveOnlineDice();
}
function resolveOnlineDice() {
    if (onlineDiceDone) return;
    if (onlineDice.mine === null || onlineDice.theirs === null) return;
    if (onlineDice.mine === onlineDice.theirs) {
        onlineDice = { mine: null, theirs: null, started: false };
        setOnlineStatus('サイコロがあいこ！振り直します…');
        startOnlineDice();
        return;
    }
    myRole = onlineDice.mine > onlineDice.theirs ? 'P1' : 'P2';
    onlineDiceDone = true;
    setOnlineStatus(`サイコロ: あなた ${onlineDice.mine} / 相手 ${onlineDice.theirs} → あなたは ${myRole}（${myRole === 'P1' ? '先手・金' : '後手・青'}）`);
    initGame();
    refreshSideLabels();
    if (isCharaMode()) openCharaSelection();
    updateModeDisplay();
}

// ===== script.js から分割（CPU着手・観戦制御） =====
function maybeArmDoubleMove(player, mv) {
    if (player !== 'P2' || !p2DoubleMove || doubleMoveArmed || !mv) return;
    let use = !!mv.captured;
    if (!use) {
        try {
            const tg = new Chess(buildActiveFen());
            const rm = tg.move({ from: mv.from, to: mv.to, promotion: mv.promotion || 'q' });
            if (rm && isKingInCheck(tg.fen(), 'w')) use = true;
        } catch (e) { /* 評価できない場合は使わない */ }
    }
    if (use) doubleMoveArmed = true;
}
function makeCpuMove() {
    if (gameOver) return;
    // スキル処理で例外が起きても、CPUの手番がそのまま止まらないようにする
    try { maybeCpuUseSkill(); } catch (e) { /* スキルを諦めて着手に進む */ }
    const level = getCpuLevelForMode();
    let mv = null;
    try { mv = chooseCpuMove(cpuSide, level); } catch (e) { mv = null; }
    const fenBefore = game.fen();
    if (mv) { maybeArmDoubleMove(cpuSide, mv); executeMoveCustom(mv.from, mv.to); }
    if (!gameOver && currentPlayer === cpuSide && game.fen() === fenBefore) {
        // 着手がルールで拒否された（王の加護・鏡の加護など）場合は代替手を試し、対戦が止まるのを防ぐ
        // ※盤面が変わっている場合は追加手番（アンコール／連続手番）で、予約済みの次手に任せる
        const color = getActivePieceColor();
        const alts = [];
        boardCells().filter(c => c.color === color).forEach(c => { getSimulatedMoves(c.square, color).forEach(m => alts.push(m)); });
        for (const alt of alts) {
            if (mv && alt.from === mv.from && alt.to === mv.to) continue;
            maybeArmDoubleMove(cpuSide, alt);
            executeMoveCustom(alt.from, alt.to);
            if (gameOver || currentPlayer !== cpuSide || game.fen() !== fenBefore) break;
        }
    }
}

// ===== CPU同士の観戦モード =====
let watchTimer = null;
let watchPlaying = false;
let watchMatchNo = 1;
function isWatchMode() { return selectedGameMode === 'watch' || selectedGameMode === 'chara-watch'; }
function isCharaWatchMode() { return selectedGameMode === 'chara-watch'; }
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
    if (isCharaWatchMode()) { try { maybeUseSkillFor(currentPlayer); } catch (e) { /* スキル処理の例外で観戦が止まらないようにする */ } }
    let mv = chooseCpuMove(currentPlayer, watchLevelFor(currentPlayer));
    maybeArmDoubleMove(currentPlayer, mv);
    if (!mv) { pauseWatch(); return; }
    const fenBefore = game.fen();
    executeMoveCustom(mv.from, mv.to);
    if (!gameOver && game.fen() === fenBefore) {
        // 着手が何らかの理由で拒否された場合は、盤面が変わる代替手を探す（対戦が止まるのを防ぐ）
        const alts = getSimulatedMoves().filter(m2 => !(m2.from === mv.from && m2.to === mv.to));
        for (const alt of alts.slice(0, 10)) {
            executeMoveCustom(alt.from, alt.to);
            if (gameOver || game.fen() !== fenBefore) break;
        }
    }
    if (!gameOver && totalMovesCount >= 300) {
        const adjScore = evaluateBoard(game, 'w');
        if (adjScore >= 50) { finishGame('P1', 'adjudication'); messageEl.textContent = '手数上限のため形勢判定：P1 の勝ち'; }
        else if (adjScore <= -50) { finishGame('P2', 'adjudication'); messageEl.textContent = '手数上限のため形勢判定：P2 の勝ち'; }
        else finishDraw('手数上限・形勢互角');
    }
    if (!gameOver) scheduleWatch();
    else if (watchAutoEnabled()) {
        watchTimer = setTimeout(() => {
            if (!isWatchMode() || !watchPlaying) return;
            watchMatchNo++;
            if (typeof watchDiceSwap === 'function') watchDiceSwap();
            if (isCharaWatchMode()) setupCharaWatch();
            initGame();
            startWatch();
        }, 3000);
    }
    else pauseWatch();
}
function watchAutoEnabled() {
    const el = document.getElementById('watch-auto');
    return !!(el && el.checked);
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
function buildWatchCharaSelects() {
    ['watch-chara-p1', 'watch-chara-p2'].forEach(id => {
        const sel = document.getElementById(id);
        if (!sel || sel.childElementCount > 0) return;
        const opt = document.createElement('option');
        opt.value = 'random'; opt.textContent = 'ランダム';
        sel.appendChild(opt);
        CHARACTERS.forEach(ch => {
            const o = document.createElement('option');
            o.value = ch.id; o.textContent = ch.name;
            sel.appendChild(o);
        });
    });
}
function setupCharaWatch() {
    buildWatchCharaSelects();
    const pick = (selId, exclude) => {
        const sel = document.getElementById(selId);
        let v = sel ? sel.value : 'random';
        if (v === 'random') {
            const pool = CHARACTERS.map(c => c.id).filter(id => id !== exclude);
            v = pool[Math.floor(Math.random() * pool.length)];
        }
        return v;
    };
    const p1 = pick('watch-chara-p1', null);
    const p2 = pick('watch-chara-p2', p1);
    playerCharacters = { P1: p1, P2: p2 };
    charaPhase = false;
    renderCharaPanel();
}
function updateWatchUI() {
    const panel = document.getElementById('watch-panel');
    if (panel) panel.classList.toggle('hidden', !isWatchMode());
    document.querySelectorAll('.watch-chara-row').forEach(r => r.classList.toggle('hidden', !isCharaWatchMode()));
    if (isCharaWatchMode()) buildWatchCharaSelects();
    const btn = document.getElementById('watch-toggle-btn');
    if (btn) btn.textContent = watchPlaying ? '一時停止' : '再開する';
    const info = document.getElementById('watch-match-info');
    if (info) info.textContent = `第${watchMatchNo}試合` + (typeof watchDiceNote !== 'undefined' && watchDiceNote ? `（${watchDiceNote}）` : '');
}

// ===== 最終決戦と形勢判定（script.js から分割） =====
function enterEndgamePhase() {
    endgamePhase = true;
    isBoardRotated = false;
    if (boardEl) boardEl.classList.remove('rotate-180');
    positionCounts = {};
    positionCounts[positionKey()] = 1;
    messageEl.textContent = '千日手！盤面の回転を止めて、通常チェスで最終決戦を行います';
}
function adjudicateByPosition(reason) {
    const diff = evaluateBoard(game, 'w');
    if (diff >= 50) { finishGame('P1', 'adjudication'); messageEl.textContent = `${reason}のため形勢判定：P1 の勝ち`; }
    else if (diff <= -50) { finishGame('P2', 'adjudication'); messageEl.textContent = `${reason}のため形勢判定：P2 の勝ち`; }
    else finishDraw(reason + '・形勢互角');
}

// ===== CPUの着手選択（script.js から分割） =====
function chooseCpuMove(player, levelKey) {
    const color = getActivePieceColor(player);
    const ownColor = player === 'P1' ? 'w' : 'b'; // そのプレイヤーの「初めの色」。評価は常にこの色基準
    const activeFen = buildActiveFen(color);
    let simGame;
    try { simGame = new Chess(activeFen); } catch (e) { return null; }
    let moves = filterForbiddenKingCaptures(simGame.moves({ verbose: true }), player);
    const legalMoves = moves;
    // クロス・スラッシュを使った手番ではキングを取れない（他に手がある場合）
    if (slashKingBanFor === player) {
        const noKing = moves.filter(m => m.captured !== 'k');
        if (noKing.length) moves = noKing;
    }
    // 自分の色の駒を取る手は選ばない（他に手がある場合）。相手の色を操作中の自滅的な取りを防ぐ
    const nonOwnCaps = moves.filter(m => !m.captured || (m.color === 'w' ? 'b' : 'w') !== ownColor);
    if (nonOwnCaps.length) moves = nonOwnCaps;
    if (sleepFor === player) moves = moves.filter(m => m.from !== sleepSquare);
    if (frozenFor === player) moves = moves.filter(m => !m.captured);
    if (shieldFor && shieldFor !== player) {
        const sc = shieldFor === 'P1' ? 'w' : 'b';
        moves = moves.filter(m => { if (!m.captured) return true; return (m.color === 'w' ? 'b' : 'w') !== sc; });
    }
    if (barrierFor === player) {
        const okc = opponentOf(player) === 'P1' ? 'w' : 'b';
        moves = moves.filter(m => {
            if (m.captured === 'k') return false;
            try { const tg = new Chess(activeFen); const rm = tg.move({ from: m.from, to: m.to, promotion: m.promotion || 'q' }); return rm ? !isKingInCheck(tg.fen(), okc) : false; }
            catch (e) { return true; }
        });
    }
    if (starGuardFor && starGuardFor !== player) {
        const guardColor = starGuardFor === 'P1' ? 'w' : 'b';
        moves = moves.filter(m => {
            if (m.captured && (m.color === 'w' ? 'b' : 'w') === guardColor) return false;
            try { const tg = new Chess(activeFen); const rm = tg.move({ from: m.from, to: m.to, promotion: m.promotion || 'q' }); return rm ? !isKingInCheck(tg.fen(), guardColor) : false; }
            catch (e) { return true; }
        });
    }
    if (counterFor && counterFor !== player) {
        moves = moves.filter(m => m.to !== counterSquare);
    }
    // 相手の色のキングを動かす手は、合法手全体に他の手がある限り必ず除外する（着手側のハードルールで拒否され、対戦が止まるため）。
    // 嗜好フィルターで候補が敵キング手だけになった場合は、嗜好を緩めて合法手全体から選び直す
    if (legalMoves.some(m => m.piece !== 'k')) {
        let nk = moves.filter(m => !(m.piece === 'k' && m.color !== ownColor));
        if (!nk.length) nk = legalMoves.filter(m => !(m.piece === 'k' && m.color !== ownColor));
        if (nk.length) moves = nk;
    }
    if (!moves.length) moves = legalMoves;
    if (moves.length === 0) return null;

    // 回転停止権の使用判断（そのプレイヤーの残り回数を使う）
    const skipsLeft = player === 'P1' ? p1Skips : p2Skips;
    if (skipsLeft > 0 && !skipNextRotation) {
        const ownKingInDanger = isKingInCheck(game.fen(), ownColor);
        const useSkip = ownKingInDanger
            ? Math.random() < 0.85
            : (levelKey === 'cpu-demon' ? (Math.random() < 0.4 || simGame.in_check()) : (Math.random() < 0.2));
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
        if (color === ownColor) {
            const captureMoves = moves.filter(m => m.captured);
            selectedMove = captureMoves.length > 0 ? captureMoves[Math.floor(Math.random() * captureMoves.length)] : moves[Math.floor(Math.random() * moves.length)];
        } else {
            // 相手の色を操作しているときは、自分の色の駒を減らす「取る手」を避ける
            const safeMoves = moves.filter(m => !m.captured);
            const pool = safeMoves.length > 0 ? safeMoves : moves;
            selectedMove = pool[Math.floor(Math.random() * pool.length)];
        }
    } else if (levelKey === 'cpu-hard' || levelKey === 'cpu-demon') {
        // ミニマックス法＋α-β探索（上級：合計2手先、鬼：合計3手先まで読む）
        const depth = levelKey === 'cpu-demon' ? 2 : 1; // ルートの1手＋この深さ
        let bestScore = -Infinity;
        let alpha = -Infinity;
        const ordered = orderMovesForSearch(moves);
        // 考えすぎて画面が固まらないよう、探索に時間の上限を設ける（候補は取る手優先の順なので、途中で切っても最善寄りの手が残る）
        const searchStart = Date.now();
        const timeBudget = levelKey === 'cpu-demon' ? 2500 : 1500;
        for (const m of ordered) {
            if (isWinningKingCapture(m, player)) {
                selectedMove = m;
                bestScore = Infinity;
                break;
            }
            const testGame = new Chess(activeFen);
            testGame.move(m);
            const childBoard = testGame.fen().split(' ')[0];
            const score = minimaxAlphaBeta(childBoard, 1, depth, alpha, Infinity, false, color, player, ownColor);
            if (score > bestScore) {
                bestScore = score;
                selectedMove = m;
            }
            if (score > alpha) alpha = score;
            if (selectedMove && Date.now() - searchStart > timeBudget) break;
        }
    }
    if (!selectedMove) selectedMove = moves[Math.floor(Math.random() * moves.length)];
    return selectedMove;
}

