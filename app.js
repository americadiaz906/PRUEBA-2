/* ==========================================================================
   DOMINÓ NUMÉRICO INFANTIL - JAVASCRIPT LOGIC
   Lógica del juego por turnos, validaciones, NEM PDA y confeti interactivo
   Sintetizador de sonidos, animaciones de vuelo, partículas y temporizador lúdico
   ========================================================================== */

// --- Estado Global de la Partida ---
const gameState = {
    playerCount: 2,
    players: [],            // Fichas, nombre, avatar, puntuación
    currentPlayerIndex: 0,
    board: [],              // Lista de fichas jugadas: [[A,B], [B,C]...]
    boneyard: [],           // El Pozo: Fichas boca abajo
    selectedTileIndex: null,// Índice de la ficha que el jugador quiere jugar
    pendingMove: null,      // Ficha en espera de elección de lado
    soundMuted: false       // Silenciador de sonido
};

// --- Configuración y Constantes ---
const AVATARS = ['🐰', '🐻', '🦊', '🐼', '🐸', '🦁', '🐱', '🐶'];
const DEFAULT_NAMES = ['Copito', 'Bongo', 'Foxy', 'Pandi', 'René', 'Simba', 'Michi', 'Toby'];
const TURN_TIME_LIMIT = 25; // 25 segundos para dar una pista al niño

// Variables de Control Dinámico
let turnTimerInterval = null;
let turnTimeLeft = TURN_TIME_LIMIT;
let newlyPlayedIndex = null;

// --- Elementos del DOM ---
const DOM = {
    screenSetup: document.getElementById('screen-setup'),
    screenTransition: document.getElementById('screen-turn-transition'),
    screenGame: document.getElementById('screen-game'),
    screenResults: document.getElementById('screen-results'),
    
    playersConfigList: document.getElementById('players-config-list'),
    btnStartGame: document.getElementById('btn-start-game'),
    btnCountButtons: document.querySelectorAll('.btn-count'),
    
    // Transición de turno
    transitionPlayerAvatar: document.getElementById('transition-player-avatar'),
    transitionPlayerName: document.getElementById('transition-player-name'),
    btnRevealTurn: document.getElementById('btn-reveal-turn'),
    
    // Tablero
    currentAvatar: document.getElementById('current-avatar'),
    currentName: document.getElementById('current-name'),
    boneyardCount: document.getElementById('boneyard-count'),
    gameBoard: document.getElementById('game-board'),
    playerHand: document.getElementById('player-hand'),
    btnDraw: document.getElementById('btn-draw'),
    btnPassTurn: document.getElementById('btn-pass-turn'),
    controlsStatusMsg: document.getElementById('controls-status-msg'),
    
    // Selector de lado
    sidePickerOverlay: document.getElementById('side-picker-overlay'),
    btnPickLeft: document.getElementById('btn-pick-left'),
    btnPickRight: document.getElementById('btn-pick-right'),
    
    // Resultados
    winnerAvatar: document.getElementById('winner-avatar'),
    winnerName: document.getElementById('winner-name'),
    winnerReason: document.getElementById('winner-reason'),
    resultsTableBody: document.getElementById('results-table-body'),
    btnRestart: document.getElementById('btn-restart'),
    
    // Modal Pedagógico
    btnPedagogic: document.getElementById('btn-pedagogic'),
    modalPedagogic: document.getElementById('modal-pedagogic'),
    closePedagogic: document.getElementById('close-pedagogic'),
    btnClosePedagogicFooter: document.getElementById('btn-close-pedagogic-footer')
};

// ==========================================================================
// 1. SINTETIZADOR DE SONIDOS (WEB AUDIO API - SIN RECURSOS EXTERNOS)
// ==========================================================================
const SoundEffects = {
    ctx: null,
    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
    },
    playPop() {
        if (gameState.soundMuted) return;
        this.init();
        const ctx = this.ctx;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(750, ctx.currentTime + 0.12);
        
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
        
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.12);
    },
    playDraw() {
        if (gameState.soundMuted) return;
        this.init();
        const ctx = this.ctx;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(550, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(250, ctx.currentTime + 0.18);
        
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.18);
        
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.18);
    },
    playError() {
        if (gameState.soundMuted) return;
        this.init();
        const ctx = this.ctx;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(140, ctx.currentTime);
        osc.frequency.setValueAtTime(110, ctx.currentTime + 0.08);
        
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.22);
        
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.22);
    },
    playWin() {
        if (gameState.soundMuted) return;
        this.init();
        const ctx = this.ctx;
        const now = ctx.currentTime;
        const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // C4, E4, G4, C5, E5, G5, C6
        notes.forEach((freq, index) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.type = (index === notes.length - 1) ? 'sine' : 'triangle';
            osc.frequency.setValueAtTime(freq, now + index * 0.1);
            
            gain.gain.setValueAtTime(0.08, now + index * 0.1);
            gain.gain.exponentialRampToValueAtTime(0.005, now + index * 0.1 + 0.4);
            
            osc.start(now + index * 0.1);
            osc.stop(now + index * 0.1 + 0.4);
        });
    }
};

