// Name: Performance
// ID: dillonPerformance
// Description: Check performance metrics of the current project.
// By: DillonRGaming
// Licence: MIT


(function(Scratch) {
    'use strict';

    const svgIcon = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTkxIiBoZWlnaHQ9IjU5MSIgdmlld0JveD0iMCAwIDU5MSA1OTEiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxjaXJjbGUgY3g9IjI5NS41IiBjeT0iMjk1LjUiIHI9IjI4MiIgZmlsbD0iIzM5NjdGRiIgc3Ryb2tlPSIjMUQ0NUNCIiBzdHJva2Utd2lkdGg9IjI3Ii8+CjxwYXRoIGQ9Ik04NiAyNTdMMTkxLjEyMiAzNjIuMTIyQzE5NC42MjMgMzY1LjYyMyAyMDAuMjk0IDM2NS42MzkgMjAzLjgxNSAzNjIuMTU4TDI1NC4yMjUgMzEyLjMwNkMyNTYuMTggMzEwLjM3MiAyNTkuMzMxIDMxMC4zOCAyNjEuMjc2IDMxMi4zMjVMMzQ2LjUwOSAzOTcuNTU5QzM1MS41ODYgNDAyLjYzNiAzNTkuODE3IDQwMi42MzYgMzY0Ljg5NCAzOTcuNTU5TDUwNS40NTMgMjU3IiBzdHJva2U9IiNDMEMwQzAiIHN0cm9rZS13aWR0aD0iNjAiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8cGF0aCBkPSJNODYgMjU3TDE5MS4xMjIgMzYyLjEyMkMxOTQuNjIzIDM2NS42MjMgMjAwLjI5NCAzNjUuNjM5IDIwMy44MTUgMzYyLjE1OEwyNTQuMjI1IDMxMi4zMDZDMjU2LjE4IDMxMC4zNzIgMjU5LjMzMSAzMTAuMzggMjYxLjI3NiAzMTIuMzI1TDM0Ni41MDkgMzk3LjU1OUMzNTEuNTg2IDQwMi42MzYgMzU5LjgxNyA0MDIuNjM2IDM2NC44OTQgMzk3LjU1OUw1MDUuNDUzIDI1NyIgc3Ryb2tlPSIjRDlEOUQ5IiBzdHJva2Utd2lkdGg9IjMwIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPC9zdmc+Cg==";

    const vm = Scratch.vm;
    let runtime = vm ? vm.runtime : null;

    if (!runtime) {
        runtime = {
            targets: [],
            currentStepTime: 1000 / 30,
            stageWidth: 480,
            stageHeight: 360,
            threads: [],
            on: () => {},
            removeListener: () => {},
            emit: () => {},
            profiler: null,
            getSpriteTargetByName: (name) => runtime.targets.find(t => t.isSprite && t.getName() === name),
            getTargetForStage: () => runtime.targets.find(t => t.isStage),
            renderer: { constructor: { name: 'StubRenderer'}},
            audioEngine: { inputデバイス: null },
            ioDevices: {
                mouse: { getScratchX: () => 0, getScratchY: () => 0, getButtonIsDown: () => false }
            },
            projectTimer: { getProjectTimer: () => 0, startTime: performance.now(), reset: () => {} },
            extensions: {}
        };
    }

    const MAX_FPS_HISTORY_SECONDS = 60;

    class PerformanceMonitor {
        constructor(passedRuntime) {
            this.runtime = passedRuntime;
            if (this.runtime && !this.runtime.extensions) {
                this.runtime.extensions = {};
            }
            if (this.runtime) {
                this.runtime.extensions.performance_instance = this;
            }

            this.fps = 0;
            this.lastFrameTime = performance.now();
            this.frameCount = 0;
            this.lastFpsUpdateTime = performance.now();
            this.renderTime = 0;
            this.projectStartTime = this.runtime && this.runtime.projectTimer ? (this.runtime.projectTimer.startTime || performance.now()) : performance.now();
            this.lastFlagPressTime = 0;

            this.collisionChecksPerCurrentSecond = 0;
            this.reportedCollisionChecksPerSecond = 0;

            this.recentFpsValues = [];
            this.maxFpsHistoryLength = MAX_FPS_HISTORY_SECONDS;

            if (this.runtime && typeof this.runtime.on === 'function') {
                this.runtime.on('BEFORE_EXECUTE', this._updateMetrics.bind(this));
                this.runtime.on('PROJECT_START', this._handleGreenFlag.bind(this));
                this.runtime.on('GREEN_FLAG', this._handleGreenFlag.bind(this));
            } else {
                setInterval(() => this._updateMetrics(), 1000 / 30);
            }
            if (this.runtime && this.runtime.projectTimer && typeof this.runtime.projectTimer.reset === 'function') {
                const originalReset = this.runtime.projectTimer.reset;
                this.runtime.projectTimer.reset = (...args) => {
                    this._handleGreenFlag();
                    return originalReset.apply(this.runtime.projectTimer, args);
                };
            }
        }

        _updateMetrics() {
            const now = performance.now();
            const delta = now - this.lastFrameTime;
            this.lastFrameTime = now;
            this.renderTime = delta;

            this.frameCount++;
            if (now >= this.lastFpsUpdateTime + 1000) {
                this.fps = Math.round((this.frameCount * 1000) / (now - this.lastFpsUpdateTime));
                this.frameCount = 0;
                this.lastFpsUpdateTime = now;

                this.recentFpsValues.push(this.fps);
                if (this.recentFpsValues.length > this.maxFpsHistoryLength) {
                    this.recentFpsValues.shift();
                }

                this.reportedCollisionChecksPerSecond = this.collisionChecksPerCurrentSecond;
                this.collisionChecksPerCurrentSecond = 0;
            }
        }

        _handleGreenFlag() {
            this.lastFlagPressTime = performance.now();
        }

        incrementCollisionChecks() {
            if (this.runtime && this.runtime.isActive && !this.runtime.isEditing) {
                this.collisionChecksPerCurrentSecond++;
            }
        }

        getInfo() {
            return {
                id: 'dillonPerformance',
                name: 'Performance',
                color1: '#3967FF',
                color2: '#1D45CB',
                color3: '#102A7D',
                menuIconURI: svgIcon,
                blockIconURI: svgIcon,
                blocks: [
                    {
                        opcode: 'getFPS',
                        blockType: Scratch.BlockType.REPORTER, blockShape: Scratch.BlockShape.LEAF,
                        text: 'Current FPS', disableMonitor: false
                    },
                    {
                        opcode: 'getAverageFPS',
                        blockType: Scratch.BlockType.REPORTER, blockShape: Scratch.BlockShape.LEAF,
                        text: 'Average FPS over last [DURATION_MENU] seconds',
                        arguments: { DURATION_MENU: { type: Scratch.ArgumentType.STRING, menu: 'fpsDurationMenu', defaultValue: '5' } }
                    },
                    {
                        opcode: 'getLowestFPS',
                        blockType: Scratch.BlockType.REPORTER, blockShape: Scratch.BlockShape.LEAF,
                        text: 'Lowest FPS over last [DURATION_MENU] seconds',
                        arguments: { DURATION_MENU: { type: Scratch.ArgumentType.STRING, menu: 'fpsDurationMenu', defaultValue: '5' } }
                    },
                    {
                        opcode: 'getHighestFPS',
                        blockType: Scratch.BlockType.REPORTER, blockShape: Scratch.BlockShape.LEAF,
                        text: 'Highest FPS over last [DURATION_MENU] seconds',
                        arguments: { DURATION_MENU: { type: Scratch.ArgumentType.STRING, menu: 'fpsDurationMenu', defaultValue: '5' } }
                    },
                    {
                        opcode: 'getLastFrameRenderTime',
                        blockType: Scratch.BlockType.REPORTER, blockShape: Scratch.BlockShape.LEAF,
                        text: 'Last Frame Render Time (ms)',
                    },
                    '---',
                    {
                        opcode: 'getJSMemoryUsage',
                        blockType: Scratch.BlockType.REPORTER, blockShape: Scratch.BlockShape.LEAF,
                        text: 'JS Memory Used / Total (MB)',
                    },
                    {
                        opcode: 'getEstimatedProjectDataSize',
                        blockType: Scratch.BlockType.REPORTER, blockShape: Scratch.BlockShape.LEAF,
                        text: 'Estimated Project Data Size (KB)',
                    },
                    '---',
                    {
                        opcode: 'getTotalBlockCount',
                        blockType: Scratch.BlockType.REPORTER, blockShape: Scratch.BlockShape.LEAF,
                        text: 'Total Blocks in Project',
                    },
                    {
                        opcode: 'getBlockCountForTarget',
                        blockType: Scratch.BlockType.REPORTER, blockShape: Scratch.BlockShape.LEAF,
                        text: 'Blocks in [TARGET_MENU]',
                        arguments: { TARGET_MENU: { type: Scratch.ArgumentType.STRING, menu: 'targetMenu', defaultValue: '_stage_' } }
                    },
                    {
                        opcode: 'getTotalVariableCount',
                        blockType: Scratch.BlockType.REPORTER, blockShape: Scratch.BlockShape.LEAF,
                        text: 'Total Variables (All Targets)',
                    },
                    {
                        opcode: 'getTotalListCount',
                        blockType: Scratch.BlockType.REPORTER, blockShape: Scratch.BlockShape.LEAF,
                        text: 'Total Lists (All Targets)',
                    },
                    {
                        opcode: 'getTotalSpriteCount',
                        blockType: Scratch.BlockType.REPORTER, blockShape: Scratch.BlockShape.LEAF,
                        text: 'Sprite Count (Originals)',
                    },
                    {
                        opcode: 'getTotalCloneCount',
                        blockType: Scratch.BlockType.REPORTER, blockShape: Scratch.BlockShape.LEAF,
                        text: 'Total Active Clones',
                    },
                    {
                        opcode: 'getCloneCountForSprite',
                        blockType: Scratch.BlockType.REPORTER, blockShape: Scratch.BlockShape.LEAF,
                        text: 'Clones of [SPRITE_TARGET_MENU]',
                        arguments: { SPRITE_TARGET_MENU: { type: Scratch.ArgumentType.STRING, menu: 'spriteTargetMenu' } }
                    },
                    '---',
                    {
                        opcode: 'getActiveThreadCount',
                        blockType: Scratch.BlockType.REPORTER, blockShape: Scratch.BlockShape.LEAF,
                        text: 'Active Script Threads', disableMonitor: false
                    },
                    {
                        opcode: 'getCollisionChecksPerSecond',
                        blockType: Scratch.BlockType.REPORTER, blockShape: Scratch.BlockShape.LEAF,
                        text: 'Collision Checks / sec', disableMonitor: false
                    },
                    '---',
                    {
                        opcode: 'getTimeSinceProjectStart',
                        blockType: Scratch.BlockType.REPORTER, blockShape: Scratch.BlockShape.LEAF,
                        text: 'Time Since Project Start (s)',
                    },
                    {
                        opcode: 'getTimeSinceFlagPressed',
                        blockType: Scratch.BlockType.REPORTER, blockShape: Scratch.BlockShape.LEAF,
                        text: 'Time Since Flag Pressed (s)'
                    },
                    '---',
                    {
                        opcode: 'getStageWidth',
                        blockType: Scratch.BlockType.REPORTER, blockShape: Scratch.BlockShape.LEAF,
                        text: 'Stage Width',
                    },
                    {
                        opcode: 'getStageHeight',
                        blockType: Scratch.BlockType.REPORTER, blockShape: Scratch.BlockShape.LEAF,
                        text: 'Stage Height',
                    },
                    {
                        opcode: 'getRendererType',
                        blockType: Scratch.BlockType.REPORTER, blockShape: Scratch.BlockShape.LEAF,
                        text: 'Renderer Type',
                    }
                ],
                menus: {
                    targetMenu: { acceptReporters: true, items: '_getTargetsMenu' },
                    spriteTargetMenu: { acceptReporters: true, items: '_getSpriteTargetsMenu' },
                    fpsDurationMenu: {
                        acceptReporters: false,
                        items: [
                            { text: '5', value: '5' },
                            { text: '10', value: '10' },
                            { text: '30', value: '30' },
                            { text: '60', value: '60' }
                        ]
                    }
                }
            };
        }

        getFPS() { return this.fps; }

        _getFpsHistorySlice(durationSeconds) {
            const count = Math.min(durationSeconds, this.recentFpsValues.length);
            if (count === 0) return [];
            return this.recentFpsValues.slice(-count);
        }

        getAverageFPS(args) {
            const duration = parseInt(args.DURATION_MENU, 10);
            const history = this._getFpsHistorySlice(duration);
            if (history.length === 0) return 0;
            const sum = history.reduce((acc, val) => acc + val, 0);
            return Math.round(sum / history.length);
        }

        getLowestFPS(args) {
            const duration = parseInt(args.DURATION_MENU, 10);
            const history = this._getFpsHistorySlice(duration);
            if (history.length === 0) return 0;
            return Math.min(...history);
        }

        getHighestFPS(args) {
            const duration = parseInt(args.DURATION_MENU, 10);
            const history = this._getFpsHistorySlice(duration);
            if (history.length === 0) return 0;
            return Math.max(...history);
        }

        getLastFrameRenderTime() { return Math.round(this.renderTime * 100) / 100; }

        getJSMemoryUsage() {
            if (typeof performance !== 'undefined' && performance.memory) {
                const usedMB = Math.round(performance.memory.usedJSHeapSize / 1024 / 1024 * 100) / 100;
                const totalMB = Math.round(performance.memory.totalJSHeapSize / 1024 / 1024 * 100) / 100;
                return `${usedMB} / ${totalMB}`;
            }
            return 'N/A';
        }

        _getDescendantBlockIDs(targetBlocks, topBlockID, visited = new Set()) {
            if (!topBlockID || !targetBlocks.getBlock(topBlockID) || visited.has(topBlockID)) return [];
            visited.add(topBlockID);
            const blockList = [topBlockID];
            const block = targetBlocks.getBlock(topBlockID);

            if (block) {
                for (const inputName in block.inputs) {
                    const input = block.inputs[inputName];
                    if (input.block) {
                        blockList.push(...this._getDescendantBlockIDs(targetBlocks, input.block, new Set(visited)));
                    }
                }
                if (block.next) {
                    blockList.push(...this._getDescendantBlockIDs(targetBlocks, block.next, new Set(visited)));
                }
            }
            return blockList;
        }

        _getAllBlocksFromTarget(target) {
            if (!target || !target.blocks || typeof target.blocks.getScripts !== 'function') {
                return [];
            }
            const scriptIDs = target.blocks.getScripts();
            const allBlockIDs = new Set();
            for (const scriptID of scriptIDs) {
                const blockList = this._getDescendantBlockIDs(target.blocks, scriptID, new Set());
                blockList.forEach(id => allBlockIDs.add(id));
            }
            return Array.from(allBlockIDs);
        }


        getTotalBlockCount() {
            if (!this.runtime || !this.runtime.targets) return 0;
            let count = 0;
            for (const target of this.runtime.targets) {
                if (target.isOriginal && target.blocks) {
                     count += this._getAllBlocksFromTarget(target).length;
                }
            }
            return count;
        }

        getBlockCountForTarget(args) {
            const targetNameOrId = args.TARGET_MENU;
            if (!this.runtime) return 0;
            const target = this._findTargetByNameOrId(targetNameOrId);
            if (!target || !target.blocks) return 0;
            return this._getAllBlocksFromTarget(target).length;
        }

        _countVariablesOrLists(type) {
            if (!this.runtime || !this.runtime.targets) return 0;
            let count = 0;
            for (const target of this.runtime.targets) {
                 if (target.isOriginal && target.variables) {
                    for (const varId in target.variables) {
                        if (target.variables[varId].type === type) {
                            count++;
                        }
                    }
                }
            }
            return count;
        }

        getTotalVariableCount() {
            return this._countVariablesOrLists('');
        }

        getTotalListCount() {
            return this._countVariablesOrLists('list');
        }

        getTotalSpriteCount() {
            return this.runtime ? this.runtime.targets.filter(t => t.isSprite && t.isOriginal && !t.isStage).length : 0;
        }

        getTotalCloneCount() {
            if (!this.runtime || !this.runtime.targets) return 0;
            let count = 0;
            for (const target of this.runtime.targets) {
                if (target.isSprite && !target.isOriginal) {
                    count++;
                }
            }
            return count;
        }

        getCloneCountForSprite(args) {
            const targetNameOrId = args.SPRITE_TARGET_MENU;
            if (!this.runtime) return 0;
            const originalTarget = this._findTargetByNameOrId(targetNameOrId);
            if (!originalTarget || !originalTarget.isSprite || !originalTarget.isOriginal) return 0;

            let cloneCount = 0;
            const originalSpriteName = originalTarget.sprite ? originalTarget.sprite.name : originalTarget.getName();

            for (const target of this.runtime.targets) {
                const targetSpriteName = target.sprite ? target.sprite.name : (typeof target.getName === 'function' ? target.getName() : null);
                if (target.isSprite && !target.isOriginal && targetSpriteName === originalSpriteName) {
                    cloneCount++;
                }
            }
            return cloneCount;
        }

        getEstimatedProjectDataSize() {
            if (!this.runtime || !this.runtime.targets) return 0;
            let totalSize = 0;
            for (const target of this.runtime.targets) {
                if (!target.isOriginal) continue;
                if (target.variables) {
                    for (const varId in target.variables) {
                        const variable = target.variables[varId];
                        if (variable.type === '') {
                            totalSize += new TextEncoder().encode(String(variable.value)).length;
                        } else if (variable.type === 'list') {
                            variable.value.forEach(item => totalSize += new TextEncoder().encode(String(item)).length);
                        }
                    }
                }

                const costumes = target.sprite ? (target.sprite.costumes_ || target.costumes_) : target.costumes_;
                if (costumes) {
                    costumes.forEach(costume => {
                        if (costume.asset && costume.asset.data) totalSize += costume.asset.data.byteLength;
                    });
                }
                const sounds = target.sprite ? (target.sprite.sounds_ || target.sounds_) : target.sounds_;
                if (sounds) {
                    sounds.forEach(sound => {
                        if (sound.asset && sound.asset.data) totalSize += sound.asset.data.byteLength;
                    });
                }
            }
            return Math.round(totalSize / 1024);
        }

        getActiveThreadCount() {
            return (this.runtime && this.runtime.threads) ? this.runtime.threads.length : 0;
        }

        getCollisionChecksPerSecond() {
            return this.reportedCollisionChecksPerSecond;
        }

        getTimeSinceProjectStart() {
             if (this.runtime && this.runtime.projectTimer && typeof this.runtime.projectTimer.getProjectTimer === 'function') {
                return Math.round(this.runtime.projectTimer.getProjectTimer() * 100) / 100;
             }
             return Math.round((performance.now() - this.projectStartTime) / 10) / 100;
        }

        getTimeSinceFlagPressed() {
            if (this.lastFlagPressTime === 0) {
                if (this.runtime && this.runtime.projectTimer && this.runtime.projectTimer.startTime) {
                    return Math.round((performance.now() - this.runtime.projectTimer.startTime) / 10) / 100;
                }
                return 0; // Otherwise, default to 0
            }
            return Math.round((performance.now() - this.lastFlagPressTime) / 10) / 100;
        }


        getStageWidth() { return this.runtime ? this.runtime.stageWidth : 480; }
        getStageHeight() { return this.runtime ? this.runtime.stageHeight : 360; }

        getRendererType() {
            if (this.runtime && this.runtime.renderer && this.runtime.renderer.constructor) {
                const name = this.runtime.renderer.constructor.name;
                if (name.toLowerCase().includes('webgl')) return 'WebGL';
                if (name.toLowerCase().includes('svg')) return 'SVG';
                if (name.toLowerCase().includes('canvas2d')) return 'Canvas2D';
                return name;
            }
            return 'Unknown';
        }

        _getTargetsMenu() {
            const defaultItem = [{ text: 'Stage', value: '_stage_' }];
            if (!this.runtime || !this.runtime.targets) return defaultItem;

            const spriteTargets = this.runtime.targets
                .filter(target => target.isOriginal && !target.isStage && typeof target.getName === 'function')
                .map(target => ({ text: target.getName(), value: target.id }));
            
            const menuItems = defaultItem.concat(spriteTargets);
            return menuItems.length > 0 ? menuItems : [{ text: '(no targets)', value: ''}];
        }

        _getSpriteTargetsMenu() {
             if (!this.runtime || !this.runtime.targets) return [{ text: 'select sprite', value: '' }];
             const sprites = this.runtime.targets
                .filter(target => target.isOriginal && target.isSprite && !target.isStage && typeof target.getName === 'function')
                .map(target => ({ text: target.getName(), value: target.id }));

            return sprites.length > 0 ? sprites : [{ text: 'no sprites', value: '' }];
        }

        _findTargetByNameOrId(idOrName) {
            if (!this.runtime || !this.runtime.targets) return null;
            if (idOrName === '_stage_') {
                return typeof this.runtime.getTargetForStage === 'function' ?
                    this.runtime.getTargetForStage() :
                    this.runtime.targets.find(t => t.isStage);
            }
            
            let target = this.runtime.targets.find(t => t.id === idOrName);
            if (target) return target;

            target = this.runtime.targets.find(t => {
                if (!t.isOriginal) return false;
                const name = typeof t.getName === 'function' ? t.getName() : (t.sprite ? t.sprite.name : null);
                return name === idOrName;
            });
            return target;
        }
    }

    if (Scratch && Scratch.extensions) {
        Scratch.extensions.register(new PerformanceMonitor(runtime));
    }

})(Scratch);
