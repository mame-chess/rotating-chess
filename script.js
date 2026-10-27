let game = new Chess();

// 駒の表示：スタントン風の駒文字を使う
// スタントン形の駒を部品から組み立てたSVG（BG=凹みの色）
const PIECE_SHAPES = {
    k: '<path d="M21.5 1.6h2v2.2h2.2v2h-2.2v3.4h-2V5.8h-2.2v-2h2.2z"/><path d="M16.2 15.5c0-3.4 2.6-5.4 6.3-5.4s6.3 2 6.3 5.4z"/><path d="M18.6 14.9c.8-1.7 2.2-2.6 3.9-2.6s3.1.9 3.9 2.6" fill="none" stroke="BG" stroke-width="0.9"/><path d="M15.2 15.5h14.6l.7 2.6H14.5z"/><path d="M15.1 18.1h14.8l.5 2H14.6z"/><path d="M15.4 20.1c1 4.6 1.5 8 1.8 12.4h10.4c.3-4.4.8-7.8 1.8-12.4z"/><path d="M14.6 32.5h15.8c.8 1.4 1.5 3 1.9 4.9H12.7c.4-1.9 1.1-3.5 1.9-4.9z"/><path d="M12.7 37.4h19.6l.7 2.6H12z"/><path d="M11.5 40h22v2.5H11.5z"/>',
    q: '<circle cx="22.5" cy="3.4" r="1.4"/><circle cx="16.8" cy="9.6" r="1"/><circle cx="19.8" cy="8.2" r="1"/><circle cx="22.5" cy="7.7" r="1"/><circle cx="25.2" cy="8.2" r="1"/><circle cx="28.2" cy="9.6" r="1"/><path d="M14.9 15c.3-4.8 3.2-7.4 7.6-7.4s7.3 2.6 7.6 7.4z"/><path d="M17.4 12.7q1.7 1.5 3.4 0" fill="none" stroke="BG" stroke-width="0.9"/><path d="M20.8 13.2q1.7 1.5 3.4 0" fill="none" stroke="BG" stroke-width="0.9"/><path d="M24.2 12.7q1.7 1.5 3.4 0" fill="none" stroke="BG" stroke-width="0.9"/><path d="M14.2 15h16.6l.8 2.8H13.4z"/><path d="M15.4 17.8c1 4.2 1.5 7.2 1.8 11.2h10.4c.3-4 .8-7 1.8-11.2z"/><path d="M15 29h15l1 3H14z"/><path d="M14 32h17c.7 1.3 1.3 2.8 1.7 4.6H12.3c.4-1.8 1-3.3 1.7-4.6z"/><path d="M12.3 36.6h20.4l.7 3.4H11.6z"/><path d="M11.3 40h22.4v2.5H11.3z"/>',
    r: '<path d="M14 13.8V6h4.2v3h3.1V6h2.4v3h3.1V6H31v7.8z"/><path d="M15 13.8h15l.6 2.6H14.4z"/><path d="M15.8 16.4c.4 5 .6 9.6.7 14.6h12c.1-5 .3-9.6.7-14.6z"/><path d="M15.2 31h14.6l1 3H14.2z"/><path d="M14.2 34h16.6c.6 1.2 1.2 2.7 1.5 4.5H12.7c.3-1.8.9-3.3 1.5-4.5z"/><path d="M11.7 38.5h21.6v4H11.7z"/>',
    b: '<circle cx="22.5" cy="3" r="1.5"/><path d="M22.5 5c4 3.2 6 6.9 6 10.8 0 3.3-2.7 5.5-6 5.5s-6-2.2-6-5.5c0-3.9 2-7.6 6-10.8z"/><path d="M19.6 11.5l6.4 6.4" fill="none" stroke="BG" stroke-width="2.2"/><path d="M16.4 21.3h12.2l.8 2.8H15.6z"/><path d="M16.8 24.1c.7 3 1.1 5.4 1.3 8h8.8c.2-2.6.6-5 1.3-8z"/><path d="M15.4 32.1h14.2l1 3H14.4z"/><path d="M14.4 35.1h16.2c.6 1.2 1.2 2.6 1.5 4.3H12.9c.3-1.7.9-3.1 1.5-4.3z"/><path d="M11.8 39.4h21.4v3.1H11.8z"/>',
    n: '<path d="M14.8 21.8c2.7-.8 4.7-2 5.5-3.6.8 1.2 1.2 2.6 1.9 4-.4 3.8-1.6 7.4-3.3 10.5l-1.3 1.8h10.9c1-4.5 1.9-9.1 1.5-13.7.8-2.4 1-5 .2-7.7-.8-2.7-2.4-5-4.6-6.9L24.2 3.4l-1.6 3.4c-2.6 1-5 2.6-7 4.9l-2.9 3.1c-1 1.2-1.4 2.7-1 4.2.4 1.5 1.6 2.5 3.1 2.8z"/><circle cx="21.8" cy="11.8" r="1.05" fill="BG" stroke="none"/><circle cx="14.3" cy="17.8" r="0.75" fill="BG" stroke="none"/><path d="M25.4 8.2c1.9 2.3 3 5.2 3.3 8.6" fill="none" stroke="BG" stroke-width="1.1"/><path d="M27.8 10.6c1.4 2 2.2 4.4 2.4 7.2" fill="none" stroke="BG" stroke-width="1"/><path d="M12.8 19.6l3.2.7" fill="none" stroke="BG" stroke-width="0.9"/><path d="M13.4 34.5h18.2l1.2 3.6H12.2z"/><path d="M11.4 38.1h22.2v4.4H11.4z"/>',
    p: '<circle cx="22.5" cy="10.6" r="4.6"/><path d="M18.2 16h8.6l.7 2.4H17.5z"/><path d="M17.9 18.4c.6 3.6 1 6.8 1.2 10.2h6.8c.2-3.4.6-6.6 1.2-10.2z"/><path d="M16.4 28.6h12.2l1 3H15.4z"/><path d="M15.4 31.6h14.2c.6 1.3 1.2 2.9 1.5 4.7H13.9c.3-1.8.9-3.4 1.5-4.7z"/><path d="M12.2 36.3h20.6l.7 3.4H11.5z"/><path d="M11.2 39.7h22.6v2.8H11.2z"/>'
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

const CHARACTERS = [
    { id: 'luna', name: 'セレーネ', title: '月のうさぎ巫女', skill: 'つきのまもり', kind: 'skip', desc: '回転停止権を1つ増やす。ピンチの回転を止めたいときに。', profile: '月夜の神社に仕える巫女。うさぎの耳飾りと三日月の杖が自慢。静かに見えて負けず嫌い。' },
    { id: 'mint', name: 'シルフィーユ', title: '森の妖精', skill: 'リバイブ', kind: 'revive', unlock: { lost: 2 }, desc: '取られた自分の色の駒のうち、いちばん強い駒を初期位置に復活させる。', profile: '深い森に住む風と葉の妖精。倒れた仲間を放っておけない優しい性格。' },
    { id: 'sora', name: 'カイト', title: '空のパイロット', skill: 'テレポート', kind: 'swap', desc: '今操作している自分の駒2つの位置を入れ替える。', profile: '西風を追いかける若き飛行士。思い立ったら即行動、配置換えはお手のもの。' },
    { id: 'hikari', name: 'アステリア', title: 'ステージのアイドル', skill: 'アンコール', kind: 'extra', unlock: { moves: 6 }, desc: '自分の着手のあと、もう1手続けて動ける。', profile: '星のステージで歌う人気アイドル。アンコールの声援を力に変える。' },
    { id: 'yuki', name: 'ネージュ', title: '雪の少女', skill: 'ふぶき', kind: 'freeze', desc: '次の相手の手番、相手は駒を取ることができない。', profile: '雪国から来た物静かな少女。彼女の吹雪は相手の攻め手を凍らせる。' },
    { id: 'momo', name: 'モルガナ', title: '小さな魔女', skill: 'へんしん', kind: 'transform', toType: 'n', unlock: { moves: 4 }, desc: '今操作している自分のポーン1つをナイトに変える。', profile: '古い洋館に住む魔女見習い。変身魔法が得意で、いたずら好き。' },
    { id: 'nereia', name: 'ネレイア', title: '海の人魚姫', skill: 'まどろみ', kind: 'sleep', desc: '相手が次に操作する色の駒1つを眠らせる。次の相手の手番、その駒は動けない。', profile: '深海の王国の人魚姫。子守歌のような声で大の男も眠らせる。' },
    { id: 'vulkan', name: 'ヴォルカン', title: '炎の鍛冶屋', skill: 'うちなおし', kind: 'revivePawns', unlock: { lost: 2 }, desc: '取られた自分の色のポーンを最大2つまで、初期位置に復活させる。', profile: '火山のふもとの鍛冶屋の少年。壊れたものは打ち直せばいい、が信条。' },
    { id: 'chronos', name: 'クロノス', title: '時の魔法使い', skill: 'タイムリープ', kind: 'undo', unlock: { moves: 4 }, desc: '直前の1手を無料で巻き戻す（相手の手も自分の手も対象）。', profile: '時計塔に住む魔法使い。時間の流れを少しだけ巻き戻すことができる。' },
    { id: 'bastet', name: 'バステト', title: '猫耳メイド', skill: 'にゃんステップ', kind: 'step', desc: '今操作している自分の駒1つを、隣の空きマスへそっと移す。', profile: '猫の女神の名を持つメイド。足音なく動くのは得意中の得意。' },
    { id: 'carmilla', name: 'カーミラ', title: '吸血鬼の令嬢', skill: '眷属化', kind: 'convert', unlock: { captured: 1 }, desc: '自分が取った相手の駒のうち最強の1つを、自分の色に変えて初期位置に復活させる。', profile: '古城に住む吸血鬼の令嬢。気に入った相手は眷属にしてしまう。' },
    { id: 'suiren', name: 'スイレン', title: '龍の巫女', skill: 'りゅうの結界', kind: 'barrier', desc: '次の相手の手番、相手はチェックをかける手とキングを取る手ができない。', profile: '水龍を祀る神社の巫女。張った結界は王への攻撃を通さない。' },
    { id: 'titan', name: 'タイタン', title: '岩の守護者', skill: 'いわの守護', kind: 'shield', desc: '自分の色の駒が次に取られるのを1回防ぐ（防ぐまで有効）。', profile: '山の神殿を守る岩の守護者。仲間への一撃ならこの身で受ける。' },
    { id: 'sibylla', name: 'シビラ', title: '星の占い師', skill: '星屑の加護', kind: 'fortune', desc: 'シビラだけの星読み。10%で超新星：取られた自分の駒をすべて復活。30%で星の守り：次の相手の手番、自分の駒は取られずキングもチェックされない。40%で流れ星：自分のポーン1つを前方2マスへワープ。20%で護衛の星：自分のキングの隣にポーンが現れる（現れなければ停止権+1）。', profile: '星の声を聞く占い師。運命は気まぐれだが、彼女の星読みは戦況そのものを書き換える。' },
    { id: 'hayate', name: 'ハヤテ', title: '風の忍者', skill: '分身の術', kind: 'clone', unlock: { moves: 4 }, desc: '今操作している自分のナイトの隣の空きマスに、ナイトをもう1つ増やす。', profile: '疾風の里の忍者。分身の術でナイトを増やすのが奥義。' },
    { id: 'seraphina', name: 'セラフィナ', title: '天空の天使', skill: '大いなる祝福', kind: 'transform', toType: 'q', unlock: { lost: 2 }, desc: '今操作している自分のポーン1つをクイーンに変える。', profile: '天空の都から遣わされた天使。小さなポーンにも大きな祝福を。' },
    { id: 'barbarossa', name: 'バルバロッサ', title: '海賊船長', skill: '砲撃', kind: 'destroy', unlock: { moves: 8 }, desc: '相手の色の駒（キング以外）どれか1つを盤上から取り除く。クイーンやルークも砲撃で沈められる。', profile: '七つの海を荒らした海賊船長。砲撃の的は絶対に外さない。' },
    { id: 'nicola', name: 'ニコラ', title: '錬金術師', skill: '等価交換', kind: 'exchange', unlock: { moves: 6 }, desc: '今操作している自分の駒1つ（キング以外）を、好きな駒（クイーン／ルーク／ビショップ／ナイト／ポーン）に変える。通常の上限数を超えて同じ駒を増やすこともできる（ポーンの昇格と同じ仕組み）。', profile: '賢者の石を追う錬金術師。姿を変えることも、等価交換の応用にすぎない。' },
    { id: 'persephone', name: 'ペルセフォネ', title: '冥界の女王', skill: '冥府の軍団', kind: 'reviveAll', unlock: { lost: 3, moves: 6 }, desc: '相手に取られた自分の駒をすべて、自分の色のまま初期位置に復活させる（空いている初期位置の分だけ）。取られた駒が多いほど帰ってくる軍団も大きくなる。', profile: '冥界を治める若き女王。倒れた自軍の魂を呼び戻し、戦列へ帰す。' },
    { id: 'rosetta', name: 'ロゼッタ', title: '薔薇の伯爵夫人', skill: '魅了の抱擁', kind: 'charm', unlock: { moves: 8 }, desc: '相手の色の駒1つ（キングとクイーン以外）を、場所はそのままに自分の色に変えてしまう。ただし、変えた駒がそのまま相手のキングにチェックできる位置にある場合は選べない。', profile: '薔薇園の若き伯爵夫人。その微笑みと差し伸べた手に、逆らえる者はいない。' },
    { id: 'shizuku', name: 'シズク', title: '図書室の文学少女', skill: '終章', kind: 'doom', unlock: { moves: 6 }, desc: '相手が次に操作する色の駒1つ（キング以外）に「終章」の印をつける。その相手の手番が終わると、印の駒は盤上から消える。印の駒が動いても、消えるまで印は追いかける。', profile: '白髪と眼鏡が目印の、物静かな文学少女。本を閉じるように、物語の終わりを静かに告げる。' },
    { id: 'ayame', name: 'アヤメ', title: '二刀流の女剣士', skill: '斬り込み', kind: 'dashSlash', unlock: { moves: 5 }, desc: '今操作している自分の駒1つ（キング以外）を、同じ縦・横・斜めの直線上にいる相手の色の駒（キング以外）へ一直線に斬り込ませ、その駒を取る。途中の駒は飛び越える。', profile: '桜と月夜を背に戦う二刀流の女剣士。二本の刀が描く軌跡は、一直線の死線になる。' },
    { id: 'kanon', name: 'カノン', title: '弦楽の演奏家', skill: 'リタルダンド', kind: 'pushback', desc: '相手の色のポーン1つを、そのポーンから見て後ろの空きマスへ1マス押し戻す。', profile: 'コンサートホールの花形ヴァイオリニスト。ゆっくりと遅らせる旋律は、敵の歩みまで押し戻す。' }
];
const SKILL_PIECE_VALUES = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
let playerCharacters = { P1: null, P2: null };
let charaUsed = { P1: false, P2: false };
let frozenFor = null;
let skillRecharge = { P1: 0, P2: 0 };
let skillFxSquares = [];
let sleepFor = null;
let sleepSquare = null;
let barrierFor = null;
let shieldFor = null;
let starGuardFor = null;
let doomFor = null;
let doomSquare = null;
let doomPieceType = null;
let doomPieceColor = null;
let transformPicker = null;
let skillFxNote = '';
function opponentOf(player) { return player === 'P1' ? 'P2' : 'P1'; }
function sleepTargetColorFor(player) {
    const active = getActivePieceColor(player);
    return player === 'P1' ? (active === 'w' ? 'b' : 'w') : active;
}
let pendingExtraMove = { P1: false, P2: false };
let charaPhase = false;
let skillTargeting = null;
const CPU_LEVEL_NAMES = { 'cpu-easy': '初級', 'cpu-normal': '中級', 'cpu-hard': '上級', 'cpu-demon': '鬼' };
let cpuVariantLevel = 'cpu-normal'; // 通常チェス／キャラ対戦（CPU）の難易度
function getCpuLevelForMode() {
    if (selectedGameMode === 'normal-cpu' || selectedGameMode === 'chara-cpu' || selectedGameMode === 'cpu-random') return cpuVariantLevel;
    return selectedGameMode;
}
function selectedModeSummary() {
    let label = MODE_LABELS[selectedGameMode] || selectedGameMode;
    if (selectedGameMode === 'normal-cpu' || selectedGameMode === 'chara-cpu' || selectedGameMode === 'cpu-random') label += `（CPU：${CPU_LEVEL_NAMES[cpuVariantLevel]}）`;
    return label;
}
function refreshModeSummaries() {
    document.querySelectorAll('.selected-mode-name').forEach(el => { el.textContent = selectedModeSummary(); });
    const box = document.getElementById('cpu-level-box');
    if (box) box.classList.toggle('hidden', !(selectedGameMode === 'normal-cpu' || selectedGameMode === 'chara-cpu' || selectedGameMode === 'cpu-random'));
}
function charaOf(player) { const id = playerCharacters[player]; return CHARACTERS.find(c => c.id === id) || null; }

const MODE_LABELS = {
    'pvp': 'P1 vs P2｜2人対戦 (ローカル)',
    'online': 'オンライン対戦｜離れた相手と対戦',
    'pvp-random': 'ランダム回転｜2人対戦 (特別ルール)',
    'cpu-random': 'ランダム回転｜CPU対戦 (特別ルール・中級)',
    'cpu-easy': 'CPU対戦 (Easy)｜初級',
    'cpu-normal': 'CPU対戦 (Normal)｜中級',
    'cpu-hard': 'CPU対戦 (Hard)｜上級・ミニマックス探索',
    'cpu-demon': 'CPU対戦 (鬼)｜深い先読み',
    'watch': 'CPU同士｜観戦モード',
    'normal-pvp': '通常チェス｜2人対戦 (回転なし)',
    'normal-cpu': '通常チェス｜CPU対戦 (回転なし)',
    'normal-online': '通常チェス｜オンライン対戦 (回転なし)',
    'online-random': 'ランダム回転｜オンライン対戦 (特別ルール)',
    'chara-pvp': 'キャラ対戦｜2人対戦 (回転＋スキル)',
    'chara-cpu': 'キャラ対戦｜CPU対戦 (回転＋スキル)',
    'chara-online': 'キャラ対戦｜オンライン対戦 (回転＋スキル)'
};

function isRandomMode() { return selectedGameMode.includes('random'); }
function isOnlineMode() { return ['online', 'online-random', 'normal-online', 'chara-online'].includes(selectedGameMode); }
function isNormalMode() { return selectedGameMode.startsWith('normal'); }
function isCharaMode() { return selectedGameMode.startsWith('chara'); }
function isCpuGame() { return selectedGameMode.startsWith('cpu') || selectedGameMode === 'normal-cpu' || selectedGameMode === 'chara-cpu'; }

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
let lastMovePlayer = null; // 最後に着手したプレイヤー（勝敗判定用）
let lastMoveColor = null; // 最後に着手した駒の色
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
        refreshModeSummaries();
        if (onlineJoinBoxEl) {
            onlineJoinBoxEl.classList.toggle('hidden', !isOnlineMode());
        }
    });
});