// ==========================================================================
// 2. INICIALIZACIÓN Y CONFIGURACIÓN INICIAL
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    initSetupScreen();
    setupEventListeners();
});

function initSetupScreen() {
    renderPlayerConfigRows(gameState.playerCount);
    
    DOM.btnCountButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            DOM.btnCountButtons.forEach(b => b.classList.remove('btn-count-active'));
            btn.classList.add('btn-count-active');
            
            const count = parseInt(btn.dataset.count);
            gameState.playerCount = count;
            renderPlayerConfigRows(count);
        });
    });
}

function renderPlayerConfigRows(count) {
    DOM.playersConfigList.innerHTML = '';
    
    for (let i = 0; i < count; i++) {
        const row = document.createElement('div');
        row.className = 'player-config-row';
        
        const defaultAvatar = AVATARS[i % AVATARS.length];
        const defaultName = DEFAULT_NAMES[i % DEFAULT_NAMES.length];
        
        row.innerHTML = `
            <span class="player-config-label">Jugador ${i + 1}:</span>
            <input type="text" class="player-config-input" value="${defaultName}" data-index="${i}" placeholder="Nombre">
            <div class="avatar-selector" data-player="${i}">
                ${AVATARS.map(avatar => `
                    <div class="avatar-option ${avatar === defaultAvatar ? 'selected' : ''}" data-avatar="${avatar}">
                        ${avatar}
                    </div>
                `).join('')}
            </div>
        `;
        
        DOM.playersConfigList.appendChild(row);
        
        const options = row.querySelectorAll('.avatar-option');
        options.forEach(opt => {
            opt.addEventListener('click', () => {
                row.querySelectorAll('.avatar-option').forEach(o => o.classList.remove('selected'));
                opt.classList.add('selected');
            });
        });
    }
}

function setupEventListeners() {
    DOM.btnStartGame.addEventListener('click', startGame);
    
    DOM.btnRevealTurn.addEventListener('click', () => {
        DOM.transitionPlayerAvatar.classList.remove('avatar-excited');
        showScreen(DOM.screenGame);
        renderHand();
        startTurnTimer(); // Iniciar tiempo cuando el niño ve sus fichas
    });
    
    DOM.btnDraw.addEventListener('click', handleDrawCard);
    DOM.btnPassTurn.addEventListener('click', handlePassTurn);
    DOM.btnPickLeft.addEventListener('click', () => playTileOnSide('left'));
    DOM.btnPickRight.addEventListener('click', () => playTileOnSide('right'));
    DOM.btnRestart.addEventListener('click', restartToSetup);
    
    // Modal Pedagógico
    DOM.btnPedagogic.addEventListener('click', () => DOM.modalPedagogic.classList.add('active'));
    DOM.closePedagogic.addEventListener('click', () => DOM.modalPedagogic.classList.remove('active'));
    DOM.btnClosePedagogicFooter.addEventListener('click', () => DOM.modalPedagogic.classList.remove('active'));
    
    window.addEventListener('click', (e) => {
        if (e.target === DOM.modalPedagogic) {
            DOM.modalPedagogic.classList.remove('active');
        }
    });

    // Botón Silenciador de Sonido
    const btnMute = document.getElementById('btn-mute');
    if (btnMute) {
        btnMute.addEventListener('click', () => {
            gameState.soundMuted = !gameState.soundMuted;
            const icon = btnMute.querySelector('i');
            if (gameState.soundMuted) {
                icon.className = 'fa-solid fa-volume-xmark';
                btnMute.title = 'Activar Sonido';
                btnMute.style.background = '#cbd5e1';
                btnMute.style.color = '#475569';
            } else {
                icon.className = 'fa-solid fa-volume-high';
                btnMute.title = 'Silenciar Sonido';
                btnMute.style.background = '#fbcfe8';
                btnMute.style.color = '#9d174d';
            }
        });
    }
}

