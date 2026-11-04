(function(Scratch) {
    'use strict';
    class ChessLogic {
        constructor() {
            this.reset();
        }
        reset(startingTurn = 'w') {
            this.board = [
                ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
                ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
                ['.', '.', '.', '.', '.', '.', '.', '.'],
                ['.', '.', '.', '.', '.', '.', '.', '.'],
                ['.', '.', '.', '.', '.', '.', '.', '.'],
                ['.', '.', '.', '.', '.', '.', '.', '.'],
                ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
                ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
            ];
            this.turn = startingTurn;
            this.castling = { w: { k: true, q: true }, b: { k: true, q: true } };
            this.enPassantTarget = null;
            this.halfMoveClock = 0;
            this.fullMoveNumber = 1;
            this.history = [];
            this.positionHistory = {};
            this.recordPosition();
        }
        clone() {
            const copy = new ChessLogic();
            copy.board = this.board.map(row => [...row]);
            copy.turn = this.turn;
            copy.castling = JSON.parse(JSON.stringify(this.castling));
            copy.enPassantTarget = this.enPassantTarget ? [...this.enPassantTarget] : null;
            copy.halfMoveClock = this.halfMoveClock;
            copy.fullMoveNumber = this.fullMoveNumber;
            return copy;
        }
        getPositionKey() {
            let key = '';
            for (let r = 0; r < 8; r++) key += this.board[r].join('');
            key += this.turn;
            key += JSON.stringify(this.castling);
            key += this.enPassantTarget ? this.enPassantTarget.join(',') : '-';
            return key;
        }
        recordPosition() {
            const key = this.getPositionKey();
            this.positionHistory[key] = (this.positionHistory[key] || 0) + 1;
        }
        getFEN() {
            let fen = '';
            for (let r = 0; r < 8; r++) {
                let empty = 0;
                for (let c = 0; c < 8; c++) {
                    const char = this.board[r][c];
                    if (char === '.') {
                        empty++;
                    } else {
                        if (empty > 0) { fen += empty; empty = 0; }
                        fen += char;
                    }
                }
                if (empty > 0) fen += empty;
                if (r < 7) fen += '/';
            }
            fen += ` ${this.turn} `;
            let castleStr = '';
            if (this.castling.w.k) castleStr += 'K';
            if (this.castling.w.q) castleStr += 'Q';
            if (this.castling.b.k) castleStr += 'k';
            if (this.castling.b.q) castleStr += 'q';
            fen += (castleStr || '-') + ' ';
            let ep = '-';
            if (this.enPassantTarget) {
                const [r, c] = this.enPassantTarget;
                const pawn = this.turn === 'w' ? 'P' : 'p';
                const epRow = this.turn === 'w' ? r + 1 : r - 1;
                const left = (c - 1 >= 0) && this.board[epRow][c - 1] === pawn;
                const right = (c + 1 < 8) && this.board[epRow][c + 1] === pawn;
                if (left || right) {
                    ep = this.coordsToAlg(r, c);
                }
            }
            fen += ep;
            fen += ` ${this.halfMoveClock} ${this.fullMoveNumber}`;
            return fen;
        }
        loadFEN(fen) {
            try {
                this.reset();
                const parts = fen.split(' ');
                const rows = parts[0].split('/');
                for (let r = 0; r < 8; r++) {
                    let c = 0;
                    for (let i = 0; i < rows[r].length; i++) {
                        const char = rows[r][i];
                        if (!isNaN(char)) {
                            const count = parseInt(char);
                            for (let k = 0; k < count; k++) {
                                this.board[r][c++] = '.';
                            }
                        } else {
                            this.board[r][c++] = char;
                        }
                    }
                }
                this.turn = parts[1];
                const castling = parts[2];
                this.castling = {
                    w: { k: castling.includes('K'), q: castling.includes('Q') },
                    b: { k: castling.includes('k'), q: castling.includes('q') }
                };
                const ep = parts[3];
                this.enPassantTarget = ep === '-' ? null : this.algToCoords(ep);
                this.halfMoveClock = parseInt(parts[4]) || 0;
                this.fullMoveNumber = parseInt(parts[5]) || 1;
                this.positionHistory = {};
                this.recordPosition();
                return true;
            } catch (e) {
                console.error("Invalid FEN", e);
                return false;
            }
        }
        algToCoords(sq) {
            if (!sq || sq.length < 2) return [0,0];
            const col = sq.charCodeAt(0) - 97;
            const row = 8 - parseInt(sq[1]);
            return [row, col];
        }
        coordsToAlg(r, c) {
            const file = String.fromCharCode(97 + c);
            const rank = 8 - r;
            return file + rank;
        }
        isWhite(piece) { return piece !== '.' && piece === piece.toUpperCase(); }
        isBlack(piece) { return piece !== '.' && piece === piece.toLowerCase(); }
        getColor(piece) {
            if(piece === '.') return null;
            return this.isWhite(piece) ? 'w' : 'b';
        }
        getValidMoves(returnAlgebraic = false) {
            const moves = [];
            for (let r = 0; r < 8; r++) {
                for (let c = 0; c < 8; c++) {
                    const piece = this.board[r][c];
                    if (this.getColor(piece) === this.turn) {
                        const pieceMoves = this.generateMovesForSquare(r, c);
                        moves.push(...pieceMoves);
                    }
                }
            }
            const legalMoves = moves.filter(m => {
                const tempState = this.clone();
                tempState.makeMoveInternal(m);
                return !tempState.isKingInCheck(this.turn);
            });
            if (returnAlgebraic) {
                return legalMoves.map(m => {
                    let str = this.coordsToAlg(m.fromR, m.fromC) + this.coordsToAlg(m.toR, m.toC);
                    if (m.promotion) str += m.promotion;
                    return str;
                });
            }
            return legalMoves;
        }
        isKingInCheck(color) {
            let kr, kc;
            for(let r=0; r<8; r++) {
                for(let c=0; c<8; c++) {
                    if (this.board[r][c] === (color === 'w' ? 'K' : 'k')) {
                        kr = r; kc = c;
                    }
                }
            }
            if (kr === undefined) return true;
            const opponent = color === 'w' ? 'b' : 'w';
            return this.isSquareAttacked(kr, kc, opponent);
        }
        isSquareAttacked(r, c, attackerColor) {
            if (attackerColor === 'w') {
                if (r < 7 && c > 0 && this.board[r+1][c-1] === 'P') return true;
                if (r < 7 && c < 7 && this.board[r+1][c+1] === 'P') return true;
            } else {
                if (r > 0 && c > 0 && this.board[r-1][c-1] === 'p') return true;
                if (r > 0 && c < 7 && this.board[r-1][c+1] === 'p') return true;
            }
            const knightMoves = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
            for (let m of knightMoves) {
                const nr = r + m[0], nc = c + m[1];
                if (nr>=0 && nr<8 && nc>=0 && nc<8) {
                    const p = this.board[nr][nc];
                    if (p === (attackerColor === 'w' ? 'N' : 'n')) return true;
                }
            }
            for (let i=-1; i<=1; i++) {
                for (let j=-1; j<=1; j++) {
                    if (i===0 && j===0) continue;
                    const kr = r+i, kc = c+j;
                    if (kr>=0 && kr<8 && kc>=0 && kc<8) {
                        if (this.board[kr][kc] === (attackerColor === 'w' ? 'K' : 'k')) return true;
                    }
                }
            }
            const dirsStr = [[0,1],[0,-1],[1,0],[-1,0]];
            for (let d of dirsStr) {
                let nr = r + d[0], nc = c + d[1];
                while(nr>=0 && nr<8 && nc>=0 && nc<8) {
                    const p = this.board[nr][nc];
                    if (p !== '.') {
                        if (p === (attackerColor === 'w' ? 'R' : 'r') || p === (attackerColor === 'w' ? 'Q' : 'q')) return true;
                        break;
                    }
                    nr += d[0]; nc += d[1];
                }
            }
            const dirsDiag = [[1,1],[1,-1],[-1,1],[-1,-1]];
            for (let d of dirsDiag) {
                let nr = r + d[0], nc = c + d[1];
                while(nr>=0 && nr<8 && nc>=0 && nc<8) {
                    const p = this.board[nr][nc];
                    if (p !== '.') {
                        if (p === (attackerColor === 'w' ? 'B' : 'b') || p === (attackerColor === 'w' ? 'Q' : 'q')) return true;
                        break;
                    }
                    nr += d[0]; nc += d[1];
                }
            }
            return false;
        }
        generateMovesForSquare(r, c) {
            const piece = this.board[r][c];
            const type = piece.toLowerCase();
            const color = this.getColor(piece);
            const moves = [];
            if (type === 'p') {
                const dir = color === 'w' ? -1 : 1;
                const startRow = color === 'w' ? 6 : 1;
                if (r+dir >= 0 && r+dir < 8 && this.board[r+dir][c] === '.') {
                    if (r+dir === 0 || r+dir === 7) {
                        moves.push({fromR:r, fromC:c, toR:r+dir, toC:c, promotion:'q'});
                        moves.push({fromR:r, fromC:c, toR:r+dir, toC:c, promotion:'r'});
                    } else {
                        moves.push({fromR:r, fromC:c, toR:r+dir, toC:c});
                        if (r === startRow && this.board[r+(dir*2)][c] === '.') {
                            moves.push({fromR:r, fromC:c, toR:r+(dir*2), toC:c});
                        }
                    }
                }
                for (let dc of [-1, 1]) {
                    if (c+dc >= 0 && c+dc < 8) {
                        const target = this.board[r+dir]?.[c+dc];
                        if (target && target !== '.' && this.getColor(target) !== color) {
                            if (r+dir === 0 || r+dir === 7) {
                                moves.push({fromR:r, fromC:c, toR:r+dir, toC:c+dc, promotion:'q', isCapture: true});
                            } else {
                                moves.push({fromR:r, fromC:c, toR:r+dir, toC:c+dc, isCapture: true});
                            }
                        }
                        if (this.enPassantTarget && this.enPassantTarget[0] === r+dir && this.enPassantTarget[1] === c+dc) {
                             moves.push({fromR:r, fromC:c, toR:r+dir, toC:c+dc, isEnPassant: true, isCapture: true});
                        }
                    }
                }
            }
            else if (type === 'n') {
                const jumps = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
                for (let m of jumps) {
                    const nr = r+m[0], nc = c+m[1];
                    if (nr>=0 && nr<8 && nc>=0 && nc<8) {
                        const target = this.board[nr][nc];
                        if (target === '.' || this.getColor(target) !== color) {
                             moves.push({fromR:r, fromC:c, toR:nr, toC:nc, isCapture: target !== '.'});
                        }
                    }
                }
            }
            else if (type === 'k') {
                for (let i=-1; i<=1; i++) {
                    for (let j=-1; j<=1; j++) {
                        if (i===0 && j===0) continue;
                        const nr = r+i, nc = c+j;
                        if (nr>=0 && nr<8 && nc>=0 && nc<8) {
                             const target = this.board[nr][nc];
                             if (target === '.' || this.getColor(target) !== color) {
                                moves.push({fromR:r, fromC:c, toR:nr, toC:nc, isCapture: target !== '.'});
                            }
                        }
                    }
                }
                if (color === 'w' && r===7 && c===4 && !this.isSquareAttacked(7, 4, 'b')) {
                    if (this.castling.w.k && this.board[7][5] === '.' && this.board[7][6] === '.' && !this.isSquareAttacked(7, 5, 'b')) {
                        moves.push({fromR:7, fromC:4, toR:7, toC:6, castle:'k'});
                    }
                    if (this.castling.w.q && this.board[7][3] === '.' && this.board[7][2] === '.' && this.board[7][1] === '.' && !this.isSquareAttacked(7, 3, 'b')) {
                        moves.push({fromR:7, fromC:4, toR:7, toC:2, castle:'q'});
                    }
                }
                if (color === 'b' && r===0 && c===4 && !this.isSquareAttacked(0, 4, 'w')) {
                    if (this.castling.b.k && this.board[0][5] === '.' && this.board[0][6] === '.' && !this.isSquareAttacked(0, 5, 'w')) {
                        moves.push({fromR:0, fromC:4, toR:0, toC:6, castle:'k'});
                    }
                    if (this.castling.b.q && this.board[0][3] === '.' && this.board[0][2] === '.' && this.board[0][1] === '.' && !this.isSquareAttacked(0, 3, 'w')) {
                        moves.push({fromR:0, fromC:4, toR:0, toC:2, castle:'q'});
                    }
                }
            }
            else {
                const dirs = [];
                if (type === 'r' || type === 'q') dirs.push([0,1],[0,-1],[1,0],[-1,0]);
                if (type === 'b' || type === 'q') dirs.push([1,1],[1,-1],[-1,1],[-1,-1]);
                for (let d of dirs) {
                    let nr = r + d[0], nc = c + d[1];
                    while (nr>=0 && nr<8 && nc>=0 && nc<8) {
                        const target = this.board[nr][nc];
                        if (target === '.') {
                            moves.push({fromR:r, fromC:c, toR:nr, toC:nc});
                        } else {
                            if (this.getColor(target) !== color) {
                                moves.push({fromR:r, fromC:c, toR:nr, toC:nc, isCapture: true});
                            }
                            break;
                        }
                        nr += d[0]; nc += d[1];
                    }
                }
            }
            return moves;
        }
        makeMoveInternal(moveObj) {
            const { fromR, fromC, toR, toC, promotion, castle, isEnPassant } = moveObj;
            const piece = this.board[fromR][fromC];
            const target = this.board[toR][toC];
            const color = this.turn;
            if (piece.toLowerCase() === 'p' || target !== '.') this.halfMoveClock = 0;
            else this.halfMoveClock++;
            if (color === 'b') this.fullMoveNumber++;
            this.board[toR][toC] = piece;
            this.board[fromR][fromC] = '.';
            if (promotion) {
                this.board[toR][toC] = color === 'w' ? promotion.toUpperCase() : promotion.toLowerCase();
            }
            if (isEnPassant) {
                this.board[fromR][toC] = '.';
            }
            if (castle) {
                if (castle === 'k') {
                    this.board[fromR][5] = this.board[fromR][7];
                    this.board[fromR][7] = '.';
                } else if (castle === 'q') {
                    this.board[fromR][3] = this.board[fromR][0];
                    this.board[fromR][0] = '.';
                }
            }
            if (piece === 'K') { this.castling.w.k = false; this.castling.w.q = false; }
            if (piece === 'k') { this.castling.b.k = false; this.castling.b.q = false; }
            if (piece === 'R') {
                if (fromR===7 && fromC===0) this.castling.w.q = false;
                if (fromR===7 && fromC===7) this.castling.w.k = false;
            }
            if (piece === 'r') {
                if (fromR===0 && fromC===0) this.castling.b.q = false;
                if (fromR===0 && fromC===7) this.castling.b.k = false;
            }
            if (target === 'R') {
                if (toR===7 && toC===0) this.castling.w.q = false;
                if (toR===7 && toC===7) this.castling.w.k = false;
            }
            if (target === 'r') {
                if (toR===0 && toC===0) this.castling.b.q = false;
                if (toR===0 && toC===7) this.castling.b.k = false;
            }
            this.enPassantTarget = null;
            if (piece.toLowerCase() === 'p' && Math.abs(toR - fromR) === 2) {
                this.enPassantTarget = [(fromR + toR) / 2, fromC];
            }
            this.turn = this.turn === 'w' ? 'b' : 'w';
            this.recordPosition();
        }
        move(moveStr) {
            const moves = this.getValidMoves(true);
            const moveObj = this.getValidMoves().find((m, i) => moves[i] === moveStr);
            if (moveObj) {
                this.history.push(moveStr);
                this.makeMoveInternal(moveObj);
                return true;
            }
            return false;
        }
        isInsufficientMaterial() {
            const pieces = [];
            for(let r=0; r<8; r++) {
                for(let c=0; c<8; c++) {
                    const p = this.board[r][c];
                    if (p !== '.') pieces.push(p);
                }
            }
            if (pieces.length === 2) return true;
            if (pieces.length === 3) {
                return pieces.some(p => p.toLowerCase() === 'n' || p.toLowerCase() === 'b');
            }
            return false;
        }
        getGameState() {
            const validMoves = this.getValidMoves();
            const inCheck = this.isKingInCheck(this.turn);
            if (validMoves.length === 0) {
                if (inCheck) return 'checkmate';
                return 'stalemate';
            }
            if (this.isInsufficientMaterial()) return 'insufficient_material';
            if (this.halfMoveClock >= 100) return 'fifty_move_rule';
            const key = this.getPositionKey();
            if (this.positionHistory[key] >= 3) return 'threefold_repetition';
            return 'active';
        }
    }
    if (!Scratch.extensions.unsandboxed) {
		throw new Error("Chess Extension must run unsandboxed!")
	}
	class ChessExtension {
        constructor() {
            this.game = new ChessLogic();
            this.isBoardInitialized = false;
            this.overlay = null;
            this.boardEl = null;
            this.squares = [];
            this.selectedSquare = null;
            this.isInteractive = true;
            this.boardSize = 'medium';
            this.customSize = 300;
            this.position = 'center';
            this.possibleMoveHighlights = [];
            this.castleRookHighlight = null;
            this.flipped = false;
            this.lightTileColor = '#F0D9B5';
            this.darkTileColor = '#B58863';
            this.pieceStyle = 'emojis';
            this.fontLoaded = false;
            this.tweenEnabled = false;
            this.tweenDuration = 0.3;
            this.tweenEasing = 'ease-in-out';
            this.cpuWorker = null;
            this.cpuEngineLoaded = false;
            this.cpuPendingResolver = null;
            this.cpuCurrentScore = 0;
            this.createOverlay();
            this.updateUI();
        }
        getInfo() {
            return {
                id: 'chessG1nX',
                name: 'Chess Extension',
                color1: '#B58863',
                docsURI: "https://hackmd.io/@Gen1x01/chess-ext-docs",
                blocks: [
                    { blockType: 'label', text: 'Board Management' },
                    { opcode: 'initializeBoard', blockType: 'command', text: 'initialize new chess game' },
                    { opcode: 'showBoard', blockType: 'command', text: 'show chess board' },
                    { opcode: 'hideBoard', blockType: 'command', text: 'hide chess board' },
                    { opcode: 'initializeDetector', blockType: 'Boolean', text: 'board initialized?' },
                    { blockType: 'label', text: 'Appearance & Settings' },
                    { opcode: 'setBoardPosition', blockType: 'command', text: 'set board position to [POSITION]', arguments: { POSITION: { type: 'string', menu: 'positionMenu', defaultValue: 'center' } }, hideFromPalette: true },
                    { opcode: 'setBoardPositionNew', blockType: 'command', text: 'set board position to [POSITION]', arguments: { POSITION: { type: 'string', menu: 'positionMenuNew', defaultValue: 'center' } } },
                    { opcode: 'setBoardSize', blockType: 'command', text: 'set board size to [SIZE]', arguments: { SIZE: { type: 'string', menu: 'sizeMenu', defaultValue: 'medium' } } },
                    { opcode: 'setCustomBoardSize', blockType: 'command', text: 'set custom board size to [SIZE] pixels', arguments: { SIZE: { type: 'number', defaultValue: 300 } } },
                    { opcode: 'setPerspective', blockType: 'command', text: 'set perspective to [PERSPECTIVE]', arguments: { PERSPECTIVE: { type: 'string', menu: 'perspectiveMenu', defaultValue: 'white' } } },
                    { opcode: 'toggleBoardInteractivity', blockType: 'command', text: 'set board interactivity to [INTERACTIVE]', arguments: { INTERACTIVE: { type: 'string', menu: 'interactivityMenu', defaultValue: 'true' } } },
                    { opcode: 'setTileColor', blockType: 'command', text: 'set [TYPE] tile color to [COLOR]', arguments: { TYPE: { type: 'string', menu: 'tileTypeMenu', defaultValue: 'light' }, COLOR: { type: 'color', defaultValue: '#F0D9B5' } } },
                    { opcode: 'setPieceStyle', blockType: 'command', text: 'show pieces via [STYLE]', arguments: { STYLE: { type: 'string', menu: 'styleMenu', defaultValue: 'emojis' } } },
                    { blockType: 'label', text: 'Animation / Tweening' },
                    { opcode: 'setTweening', blockType: 'command', text: 'turn tweening [STATE]', arguments: { STATE: { type: 'string', menu: 'onOffMenu', defaultValue: 'off' } } },
                    { opcode: 'setTweenDuration', blockType: 'command', text: 'set tween duration to [SEC] seconds', arguments: { SEC: { type: 'number', defaultValue: 0.3 } } },
                    { opcode: 'setTweenEasing', blockType: 'command', text: 'set tween easing to [EASE]', arguments: { EASE: { type: 'string', menu: 'easingMenu', defaultValue: 'ease-in-out' } } },
                    { blockType: 'label', text: 'Game Moves' },
                    { opcode: 'makeMove', blockType: 'command', text: 'make move [MOVE]', arguments: { MOVE: { type: 'string', defaultValue: 'e2e4' } } },
                    { opcode: 'isValidMove', blockType: 'Boolean', text: 'is [MOVE] valid?', arguments: { MOVE: { type: 'string', defaultValue: 'e2e4' } } },
                    { blockType: 'label', text: 'State & FEN' },
                    { opcode: 'getFEN', blockType: 'reporter', text: 'get FEN position' },
                    { opcode: 'setFEN', blockType: 'command', text: 'set board to FEN [FEN]', arguments: { FEN: { type: 'string', defaultValue: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1' } } },
                    { blockType: 'label', text: 'Engine & Analysis' },
                    { opcode: 'analyzeChessPosition', blockType: 'reporter', text: 'analyze (API) position [FEN] variants [VARIANTS] depth [DEPTH] time [MAX_THINKING_TIME] moves [SEARCH_MOVES]', arguments: { FEN: { type: 'string', defaultValue: 'current' }, VARIANTS: { type: 'number', defaultValue: 1 }, DEPTH: { type: 'number', defaultValue: 12 }, MAX_THINKING_TIME: { type: 'number', defaultValue: 50 }, SEARCH_MOVES: { type: 'string', defaultValue: '' } } },
                    { opcode: 'loadCpuEngine', blockType: 'command', text: 'import CPU engine' },
                    { opcode: 'isCpuEngineLoaded', blockType: 'Boolean', text: 'is CPU engine loaded?' },
                    { opcode: 'analyzeChessPositionLocal', blockType: 'reporter', text: 'analyze (CPU) position [FEN] depth [DEPTH]', arguments: { FEN: { type: 'string', defaultValue: 'current' }, DEPTH: { type: 'number', defaultValue: 10 } } },
                    { blockType: 'label', text: 'Information' },
                    { opcode: 'isCheck', hideFromPalette: true, blockType: 'Boolean', text: 'is king in check?' },
                    { opcode: 'isKingInCheckNew', blockType: 'Boolean', text: 'is [COLOR] king in check?', arguments: { COLOR: { type: 'string', menu: 'colorMenu', defaultValue: 'w' } }, hideFromPalette: true },
                    { opcode: 'isKingInCheckNewNew', blockType: 'Boolean', text: 'is [COLOR] king in check?', arguments: { COLOR: { type: 'string', menu: 'colorMenuNew', defaultValue: 'white' } } },
                    { opcode: 'getGameStatus', blockType: 'reporter', text: 'game status' },
                    { opcode: 'isGameOver', blockType: 'Boolean', text: 'is game over?' },
                    { opcode: 'getValidMoves', blockType: 'reporter', text: 'get all valid moves' },
                    { opcode: 'getPieceAt', blockType: 'reporter', text: 'get piece at [SQUARE]', arguments: { SQUARE: { type: 'string', defaultValue: 'e4' } } },
                    { opcode: 'getTurn', blockType: 'reporter', text: 'whose turn? (w/b)' },
                    { opcode: 'getPGN', blockType: 'reporter', text: 'get game PGN' },
                    { blockType: 'label', text: 'Advanced Stats' },
                    { opcode: 'getPieceColorAtSquare', blockType: 'reporter', text: 'color of piece at [SQUARE]', arguments: { SQUARE: { type: 'string', defaultValue: 'e4' } } },
                    { opcode: 'getPieceCount', blockType: 'reporter', text: 'count of [PIECE_TYPE] pieces for [COLOR]', arguments: { PIECE_TYPE: { type: 'string', menu: 'pieceTypeMenu', defaultValue: 'all' }, COLOR: { type: 'string', menu: 'colorMenu', defaultValue: 'w' } }, hideFromPalette: true },
                    { opcode: 'getPieceCountNew', blockType: 'reporter', text: 'count of [PIECE_TYPE] pieces for [COLOR]', arguments: { PIECE_TYPE: { type: 'string', menu: 'pieceTypeMenuNew', defaultValue: 'all' }, COLOR: { type: 'string', menu: 'colorMenuNew', defaultValue: 'white' } } },
                    { opcode: 'getMaterialScore', blockType: 'reporter', text: 'material score for [COLOR]', arguments: { COLOR: { type: 'string', menu: 'colorMenu', defaultValue: 'w' } }, hideFromPalette: true },
                    { opcode: 'getMaterialScoreNew', blockType: 'reporter', text: 'material score for [COLOR]', arguments: { COLOR: { type: 'string', menu: 'colorMenuNew', defaultValue: 'white' } } },
                    { opcode: 'getAttackersOfSquare', hideFromPalette: true, blockType: 'reporter', text: 'attackers of square [SQUARE] by [COLOR]', arguments: { SQUARE: { type: 'string', defaultValue: 'e4' }, COLOR: { type: 'string', menu: 'colorMenu', defaultValue: 'w' } } },
                    { opcode: 'getPieceMoves', blockType: 'reporter', text: 'valid moves for piece at [SQUARE]', arguments: { SQUARE: { type: 'string', defaultValue: 'e2' } } },
                    { opcode: 'getPositionScore', blockType: 'reporter', text: 'position evaluation score' },
                    { opcode: 'getMoveHistory', blockType: 'reporter', text: 'get move history' },
                    { opcode: 'getCapturedPieces', blockType: 'reporter', text: 'captured pieces by [COLOR]', arguments: { COLOR: { type: 'string', menu: 'colorMenu', defaultValue: 'w' } }, hideFromPalette: true },
                    { opcode: 'getCapturedPiecesNew', blockType: 'reporter', text: 'captured pieces by [COLOR]', arguments: { COLOR: { type: 'string', menu: 'colorMenuNew', defaultValue: 'white' } } }
                ],
                menus: {
                    positionMenu: { acceptReporters: false, items: ['center', 'topleft', 'topright', 'bottomleft', 'bottomright'] },
                    positionMenuNew: { acceptReporters: false, items: ['center', 'top-left', 'top-right', 'bottom-left', 'bottom-right', 'center-left', 'center-top', 'center-right', 'center-bottom'] },
                    sizeMenu: { acceptReporters: false, items: ['small', 'medium', 'large', 'full'] },
                    pieceTypeMenu: { acceptReporters: false, items: ['all', 'p', 'n', 'b', 'r', 'q', 'k'] },
                    pieceTypeMenuNew: { acceptReporters: false, items: ['all', 'pawn', 'knight', 'bishop', 'rook', 'queen', 'king'] },
                    colorMenu: { acceptReporters: false, items: ['w', 'b'] },
                    colorMenuNew: { acceptReporters: false, items: ['white', 'black'] },
                    interactivityMenu: { items: ['true', 'false'] },
                    tileTypeMenu: { items: ['light', 'dark'] },
                    styleMenu: { items: ['emojis', 'icons'] },
                    onOffMenu: { items: ['on', 'off'] },
                    easingMenu: { items: ['linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out'] },
                    perspectiveMenu: { acceptReporters: true, items: ['white', 'black'] }
                }
            };
        }
        loadCpuEngine() {
            if (this.cpuEngineLoaded) return Promise.resolve();
            return Scratch.fetch('https://rawcdn.githack.com/Gen1xLol/testassets/refs/heads/main/lozza.js')
                .then(r => r.text())
                .then(js => {
                    const blob = new Blob([js], {type: 'application/javascript'});
                    this.cpuWorker = new Worker(URL.createObjectURL(blob));
                    this.cpuWorker.onmessage = (e) => this.handleCpuMessage(e.data);
                    this.cpuWorker.postMessage('uci');
                    this.cpuEngineLoaded = true;
                })
                .catch(e => {
                    console.error("Failed to load Lozza engine", e);
                    throw e;
                });
        }
        isCpuEngineLoaded() { return this.cpuEngineLoaded; }
        handleCpuMessage(data) {
            if (data.startsWith('info') && data.includes('score')) {
                let score = 0;
                const matchCp = data.match(/score cp (-?\d+)/);
                const matchMate = data.match(/score mate (-?\d+)/);
                if (matchMate) {
                    score = parseInt(matchMate[1]) * 10000;
                } else if (matchCp) {
                    score = parseInt(matchCp[1]);
                }
                this.cpuCurrentScore = score;
            }
            if (data.startsWith('bestmove')) {
                const parts = data.split(' ');
                const bestMove = parts[1];
                if (this.cpuPendingResolver) {
                    this.cpuPendingResolver(JSON.stringify({ best: bestMove, score: this.cpuCurrentScore }));
                    this.cpuPendingResolver = null;
                }
            }
        }
        analyzeChessPositionLocal(args) {
            if (!this.cpuEngineLoaded || !this.cpuWorker) return JSON.stringify({ error: "Engine not loaded" });
            if (this.cpuPendingResolver) return JSON.stringify({ error: "Engine busy" });
            let fen = args.FEN;
            if (fen === 'current') fen = this.game.getFEN();
            const depth = Math.max(1, Number(args.DEPTH) || 10);
            return new Promise((resolve) => {
                this.cpuPendingResolver = resolve;
                this.cpuCurrentScore = 0;
                this.cpuWorker.postMessage('ucinewgame');
                this.cpuWorker.postMessage('position fen ' + fen);
                this.cpuWorker.postMessage('go depth ' + depth);
                setTimeout(() => {
                    if (this.cpuPendingResolver === resolve) {
                        this.cpuWorker.postMessage('stop');
                        resolve(JSON.stringify({ error: "Timeout" }));
                        this.cpuPendingResolver = null;
                    }
                }, 30000);
            });
        }
        createOverlay() {
            if (this.overlay) return;
            this.overlay = document.createElement('div');
            this.overlay.style.pointerEvents = 'none';
            this.overlay.style.width = '100%';
            this.overlay.style.height = '100%';
            this.overlay.style.display = 'flex';
            this.overlay.style.justifyContent = 'center';
            this.overlay.style.alignItems = 'center';
            this.overlay.style.visibility = 'hidden';
            this.boardEl = document.createElement('div');
            this.boardEl.style.display = 'grid';
            this.boardEl.style.gridTemplateColumns = 'repeat(8, 1fr)';
            this.boardEl.style.gridTemplateRows = 'repeat(8, 1fr)';
            this.boardEl.style.width = '300px';
            this.boardEl.style.height = '300px';
            this.boardEl.style.border = '4px solid #5d4037';
            this.boardEl.style.pointerEvents = 'auto';
            this.boardEl.style.backgroundColor = this.darkTileColor;
            this.boardEl.style.position = 'relative';
            for (let r_disp = 0; r_disp < 8; r_disp++) {
                for (let c_disp = 0; c_disp < 8; c_disp++) {
                    const sq = document.createElement('div');
                    const isDark = (r_disp + c_disp) % 2 === 1;
                    sq.style.backgroundColor = isDark ? this.darkTileColor : this.lightTileColor;
                    sq.style.display = 'flex';
                    sq.style.justifyContent = 'center';
                    sq.style.alignItems = 'center';
                    sq.style.fontSize = '24px';
                    sq.style.cursor = 'pointer';
                    sq.style.userSelect = 'none';
                    sq.style.boxSizing = 'border-box';
                    sq.style.overflow = 'hidden';
                    sq.style.lineHeight = '1';
                    sq.onclick = () => {
                        const r_logic = this.flipped ? 7 - r_disp : r_disp;
                        const c_logic = this.flipped ? 7 - c_disp : c_disp;
                        this.handleSquareClick(r_logic, c_logic);
                    };
                    this.squares.push(sq);
                    this.boardEl.appendChild(sq);
                }
            }
            this.overlay.appendChild(this.boardEl);
            Scratch.vm.renderer.addOverlay(this.overlay, "scale");
            this.updateLayout();
        }
        updateLayout() {
            if (!this.boardEl) return;
            const stageW = Scratch.vm.runtime.stageWidth;
            const stageH = Scratch.vm.runtime.stageHeight;
            let size = 300;
            const minDim = Math.min(stageW, stageH);
            if (this.boardSize === 'small') size = minDim * 0.5;
            else if (this.boardSize === 'medium') size = minDim * 0.8;
            else if (this.boardSize === 'large') size = minDim * 0.9;
            else if (this.boardSize === 'full') size = minDim * 1.0;
            else size = this.customSize;
            this.boardEl.style.width = size + 'px';
            this.boardEl.style.height = size + 'px';
            const fontSize = size / 10;
            this.squares.forEach(sq => sq.style.fontSize = fontSize + 'px');

            const pos = (this.position || 'center').replace(/[\s-]/g, '');

            let justifyContent = 'center';
            let alignItems = 'center';
    
            if (pos.includes('top')) alignItems = 'flex-start';
            else if (pos.includes('bottom')) alignItems = 'flex-end';
    
            if (pos.includes('left')) justifyContent = 'flex-start';
            else if (pos.includes('right')) justifyContent = 'flex-end';
    
            this.overlay.style.justifyContent = justifyContent;
            this.overlay.style.alignItems = alignItems;
        }
        updateUI() {
            if (!this.boardEl) return;
            const pieceSymbols = {
                'P': '♟', 'N': '♞', 'B': '♝', 'R': '♜', 'Q': '♛', 'K': '♚',
                'p': '♟', 'n': '♞', 'b': '♝', 'r': '♜', 'q': '♛', 'k': '♚'
            };
            for (let r_disp = 0; r_disp < 8; r_disp++) {
                for (let c_disp = 0; c_disp < 8; c_disp++) {
                    const r_logic = this.flipped ? 7 - r_disp : r_disp;
                    const c_logic = this.flipped ? 7 - c_disp : c_disp;
                    const idx = r_disp * 8 + c_disp;
                    const sq = this.squares[idx];
                    const piece = this.game.board[r_logic][c_logic];
                    if (this.pieceStyle === 'icons' && this.fontLoaded) {
                        sq.style.fontFamily = "'ChessMerida', sans-serif";
                        sq.textContent = piece === '.' ? '' : pieceSymbols[piece];
                        sq.style.textShadow = 'none';
                        sq.style.color = '#000000';
                        if (this.game.isWhite(piece)) sq.style.color = '#ffffff';
                        if (this.game.isBlack(piece)) sq.style.color = '#000000';
                        if (this.game.isWhite(piece)) sq.style.textShadow = '0px 0px 2px black';
                    } else {
                        sq.style.fontFamily = "sans-serif";
                        sq.textContent = piece === '.' ? '' : pieceSymbols[piece];
                        sq.style.color = this.game.isWhite(piece) ? '#ffffff' : '#000000';
                        if (this.game.isWhite(piece)) sq.style.textShadow = '0px 0px 2px black';
                    }
                    const isDark = (r_logic + c_logic) % 2 === 1;
                    sq.style.backgroundColor = isDark ? this.darkTileColor : this.lightTileColor;
                    if (this.selectedSquare && this.selectedSquare.r === r_logic && this.selectedSquare.c === c_logic) {
                        sq.style.backgroundColor = '#6a9c47';
                    }
                    if (this.possibleMoveHighlights.some(m => m.toR === r_logic && m.toC === c_logic)) {
                         sq.style.boxShadow = 'inset 0 0 10px rgba(0,0,0,0.5)';
                         if (piece === '.') {
                             sq.style.background = `radial-gradient(rgba(0,0,0,0.2) 19%, rgba(0,0,0,0) 20%)`;
                             sq.style.backgroundColor = isDark ? this.darkTileColor : this.lightTileColor;
                         } else {
                             sq.style.boxShadow = 'inset 0 0 0 4px rgba(0,0,0,0.2)';
                         }
                    } else {
                        sq.style.boxShadow = 'none';
                        sq.style.background = 'none';
                        sq.style.backgroundColor = isDark ? this.darkTileColor : this.lightTileColor;
                    }
                    if (this.castleRookHighlight && this.castleRookHighlight.r === r_logic && this.castleRookHighlight.c === c_logic) {
                        sq.style.boxShadow = 'inset 0 0 10px rgba(0,0,255,0.5)';
                    }
                }
            }
        }
        setTweening(args) { this.tweenEnabled = args.STATE === 'on'; }
        setTweenDuration(args) { this.tweenDuration = Math.max(0.01, Number(args.SEC)); }
        setTweenEasing(args) { this.tweenEasing = args.EASE; }
        animatePiece(fromR, fromC, toR, toC, callback) {
            if (!this.boardEl) { callback(); return; }
            const boardWidth = this.boardEl.clientWidth;
            const boardHeight = this.boardEl.clientHeight;
            const sqW = boardWidth / 8;
            const sqH = boardHeight / 8;
            
            const fromR_disp = this.flipped ? 7 - fromR : fromR;
            const fromC_disp = this.flipped ? 7 - fromC : fromC;
            const toR_disp = this.flipped ? 7 - toR : toR;
            const toC_disp = this.flipped ? 7 - toC : toC;
            
            const startX = fromC_disp * sqW;
            const startY = fromR_disp * sqH;
            const endX = toC_disp * sqW;
            const endY = toR_disp * sqH;
            
            const fromIdx = fromR_disp * 8 + fromC_disp;
            const fromSq = this.squares[fromIdx];
            const pieceContent = fromSq.textContent;
            const pieceStyle = fromSq.style.cssText;
            const ghost = document.createElement('div');
            ghost.style.cssText = pieceStyle;
            ghost.textContent = pieceContent;
            ghost.style.position = 'absolute';
            ghost.style.left = startX + 'px';
            ghost.style.top = startY + 'px';
            ghost.style.width = sqW + 'px';
            ghost.style.height = sqH + 'px';
            ghost.style.backgroundColor = 'transparent';
            ghost.style.zIndex = '1000';
            ghost.style.boxShadow = 'none';
            ghost.style.display = 'flex';
            ghost.style.justifyContent = 'center';
            ghost.style.alignItems = 'center';
            ghost.style.transition = `transform ${this.tweenDuration}s ${this.tweenEasing}`;
            this.boardEl.appendChild(ghost);
            fromSq.textContent = '';
            fromSq.style.textShadow = 'none';
            let animationFinished = false;
            const onEnd = () => {
                if (animationFinished) return;
                animationFinished = true;
                ghost.removeEventListener('transitionend', onEnd);
                if (ghost.parentNode) {
                    ghost.parentNode.removeChild(ghost);
                }
                callback();
            };
            ghost.addEventListener('transitionend', onEnd);
            setTimeout(onEnd, this.tweenDuration * 1000 + 50);
            setTimeout(() => {
                const deltaX = endX - startX;
                const deltaY = endY - startY;
                ghost.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
            }, 0);
        }
        handleSquareClick(r, c) {
            if (!this.isInteractive) return;
            const piece = this.game.board[r][c];
            const isOwnPiece = (this.game.turn === 'w' && this.game.isWhite(piece)) ||
                               (this.game.turn === 'b' && this.game.isBlack(piece));
            if (isOwnPiece) {
                this.selectedSquare = {r, c};
                const moves = this.game.getValidMoves();
                this.possibleMoveHighlights = moves.filter(m => m.fromR === r && m.fromC === c);
                this.castleRookHighlight = null;
                const castleMove = this.possibleMoveHighlights.find(m => m.castle);
                if (castleMove) {
                    if (castleMove.castle === 'k') this.castleRookHighlight = { r: r, c: 7 };
                    else if (castleMove.castle === 'q') this.castleRookHighlight = { r: r, c: 0 };
                }
                this.updateUI();
                return;
            }
            if (this.selectedSquare) {
                const move = this.possibleMoveHighlights.find(m => m.toR === r && m.toC === c);
                let altMove = null;
                if (!move && (piece === 'R' || piece === 'r')) {
                    const kingMove = this.possibleMoveHighlights.find(m => m.castle);
                    if (kingMove) {
                        if (kingMove.castle === 'k' && c === 7) altMove = kingMove;
                        if (kingMove.castle === 'q' && c === 0) altMove = kingMove;
                    }
                }
                const finalMove = move || altMove;
                if (finalMove) {
                    const alg = this.game.coordsToAlg(this.selectedSquare.r, this.selectedSquare.c) +
                                this.game.coordsToAlg(finalMove.toR, finalMove.toC) +
                                (finalMove.promotion ? finalMove.promotion : '');
                    
                    const fromR = this.selectedSquare.r;
                    const fromC = this.selectedSquare.c;

                    this.selectedSquare = null;
                    this.possibleMoveHighlights = [];
                    this.castleRookHighlight = null;
                    this.updateUI();

                    if (this.tweenEnabled) {
                        this.animatePiece(fromR, fromC, finalMove.toR, finalMove.toC, () => {
                            this.game.move(alg);
                            this.updateUI();
                        });
                    } else {
                        this.game.move(alg);
                        this.updateUI();
                    }
                } else {
                    this.selectedSquare = null;
                    this.possibleMoveHighlights = [];
                    this.castleRookHighlight = null;
                    this.updateUI();
                }
            }
        }
        loadChessFont() {
            if (this.fontLoaded) return;
            const style = document.createElement('style');
            style.textContent = `
                @font-face {
                    font-family: 'ChessMerida';
                    src: url('https://rawcdn.githack.com/xeyownt/chess_merida_unicode/refs/heads/master/chess_merida_unicode.ttf') format('truetype');
                }
            `;
            document.head.appendChild(style);
            this.fontLoaded = true;
        }
        initializeBoard() {
            this.game.reset('w');
            this.isBoardInitialized = true;
            this.updateUI();
        }
        showBoard() { if (this.overlay) this.overlay.style.visibility = 'visible'; }
        hideBoard() { if (this.overlay) this.overlay.style.visibility = 'hidden'; }
        initializeDetector() { return this.isBoardInitialized; }
        setBoardPosition(args) { this.position = args.POSITION; this.updateLayout(); }
        setBoardSize(args) { this.boardSize = args.SIZE; this.updateLayout(); }
        setCustomBoardSize(args) { this.boardSize = 'custom'; this.customSize = Number(args.SIZE); this.updateLayout(); }
        toggleBoardInteractivity(args) { this.isInteractive = args.INTERACTIVE === 'true'; }
        setPerspective(args) {
            this.flipped = args.PERSPECTIVE === 'black';
            this.updateUI();
        }
        setTileColor(args) {
            if (args.TYPE === 'light') this.lightTileColor = args.COLOR;
            else this.darkTileColor = args.COLOR;
            this.updateUI();
        }
        setPieceStyle(args) {
            this.pieceStyle = args.STYLE;
            if (this.pieceStyle === 'icons') this.loadChessFont();
            this.updateUI();
        }
        makeMove(args) {
            const moveStr = args.MOVE;
            const moves = this.game.getValidMoves(true);
            const moveIndex = moves.indexOf(moveStr);
            if (moveIndex !== -1) {
                const moveObj = this.game.getValidMoves()[moveIndex];
                if (this.tweenEnabled) {
                    return new Promise(resolve => {
                        this.animatePiece(moveObj.fromR, moveObj.fromC, moveObj.toR, moveObj.toC, () => {
                            this.game.move(moveStr);
                            this.selectedSquare = null;
                            this.possibleMoveHighlights = [];
                            this.castleRookHighlight = null;
                            this.updateUI();
                            resolve();
                        });
                    });
                } else {
                    this.game.move(moveStr);
                    this.selectedSquare = null;
                    this.possibleMoveHighlights = [];
                    this.castleRookHighlight = null;
                    this.updateUI();
                }
            }
        }
        isValidMove(args) {
            const valid = this.game.getValidMoves(true);
            return valid.includes(args.MOVE);
        }
        getFEN() { return this.game.getFEN(); }
        setFEN(args) {
            const success = this.game.loadFEN(args.FEN);
            if (success) this.updateUI();
        }
        analyzeChessPosition(args) {
            let fen = args.FEN;
            if (fen === 'current') fen = this.game.getFEN();
            const payload = {
                fen: fen,
                variants: Number(args.VARIANTS) || 1,
                depth: Number(args.DEPTH) || 12,
                maxThinkingTime: Number(args.MAX_THINKING_TIME) || 50,
            };
            if (args.SEARCH_MOVES && args.SEARCH_MOVES.trim() !== '') {
                payload.searchmoves = args.SEARCH_MOVES;
            }
            return Scratch.fetch("https://chess-api.com/v1", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload),
            })
            .then(response => response.text())
            .catch(error => JSON.stringify({ error: "API Error: " + error.message }));
        }
        isCheck() { return this.game.isKingInCheck(this.game.turn); }
        isKingInCheckNew(args) { return this.game.isKingInCheck(args.COLOR); }
        getGameStatus() { return this.game.getGameState(); }
        isGameOver() { return this.game.getGameState() !== 'active'; }
        getValidMoves() { return this.game.getValidMoves(true).join(','); }
        getPieceAt(args) {
            const coords = this.game.algToCoords(args.SQUARE);
            const p = this.game.board[coords[0]][coords[1]];
            return p === '.' ? '' : p;
        }
        getTurn() { return this.game.turn; }
        getSanForMove(gameState, moveObj) {
            if (moveObj.castle === 'k') return "O-O";
            if (moveObj.castle === 'q') return "O-O-O";
            const piece = gameState.board[moveObj.fromR][moveObj.fromC];
            const pieceType = piece.toUpperCase();
            const dest = gameState.coordsToAlg(moveObj.toR, moveObj.toC);
            const isCapture = moveObj.isCapture;
            if (pieceType === 'P') {
                let san = "";
                if (isCapture) {
                    san += gameState.coordsToAlg(moveObj.fromR, moveObj.fromC)[0];
                    san += "x";
                }
                san += dest;
                if (moveObj.promotion) san += "=" + moveObj.promotion.toUpperCase();
                return san;
            }
            let san = pieceType;
            const allMoves = gameState.getValidMoves();
            const candidates = allMoves.filter(m =>
                m.toR === moveObj.toR &&
                m.toC === moveObj.toC &&
                (m.fromR !== moveObj.fromR || m.fromC !== moveObj.fromC) &&
                gameState.board[m.fromR][m.fromC] === piece
            );
            if (candidates.length > 0) {
                const sameFile = candidates.some(m => m.fromC === moveObj.fromC);
                const sameRank = candidates.some(m => m.fromR === moveObj.fromR);
                const fromAlg = gameState.coordsToAlg(moveObj.fromR, moveObj.fromC);
                if (!sameFile) san += fromAlg[0];
                else if (!sameRank) san += fromAlg[1];
                else san += fromAlg;
            }
            if (isCapture) san += "x";
            san += dest;
            return san;
        }
        getPGN() {
            const tempGame = new ChessLogic();
            let pgn = "";
            const history = this.game.history;
            for (let i = 0; i < history.length; i++) {
                const moveStr = history[i];
                const validMoves = tempGame.getValidMoves();
                const moveObj = validMoves.find(m => {
                    let str = tempGame.coordsToAlg(m.fromR, m.fromC) + tempGame.coordsToAlg(m.toR, m.toC);
                    if (m.promotion) str += m.promotion;
                    return str === moveStr;
                });
                if (!moveObj) break;
                let san = this.getSanForMove(tempGame, moveObj);
                tempGame.makeMoveInternal(moveObj);
                if (tempGame.isKingInCheck(tempGame.turn)) {
                    if (tempGame.getValidMoves().length === 0) san += "#";
                    else san += "+";
                }
                if (i % 2 === 0) pgn += `${(i/2 + 1)}. ${san} `;
                else pgn += `${san} `;
            }
            let result = "*";
            const status = this.game.getGameState();
            if (status === "checkmate") result = this.game.turn === "w" ? "0-1" : "1-0";
            else if (['stalemate', 'threefold_repetition', 'fifty_move_rule', 'insufficient_material'].includes(status)) result = "1/2-1/2";
            return (pgn.trim() + " " + result).trim();
        }
        getPieceColorAtSquare(args) {
            const coords = this.game.algToCoords(args.SQUARE);
            if (!coords || coords[0] < 0 || coords[0] > 7 || coords[1] < 0 || coords[1] > 7) {
                return '';
            }
            const piece = this.game.board[coords[0]][coords[1]];
            const color = this.game.getColor(piece);
            return color === 'w' ? 'w' : (color === 'b' ? 'b' : '');
        }

        getPieceCount(args) {
            let count = 0;
            for(let r=0; r<8; r++) {
                for(let c=0; c<8; c++) {
                    const p = this.game.board[r][c];
                    if (p === '.') continue;
                    const pColor = this.game.getColor(p);
                    const pType = p.toLowerCase();
                    if (args.COLOR !== 'all' && pColor !== args.COLOR) continue;
                    if (args.PIECE_TYPE !== 'all' && pType !== args.PIECE_TYPE) continue;
                    count++;
                }
            }
            return count;
        }
        getMaterialScore(args) {
            const val = { 'p':1, 'n':3, 'b':3, 'r':5, 'q':9, 'k':0 };
            let score = 0;
            for(let r=0; r<8; r++) {
                for(let c=0; c<8; c++) {
                    const p = this.game.board[r][c];
                    if (p !== '.') {
                        const v = val[p.toLowerCase()] || 0;
                        if (this.game.getColor(p) === args.COLOR) score += v;
                    }
                }
            }
            return score;
        }
        getAttackersOfSquare(args) {
            const coords = this.game.algToCoords(args.SQUARE);
            const r = coords[0], c = coords[1];
            const color = args.COLOR;
            let attackers = [];
            for(let br=0; br<8; br++) {
                for(let bc=0; bc<8; bc++) {
                    const p = this.game.board[br][bc];
                    if (this.game.getColor(p) === color) {
                        const moves = this.game.generateMovesForSquare(br, bc);
                        if (moves.some(m => m.toR === r && m.toC === c)) {
                            attackers.push(this.game.coordsToAlg(br, bc));
                        }
                    }
                }
            }
            return attackers.join(',');
        }
        getPieceMoves(args) {
            const coords = this.game.algToCoords(args.SQUARE);
            const moves = this.game.generateMovesForSquare(coords[0], coords[1]);
            const legalMoves = moves.filter(m => {
                const tempState = this.game.clone();
                tempState.makeMoveInternal(m);
                return !tempState.isKingInCheck(this.game.turn);
            });
            return legalMoves.map(m => this.game.coordsToAlg(m.toR, m.toC)).join(',');
        }
        getPositionScore() {
            const w = this.getMaterialScore({COLOR: 'w'});
            const b = this.getMaterialScore({COLOR: 'b'});
            return w - b;
        }
        getMoveHistory() { return this.game.history.join(','); }
        getCapturedPieces(args) {
            const color = args.COLOR;
            const capturedColor = color === 'w' ? 'b' : 'w';
            const pieceNames = { 'p': 'pawn', 'n': 'knight', 'b': 'bishop', 'r': 'rook', 'q': 'queen' };
            const initialPiecesList = {
                'w': ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
                'b': ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p']
            };
            const initialPieces = initialPiecesList[capturedColor].slice();
            const kingPiece = capturedColor === 'w' ? 'K' : 'k';
            const kingIndex = initialPieces.indexOf(kingPiece);
            if (kingIndex > -1) {
                initialPieces.splice(kingIndex, 1);
            }
            const currentPieces = [];
            for (let r = 0; r < 8; r++) {
                for (let c = 0; c < 8; c++) {
                    const piece = this.game.board[r][c];
                    if (this.game.getColor(piece) === capturedColor) {
                        currentPieces.push(piece);
                    }
                }
            }
            const capturedPieceChars = initialPieces;
            for (const piece of currentPieces) {
                const index = capturedPieceChars.indexOf(piece);
                if (index > -1) {
                    capturedPieceChars.splice(index, 1);
                }
            }
            return JSON.stringify(capturedPieceChars.map(p => pieceNames[p.toLowerCase()]));
        }

        setBoardPositionNew(args) { this.position = args.POSITION; this.updateLayout(); }

        isKingInCheckNewNew(args) {
            const colorMap = { 'white': 'w', 'black': 'b' };
            return this.game.isKingInCheck(colorMap[args.COLOR] || args.COLOR);
        }

        getPieceCountNew(args) {
            const colorMap = { 'white': 'w', 'black': 'b' };
            const pieceMap = { 'pawn': 'p', 'knight': 'n', 'bishop': 'b', 'rook': 'r', 'queen': 'q', 'king': 'k', 'all': 'all' };
            const mappedArgs = {
                COLOR: colorMap[args.COLOR] || args.COLOR,
                PIECE_TYPE: pieceMap[args.PIECE_TYPE] || args.PIECE_TYPE
            };
            return this.getPieceCount(mappedArgs);
        }

        getMaterialScoreNew(args) {
            const colorMap = { 'white': 'w', 'black': 'b' };
            const mappedArgs = {
                COLOR: colorMap[args.COLOR] || args.COLOR
            };
            return this.getMaterialScore(mappedArgs);
        }

        getCapturedPiecesNew(args) {
            const colorMap = { 'white': 'w', 'black': 'b' };
            const mappedArgs = {
                COLOR: colorMap[args.COLOR] || args.COLOR
            };
            return this.getCapturedPieces(mappedArgs);
        }
    }
    Scratch.extensions.register(new ChessExtension());
})(Scratch);