window.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return;
    const hubVisible = ['hub-local-screen', 'hub-cpu-screen', 'hub-online-screen'].some(id => { const el = document.getElementById(id); return el && !el.classList.contains('hidden'); });
    if (hubVisible) startSelectedGame();
});

function openHub(name, screenId) {
    showScreen(name);
    const screen = document.getElementById(screenId);
    if (!screen) return;
    if (!screen.querySelector(`[data-mode="${selectedGameMode}"]`)) {
        const first = screen.querySelector('.mode-item');
        if (first) first.click();
    }
    refreshModeSummaries();
}
document.getElementById('hub-btn-local').addEventListener('click', () => openHub('hub-local', 'hub-local-screen'));
document.getElementById('hub-btn-cpu').addEventListener('click', () => openHub('hub-cpu', 'hub-cpu-screen'));
document.getElementById('hub-btn-online').addEventListener('click', () => openHub('hub-online', 'hub-online-screen'));
document.querySelectorAll('.hub-back').forEach(b => b.addEventListener('click', () => showScreen('menu')));
document.querySelectorAll('.hub-start').forEach(b => b.addEventListener('click', () => startSelectedGame()));

function startSelectedGame() {
    showScreen('game');
    p2NameLabel.textContent = (isCpuGame() || isWatchMode()) ? 'P2 (CPU)' : 'P2 (相手)';
    updateModeDisplay();
    initGame();
    if (isOnlineMode()) setupOnline();
    if (isCharaMode()) openCharaSelection();
    if (isWatchMode()) { updateWatchUI(); startWatch(); }
    else { pauseWatch(); updateWatchUI(); }
}
startBtn.addEventListener('click', () => { startSelectedGame(); });