function showScreen(screenToShow) {
    const screens = [DOM.screenSetup, DOM.screenTransition, DOM.screenGame, DOM.screenResults];
    screens.forEach(screen => screen.classList.remove('active'));
    screenToShow.classList.add('active');
}

// ==========================================================================
// 3. LÓGICA CORE DEL DOMINÓ
// ==========================================================================

function startGame() {
    gameState.players = [];
    const nameInputs = document.querySelectorAll('.player-config-input');
    
    for (let i = 0; i < gameState.playerCount; i++) {
        const name = nameInputs[i].value.trim() || `Jugador ${i + 1}`;
        const avatarContainer = document.querySelector(`.avatar-selector[data-player="${i}"]`);
        const selectedAvatarOpt = avatarContainer.querySelector('.avatar-option.selected');
        const avatar = selectedAvatarOpt ? selectedAvatarOpt.dataset.avatar : AVATARS[i];
        
        gameState.players.push({
            id: i,
            name: name,
            avatar: avatar,
            hand: [],
            score: 0
        });
    }
    
    const deck = generateDominoDeck();
    shuffle(deck);
    
    let tilesPerPlayer = 7;
    if (gameState.playerCount === 3) tilesPerPlayer = 6;
    if (gameState.playerCount === 4) tilesPerPlayer = 5;
    
    gameState.players.forEach(player => {
        player.hand = deck.splice(0, tilesPerPlayer);
    });
    
    gameState.boneyard = deck;
    gameState.board = [];
    
    determineStartingPlayer();
    updateBoneyardUI();
    renderBoard();
    
    goToPlayerTransition(gameState.currentPlayerIndex);
}

function generateDominoDeck() {
    const deck = [];
    for (let i = 0; i <= 6; i++) {
        for (let j = i; j <= 6; j++) {
            deck.push([i, j]);
        }
    }
    return deck;
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function determineStartingPlayer() {
    let startingPlayerIndex = 0;
    let highestDouble = -1;
    let highestSum = -1;
    let initialTile = null;
    let tileIndexInHand = -1;
    
    for (let d = 6; d >= 0; d--) {
        for (let p = 0; p < gameState.players.length; p++) {
            const index = gameState.players[p].hand.findIndex(tile => tile[0] === d && tile[1] === d);
            if (index !== -1) {
                highestDouble = d;
                startingPlayerIndex = p;
                tileIndexInHand = index;
                initialTile = gameState.players[p].hand[index];
                break;
            }
        }
        if (highestDouble !== -1) break;
    }
    
    if (highestDouble === -1) {
        for (let p = 0; p < gameState.players.length; p++) {
            gameState.players[p].hand.forEach((tile, index) => {
                const sum = tile[0] + tile[1];
                if (sum > highestSum) {
                    highestSum = sum;
                    startingPlayerIndex = p;
                    tileIndexInHand = index;
                    initialTile = tile;
                }
            });
        }
    }
    
    gameState.board.push(initialTile);
    gameState.players[startingPlayerIndex].hand.splice(tileIndexInHand, 1);
    gameState.currentPlayerIndex = (startingPlayerIndex + 1) % gameState.players.length;
}

function goToPlayerTransition(playerIndex) {
    gameState.currentPlayerIndex = playerIndex;
    const player = gameState.players[playerIndex];
    
    DOM.transitionPlayerAvatar.textContent = player.avatar;
    DOM.transitionPlayerName.textContent = player.name;
    
    // Animar avatar emocionado en la transición
    DOM.transitionPlayerAvatar.className = 'transition-avatar avatar-excited';
    
    DOM.currentAvatar.textContent = player.avatar;
    DOM.currentName.textContent = player.name;
    DOM.currentAvatar.className = 'badge-avatar'; // Quitar animaciones activas previas
    
    gameState.selectedTileIndex = null;
    gameState.pendingMove = null;
    DOM.sidePickerOverlay.classList.add('hidden');
    DOM.btnPassTurn.classList.add('hidden');
    
    stopTurnTimer();
    
    showScreen(DOM.screenTransition);
}

// ==========================================================================
// 4. TEMPORIZADOR LÚDICO INFANTIL (CON PISTAS SUTILES)
// ==========================================================================

function startTurnTimer() {
    stopTurnTimer();
    clearPlayableHints();
    turnTimeLeft = TURN_TIME_LIMIT;
    updateTimerUI();
    
    turnTimerInterval = setInterval(() => {
        turnTimeLeft--;
        updateTimerUI();
        
        if (turnTimeLeft <= 0) {
            stopTurnTimer();
            showPlayableHints();
        }
    }, 1000);
}

function stopTurnTimer() {
    if (turnTimerInterval) {
        clearInterval(turnTimerInterval);
        turnTimerInterval = null;
    }
}

function updateTimerUI() {
    const progressPercent = (turnTimeLeft / TURN_TIME_LIMIT) * 100;
    const progressEl = document.getElementById('timer-progress');
    const emojiEl = document.getElementById('timer-emoji');
    
    if (progressEl && emojiEl) {
        progressEl.style.width = `${progressPercent}%`;
        emojiEl.style.left = `${progressPercent}%`;
        
        if (progressPercent > 60) {
            progressEl.style.background = 'linear-gradient(90deg, #22c55e 0%, #84cc16 100%)';
            emojiEl.textContent = '🐰'; // Conejo rápido
        } else if (progressPercent > 25) {
            progressEl.style.background = 'linear-gradient(90deg, #eab308 0%, #f97316 100%)';
            emojiEl.textContent = '🐢'; // Tortuga regular
        } else {
            progressEl.style.background = 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)';
            emojiEl.textContent = '🐌'; // Caracol lento
        }
    }
}

