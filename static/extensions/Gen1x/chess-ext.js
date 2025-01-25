(function(Scratch) {
	"use strict";
	if (!Scratch.extensions.unsandboxed) {
		throw new Error("Chess Extension must run unsandboxed!")
	}
	class ChessExtension {
		constructor(runtime) {
			this.runtime = runtime;
			this.chess = null;
			this.board = null;
			this.loaded = false;
			this.settings = {
				position: 'center',
				size: 'large',
				customSize: null,
				interactive: true
			};
		}

		_createBoardElement() {
			if (this.wrapperElement) return;

			this.wrapperElement = document.createElement('div');
			this.wrapperElement.style.position = 'fixed';
			this.wrapperElement.style.display = 'none';
			this.wrapperElement.style.zIndex = '9999';

			const boardContainer = document.createElement('div');

			const boardSize = Scratch.vm.runtime.stageHeight;

			boardContainer.style.width = boardSize + 'px';
			boardContainer.style.height = boardSize + 'px';
			boardContainer.style.position = 'relative';
			boardContainer.style.pointerEvents = 'auto';

			this.boardElement = document.createElement('div');
			this.boardElement.id = 'chess-board';
			this.boardElement.style.width = '100%';
			this.boardElement.style.height = '100%';
			this.boardElement.style.position = 'relative';
			this.boardElement.style.pointerEvents = 'auto';

			boardContainer.appendChild(this.boardElement);
			this.wrapperElement.appendChild(boardContainer);

			document.body.appendChild(this.wrapperElement);
			Scratch.vm.renderer.addOverlay(this.wrapperElement, "scale");
		}

		_updateBoardPosition() {
			if (!this.wrapperElement) return;

			this.wrapperElement.style.top = '';
			this.wrapperElement.style.bottom = '';
			this.wrapperElement.style.left = '';
			this.wrapperElement.style.right = '';
			this.wrapperElement.style.transform = '';

			switch (this.settings.position) {
				case 'center':
					this.wrapperElement.style.top = '50%';
					this.wrapperElement.style.left = '50%';
					this.wrapperElement.style.transform = 'translate(-50%, -50%)';
					break;
				case 'topleft':
					this.wrapperElement.style.top = '10px';
					this.wrapperElement.style.left = '10px';
					break;
				case 'topright':
					this.wrapperElement.style.top = '10px';
					this.wrapperElement.style.right = '10px';
					break;
				case 'bottomleft':
					this.wrapperElement.style.bottom = '10px';
					this.wrapperElement.style.left = '10px';
					break;
				case 'bottomright':
					this.wrapperElement.style.bottom = '10px';
					this.wrapperElement.style.right = '10px';
					break;
			}
		}

		_updateBoardSize() {
			if (!this.wrapperElement) return;

			const stageHeight = Scratch.vm.runtime.stageHeight;
			const windowWidth = window.innerWidth;
			const windowHeight = window.innerHeight;

			const availableSpace = Math.min(
				stageHeight,
				windowWidth,
				windowHeight
			);

			let size;

			switch (this.settings.size) {
				case 'small':
					size = availableSpace * 0.4;
					break;
				case 'medium':
					size = availableSpace * 0.6;
					break;
				case 'large':
					size = availableSpace * 0.8;
					break;
				case 'full':
					size = availableSpace;
					break;
				case 'custom':
					size = Math.min(
						this.settings.customSize || availableSpace * 0.6,
						availableSpace
					);
					break;
				default:
					size = availableSpace * 0.6;
			}

			size = Math.min(size, availableSpace);

			this.wrapperElement.firstChild.style.width = size + 'px';
			this.wrapperElement.firstChild.style.height = size + 'px';

			if (this.board) {
				this.board.resize();
			}
		}

		async initializeBoard() {
			try {
				this.loaded = false;
				await this._loadLibraries();

				if (!this.wrapperElement) {
					this._createBoardElement();
				}

				this.chess = new Chess();

				if (this.board) {
					this.board.destroy();
				}

				this.wrapperElement.style.display = 'block';

				if (!window.jQuery) {
					throw new Error('jQuery not loaded');
				}

				const config = {
					position: 'start',
					pieceTheme: 'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png',
					draggable: true,
					onDragStart: (source, piece, position, orientation) => this._onDragStart(source, piece, position, orientation),
					onDrop: (source, target) => this._onDrop(source, target),
					onSnapEnd: () => this._onSnapEnd()
				};

				setTimeout(() => {
					this.board = Chessboard(this.boardElement.id, config);
					this.toggleBoardInteractivity({
						INTERACTIVE: this.settings.interactive ? 'true' : 'false'
					});
					this.loaded = true;
				}, 100);

				window.addEventListener('resize', () => {
					if (this.board) {
						this._updateBoardSize();
						this.board.resize();
					}
				});

				return 'Chess game initialized';
			} catch (error) {
				console.error('Chess initialization error:', error);
				return 'Failed to initialize chess game: ' + error.message;
			}
		}

		removeHighlights() {
			$('#chess-board .square-55d63').removeClass('highlight-white');
			$('#chess-board .square-55d63').removeClass('highlight-black');
		}

		highlightSquare(square) {
			if (!this.chess) return;

			const moves = this.chess.moves({
				square: square,
				verbose: true
			});

			if (moves.length === 0) return;

			const $square = $('#chess-board .square-' + square);
			const background = $square.hasClass('black-3c85d') ? 'highlight-black' : 'highlight-white';
			$square.addClass(background);

			moves.forEach((move) => {
				const $square = $('#chess-board .square-' + move.to);
				const background = $square.hasClass('black-3c85d') ? 'highlight-black' : 'highlight-white';
				$square.addClass(background);
			});
		}

		_onDragStart(source, piece, position, orientation) {
			console.log("WE'RE DRAGGING STUFFFFFF")
			if (!this.chess) return false;

			if (this.chess.game_over()) return false;

			if ((this.chess.turn() === 'w' && piece.search(/^b/) !== -1) ||
				(this.chess.turn() === 'b' && piece.search(/^w/) !== -1)) {
				return false;
			}

			return true;
		}

		_onDrop(source, target) {
			if (!this.chess) return 'snapback';

			try {
				const move = this.chess.move({
					from: source,
					to: target,
					promotion: 'q'
				});

				if (move === null) return 'snapback';
				return;
			} catch (e) {
				return 'snapback';
			}
		}

		_onSnapEnd() {
			if (this.board && this.chess) {
				this.board.position(this.chess.fen());
			}
		}

		getInfo() {
			return {
				id: 'chessG1nX',
				name: 'Chess Extension',
				color1: '#B58863',
				docsURI: "https://hackmd.io/@vBTXv9pwQ3GoeueFKGElEw/chess-ext-docs",
				blocks: [{
						opcode: 'initializeBoard',
						blockType: 'command',
						text: 'initialize new chess game'
					},
					{
						opcode: 'showBoard',
						blockType: 'command',
						text: 'show chess board'
					},
					{
						opcode: 'hideBoard',
						blockType: 'command',
						text: 'hide chess board'
					},
					{
						opcode: 'initializeDetector',
						blockType: 'Boolean',
						text: 'has the board loaded yet?',
					},
					'---',
					{
						opcode: 'setBoardPosition',
						blockType: 'command',
						text: 'set board position to [POSITION]',
						arguments: {
							POSITION: {
								type: 'string',
								menu: 'positionMenu',
								defaultValue: 'center'
							}
						}
					},
					{
						opcode: 'setBoardSize',
						blockType: 'command',
						text: 'set board size to [SIZE]',
						arguments: {
							SIZE: {
								type: 'string',
								menu: 'sizeMenu',
								defaultValue: 'medium'
							}
						}
					},
					{
						opcode: 'setCustomBoardSize',
						blockType: 'command',
						text: 'set custom board size to [SIZE] pixels',
						arguments: {
							SIZE: {
								type: 'number',
								defaultValue: 300
							}
						}
					},
					{
						opcode: 'toggleBoardInteractivity',
						blockType: 'command',
						text: 'set board interactivity to [INTERACTIVE]',
						arguments: {
							INTERACTIVE: {
								type: 'string',
								menu: 'interactivityMenu',
								defaultValue: 'true'
							}
						}
					},
					'---',
					{
						opcode: 'makeMove',
						blockType: 'command',
						text: 'make move [MOVE]',
						arguments: {
							MOVE: {
								type: 'string',
								defaultValue: 'e2e4'
							}
						}
					},
					{
						opcode: 'isValidMove',
						blockType: 'Boolean',
						text: 'is [MOVE] valid?',
						arguments: {
							MOVE: {
								type: 'string',
								defaultValue: 'e2e4'
							}
						}
					},
					'---',
					{
						opcode: 'getFEN',
						blockType: 'reporter',
						text: 'get FEN position'
					},
					{
						opcode: 'setFEN',
						blockType: 'command',
						text: 'set board to FEN [FEN]',
						arguments: {
							FEN: {
								type: 'string',
								defaultValue: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
							}
						}
					},
					'---',
					{
						opcode: 'analyzeChessPosition',
						blockType: 'reporter',
						text: 'analyze chess position [FEN] with variants [VARIANTS] depth [DEPTH] max time [MAX_THINKING_TIME] search moves [SEARCH_MOVES]',
						arguments: {
							FEN: {
								type: 'string',
								defaultValue: 'current'
							},
							VARIANTS: {
								type: 'number',
								defaultValue: 1
							},
							DEPTH: {
								type: 'number',
								defaultValue: 12
							},
							MAX_THINKING_TIME: {
								type: 'number',
								defaultValue: 50
							},
							SEARCH_MOVES: {
								type: 'string',
								defaultValue: ''
							}
						}
					},
					'---',
					{
						opcode: 'isCheck',
						blockType: 'Boolean',
						text: 'is king in check?'
					},
					{
						opcode: 'isGameOver',
						blockType: 'Boolean',
						text: 'is game over?'
					},
					{
						opcode: 'getValidMoves',
						blockType: 'reporter',
						text: 'get all valid moves'
					},
					{
						opcode: 'getPieceAt',
						blockType: 'reporter',
						text: 'get piece at [SQUARE]',
						arguments: {
							SQUARE: {
								type: 'string',
								defaultValue: 'e4'
							}
						}
					},
					{
						opcode: 'getTurn',
						blockType: 'reporter',
						text: 'whose turn? (w/b)'
					},
					'---',
					{
						opcode: 'getPGN',
						blockType: 'reporter',
						text: 'get game PGN'
					},
					'---',
					{
						opcode: 'getPieceCount',
						blockType: 'reporter',
						text: 'count of [PIECE_TYPE] pieces for [COLOR]',
						arguments: {
							PIECE_TYPE: {
								type: 'string',
								menu: 'pieceTypeMenu',
								defaultValue: 'all'
							},
							COLOR: {
								type: 'string',
								menu: 'colorMenu',
								defaultValue: 'w'
							}
						}
					},
					{
						opcode: 'getMaterialScore',
						blockType: 'reporter',
						text: 'material score for [COLOR]',
						arguments: {
							COLOR: {
								type: 'string',
								menu: 'colorMenu',
								defaultValue: 'w'
							}
						}
					},
					{
						opcode: 'getAttackersOfSquare',
						blockType: 'reporter',
						text: 'attackers of square [SQUARE] by [COLOR]',
						arguments: {
							SQUARE: {
								type: 'string',
								defaultValue: 'e4'
							},
							COLOR: {
								type: 'string',
								menu: 'colorMenu',
								defaultValue: 'w'
							}
						}
					},
					{
						opcode: 'getPieceMoves',
						blockType: 'reporter',
						text: 'valid moves for piece at [SQUARE]',
						arguments: {
							SQUARE: {
								type: 'string',
								defaultValue: 'e2'
							}
						}
					},
					{
						opcode: 'getPositionScore',
						blockType: 'reporter',
						text: 'position evaluation score'
					},
					{
						opcode: 'getMoveHistory',
						blockType: 'reporter',
						text: 'get move history'
					}
				],
				menus: {
					positionMenu: {
						acceptReporters: false,
						items: ['center', 'topleft', 'topright', 'bottomleft', 'bottomright']
					},
					sizeMenu: {
						acceptReporters: false,
						items: ['small', 'medium', 'large', 'full']
					},
					pieceTypeMenu: {
						acceptReporters: false,
						items: ['all', 'p', 'n', 'b', 'r', 'q', 'k']
					},
					colorMenu: {
						acceptReporters: false,
						items: ['w', 'b']
					},
					interactivityMenu: {
						items: ['true', 'false']
					}
				}
			};
		}

		initializeDetector() {
			return this.loaded;
		}

		getPGN() {
			if (!this.chess) return '';
			return this.chess.pgn({
				maxWidth: 80,
				newline: '\n',
				showHeaders: true
			});
		}

		setFEN({
			FEN
		}) {
			if (!this.chess || !this.board) {
				return false;
			}

			try {
				const tempChess = new Chess(FEN);
				this.chess = tempChess;
				this.board.position(FEN);
			} catch (error) {
				console.error('Invalid FEN:', error);
				return false;
			}
		}

		toggleBoardInteractivity({
			INTERACTIVE
		}) {

			const isInteractive = INTERACTIVE === 'true';

			this.settings.interactive = isInteractive;

			if (this.boardElement) {
				const tempBoardDiv = document.querySelector('.board-b72b1');

				if (isInteractive) {
					tempBoardDiv.style.pointerEvents = 'auto';
				} else {
					tempBoardDiv.style.pointerEvents = 'none';
				}
			}

			return true;
		}

		async analyzeChessPosition({
			FEN,
			VARIANTS = 1,
			DEPTH = 12,
			MAX_THINKING_TIME = 50,
			SEARCH_MOVES = ''
		}) {

			let positionToAnalyze = FEN;

			if (FEN === 'current') {
				if (this.chess) {
					positionToAnalyze = this.chess.pgn({
						maxWidth: 80,
						newline: '\n',
						showHeaders: true
					});
				} else {

					positionToAnalyze = '';
				}
			}

			try {
				const response = await Scratch.fetch("https://chess-api.com/v1", {
					"headers": {
						"Content-Type": "application/json",
					},
					"body": JSON.stringify({
						variants: Math.max(1, Math.min(5, VARIANTS)),
						depth: Math.max(1, Math.min(18, DEPTH)),
						maxThinkingTime: Math.max(10, Math.min(100, MAX_THINKING_TIME)),
						searchmoves: SEARCH_MOVES,
						input: positionToAnalyze || '<div></div>'
					}),
					"method": "POST",
				});

				if (!response.ok) {
					return 'API request failed';
				}

				const data = await response.json();
				return JSON.stringify(data);
			} catch (error) {
				console.error('Chess API Error:', error);
				return 'Error analyzing position: ' + error.message;
			}
		}

		_isValidFEN(fen) {
			try {
				const tempChess = new Chess(fen);
				return true;
			} catch (error) {
				return false;
			}
		}

		getPieceValue(type) {
			return this.pieceValues[type] || 0;
		}

		getPieceCount({
			PIECE_TYPE,
			COLOR
		}) {
			if (!this.chess) return 0;

			let count = 0;
			const board = this.chess.board();

			for (let row of board) {
				for (let square of row) {
					if (square) {
						if (square.color === COLOR &&
							(PIECE_TYPE === 'all' || square.type === PIECE_TYPE)) {
							count++;
						}
					}
				}
			}

			return count;
		}

		_getPieceValue(pieceType) {
			if (!pieceType) return 0;

			const pieceValues = {
				p: 1,
				n: 3,
				b: 3,
				r: 5,
				q: 9,
				k: 0
			};

			return pieceValues[pieceType.toLowerCase()] || 0;
		}

		getMaterialScore({
			COLOR
		}) {
			if (!this.chess) return 0;

			let score = 0;
			const board = this.chess.board();

			for (let row of board) {
				for (let square of row) {
					if (square && square.color === COLOR) {
						score += this._getPieceValue(square.type);
					}
				}
			}

			return score;
		}

		getAttackersOfSquare({
			SQUARE,
			COLOR
		}) {
			if (!this.chess) return '[]';

			const attackers = [];
			const board = this.chess.board();

			const moves = this.chess.moves({
				verbose: true
			});
			for (let move of moves) {
				if (move.to === SQUARE && this.chess.get(move.from).color === COLOR) {
					attackers.push(move.from);
				}
			}

			return JSON.stringify(attackers);
		}

		getPieceMoves({
			SQUARE
		}) {
			if (!this.chess) return '[]';

			const moves = this.chess.moves({
				square: SQUARE,
				verbose: true
			});

			return JSON.stringify(moves.map(move => move.to));
		}

		getPositionScore() {
			if (!this.chess) return 0;

			const whiteMaterial = this.getMaterialScore({
				COLOR: 'w'
			});
			const blackMaterial = this.getMaterialScore({
				COLOR: 'b'
			});

			return whiteMaterial - blackMaterial;
		}

		getMoveHistory() {
			if (!this.chess) return '[]';
			return JSON.stringify(this.chess.history());
		}

		showBoard() {
			if (this.wrapperElement) {
				this.wrapperElement.style.display = 'block';
				if (this.board) {
					setTimeout(() => this.board.resize(), 0);
				}
			}
		}

		hideBoard() {
			if (this.wrapperElement) {
				this.wrapperElement.style.display = 'none';
			}
		}

		makeMove({
			MOVE
		}) {
			if (!this.chess || !this.board) return false;

			try {

				const cleanMove = MOVE.trim();

				let result = this.chess.move(cleanMove, {
					sloppy: true
				});

				if (!result && cleanMove.length === 4) {
					result = this.chess.move({
						from: cleanMove.substring(0, 2),
						to: cleanMove.substring(2, 4),
						promotion: 'q'
					});
				}

				if (result) {
					const newPosition = this.chess.fen();
					this.board.position(newPosition, false);
					return true;
				}

				return false;
			} catch (e) {
				console.error('Move error:', e);
				return false;
			}
		}

		isValidMove({
			MOVE
		}) {
			if (!this.chess) return false;
			try {

				const cleanMove = MOVE.trim();

				let move = this.chess.move(cleanMove, {
					sloppy: true
				});

				if (!move && cleanMove.length === 4) {
					move = this.chess.move({
						from: cleanMove.substring(0, 2),
						to: cleanMove.substring(2, 4)
					});
				}

				if (move) {
					this.chess.undo();
					return true;
				}
				return false;
			} catch (e) {
				return false;
			}
		}

		getFEN() {
			return this.chess ? this.chess.fen() : 'Board not initialized';
		}

		isCheck() {
			return this.chess ? this.chess.in_check() : false;
		}

		isGameOver() {
			return this.chess ? this.chess.game_over() : false;
		}

		getValidMoves() {
			if (!this.chess) return '[]';
			return JSON.stringify(this.chess.moves());
		}

		getPieceAt({
			SQUARE
		}) {
			if (!this.chess) return 'none';
			const piece = this.chess.get(SQUARE);
			return piece ? `${piece.color}${piece.type}` : 'none';
		}

		getTurn() {
			return this.chess ? this.chess.turn() : 'w';
		}

		setBoardPosition({
			POSITION
		}) {
			this.settings.position = POSITION;
			this._updateBoardPosition();
		}

		setBoardSize({
			SIZE
		}) {
			this.settings.size = SIZE;
			this.settings.customSize = null;
			this._updateBoardSize();
		}

		setCustomBoardSize({
			SIZE
		}) {
			this.settings.size = 'custom';
			this.settings.customSize = Math.max(100, Math.min(Scratch.Cast.toNumber(SIZE), Scratch.vm.runtime.stageHeight))
			this._updateBoardSize();
		}

		_cleanup() {
			if (this.board) {
				this.board.destroy();
				this.board = null;
			}
			if (this.chess) {
				this.chess = null;
			}
		}

		_loadLibraries() {
			return new Promise((resolve, reject) => {
				if (window.Chess && window.Chessboard) {
					resolve();
					return;
				}

				const css = document.createElement('link');
				css.rel = 'stylesheet';
				css.href = 'https://unpkg.com/@chrisoakman/chessboardjs@1.0.0/dist/chessboard-1.0.0.min.css';
				document.head.appendChild(css);

				Promise.all([
						new Promise((resolveScript, rejectScript) => {
							const script = document.createElement('script');
							script.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
							script.onload = resolveScript;
							script.onerror = () => rejectScript(new Error(`Failed to load script: ${script.src}`));
							document.head.appendChild(script);
						}),

						new Promise((resolveScript, rejectScript) => {
							const script = document.createElement('script');
							script.src = 'https://cdnjs.cloudflare.com/ajax/libs/chess.js/0.10.3/chess.min.js';
							script.onload = resolveScript;
							script.onerror = () => rejectScript(new Error(`Failed to load script: ${script.src}`));
							document.head.appendChild(script);
						})
					])
					.then(() => {
						return new Promise((resolveScript, rejectScript) => {
							const script = document.createElement('script');
							script.src = 'https://unpkg.com/@chrisoakman/chessboardjs@1.0.0/dist/chessboard-1.0.0.min.js';
							script.onload = () => setTimeout(resolveScript, 200);
							script.onerror = () => rejectScript(new Error(`Failed to load script: ${script.src}`));
							document.head.appendChild(script);
						});
					})
					.then(resolve)
					.catch((error) => {
						console.error('Script loading error:', error.message);
						reject(error);
					});
			});
		}
	}

	Scratch.extensions.register(new ChessExtension());
})(Scratch);