function updateModeDisplay() {
    if (!currentModeEl) return;
    let label = selectedModeSummary();
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
    return isCpuGame() ? 'P2 (CPU)' : 'P2 (相手)';
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
    ['hub-local', 'hub-cpu', 'hub-online'].forEach(hb => {
        const el = document.getElementById(hb + '-screen');
        if (el) el.classList.toggle('hidden', name !== hb);
    });
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
    lastMovePlayer = null;
    lastMoveColor = null;
    charaUsed = { P1: false, P2: false };
    frozenFor = null;
    sleepFor = null;
    sleepSquare = null;
    barrierFor = null;
    shieldFor = null;
    starGuardFor = null;
    doomFor = null;
    doomSquare = null;
    doomPieceType = null;
    doomPieceColor = null;
    transformPicker = null;
    skillFxNote = '';
    const transformModalInit = document.getElementById('transform-modal');
    if (transformModalInit) transformModalInit.classList.add('hidden');
    skillRecharge = { P1: 0, P2: 0 };
    pendingExtraMove = { P1: false, P2: false };
    skillTargeting = null;
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
    if (isNormalMode()) return p === 'P1' ? 'w' : 'b';
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
        lastMovePlayer, lastMoveColor,
        playerCharacters: { ...playerCharacters }, charaUsed: { ...charaUsed },
        frozenFor, pendingExtraMove: { ...pendingExtraMove },
        sleepFor, sleepSquare, barrierFor, shieldFor, starGuardFor,
        doomFor, doomSquare, doomPieceType, doomPieceColor, skillRecharge: { ...skillRecharge },
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
    lastMovePlayer = snap.lastMovePlayer || null;
    lastMoveColor = snap.lastMoveColor || null;
    playerCharacters = snap.playerCharacters || { P1: null, P2: null };
    charaUsed = snap.charaUsed || { P1: false, P2: false };
    frozenFor = snap.frozenFor || null;
    pendingExtraMove = snap.pendingExtraMove || { P1: false, P2: false };
    sleepFor = snap.sleepFor || null;
    sleepSquare = snap.sleepSquare || null;
    barrierFor = snap.barrierFor || null;
    shieldFor = snap.shieldFor || null;
    starGuardFor = snap.starGuardFor || null;
    doomFor = snap.doomFor || null;
    doomSquare = snap.doomSquare || null;
    doomPieceType = snap.doomPieceType || null;
    doomPieceColor = snap.doomPieceColor || null;
    transformPicker = null;
    const transformModalRestore = document.getElementById('transform-modal');
    if (transformModalRestore) transformModalRestore.classList.add('hidden');
    skillRecharge = snap.skillRecharge || { P1: 0, P2: 0 };
    charaPhase = isCharaMode() && !(playerCharacters.P1 && playerCharacters.P2);
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

    if (doomSquare) {
        const doomEl = boardEl.querySelector(`[data-square="${doomSquare}"]`);
        if (doomEl) doomEl.classList.add('doom-marked');
    }

    const playerLabel = getPlayerLabel(currentPlayer);
    const currentSkips = currentPlayer === 'P1' ? p1Skips : p2Skips;
    const bottomColorName = getActivePieceColor() === 'w' ? '金' : '青';

    turnEl.textContent = `${playerLabel} の番 [操作する色: ${bottomColorName}]`;
    // ランダム回転モードでは「回転まであと何手か」を伏せる
    movesLeftEl.textContent = isNormalMode() ? '―' : (isRandomMode() ? '？' : (2 - moveCounter));
    skipBtn.style.display = isNormalMode() ? 'none' : '';

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
    renderCharaPanel();
    updateCharaModalVisibility();
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
        if (h.captured && !h.revived) {
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
    if (sleepFor && sleepFor === currentPlayer && square === sleepSquare) return [];
    try {
        const simGame = new Chess(buildActiveFen(color));
        let moves = simGame.moves({ square: square, verbose: true });
        moves = filterForbiddenKingCaptures(moves, currentPlayer);
        if (frozenFor && frozenFor === currentPlayer) moves = moves.filter(m => !m.captured);
        return moves;
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
    if (skillTargeting) { handleSkillTargetClick(square); return; }
    if (isWatchMode()) return;
    if (suppressNextClick) { suppressNextClick = false; return; }
    if (gameOver || game.game_over()) return;
    if (isCpuGame() && currentPlayer === 'P2') return;
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
    if (isCharaMode() && charaPhase) return;
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

    // 眠らされた駒は、この手番では動けない
    if (sleepFor === currentPlayer && from === sleepSquare) { messageEl.textContent = 'その駒は眠っている！この手番は動けません'; return; }
    // タイタンの守護：自分の色の駒が取られるのを1回防ぐ
    if (shieldFor && shieldFor !== currentPlayer) {
        const shieldColor = shieldFor === 'P1' ? 'w' : 'b';
        const epTakesShield = movingPiece && movingPiece.type === 'p' && !targetPiece && to === epSquare && from[0] !== to[0] && currentColor !== shieldColor;
        if ((targetPiece && targetPiece.color === shieldColor) || epTakesShield) {
            shieldFor = null;
            messageEl.textContent = 'タイタンの「いわの守護」が攻撃を防いだ！';
            return;
        }
    }
    // シビラの「星の守り」：守られているプレイヤーの色の駒は取れない
    if (starGuardFor && starGuardFor !== currentPlayer) {
        const guardColor = starGuardFor === 'P1' ? 'w' : 'b';
        const epTargetSquare = movingPiece && movingPiece.type === 'p' && !targetPiece && to === epSquare && from[0] !== to[0] ? to[0] + from[1] : null;
        const epTargetPiece = epTargetSquare ? game.get(epTargetSquare) : null;
        if ((targetPiece && targetPiece.color === guardColor) || (epTargetPiece && epTargetPiece.color === guardColor)) {
            messageEl.textContent = '星の守り！その駒はこの手番では取れません';
            return;
        }
    }
    // ふぶきで凍っているプレイヤーは、この手番では駒を取れない
    if (frozenFor === currentPlayer) {
        const isEpCapture = movingPiece && movingPiece.type === 'p' && !targetPiece && to === epSquare && from[0] !== to[0];
        if (targetPiece || isEpCapture) { messageEl.textContent = 'ふぶきで凍っている！この手番は駒を取れません'; return; }
    }

    const activeFen = buildActiveFen(currentColor);

    const simGame = new Chess(activeFen);
    const moveObj = simGame.move({ from, to, promotion: promotion || 'q' });

    if (moveObj) {
        // スイレンの結界：チェックをかける手とキングを取る手はできない
        if (barrierFor === currentPlayer) {
            const ownerKingColor = opponentOf(currentPlayer) === 'P1' ? 'w' : 'b';
            if ((targetPiece && targetPiece.type === 'k') || isKingInCheck(simGame.fen(), ownerKingColor)) {
                messageEl.textContent = 'スイレンの結界！チェックやキング取りはできません';
                return;
            }
        }
        // 星の守り：守られているキングへチェックをかける手もできない
        if (starGuardFor && starGuardFor !== currentPlayer) {
            const guardKingColor = starGuardFor === 'P1' ? 'w' : 'b';
            if (isKingInCheck(simGame.fen(), guardKingColor)) {
                messageEl.textContent = '星の守り！チェックをかける手はできません';
                return;
            }
        }
        // 待った用に、着手前の状態を保存する
        historyStack.push(snapshotState());

        // 最新状態をメインインスタンスにそのままロード
        game.load(simGame.fen());
        // キャスリング権とアンパッサン対象マスは着手結果から引き継ぐ（回転しても保持）
        const fenPartsAfter = simGame.fen().split(' ');
        if (fenPartsAfter[2]) castlingRights = fenPartsAfter[2];
        if (fenPartsAfter[3]) epSquare = fenPartsAfter[3];
        lastMove = { from, to };
        lastMovePlayer = currentPlayer;
        lastMoveColor = currentColor;
        totalMovesCount++;
        moveHistory.push({
            n: totalMovesCount, player: currentPlayer, color: currentColor,
            from, to,
            captured: moveObj.captured || null,
            capturedColor: moveObj.captured ? (currentColor === 'w' ? 'b' : 'w') : null,
            san: moveObj.san
        });
        if (doomFor === currentPlayer && from === doomSquare && movingPiece && movingPiece.color === doomPieceColor) {
            doomSquare = to;
            doomPieceType = moveObj.promotion || movingPiece.type;
        }
        if (moveObj.captured && charaUsed[currentPlayer]) {
            skillRecharge[currentPlayer]++;
            if (skillRecharge[currentPlayer] >= 3) {
                charaUsed[currentPlayer] = false;
                skillRecharge[currentPlayer] = 0;
                const rechargedPlayer = currentPlayer;
                setTimeout(() => { messageEl.textContent = `${rechargedPlayer} のスキルが再使用可能になった！`; renderCharaPanel(); }, 800);
            }
        }

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

        if (frozenFor === currentPlayer) frozenFor = null;
        if (sleepFor === currentPlayer) { sleepFor = null; sleepSquare = null; }
        if (barrierFor === currentPlayer) barrierFor = null;
        if (isCharaMode() && pendingExtraMove[currentPlayer]) {
            pendingExtraMove[currentPlayer] = false;
            messageEl.textContent = 'アンコール！もう1手動けます';
            renderBoard();
            broadcastState();
            if (isCpuGame() && currentPlayer === 'P2' && !gameOver) setTimeout(makeCpuMove, 600);
            return;
        }
        if (starGuardFor && opponentOf(currentPlayer) === starGuardFor) starGuardFor = null;
        if (doomFor === currentPlayer) {
            const doomedPiece = doomSquare ? game.get(doomSquare) : null;
            if (doomedPiece && doomedPiece.type === doomPieceType && doomedPiece.color === doomPieceColor) {
                game.remove(doomSquare);
                messageEl.textContent = 'シズクの「終章」！印をつけられた駒が消えた';
            }
            doomFor = null;
            doomSquare = null;
            doomPieceType = null;
            doomPieceColor = null;
        }
        if (!isNormalMode()) {
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

        if (!gameOver && !game.game_over() && isCpuGame() && currentPlayer === 'P2') {
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

    if (blackKingCheckmate && lastMovePlayer === 'P1' && lastMoveColor === 'w') {
        gameOver = true;
        winnerPlayer = 'P1';
        winReason = 'checkmate';
        recordGameResult();
        updateWinOverlay();
        messageEl.textContent = '★ P1 (あなた) の勝利！(チェックメイト)';
    } else if (whiteKingCheckmate && lastMovePlayer === 'P2' && lastMoveColor === 'b') {
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
    const ownColor = player === 'P1' ? 'w' : 'b'; // そのプレイヤーの「初めの色」。評価は常にこの色基準
    const activeFen = buildActiveFen(color);
    let simGame;
    try { simGame = new Chess(activeFen); } catch (e) { return null; }
    let moves = filterForbiddenKingCaptures(simGame.moves({ verbose: true }), player);
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
        ordered.forEach(m => {
            if (isWinningKingCapture(m, player)) {
                selectedMove = m;
                bestScore = Infinity;
                return;
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
        });
    }
    if (!selectedMove) selectedMove = moves[Math.floor(Math.random() * moves.length)];
    return selectedMove;
}

function makeCpuMove() {
    if (gameOver) return;
    maybeCpuUseSkill();
    const level = getCpuLevelForMode();
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
    if (isNormalMode()) {
        const nodePlayer = ply % 2 === 0 ? rp : (rp === 'P1' ? 'P2' : 'P1');
        return nodePlayer === 'P1' ? 'w' : 'b';
    }
    const rotations = Math.floor((moveCounter + ply) / 2) - Math.floor(moveCounter / 2);
    const rootBottom = rp === 'P1' ? rootColor : (rootColor === 'w' ? 'b' : 'w');
    const bottom = rotations % 2 === 0 ? rootBottom : (rootBottom === 'w' ? 'b' : 'w');
    const nodePlayer = ply % 2 === 0 ? rp : (rp === 'P2' ? 'P1' : 'P2');
    return nodePlayer === 'P1' ? bottom : (bottom === 'w' ? 'b' : 'w');
}
// ミニマックス法＋α-β探索。評価はルートで CPU が動かした色を基準にする。
// maximizing=true が CPU (P2) の手番、false が相手 (P1) の手番。
function minimaxAlphaBeta(boardOnly, ply, depth, alpha, beta, maximizing, rootColor, rootPlayer, evalColor) {
    const ec = evalColor || rootColor;
    const rp = rootPlayer || 'P2';
    const activeColor = getSearchActiveColor(ply, rootColor, rp);
    const nodePlayer = maximizing ? rp : (rp === 'P2' ? 'P1' : 'P2');
    let nodeGame;
    try {
        nodeGame = new Chess(buildFenFromBoard(boardOnly, activeColor));
    } catch (e) {
        return 0;
    }

    if (depth <= 0) return evaluateBoard(nodeGame, ec);

    const moves = filterForbiddenKingCaptures(nodeGame.moves({ verbose: true }), nodePlayer);
    if (moves.length === 0) return evaluateBoard(nodeGame, ec);

    const ordered = orderMovesForSearch(moves);

    if (maximizing) {
        let value = -Infinity;
        for (const m of ordered) {
            if (isWinningKingCapture(m, nodePlayer)) return 100000 - ply;
            const child = new Chess(buildFenFromBoard(boardOnly, activeColor));
            child.move(m);
            value = Math.max(value, minimaxAlphaBeta(child.fen().split(' ')[0], ply + 1, depth - 1, alpha, beta, false, rootColor, rp, ec));
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
            value = Math.min(value, minimaxAlphaBeta(child.fen().split(' ')[0], ply + 1, depth - 1, alpha, beta, true, rootColor, rp, ec));
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

function skillHomeSquares(type, color) {
    const rank = color === 'w' ? '1' : '8';
    const pr = color === 'w' ? '2' : '7';
    switch (type) {
        case 'k': return ['e' + rank];
        case 'q': return ['d' + rank];
        case 'r': return ['a' + rank, 'h' + rank];
        case 'b': return ['c' + rank, 'f' + rank];
        case 'n': return ['b' + rank, 'g' + rank];
        case 'p': return ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map(f => f + pr);
    }
    return [];
}
function planRevive(player) {
    const ownColor = player === 'P1' ? 'w' : 'b';
    const caps = moveHistory.filter(h => h.captured && h.capturedColor === ownColor && !h.revived);
    if (!caps.length) return null;
    caps.sort((x, y) => (SKILL_PIECE_VALUES[y.captured] || 0) - (SKILL_PIECE_VALUES[x.captured] || 0));
    const type = caps[0].captured;
    const square = skillHomeSquares(type, ownColor).find(s => !game.get(s));
    return square ? { type, square } : null;
}
function planRevivePawns(player) {
    const ownColor = player === 'P1' ? 'w' : 'b';
    const count = moveHistory.filter(h => h.captured === 'p' && h.capturedColor === ownColor && !h.revived).length;
    if (!count) return null;
    const squares = skillHomeSquares('p', ownColor).filter(s => !game.get(s));
    const places = squares.slice(0, Math.min(2, count));
    return places.length ? { places } : null;
}
function planConvert(player) {
    const ownColor = player === 'P1' ? 'w' : 'b';
    const caps = moveHistory.filter(h => h.player === player && h.captured && !h.converted);
    if (!caps.length) return null;
    caps.sort((x, y) => (SKILL_PIECE_VALUES[y.captured] || 0) - (SKILL_PIECE_VALUES[x.captured] || 0));
    const type = caps[0].captured;
    const square = skillHomeSquares(type, ownColor).find(s => !game.get(s));
    return square ? { type, square } : null;
}
function planClone(player) {
    const activeColor = getActivePieceColor(player);
    const bd = game.board();
    const files = 'abcdefgh';
    for (let r = 0; r < 8; r++) for (let f = 0; f < 8; f++) {
        const cell = bd[r][f];
        if (cell && cell.type === 'n' && cell.color === activeColor) {
            const dirs = [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
            for (const [df, dr] of dirs) {
                const nf = f + df, nr = r + dr;
                if (nf < 0 || nf > 7 || nr < 0 || nr > 7) continue;
                if (!bd[nr][nf]) return { square: files[nf] + (8 - nr) };
            }
        }
    }
    return null;
}
function skillProgress(player) {
    const ownColor = player === 'P1' ? 'w' : 'b';
    return {
        moves: moveHistory.filter(h => h.player === player).length,
        captured: moveHistory.filter(h => h.player === player && h.captured).length,
        lost: moveHistory.filter(h => h.captured && h.capturedColor === ownColor).length
    };
}
function skillUnlocked(player) {
    const ch = charaOf(player);
    if (!ch || !ch.unlock) return true;
    const p = skillProgress(player);
    if (ch.unlock.moves && p.moves < ch.unlock.moves) return false;
    if (ch.unlock.captured && p.captured < ch.unlock.captured) return false;
    if (ch.unlock.lost && p.lost < ch.unlock.lost) return false;
    return true;
}
function skillLockText(player) {
    const ch = charaOf(player);
    if (!ch || !ch.unlock) return '';
    const p = skillProgress(player);
    const parts = [];
    if (ch.unlock.moves && p.moves < ch.unlock.moves) parts.push(`あと${ch.unlock.moves - p.moves}手`);
    if (ch.unlock.captured && p.captured < ch.unlock.captured) parts.push(`あと${ch.unlock.captured - p.captured}つ取る`);
    if (ch.unlock.lost && p.lost < ch.unlock.lost) parts.push(`あと${ch.unlock.lost - p.lost}つ取られる`);
    return parts.length ? `解放まで：${parts.join('／')}` : '';
}
function unlockText(ch) {
    if (!ch.unlock) return '解放条件：なし（いつでも使える）';
    const parts = [];
    if (ch.unlock.moves) parts.push(`自分の着手${ch.unlock.moves}回以上`);
    if (ch.unlock.captured) parts.push(`相手の駒を${ch.unlock.captured}つ以上取る`);
    if (ch.unlock.lost) parts.push(`自分の駒が${ch.unlock.lost}つ以上取られる`);
    return '解放条件：' + parts.join('＋');
}
function squareCoords(square) { return { f: square.charCodeAt(0) - 97, r: Number(square[1]) }; }
function coordsToSquare(f, r) { return f >= 0 && f <= 7 && r >= 1 && r <= 8 ? String.fromCharCode(97 + f) + r : null; }
function boardCells() { const cells = []; const bd = game.board(); for (let r = 0; r < 8; r++) for (let f = 0; f < 8; f++) { const cell = bd[r][f]; if (cell) cells.push({ type: cell.type, color: cell.color, square: String.fromCharCode(97 + f) + (8 - r) }); } return cells; }
function reviveAllLostPieces(player) {
    const ownColor = player === 'P1' ? 'w' : 'b';
    const entries = moveHistory.filter(h => h.captured && h.capturedColor === ownColor && !h.revived);
    if (!entries.length) return 0;
    entries.sort((x, y) => (SKILL_PIECE_VALUES[y.captured] || 0) - (SKILL_PIECE_VALUES[x.captured] || 0));
    let placed = 0;
    skillFxSquares = [];
    entries.forEach(en => {
        const sq = skillHomeSquares(en.captured, ownColor).find(s => !game.get(s));
        if (sq) {
            en.revived = true;
            game.put({ type: en.captured, color: ownColor }, sq);
            placed++;
            skillFxSquares.push(sq);
        }
    });
    if (!placed) skillFxSquares = [];
    return placed;
}
function planKingGuardPawn(player) {
    const ownColor = player === 'P1' ? 'w' : 'b';
    let kingSquare = null;
    boardCells().forEach(cell => { if (cell.type === 'k' && cell.color === ownColor) kingSquare = cell.square; });
    if (!kingSquare) return null;
    const c = squareCoords(kingSquare);
    const dirs = [[0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1], [-1, 0], [-1, 1]];
    for (const [df, dr] of dirs) {
        const sq = coordsToSquare(c.f + df, c.r + dr);
        if (sq && !game.get(sq)) return sq;
    }
    return null;
}
function planFortuneWarp(player) {
    const activeColor = getActivePieceColor(player);
    const cells = boardCells().filter(cell => cell.type === 'p' && cell.color === activeColor);
    for (const cell of cells) {
        const c = squareCoords(cell.square);
        const dest = coordsToSquare(c.f, c.r + (cell.color === 'w' ? 2 : -2));
        if (dest && !game.get(dest)) return cell.square;
    }
    return null;
}
function charmWouldGiveCheck(square, player) {
    const pc = game.get(square);
    if (!pc) return true;
    const ownColor = player === 'P1' ? 'w' : 'b';
    const oppKingColor = ownColor === 'w' ? 'b' : 'w';
    let kingSquare = null;
    boardCells().forEach(cell => { if (cell.type === 'k' && cell.color === oppKingColor) kingSquare = cell.square; });
    if (!kingSquare) return true;
    const from = squareCoords(square);
    const king = squareCoords(kingSquare);
    const df = king.f - from.f;
    const dr = king.r - from.r;
    if (pc.type === 'p') {
        const dir = ownColor === 'w' ? 1 : -1;
        return dr === dir && Math.abs(df) === 1;
    }
    if (pc.type === 'n') return (Math.abs(df) === 1 && Math.abs(dr) === 2) || (Math.abs(df) === 2 && Math.abs(dr) === 1);
    if (pc.type === 'k') return false;
    const straight = df === 0 || dr === 0;
    const diagonal = Math.abs(df) === Math.abs(dr);
    if ((pc.type === 'r' && !straight) || (pc.type === 'b' && !diagonal) || (pc.type === 'q' && !straight && !diagonal)) return false;
    const stepF = Math.sign(df);
    const stepR = Math.sign(dr);
    let f = from.f + stepF;
    let r = from.r + stepR;
    while (f !== king.f || r !== king.r) {
        const between = coordsToSquare(f, r);
        if (!between || game.get(between)) return false;
        f += stepF;
        r += stepR;
    }
    return true;
}
function applySkillEffect(player, data) {
    const ch = charaOf(player);
    if (!ch || charaUsed[player] || gameOver) return false;
    if (!skillUnlocked(player)) return false;
    const ownColor = player === 'P1' ? 'w' : 'b';
    const activeColor = getActivePieceColor(player);
    const opp = opponentOf(player);
    switch (ch.kind) {
        case 'skip': if (player === 'P1') p1Skips++; else p2Skips++; break;
        case 'extra': pendingExtraMove[player] = true; break;
        case 'freeze': frozenFor = opp; break;
        case 'barrier': barrierFor = opp; break;
        case 'shield': shieldFor = player; break;
        case 'sleep': {
            const pc = data && data.square ? game.get(data.square) : null;
            if (!pc || pc.color !== sleepTargetColorFor(player)) return false;
            sleepFor = opp; sleepSquare = data.square; break;
        }
        case 'transform': {
            const pc = data && data.square ? game.get(data.square) : null;
            if (!pc || pc.type !== 'p' || pc.color !== activeColor) return false;
            game.remove(data.square);
            game.put({ type: ch.toType || 'n', color: pc.color }, data.square); break;
        }
        case 'swap': {
            const pa = data && data.a ? game.get(data.a) : null;
            const pb = data && data.b ? game.get(data.b) : null;
            if (!pa || !pb || data.a === data.b || pa.color !== activeColor || pb.color !== activeColor) return false;
            game.remove(data.a); game.remove(data.b);
            game.put({ type: pa.type, color: pa.color }, data.b);
            game.put({ type: pb.type, color: pb.color }, data.a); break;
        }
        case 'step': {
            const pa = data && data.a ? game.get(data.a) : null;
            if (!pa || pa.color !== activeColor || !data.b || game.get(data.b)) return false;
            const df = Math.abs(data.a.charCodeAt(0) - data.b.charCodeAt(0));
            const dr = Math.abs(Number(data.a[1]) - Number(data.b[1]));
            if (df > 1 || dr > 1 || (df === 0 && dr === 0)) return false;
            game.remove(data.a);
            game.put({ type: pa.type, color: pa.color }, data.b); break;
        }
        case 'revive': {
            if (!data || !data.type || !data.square || game.get(data.square)) return false;
            const entry = moveHistory.find(h => h.captured === data.type && h.capturedColor === ownColor && !h.revived);
            if (!entry) return false;
            entry.revived = true;
            game.put({ type: data.type, color: ownColor }, data.square); break;
        }
        case 'revivePawns': {
            if (!data || !Array.isArray(data.places) || !data.places.length) return false;
            let used = 0;
            data.places.forEach(sq => {
                if (game.get(sq)) return;
                const entry = moveHistory.find(h => h.captured === 'p' && h.capturedColor === ownColor && !h.revived);
                if (!entry) return;
                entry.revived = true;
                game.put({ type: 'p', color: ownColor }, sq);
                used++;
            });
            if (!used) return false;
            break;
        }
        case 'convert': {
            if (!data || !data.type || !data.square || game.get(data.square)) return false;
            const entry = moveHistory.find(h => h.player === player && h.captured === data.type && !h.converted);
            if (!entry) return false;
            entry.converted = true; entry.revived = true;
            game.put({ type: data.type, color: ownColor }, data.square); break;
        }
        case 'exchange': {
            const target = data && data.square ? game.get(data.square) : null;
            const validTypes = ['q', 'r', 'b', 'n', 'p'];
            if (!target || target.color !== activeColor || target.type === 'k' || !data || !validTypes.includes(data.toType)) return false;
            game.remove(data.square);
            game.put({ type: data.toType, color: target.color }, data.square); break;
        }
        case 'clone': {
            if (!data || !data.square || game.get(data.square)) return false;
            const hasKnight = game.board().flat().some(c => c && c.type === 'n' && c.color === activeColor);
            if (!hasKnight) return false;
            game.put({ type: 'n', color: activeColor }, data.square); break;
        }
        case 'destroy': {
            const pc = data && data.square ? game.get(data.square) : null;
            const oppColor = ownColor === 'w' ? 'b' : 'w';
            if (!pc || pc.type === 'k' || pc.color !== oppColor) return false;
            game.remove(data.square); break;
        }
        case 'fortune': {
            if (!data) return false;
            if (data.mode === 'all') {
                if (!reviveAllLostPieces(player)) return false;
                skillFxNote = '超新星！取られた駒をすべて復活';
                break;
            }
            if (data.mode === 'guard') {
                starGuardFor = player;
                skillFxNote = '星の守り！次の相手の手番は取られず、チェックもされない';
                break;
            }
            if (data.mode === 'warp') {
                const pc = data.square ? game.get(data.square) : null;
                if (!pc || pc.type !== 'p' || pc.color !== activeColor) return false;
                const c = squareCoords(data.square);
                const dest = coordsToSquare(c.f, c.r + (pc.color === 'w' ? 2 : -2));
                if (!dest || game.get(dest)) return false;
                game.remove(data.square);
                game.put({ type: 'p', color: pc.color }, dest);
                skillFxSquares = [data.square, dest];
                skillFxNote = '流れ星！ポーンが前方2マスへワープ';
                break;
            }
            if (data.mode === 'pawn') {
                if (data.square && !game.get(data.square)) {
                    game.put({ type: 'p', color: ownColor }, data.square);
                    skillFxNote = '護衛の星！キングの隣にポーンが現れた';
                } else {
                    if (player === 'P1') p1Skips++; else p2Skips++;
                    skillFxNote = '護衛の星は現れず、代わりに停止権+1';
                }
                break;
            }
            return false;
        }
        case 'reviveAll': {
            if (!reviveAllLostPieces(player)) return false;
            break;
        }
        case 'doom': {
            const pc = data && data.square ? game.get(data.square) : null;
            if (!pc || pc.type === 'k' || pc.color !== sleepTargetColorFor(player)) return false;
            doomFor = opp;
            doomSquare = data.square;
            doomPieceType = pc.type;
            doomPieceColor = pc.color;
            break;
        }
        case 'dashSlash': {
            const pa = data && data.a ? game.get(data.a) : null;
            const pb = data && data.b ? game.get(data.b) : null;
            const oppColor = ownColor === 'w' ? 'b' : 'w';
            if (!pa || !pb || data.a === data.b || pa.color !== activeColor || pa.type === 'k' || pb.color !== oppColor || pb.type === 'k') return false;
            const a = squareCoords(data.a);
            const b = squareCoords(data.b);
            const aligned = a.f === b.f || a.r === b.r || Math.abs(a.f - b.f) === Math.abs(a.r - b.r);
            if (!aligned) return false;
            game.remove(data.b);
            game.remove(data.a);
            game.put({ type: pa.type, color: pa.color }, data.b);
            break;
        }
        case 'pushback': {
            const pc = data && data.square ? game.get(data.square) : null;
            const oppColor = ownColor === 'w' ? 'b' : 'w';
            if (!pc || pc.type !== 'p' || pc.color !== oppColor) return false;
            const c = squareCoords(data.square);
            const dest = coordsToSquare(c.f, c.r + (pc.color === 'w' ? -1 : 1));
            if (!dest || game.get(dest)) return false;
            game.remove(data.square);
            game.put({ type: 'p', color: pc.color }, dest);
            skillFxSquares = [data.square, dest];
            break;
        }
        case 'charm': {
            const pc = data && data.square ? game.get(data.square) : null;
            const oppColorC = ownColor === 'w' ? 'b' : 'w';
            if (!pc || pc.color !== oppColorC || pc.type === 'k' || pc.type === 'q' || charmWouldGiveCheck(data.square, player)) return false;
            const type = pc.type;
            game.remove(data.square);
            game.put({ type, color: ownColor }, data.square); break;
        }
        case 'undo': {
            if (!historyStack.length) return false;
            const snap = historyStack.pop();
            restoreState(snap);
            charaUsed[player] = true;
            skillRecharge[player] = 0;
            skillTargeting = null;
            messageEl.textContent = `${ch.name} のスキル「${ch.skill}」！時間を巻き戻した`;
            renderBoard();
            showSkillEffect(player, []);
            broadcastState();
            return true;
        }
        default: return false;
    }
    charaUsed[player] = true;
    skillRecharge[player] = 0;
    skillTargeting = null;
    messageEl.textContent = `${ch.name} のスキル「${ch.skill}」！${skillFxNote ? ' ' + skillFxNote : ''}`;
    renderBoard();
    showSkillEffect(player, skillSquaresOf(data).concat(skillFxSquares));
    skillFxSquares = [];
    broadcastState();
    return true;
}
function skillSquaresOf(data) {
    if (!data) return [];
    const s = [];
    if (data.square) s.push(data.square);
    if (Array.isArray(data.places)) s.push(...data.places);
    if (data.a) s.push(data.a);
    if (data.b) s.push(data.b);
    return s;
}
const SKILL_FX = {
    skip: { icons: ['🌙', '✨', '⭐'], tint: 'rgba(250,210,90,.20)', motion: 'fx-rise' },
    revive: { icons: ['✨', '💫', '🌟'], tint: 'rgba(255,240,180,.25)', motion: 'fx-rise' },
    revivePawns: { icons: ['🔥', '✨', '⚒️'], tint: 'rgba(255,140,60,.22)', motion: 'fx-rise' },
    reviveAll: { icons: ['👻', '💜', '✨'], tint: 'rgba(150,90,255,.25)', motion: 'fx-rise' },
    extra: { icons: ['⭐', '🎵', '✨'], tint: 'rgba(255,120,200,.20)', motion: 'fx-swirl' },
    freeze: { icons: ['❄️', '❄️', '🧊'], tint: 'rgba(140,200,255,.25)', motion: 'fx-fall' },
    transform: { icons: ['🔮', '✨', '🦋'], tint: 'rgba(170,110,255,.22)', motion: 'fx-swirl' },
    swap: { icons: ['🍃', '💨', '🌀'], tint: 'rgba(120,230,160,.20)', motion: 'fx-swirl' },
    sleep: { icons: ['🫧', '💤', '🌙'], tint: 'rgba(110,150,255,.22)', motion: 'fx-rise' },
    undo: { icons: ['⏳', '🕰️', '↩️'], tint: 'rgba(210,170,90,.25)', motion: 'fx-fall' },
    step: { icons: ['🐾', '🐱', '✨'], tint: 'rgba(255,180,120,.20)', motion: 'fx-rise' },
    convert: { icons: ['🌹', '❤️', '🦇'], tint: 'rgba(255,80,110,.22)', motion: 'fx-fall' },
    barrier: { icons: ['💧', '🐉', '🌀'], tint: 'rgba(80,200,220,.22)', motion: 'fx-swirl' },
    shield: { icons: ['🪨', '🛡️', '✨'], tint: 'rgba(190,160,110,.25)', motion: 'fx-rise' },
    fortune: { icons: ['🔮', '⭐', '🍀'], tint: 'rgba(180,120,255,.22)', motion: 'fx-fall' },
    clone: { icons: ['🥷', '🍃', '💨'], tint: 'rgba(120,200,140,.20)', motion: 'fx-swirl' },
    destroy: { icons: ['💥', '🔥', '💣'], tint: 'rgba(255,110,60,.28)', motion: 'fx-rise' },
    exchange: { icons: ['⚗️', '🧪', '✨'], tint: 'rgba(120,255,170,.20)', motion: 'fx-swirl' },
    charm: { icons: ['💘', '🌹', '💕'], tint: 'rgba(255,110,180,.24)', motion: 'fx-rise' }
};
const CHARA_SKILL_FX = {
    luna: { sign: '🌙', icons: ['🌙', '✨', '⭐'], tint: 'rgba(250,210,90,.22)', motion: 'fx-rise', special: 'fx-moon' },
    mint: { sign: '🌿', icons: ['🍃', '🌿', '✨'], tint: 'rgba(90,220,130,.22)', motion: 'fx-rise', special: 'fx-leaf' },
    sora: { sign: '💨', icons: ['💨', '🍃', '🌀'], tint: 'rgba(110,220,255,.20)', motion: 'fx-swirl', special: 'fx-wind' },
    hikari: { sign: '🎤', icons: ['⭐', '🎵', '🎤'], tint: 'rgba(255,120,200,.24)', motion: 'fx-swirl', special: 'fx-spotlight' },
    yuki: { sign: '❄️', icons: ['❄️', '❄️', '🧊'], tint: 'rgba(170,220,255,.34)', motion: 'fx-fall', special: 'fx-blizzard' },
    momo: { sign: '🔮', icons: ['🔮', '✨', '🦋'], tint: 'rgba(175,110,255,.26)', motion: 'fx-swirl', special: 'fx-magic' },
    nereia: { sign: '🫧', icons: ['🫧', '💤', '🐚'], tint: 'rgba(90,170,255,.26)', motion: 'fx-rise', special: 'fx-bubbles' },
    vulkan: { sign: '🔨', icons: ['🔥', '🔨', '⚒️'], tint: 'rgba(255,130,50,.28)', motion: 'fx-rise', special: 'fx-embers' },
    chronos: { sign: '🕰️', icons: ['⏳', '🕰️', '↩️'], tint: 'rgba(215,175,95,.28)', motion: 'fx-fall', special: 'fx-rewind' },
    bastet: { sign: '🐾', icons: ['🐾', '🐱', '✨'], tint: 'rgba(255,180,120,.22)', motion: 'fx-rise', special: 'fx-paw' },
    carmilla: { sign: '🌹', icons: ['🌹', '🦇', '❤️'], tint: 'rgba(255,70,105,.26)', motion: 'fx-fall', special: 'fx-petals' },
    suiren: { sign: '🐉', icons: ['🐉', '💧', '🌀'], tint: 'rgba(70,205,225,.26)', motion: 'fx-swirl', special: 'fx-ripple' },
    titan: { sign: '🛡️', icons: ['🪨', '🛡️', '✨'], tint: 'rgba(190,160,110,.28)', motion: 'fx-rise', special: 'fx-guard' },
    sibylla: { sign: '🔮', icons: ['🔮', '⭐', '✨'], tint: 'rgba(175,120,255,.28)', motion: 'fx-fall', special: 'fx-stars' },
    hayate: { sign: '🥷', icons: ['🥷', '🍃', '💨'], tint: 'rgba(110,200,140,.22)', motion: 'fx-swirl', special: 'fx-smoke' },
    seraphina: { sign: '🪽', icons: ['✨', '🪶', '🪽'], tint: 'rgba(255,245,190,.34)', motion: 'fx-rise', special: 'fx-holy' },
    barbarossa: { sign: '💥', icons: ['💥', '🔥', '💣'], tint: 'rgba(255,105,45,.32)', motion: 'fx-rise', special: 'fx-explosion' },
    nicola: { sign: '⚗️', icons: ['⚗️', '🧪', '✨'], tint: 'rgba(110,255,175,.24)', motion: 'fx-swirl', special: 'fx-alchemy' },
    persephone: { sign: '👻', icons: ['👻', '💜', '✨'], tint: 'rgba(120,230,210,.25)', motion: 'fx-rise', special: 'fx-underworld' },
    rosetta: { sign: '💘', icons: ['💘', '🌹', '💕'], tint: 'rgba(255,110,180,.28)', motion: 'fx-rise', special: 'fx-hearts' },
    shizuku: { sign: '📖', icons: ['📖', '🔖', '✒️'], tint: 'rgba(105,135,255,.26)', motion: 'fx-fall', special: 'fx-pages' },
    ayame: { sign: '⚔️', icons: ['⚔️', '🌸', '💨'], tint: 'rgba(255,145,180,.24)', motion: 'fx-swirl', special: 'fx-slash' },
    kanon: { sign: '🎻', icons: ['🎻', '🎵', '🎶'], tint: 'rgba(100,220,220,.24)', motion: 'fx-swirl', special: 'fx-music' }
};
function showSkillEffect(player, squares) {
    const ch = charaOf(player);
    if (!ch) return;
    try {
        const fxNote = skillFxNote;
        const banner = document.getElementById('skill-effect-banner');
        if (banner) {
            banner.innerHTML = `<div class="se-player">${player === 'P1' ? 'P1' : 'P2'} ${ch.name}</div><div class="se-skill">✦「${ch.skill}」✦</div>${fxNote ? `<div class="se-result">${fxNote}</div>` : ''}`;
            banner.classList.remove('hidden', 'anim');
            void banner.offsetWidth;
            banner.classList.add('anim');
            setTimeout(() => { banner.classList.add('hidden'); banner.classList.remove('anim'); }, 1600);
        }
        if (boardEl) {
            boardEl.classList.remove('skill-flash');
            void boardEl.offsetWidth;
            boardEl.classList.add('skill-flash');
            setTimeout(() => boardEl.classList.remove('skill-flash'), 900);
        }
        (squares || []).forEach(sq => {
            const el = boardEl ? boardEl.querySelector(`[data-square="${sq}"]`) : null;
            if (el) { el.classList.add('skill-hit'); setTimeout(() => el.classList.remove('skill-hit'), 1400); }
        });
        const fxLayer = document.getElementById('fx-layer');
        const fx = CHARA_SKILL_FX[ch.id] || SKILL_FX[ch.kind] || SKILL_FX.fortune;
        if (fxLayer && fx) {
            fxLayer.innerHTML = '';
            fxLayer.removeAttribute('class');
            if (fx.special) fxLayer.classList.add(fx.special);
            const boardWrap = fxLayer.parentElement;
            if (boardWrap) {
                boardWrap.classList.remove('fx-board-shake', 'fx-board-rewind');
                if (fx.special === 'fx-explosion' || fx.special === 'fx-slash') boardWrap.classList.add('fx-board-shake');
                if (fx.special === 'fx-rewind') boardWrap.classList.add('fx-board-rewind');
                setTimeout(() => boardWrap.classList.remove('fx-board-shake', 'fx-board-rewind'), 1050);
            }
            fxLayer.style.background = `radial-gradient(ellipse at center, ${fx.tint}, transparent 75%)`;
            for (let i = 0; i < 28; i++) {
                const sp = document.createElement('span');
                sp.className = 'fx-particle ' + fx.motion;
                sp.textContent = fx.icons[i % fx.icons.length];
                sp.style.left = (2 + Math.random() * 92) + '%';
                sp.style.fontSize = (18 + Math.random() * 18) + 'px';
                sp.style.animationDelay = (Math.random() * 0.35) + 's';
                fxLayer.appendChild(sp);
            }
            const sig = document.createElement('div');
            sig.className = 'fx-signature';
            sig.textContent = fx.sign || fx.icons[0];
            fxLayer.appendChild(sig);
            setTimeout(() => { fxLayer.innerHTML = ''; fxLayer.style.background = 'transparent'; fxLayer.removeAttribute('class'); }, 2100);
        }
    } catch (e) {}
}
function canUseSkillUI(player) {
    if (!isCharaMode() || charaPhase || gameOver) return false;
    if (currentPlayer !== player || !playerCharacters[player] || charaUsed[player]) return false;
    if (isOnlineMode()) return myRole === player;
    if (isCpuGame()) return player === 'P1';
    return true;
}
function onSkillButton(player) {
    if (skillTargeting && skillTargeting.player === player) { skillTargeting = null; messageEl.textContent = 'スキルをキャンセルしました'; return; }
    if (!canUseSkillUI(player)) return;
    const ch = charaOf(player);
    if (!ch) return;
    if (!skillUnlocked(player)) { messageEl.textContent = `${ch.name} のスキルはまだ解放されていません（${skillLockText(player)}）`; return; }
    switch (ch.kind) {
        case 'transform': skillTargeting = { player, skill: 'transform' }; messageEl.textContent = '変身：変えたい、今操作しているポーンをクリック'; return;
        case 'swap': skillTargeting = { player, skill: 'swap', first: null }; messageEl.textContent = 'テレポート：入れ替える駒を2つクリックしてください'; return;
        case 'step': skillTargeting = { player, skill: 'step', first: null }; messageEl.textContent = 'にゃんステップ：移したい駒をクリック'; return;
        case 'sleep': skillTargeting = { player, skill: 'sleep' }; messageEl.textContent = 'まどろみ：眠らせたい相手の駒をクリック'; return;
        case 'destroy': skillTargeting = { player, skill: 'destroy' }; messageEl.textContent = '砲撃：取り除く相手の駒（キング以外）をクリック'; return;
        case 'exchange': skillTargeting = { player, skill: 'exchange' }; messageEl.textContent = '等価交換：変身させたい、今操作している自分の駒をクリック'; return;
        case 'revive': { const plan = planRevive(player); if (!plan) { messageEl.textContent = '復活できる駒がありません'; return; } applySkillEffect(player, plan); return; }
        case 'revivePawns': { const plan = planRevivePawns(player); if (!plan) { messageEl.textContent = '復活できるポーンがありません'; return; } applySkillEffect(player, plan); return; }
        case 'convert': { const plan = planConvert(player); if (!plan) { messageEl.textContent = '眷属化できる駒がありません'; return; } applySkillEffect(player, plan); return; }
        case 'clone': { const plan = planClone(player); if (!plan) { messageEl.textContent = 'ナイトがいないか、隣が空いていません'; return; } applySkillEffect(player, plan); return; }
        case 'fortune': {
            const ownColor = player === 'P1' ? 'w' : 'b';
            const hasLost = moveHistory.some(h => h.captured && h.capturedColor === ownColor && !h.revived);
            const r = Math.random();
            if (r < 0.10 && hasLost) { applySkillEffect(player, { mode: 'all' }); return; }
            if (r < 0.40) { applySkillEffect(player, { mode: 'guard' }); return; }
            if (r < 0.80) {
                if (planFortuneWarp(player)) {
                    skillTargeting = { player, skill: 'fortuneWarp' };
                    messageEl.textContent = '星読みは「流れ星」！前方2マスへワープさせる、今操作しているポーンをクリック';
                } else applySkillEffect(player, { mode: 'guard' });
                return;
            }
            applySkillEffect(player, { mode: 'pawn', square: planKingGuardPawn(player) });
            return;
        }
        case 'reviveAll': {
            const ownColor = player === 'P1' ? 'w' : 'b';
            if (!moveHistory.some(h => h.captured && h.capturedColor === ownColor && !h.revived)) { messageEl.textContent = 'まだ相手に取られた自分の駒がありません'; return; }
            applySkillEffect(player, {}); return;
        }
        case 'doom': skillTargeting = { player, skill: 'doom' }; messageEl.textContent = '終章：相手が次に操作する駒（キング以外）に印をつけてください'; return;
        case 'dashSlash': skillTargeting = { player, skill: 'dashSlash', first: null }; messageEl.textContent = '斬り込み：斬り込む自分の駒をクリック'; return;
        case 'pushback': skillTargeting = { player, skill: 'pushback' }; messageEl.textContent = 'リタルダンド：押し戻したい相手のポーンをクリック'; return;
        case 'charm': skillTargeting = { player, skill: 'charm' }; messageEl.textContent = '魅了：自分の色に変えたい相手の駒（キング・クイーン以外）をクリック'; return;
        case 'undo': if (!historyStack.length) { messageEl.textContent = 'まだ巻き戻せる手がありません'; return; } applySkillEffect(player, {}); return;
        default: applySkillEffect(player, {}); return;
    }
}
function openTransformPicker(player, square) {
    transformPicker = { player, square };
    const modal = document.getElementById('transform-modal');
    if (modal) modal.classList.remove('hidden');
    messageEl.textContent = '等価交換：変身先の駒を選んでください（上限数を超えてもOK）';
}
function closeTransformPicker() {
    transformPicker = null;
    const modal = document.getElementById('transform-modal');
    if (modal) modal.classList.add('hidden');
}
document.querySelectorAll('.transform-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        if (!transformPicker) return;
        const picked = transformPicker;
        closeTransformPicker();
        skillTargeting = null;
        applySkillEffect(picked.player, { square: picked.square, toType: btn.dataset.tpiece });
    });
});
(function () {
    const cancel = document.getElementById('transform-cancel');
    if (cancel) cancel.addEventListener('click', () => {
        closeTransformPicker();
        skillTargeting = null;
        messageEl.textContent = 'スキルの使用をキャンセルしました';
    });
})();
function handleSkillTargetClick(square) {
    const t = skillTargeting;
    if (!t) return;
    const activeColor = getActivePieceColor(t.player);
    const pc = game.get(square);
    if (t.skill === 'transform') {
        if (pc && pc.type === 'p' && pc.color === activeColor) applySkillEffect(t.player, { square });
        else messageEl.textContent = '今操作している自分のポーンを選んでください';
        return;
    }
    if (t.skill === 'sleep') {
        if (pc && pc.color === sleepTargetColorFor(t.player)) applySkillEffect(t.player, { square });
        else messageEl.textContent = '相手が次に操作する駒を選んでください';
        return;
    }
    if (t.skill === 'charm') {
        const oppColor = t.player === 'P1' ? 'b' : 'w';
        if (pc && pc.color === oppColor && (pc.type === 'k' || pc.type === 'q')) messageEl.textContent = 'キングとクイーンは魅了できません';
        else if (pc && pc.color === oppColor && charmWouldGiveCheck(square, t.player)) messageEl.textContent = 'その駒を変えると相手のキングへチェックがかかってしまうため選べません';
        else if (pc && pc.color === oppColor) applySkillEffect(t.player, { square });
        else messageEl.textContent = '相手の色の駒（キング・クイーン以外）を選んでください';
        return;
    }
    if (t.skill === 'doom') {
        if (pc && pc.type !== 'k' && pc.color === sleepTargetColorFor(t.player)) applySkillEffect(t.player, { square });
        else messageEl.textContent = '相手が次に操作する駒（キング以外）を選んでください';
        return;
    }
    if (t.skill === 'pushback') {
        const oppColor = t.player === 'P1' ? 'b' : 'w';
        if (pc && pc.type === 'p' && pc.color === oppColor) { if (!applySkillEffect(t.player, { square })) messageEl.textContent = 'そのポーンの後ろが空いていません'; }
        else messageEl.textContent = '相手の色のポーンを選んでください';
        return;
    }
    if (t.skill === 'fortuneWarp') {
        if (pc && pc.type === 'p' && pc.color === activeColor) { if (!applySkillEffect(t.player, { mode: 'warp', square })) messageEl.textContent = 'そのポーンは前方2マス先へワープできません'; }
        else messageEl.textContent = '今操作している自分のポーンを選んでください';
        return;
    }
    if (t.skill === 'dashSlash') {
        const oppColor = t.player === 'P1' ? 'b' : 'w';
        if (!t.first) {
            if (pc && pc.color === activeColor && pc.type !== 'k') { t.first = square; messageEl.textContent = '斬り込み：同じ縦・横・斜めの直線上にいる相手の駒をクリック'; }
            else messageEl.textContent = '今操作している自分の駒（キング以外）を選んでください';
            return;
        }
        if (pc && pc.color === oppColor && pc.type !== 'k') { if (!applySkillEffect(t.player, { a: t.first, b: square })) messageEl.textContent = '同じ縦・横・斜めの直線上にいる相手の駒を選んでください'; }
        else messageEl.textContent = '相手の色の駒（キング以外）を選んでください';
        return;
    }
    if (t.skill === 'destroy') {
        const oppColor = t.player === 'P1' ? 'b' : 'w';
        if (pc && pc.type !== 'k' && pc.color === oppColor) applySkillEffect(t.player, { square });
        else messageEl.textContent = '相手の色の駒（キング以外）を選んでください';
        return;
    }
    if (t.skill === 'exchange') {
        if (pc && pc.color === activeColor && pc.type !== 'k') openTransformPicker(t.player, square);
        else messageEl.textContent = '今操作している自分の駒（キング以外）を選んでください';
        return;
    }
    if (t.skill === 'step') {
        if (!t.first) {
            if (pc && pc.color === activeColor) { t.first = square; messageEl.textContent = 'にゃんステップ：移す先の空きマスをクリック'; }
            else messageEl.textContent = '今操作している自分の駒を選んでください';
            return;
        }
        if (!pc) { if (!applySkillEffect(t.player, { a: t.first, b: square })) messageEl.textContent = '隣の空きマスを選んでください'; }
        else messageEl.textContent = '空きマスを選んでください';
        return;
    }
    if (t.skill === 'swap') {
        if (!pc || pc.color !== activeColor) { messageEl.textContent = '今操作している自分の駒を選んでください'; return; }
        if (!t.first) { t.first = square; messageEl.textContent = 'テレポート：もう1つの駒をクリック'; return; }
        if (square === t.first) { messageEl.textContent = '別の駒を選んでください'; return; }
        applySkillEffect(t.player, { a: t.first, b: square });
    }
}