function showPlayableHints() {
    const playableTiles = DOM.playerHand.querySelectorAll('.domino-tile.playable');
    if (playableTiles.length > 0) {
        DOM.controlsStatusMsg.innerHTML = '✨ ¡Mira con cuidado! Tus fichas que brillan tiemblan para darte una pista.';
        DOM.controlsStatusMsg.style.color = 'var(--color-accent)';
        
        playableTiles.forEach(tile => {
            tile.classList.add('shake-animation');
            // Sacudida periódica cada 2.5 segundos
            const intervalId = setInterval(() => {
                tile.classList.remove('shake-animation');
                void tile.offsetWidth;
                tile.classList.add('shake-animation');
            }, 2500);
            tile.dataset.hintInterval = intervalId;
        });
    }
}

function clearPlayableHints() {
    const playableTiles = DOM.playerHand.querySelectorAll('.domino-tile');
    playableTiles.forEach(tile => {
        if (tile.dataset.hintInterval) {
            clearInterval(parseInt(tile.dataset.hintInterval));
            delete tile.dataset.hintInterval;
        }
        tile.classList.remove('shake-animation');
    });
}

// ==========================================================================
// 5. ANIMACIONES DE VUELO Y PARTICULAS
// ==========================================================================

function animateTileFlight(startRect, endRect, tileValues, callback) {
    const clone = document.createElement('div');
    clone.className = 'domino-tile flying-tile';
    clone.innerHTML = `
        <div class="domino-half num-val-${tileValues[0]}">${tileValues[0]}</div>
        <div class="domino-divider"></div>
        <div class="domino-half num-val-${tileValues[1]}">${tileValues[1]}</div>
    `;
    
    clone.style.left = `${startRect.left}px`;
    clone.style.top = `${startRect.top}px`;
    clone.style.width = `${startRect.width}px`;
    clone.style.height = `${startRect.height}px`;
    
    document.body.appendChild(clone);
    
    void clone.offsetWidth; // Force Reflow
    
    clone.style.left = `${endRect.left}px`;
    clone.style.top = `${endRect.top}px`;
    clone.style.width = `${endRect.width}px`;
    clone.style.height = `${endRect.height}px`;
    
    setTimeout(() => {
        clone.remove();
        if (callback) callback();
    }, 600);
}

function animateDrawTile(newTile, callback) {
    const boneyardEl = DOM.btnDraw;
    const handEl = DOM.playerHand;
    const startRect = boneyardEl.getBoundingClientRect();
    
    const handTiles = handEl.querySelectorAll('.domino-tile');
    let endRect;
    if (handTiles.length > 0) {
        const lastTileRect = handTiles[handTiles.length - 1].getBoundingClientRect();
        endRect = {
            left: lastTileRect.right + 12,
            top: lastTileRect.top,
            width: lastTileRect.width,
            height: lastTileRect.height
        };
    } else {
        const handRect = handEl.getBoundingClientRect();
        endRect = {
            left: handRect.left + 10,
            top: handRect.top + 10,
            width: 100,
            height: 60
        };
    }
    
    SoundEffects.playDraw();
    animateTileFlight(startRect, endRect, newTile, callback);
}

function createParticleBurst(x, y) {
    const container = document.body;
    const particleCount = 14;
    const emojis = ['⭐', '✨', '🌟', '🎈', '🎉', '🌈', '🍭'];
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'game-particle';
        particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 90 + 40;
        const dx = Math.cos(angle) * distance;
        const dy = Math.sin(angle) * distance;
        const rot = Math.random() * 360;
        
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.setProperty('--dx', `${dx}px`);
        particle.style.setProperty('--dy', `${dy}px`);
        particle.style.setProperty('--rot', `${rot}deg`);
        
        container.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 800);
    }
}

function triggerBoardExplosion(side) {
    const tiles = DOM.gameBoard.querySelectorAll('.domino-tile');
    if (tiles.length > 0) {
        const targetTile = (side === 'left') ? tiles[0] : tiles[tiles.length - 1];
        const rect = targetTile.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2 + window.scrollX;
        const centerY = rect.top + rect.height / 2 + window.scrollY;
        createParticleBurst(centerX, centerY);
    }
}

// ==========================================================================
// 6. RENDERIZADO DEL TABLERO Y LAS FICHAS
// ==========================================================================

function renderBoard() {
    DOM.gameBoard.innerHTML = '';
    
    if (gameState.board.length === 0) {
        DOM.gameBoard.innerHTML = '<div class="board-placeholder">¡El tablero está vacío! Empieza la partida.</div>';
        return;
    }
    
    const leftVal = getBoardEndpoint('left');
    const rightVal = getBoardEndpoint('right');
    
    const leftIndicator = document.createElement('div');
    leftIndicator.className = 'board-endpoint';
    leftIndicator.title = `Extremo izquierdo: busca un ${leftVal}`;
    DOM.gameBoard.appendChild(leftIndicator);
    
    gameState.board.forEach((tile, index) => {
        const isDouble = tile[0] === tile[1];
        const tileEl = createDominoTileHTML(tile[0], tile[1], isDouble);
        if (newlyPlayedIndex === index) {
            tileEl.style.opacity = '0'; // Se hace visible hasta terminar la animación
        }
        DOM.gameBoard.appendChild(tileEl);
    });
    
    const rightIndicator = document.createElement('div');
    rightIndicator.className = 'board-endpoint';
    rightIndicator.title = `Extremo derecho: busca un ${rightVal}`;
    DOM.gameBoard.appendChild(rightIndicator);
    
    setTimeout(() => {
        const wrapper = document.querySelector('.board-wrapper');
        if (wrapper) {
            wrapper.scrollLeft = (wrapper.scrollWidth - wrapper.clientWidth) / 2;
        }
    }, 100);
}

function renderHand() {
    DOM.playerHand.innerHTML = '';
    const player = gameState.players[gameState.currentPlayerIndex];
    const leftVal = getBoardEndpoint('left');
    const rightVal = getBoardEndpoint('right');
    
    let hasPlayableTiles = false;
    
    // Activar animación de avatar activo
    DOM.currentAvatar.className = 'badge-avatar avatar-active';
    
    player.hand.forEach((tile, index) => {
        const fitsLeft = tile[0] === leftVal || tile[1] === leftVal;
        const fitsRight = tile[0] === rightVal || tile[1] === rightVal;
        const isPlayable = fitsLeft || fitsRight;
        
        if (isPlayable) hasPlayableTiles = true;
        
        const tileEl = createDominoTileHTML(tile[0], tile[1], false);
        
        if (isPlayable) {
            tileEl.classList.add('playable');
        }
        
        tileEl.addEventListener('click', () => {
            handleSelectTile(index, fitsLeft, fitsRight);
        });
        
        DOM.playerHand.appendChild(tileEl);
    });
    
    if (hasPlayableTiles) {
        DOM.controlsStatusMsg.innerHTML = '✨ ¡Tienes fichas que sirven! Toca una ficha que brille para jugarla.';
        DOM.controlsStatusMsg.style.color = 'var(--color-success)';
        DOM.btnPassTurn.classList.add('hidden');
    } else {
        if (gameState.boneyard.length > 0) {
            DOM.controlsStatusMsg.innerHTML = '💡 No tienes fichas que sirvan. ¡Toca <strong>El Pozo</strong> para robar!';
            DOM.controlsStatusMsg.style.color = 'var(--color-danger)';
            DOM.btnPassTurn.classList.add('hidden');
        } else {
            DOM.controlsStatusMsg.innerHTML = '🚫 No hay fichas en el pozo y no tienes jugadas. Toca <strong>Pasar Turno</strong>.';
            DOM.controlsStatusMsg.style.color = 'var(--color-warning)';
            DOM.btnPassTurn.classList.remove('hidden');
        }
    }
}

function createDominoTileHTML(val1, val2, isVertical) {
    const tile = document.createElement('div');
    tile.className = `domino-tile ${isVertical ? 'vertical' : ''}`;
    
    tile.innerHTML = `
        <div class="domino-half num-val-${val1}">${val1}</div>
        <div class="domino-divider"></div>
        <div class="domino-half num-val-${val2}">${val2}</div>
    `;
    
    return tile;
}

function getBoardEndpoint(side) {
    if (gameState.board.length === 0) return null;
    if (side === 'left') {
        return gameState.board[0][0];
    } else {
        return gameState.board[gameState.board.length - 1][1];
    }
}

function updateBoneyardUI() {
    DOM.boneyardCount.textContent = `${gameState.boneyard.length} ficha${gameState.boneyard.length === 1 ? '' : 's'}`;
    if (gameState.boneyard.length === 0) {
        DOM.btnDraw.style.opacity = '0.4';
        DOM.btnDraw.title = 'El pozo está vacío';
    } else {
        DOM.btnDraw.style.opacity = '1';
        DOM.btnDraw.title = 'Haz clic para robar una ficha';
    }
}

// ==========================================================================
// 7. ACCIONES DEL TURNO DEL JUGADOR
// ==========================================================================

function handleSelectTile(index, fitsLeft, fitsRight) {
    const player = gameState.players[gameState.currentPlayerIndex];
    const tile = player.hand[index];
    
    if (!fitsLeft && !fitsRight) {
        SoundEffects.playError();
        const tileElements = DOM.playerHand.querySelectorAll('.domino-tile');
        tileElements[index].classList.add('shake-animation');
        setTimeout(() => {
            tileElements[index].classList.remove('shake-animation');
        }, 400);
        return;
    }
    
    gameState.selectedTileIndex = index;
    
    if (fitsLeft && fitsRight) {
        gameState.pendingMove = { tile, index };
        DOM.sidePickerOverlay.classList.remove('hidden');
    } else if (fitsLeft) {
        playTileOnSide('left');
    } else if (fitsRight) {
        playTileOnSide('right');
    }
}

function playTileOnSide(side) {
    const player = gameState.players[gameState.currentPlayerIndex];
    const tileIndex = gameState.selectedTileIndex;
    let tile = player.hand[tileIndex];
    
    // Obtener la posición inicial de la ficha en la mano para animar
    const handTiles = DOM.playerHand.querySelectorAll('.domino-tile');
    const startTileEl = handTiles[tileIndex];
    const startRect = startTileEl ? startTileEl.getBoundingClientRect() : null;
    
    DOM.sidePickerOverlay.classList.add('hidden');
    
    const leftVal = getBoardEndpoint('left');
    const rightVal = getBoardEndpoint('right');
    
    let actualTileToPlay = [...tile];
    if (side === 'left') {
        if (actualTileToPlay[0] === leftVal) {
            actualTileToPlay = [actualTileToPlay[1], actualTileToPlay[0]];
        }
        gameState.board.unshift(actualTileToPlay);
        newlyPlayedIndex = 0;
    } else {
        if (actualTileToPlay[1] === rightVal) {
            actualTileToPlay = [actualTileToPlay[1], actualTileToPlay[0]];
        }
        gameState.board.push(actualTileToPlay);
        newlyPlayedIndex = gameState.board.length - 1;
    }
    
    player.hand.splice(tileIndex, 1);
    
    // Parar el tiempo y limpiar pistas en mano
    stopTurnTimer();
    clearPlayableHints();
    
    // Renderizar para colocar el elemento invisible en el tablero
    renderBoard();
    
    // Localizar el elemento destino en el tablero
    const boardTiles = DOM.gameBoard.querySelectorAll('.domino-tile');
    const targetBoardTile = (side === 'left') ? boardTiles[0] : boardTiles[boardTiles.length - 1];
    
    if (startRect && targetBoardTile) {
        const endRect = targetBoardTile.getBoundingClientRect();
        
        // Ejecutar animación de vuelo
        animateTileFlight(startRect, endRect, actualTileToPlay, () => {
            targetBoardTile.style.opacity = '1';
            newlyPlayedIndex = null;
            
            SoundEffects.playPop();
            triggerBoardExplosion(side);
            
            checkGameStatusAndNextTurn();
        });
    } else {
        if (targetBoardTile) targetBoardTile.style.opacity = '1';
        newlyPlayedIndex = null;
        SoundEffects.playPop();
        checkGameStatusAndNextTurn();
    }
}

function checkGameStatusAndNextTurn() {
    const player = gameState.players[gameState.currentPlayerIndex];
    if (player.hand.length === 0) {
        endGame(player.name + " terminó sus fichas", player);
        return;
    }
    
    if (isGameBlocked()) {
        resolveBlockedGame();
        return;
    }
    
    const nextPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;
    goToPlayerTransition(nextPlayerIndex);
}

function handleDrawCard() {
    const player = gameState.players[gameState.currentPlayerIndex];
    const leftVal = getBoardEndpoint('left');
    const rightVal = getBoardEndpoint('right');
    const hasPlayable = player.hand.some(tile => 
        tile[0] === leftVal || tile[1] === leftVal || 
        tile[0] === rightVal || tile[1] === rightVal
    );
    
    if (hasPlayable) {
        DOM.controlsStatusMsg.innerHTML = '⚠️ ¡Tienes fichas que sirven! No necesitas robar del pozo.';
        DOM.controlsStatusMsg.style.color = 'var(--color-warning)';
        SoundEffects.playError();
        return;
    }
    
    if (gameState.boneyard.length === 0) {
        DOM.controlsStatusMsg.innerHTML = '🚫 El pozo está vacío. Tienes que pasar tu turno.';
        DOM.controlsStatusMsg.style.color = 'var(--color-danger)';
        DOM.btnPassTurn.classList.remove('hidden');
        SoundEffects.playError();
        return;
    }
    
    // Desactivar temporalmente clics en pozo para evitar abusos
    DOM.btnDraw.style.pointerEvents = 'none';
    
    const newTile = gameState.boneyard.pop();
    
    // Parar temporizador mientras vuela la ficha
    stopTurnTimer();
    
    animateDrawTile(newTile, () => {
        player.hand.push(newTile);
        DOM.btnDraw.style.pointerEvents = 'auto';
        
        updateBoneyardUI();
        renderHand();
        
        // Reactivar el tiempo
        startTurnTimer();
    });
}

function handlePassTurn() {
    const player = gameState.players[gameState.currentPlayerIndex];
    const leftVal = getBoardEndpoint('left');
    const rightVal = getBoardEndpoint('right');
    const hasPlayable = player.hand.some(tile => 
        tile[0] === leftVal || tile[1] === leftVal || 
        tile[0] === rightVal || tile[1] === rightVal
    );
    
    if (!hasPlayable && gameState.boneyard.length === 0) {
        stopTurnTimer();
        clearPlayableHints();
        const nextPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;
        goToPlayerTransition(nextPlayerIndex);
    } else {
        renderHand();
    }
}

// ==========================================================================
// 8. DETECCIÓN DE BLOQUEO Y FIN DE JUEGO
// ==========================================================================

function isGameBlocked() {
    if (gameState.boneyard.length > 0) return false;
    
    const leftVal = getBoardEndpoint('left');
    const rightVal = getBoardEndpoint('right');
    
    for (let p = 0; p < gameState.players.length; p++) {
        const hasPlayable = gameState.players[p].hand.some(tile => 
            tile[0] === leftVal || tile[1] === leftVal || 
            tile[0] === rightVal || tile[1] === rightVal
        );
        if (hasPlayable) return false;
    }
    
    return true;
}

function resolveBlockedGame() {
    let winner = gameState.players[0];
    let minScore = calculatePlayerScore(gameState.players[0]);
    let tie = false;
    
    gameState.players.forEach((player, index) => {
        const score = calculatePlayerScore(player);
        player.score = score;
        if (index > 0) {
            if (score < minScore) {
                minScore = score;
                winner = player;
                tie = false;
            } else if (score === minScore) {
                tie = true;
            }
        }
    });
    
    if (tie) {
        let minTilesCount = winner.hand.length;
        gameState.players.forEach(player => {
            if (calculatePlayerScore(player) === minScore) {
                if (player.hand.length < minTilesCount) {
                    minTilesCount = player.hand.length;
                    winner = player;
                }
            }
        });
    }
    
    endGame("El juego se ha cerrado (bloqueado). ¡Gana el jugador con menos puntos en su mano!", winner);
}

function calculatePlayerScore(player) {
    return player.hand.reduce((total, tile) => total + tile[0] + tile[1], 0);
}

function endGame(reason, winner) {
    stopTurnTimer();
    clearPlayableHints();
    
    gameState.players.forEach(p => {
        p.score = calculatePlayerScore(p);
    });
    
    DOM.winnerAvatar.textContent = winner.avatar;
    DOM.winnerName.textContent = winner.name;
    DOM.winnerReason.textContent = reason;
    
    DOM.winnerAvatar.className = 'winner-avatar avatar-winner-spin';
    
    DOM.resultsTableBody.innerHTML = '';
    const sortedPlayers = [...gameState.players].sort((a, b) => a.score - b.score);
    
    sortedPlayers.forEach(p => {
        const tr = document.createElement('tr');
        const tilesStr = p.hand.map(tile => `[${tile[0]}|${tile[1]}]`).join(' ') || '¡Ninguna! 🎉';
        
        tr.innerHTML = `
            <td style="font-weight: 700; text-align: left;">
                <span style="font-size: 1.3rem;">${p.avatar}</span> ${p.name} 
                ${p.id === winner.id ? '⭐' : ''}
            </td>
            <td style="font-size: 0.95rem; color: var(--color-text-muted);">${tilesStr}</td>
            <td style="font-weight: 700; color: ${p.score === 0 ? 'var(--color-success)' : 'var(--color-text)'}">
                ${p.score} pt${p.score === 1 ? '' : 's'}
            </td>
        `;
        DOM.resultsTableBody.appendChild(tr);
    });
    
    showScreen(DOM.screenResults);
    
    SoundEffects.playWin();
    startConfetti();
}

function restartToSetup() {
    stopTurnTimer();
    clearPlayableHints();
    stopConfetti();
    DOM.winnerAvatar.className = 'winner-avatar';
    initSetupScreen();
    showScreen(DOM.screenSetup);
}

// ==========================================================================
// 9. SISTEMA DE CONFETI EN CANVAS (PREMIUM Y OFFLINE)
// ==========================================================================

let confettiInterval = null;
let confettiCanvas = null;
let confettiCtx = null;
let confettiParticles = [];

function startConfetti() {
    if (!confettiCanvas) {
        confettiCanvas = document.createElement('canvas');
        confettiCanvas.style.position = 'fixed';
        confettiCanvas.style.top = '0';
        confettiCanvas.style.left = '0';
        confettiCanvas.style.width = '100vw';
        confettiCanvas.style.height = '100vh';
        confettiCanvas.style.pointerEvents = 'none';
        confettiCanvas.style.zIndex = '999';
        document.body.appendChild(confettiCanvas);
    }
    
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
    confettiCtx = confettiCanvas.getContext('2d');
    
    confettiParticles = [];
    const colors = ['#f43f5e', '#0ea5e9', '#3b82f6', '#22c55e', '#a855f7', '#f97316', '#eab308'];
    
    for (let i = 0; i < 120; i++) {
        confettiParticles.push({
            x: Math.random() * confettiCanvas.width,
            y: Math.random() * confettiCanvas.height - confettiCanvas.height,
            r: Math.random() * 6 + 4,
            d: Math.random() * confettiCanvas.height,
            color: colors[Math.floor(Math.random() * colors.length)],
            tilt: Math.random() * 10 - 5,
            tiltAngleIncremental: Math.random() * 0.07 + 0.02,
            tiltAngle: 0
        });
    }
    
    function drawConfetti() {
        if (!confettiCanvas) return;
        confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        
        confettiParticles.forEach((p, idx) => {
            p.tiltAngle += p.tiltAngleIncremental;
            p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
            p.x += Math.sin(p.tiltAngle);
            p.tilt = Math.sin(p.tiltAngle - idx / 3) * 15;
            
            if (p.y > confettiCanvas.height) {
                confettiParticles[idx] = {
                    x: Math.random() * confettiCanvas.width,
                    y: -20,
                    r: p.r,
                    d: p.d,
                    color: p.color,
                    tilt: p.tilt,
                    tiltAngleIncremental: p.tiltAngleIncremental,
                    tiltAngle: p.tiltAngle
                };
            }
            
            confettiCtx.beginPath();
            confettiCtx.lineWidth = p.r;
            confettiCtx.strokeStyle = p.color;
            confettiCtx.moveTo(p.x + p.tilt + p.r / 2, p.y);
            confettiCtx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
            confettiCtx.stroke();
        });
        
        confettiInterval = requestAnimationFrame(drawConfetti);
    }
    
    drawConfetti();
    window.addEventListener('resize', resizeConfettiCanvas);
}

function resizeConfettiCanvas() {
    if (confettiCanvas) {
        confettiCanvas.width = window.innerWidth;
        confettiCanvas.height = window.innerHeight;
    }
}

function stopConfetti() {
    if (confettiInterval) {
        cancelAnimationFrame(confettiInterval);
        confettiInterval = null;
    }
    if (confettiCanvas) {
        window.removeEventListener('resize', resizeConfettiCanvas);
        confettiCanvas.remove();
        confettiCanvas = null;
        confettiCtx = null;
    }
}
