((Scratch) => {
    'use strict';

    const icon = 'https://utakeuchigames.github.io/boolvariable/favicon.svg';

    const vm = Scratch.vm;

    let deltaTime = 0;
    let previousTime = 0;

    

    class utakeuchigamesBoolvariable {
        constructor() {
            this.boolVariables = {};
            this.boolVariablesinfo = {};
            this.isUIOpen = false;
            this.isDelUIOpen = false; 
            this.frameCount = 0;
        }

        // セーブデータの書き出し
        customSave() {
            const saveData = {
                boolVariables: this.boolVariables,
                boolVariablesinfo: this.boolVariablesinfo
            };
            return JSON.stringify(saveData);
        }

        // セーブデータの読み込み
        customLoad(data) {
            if (!data) return;
            try {
                const parsed = (typeof data === 'string') ? JSON.parse(data) : data;
                if (parsed) {
                    this.boolVariables = parsed.boolVariables ?? {};
                    this.boolVariablesinfo = parsed.boolVariablesinfo ?? {};

                    // 読み込み時にもし管理情報（info）が欠落している変数があれば自動救出
                    for (const key of Object.keys(this.boolVariables)) {
                        if (!this.boolVariablesinfo[key]) {
                            this.ensureVariableExists(key);
                        }
                    }
                }
                
                this.refreshBlocks();
            } catch (e) {
                console.error("❌ データの復元に失敗したよ：", e);
            }
        }

        // ⚡️ ブロックの表示を最新状態に更新するヘルパー
        refreshBlocks() {
            setTimeout(() => {
                if (Scratch.vm && Scratch.vm.runtime) {
                    Scratch.vm.runtime.requestBlocksDisplayUpdate();
                }
            }, 5);
        }

        // ⚡️【核心】内部キーの形からグローバル/ローカルを賢く見極めて、その場で復元を試みる関数
        ensureVariableExists(internalKey) {
            // すでに存在していれば何もしない
            if (Object.prototype.hasOwnProperty.call(this.boolVariables, internalKey)) {
                return;
            }

            console.log(`💡 未知のデータ「${internalKey}」を検知！自動復元を試みます。`);

            let displayName = internalKey;
            let isLocal = false;
            let targetId = 'stage';

            // 文字列の中に "_" が含まれているかチェック
            if (internalKey.includes('_')) {
                isLocal = true; // "_" があるならローカル変数として復元を試みる

                // スプライトID自体の "_" 混入を考慮して、一番最後の "_" の位置で綺麗に分割
                const lastIndex = internalKey.lastIndexOf('_');
                targetId = internalKey.substring(0, lastIndex); // 前半：元の所有スプライトID
                displayName = internalKey.substring(lastIndex + 1); // 後半：表示名
            } else {
                // "_" がない場合は、全体が内部キーであり表示名（グローバル変数）
                displayName = internalKey;
                isLocal = false;
                targetId = 'stage';
            }

            // データ全体（internalKey）をそのままキーにして実体を生成！
            this.boolVariables[internalKey] = false;
            this.boolVariablesinfo[internalKey] = {
                isLocal: isLocal,
                targetId: targetId,
                displayName: displayName
            };

            this.refreshBlocks();
        }

        getInfo() {
            return {
                id: 'utakeuchigamesBV', 
                name: 'Bool変数拡張',
                menuIconURI: icon,
                color1: "#ff8c1a",  
                color2: "#ff8000",          
                color3: "#db6d00",      
                blocks: [
                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: '真偽値変数'
                    },
                    {
                        func: 'createUI',
                        blockType: Scratch.BlockType.BUTTON,
                        text: '変数作成フォームを開く'
                    },
                    {
                        opcode: 'setBool',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'bool値[variable]を[bool]にする',
                        arguments: {
                            variable: { type: Scratch.ArgumentType.STRING, menu: 'boolVariableMenu' },
                            bool: { type: Scratch.ArgumentType.STRING, menu: 'staticBoolMenu' }
                        }
                    },
                    {
                        opcode: 'getBool',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: 'bool値[variable]',
                        arguments: {
                            variable: { type: Scratch.ArgumentType.STRING, menu: 'boolVariableMenu' }
                        }
                    },
                    {
                        opcode: 'ifBool',
                        blockType: Scratch.BlockType.EVENT,
                        text: 'bool値[variable]が[bool]になった時',
                        isEdgeActivated: false, // startHats連動のイベント型
                        arguments: {
                            variable: { type: Scratch.ArgumentType.STRING, menu: 'boolVariableHatMenu' },
                            bool: { type: Scratch.ArgumentType.STRING, menu: 'staticBoolMenu' }
                        }
                    },
                    {
                        opcode: 'getallBool',
                        blockType: Scratch.BlockType.REPORTER,
                        text: '全部のbool値を見る',
                    },
                    {
                        opcode: 'getallboolinfo',
                        blockType: Scratch.BlockType.REPORTER,
                        text: '全部のbool値の情報を見る',
                    },
                    '---',
                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: 'その他のキット'
                    },
                    {
                        opcode: 'reversebool',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: '![bool]',
                        arguments: {
                            bool: { type: Scratch.ArgumentType.BOOLEAN }
                        }
                    },
                    {
                        opcode: 'andbool',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: '[bool1] && [bool2]',
                        arguments: {
                            bool1: { type: Scratch.ArgumentType.BOOLEAN },
                            bool2: { type: Scratch.ArgumentType.BOOLEAN }
                        }
                    },
                    {
                        opcode: 'orbool',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: '[bool1] || [bool2]',
                        arguments: {
                            bool1: { type: Scratch.ArgumentType.BOOLEAN },
                            bool2: { type: Scratch.ArgumentType.BOOLEAN }
                        }
                    },
                    {
                        opcode: 'xorbool',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: '[bool1] !== [bool2]',
                        arguments: {
                            bool1: { type: Scratch.ArgumentType.BOOLEAN },
                            bool2: { type: Scratch.ArgumentType.BOOLEAN }
                        }
                    },
                    {
                        opcode: 'waitFrames',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '[frames] フレーム待つ',
                        arguments: {
                            frames: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 }
                        }
                    }
                ],
                menus: {
                    boolVariableMenu: { acceptReporters: false, items: 'getVariableMenuItems' },
                    boolVariableHatMenu: { acceptReporters: false, items: 'getVariableMenuItems' },
                    staticBoolMenu: { 
                        acceptReporters: false, 
                        items: [{text: 'true', value: 'true'}, {text: 'false', value: 'false'}] 
                    }
                }
            };
        }

        // 変数作成UIのレンダリング
        createUI() {
            if (this.isUIOpen) return;
            this.isUIOpen = true;

            const editingTarget = Scratch.vm.runtime.getEditingTarget();
            const isStage = editingTarget ? !!editingTarget.isStage : false;
            const currentTargetId = editingTarget ? (editingTarget.id ?? 'stage') : 'stage';

            const overlay = document.createElement('div');
            overlay.style.cssText = `position:fixed;top:0;left:0;right:0;bottom:0;z-index:99999;background-color:var(--ui-modal-overlay,rgba(0,0,0,0.55));color:var(--ui-modal-foreground,#333333);display:flex;justify-content:center;align-items:center;font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;`;

            const dialog = document.createElement('div');
            dialog.style.cssText = `background-color:var(--ui-modal-background,#ffffff);width:360px;outline:none;border:4px solid #ff8787;padding:0;border-radius:0.5rem;user-select:none;overflow:hidden;display:flex;flex-direction:column;box-shadow:var(--shadow,0px 4px 15px rgba(0,0,0,0.3));`;

            dialog.innerHTML = `
                <div style="display:flex;flex-direction:row;flex-wrap:nowrap;justify-content:space-between;align-items:center;height:3.125rem;width:100%;background-color:#ff4c4c;color:#ffffff;font-size:1rem;font-weight:normal;">
                    <div style="width:3.125rem;height:100%;"></div>
                    <div style="flex-grow:1;text-align:center;letter-spacing:0.4px;cursor:default;font-weight:bold;">新しい変数</div>
                    <div style="width:3.125rem;height:100%;display:flex;justify-content:center;align-items:center;z-index:1;">
                        <button id="ceoCloseXBtn" style="background:none;border:none;color:inherit;font-size:1.25rem;cursor:pointer;padding:0;width:100%;height:100%;">✕</button>
                    </div>
                </div>
                <div style="background:var(--ui-modal-background,#ffffff);padding:1.5rem 2.25rem;display:flex;flex-direction:column;">
                    <div style="font-weight:500;margin:0 0 0.75rem;font-size:14px;color:var(--text-primary,#575e75);text-align:left;">新しい変数名:</div>
                    <input type="text" id="varInput" style="margin-bottom:1.5rem;width:100%;border:1px solid var(--ui-black-transparent,rgba(0,0,0,0.15));border-radius:calc(0.5rem / 2);padding:0 1rem;height:3rem;color:var(--text-primary,#333333);background-color:var(--input-background,#ffffff);font-size:.875rem;outline:none;box-sizing:border-box;" autofocus />
                    <div style="display:flex;font-weight:normal;justify-content:space-between;margin-bottom:1.5rem;font-size:.875rem;color:var(--text-primary,#575e75);">
                        ${isStage ? `
                            <span style="font-size: 13px; color: var(--text-primary-alpha, #747474); line-height: 1.4; text-align: left;">ステージで作った変数は基本的にすべてのスプライトで使用できます</span>
                        ` : `
                            <label style="display:flex;align-items:center;cursor:pointer;">
                                <input type="radio" name="variableScopeOption" value="global" checked style="margin:3px 6px 3px 3px;width:16px;height:16px;" />
                                <span>すべてのスプライト用</span>
                            </label>
                            <label style="display:flex;align-items:center;cursor:pointer;">
                                <input type="radio" name="variableScopeOption" value="local" style="margin:3px 6px 3px 3px;width:16px;height:16px;" />
                                <span>このスプライトのみ</span>
                            </label>
                        `}
                    </div>
                    <div style="font-weight:bolder;text-align:right;margin-top:1rem;">
                        <button id="cancelBtn" style="padding:0.75rem 1rem;border-radius:0.25rem;background:var(--ui-white,#ffffff);color:var(--text-primary,#333333);border:1px solid var(--ui-black-transparent,rgba(0,0,0,0.15));font-weight:600;font-size:0.85rem;cursor:pointer;outline:none;">キャンセル</button>
                        <button id="okBtn" style="padding:0.75rem 1rem;border-radius:0.25rem;background:#ff4c4c;border:1px solid #ff4c4c;color:#ffffff;font-weight:600;font-size:0.85rem;cursor:pointer;outline:none;margin-left:0.5rem;">OK</button>
                    </div>
                </div>
            `;

            overlay.appendChild(dialog);
            document.body.appendChild(overlay);

            setTimeout(() => {
                const inputField = document.getElementById('varInput');
                if (inputField) inputField.focus();
            }, 50);

            const close = () => {
                overlay.remove(); 
                this.isUIOpen = false;
            };

            overlay.onclick = (e) => {
                if (e.target === overlay) close();
            };

            document.getElementById('ceoCloseXBtn').onclick = close;
            document.getElementById('cancelBtn').onclick = close;

            document.getElementById('okBtn').onclick = () => {
                const name = document.getElementById('varInput').value;
                if (name && name.trim() !== "") {
                    const trimmedName = name.trim();
                    const scopeValue = (document.querySelector('input[name="variableScopeOption"]:checked') ?? { value: 'global' }).value;
                    
                    const isLocal = isStage ? false : (scopeValue === 'local');
                    const targetId = isLocal ? currentTargetId : 'stage';
                    
                    let isDuplicate = false;

                    for (const existingKey of Object.keys(this.boolVariables)) {
                        const info = this.boolVariablesinfo[existingKey];
                        const existingDisplayName = info ? (info.displayName ?? existingKey) : existingKey;

                        if (existingDisplayName === trimmedName) {
                            if (!isLocal) {
                                isDuplicate = true;
                                break;
                            } else {
                                if (!info || !info.isLocal || info.targetId === targetId) {
                                    isDuplicate = true;
                                    break;
                                }
                            }
                        }
                    }

                    if (isDuplicate) {
                        alert(`❌ エラー: 「${trimmedName}」という名前の変数はすでに存在するか、競合するため作成できません！`);
                        return;
                    }

                    const internalKey = isLocal ? `${targetId}_${trimmedName}` : trimmedName;
                    
                    this.boolVariables[internalKey] = false;
                    this.boolVariablesinfo[internalKey] = {
                        isLocal: isLocal,
                        targetId: targetId,
                        displayName: trimmedName
                    };
                    
                    this.refreshBlocks();
                }
                close();
            };

            document.getElementById('varInput').onkeypress = (e) => {
                if (e.key === 'Enter') {
                    document.getElementById('okBtn').click();
                }
            };
        }

        // 変数メニュー（リスト）の生成
        getVariableMenuItems(currentlySelectedValue) {
            const menuItems = [];
            const currentTarget = Scratch.vm.runtime.getEditingTarget();
            const currentTargetId = currentTarget ? (currentTarget.id ?? 'stage') : 'stage';

            for (const key of Object.keys(this.boolVariables)) {
                const info = this.boolVariablesinfo[key];
                const dispName = info ? (info.displayName ?? key) : key;
                
                if (info) {
                    // グローバル変数、または「いま編集中のスプライト」に属するローカル変数のみメニューに出す
                    if (!info.isLocal || info.targetId === currentTargetId) {
                        menuItems.push({ text: dispName, value: key });
                    }
                } else {
                    menuItems.push({ text: dispName, value: key });
                }
            }

            const isValidUserVar = Object.prototype.hasOwnProperty.call(this.boolVariables, currentlySelectedValue);
            
            if (!isValidUserVar || !currentlySelectedValue || currentlySelectedValue === '(空)') {
                menuItems.unshift({ text: '(空)', value: '(空)' });
            } else {
                menuItems.push({ text: '(空)', value: '( Stock )' });
            }

            if (menuItems.length > 0) {
                menuItems.push({ text: '────────────────', value: 'IGNORE_CLICK' });
            }
            menuItems.push({ text: '🔥 変数を削除するフォームを開く', value: 'OPEN_DELETE_UI' });

            return menuItems;
        }

        // 変数削除UIのレンダリング
        // 変数削除UIのレンダリング
        createDeleteUI() {
            if (this.isDelUIOpen) return;
            this.isDelUIOpen = true;

            setTimeout(() => {
                const currentTarget = Scratch.vm.runtime.getEditingTarget();
                const currentTargetId = currentTarget ? (currentTarget.id ?? 'stage') : 'stage';

                // 今開いているスプライトで削除できる変数（グローバル or 自分のローカル）を絞り込む
                const deleteableKeys = Object.keys(this.boolVariables).filter(internalKey => {
                    const info = this.boolVariablesinfo[internalKey];
                    if (!info) return true;
                    return !info.isLocal || info.targetId === currentTargetId;
                });

                if (deleteableKeys.length === 0) {
                    alert("❌ 削除できる変数がありません！");
                    this.isDelUIOpen = false; 
                    return;
                }

                const overlay = document.createElement('div');
                overlay.style.cssText = `position:fixed;top:0;left:0;right:0;bottom:0;z-index:99999;background-color:rgba(0,0,0,0.6);display:flex;justify-content:center;align-items:center;font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;`;

                const dialog = document.createElement('div');
                dialog.style.cssText = `background-color:#ffffff;width:340px;border:4px solid #ff4c4c;border-radius:0.5rem;overflow:hidden;display:flex;flex-direction:column;box-shadow:0px 4px 15px rgba(0,0,0,0.3);`;

                // 選択肢のHTMLをループで組み立てる
                let optionsHtml = '';
                for (const key of deleteableKeys) {
                    const info = this.boolVariablesinfo[key];
                    const disp = info ? (info.displayName ?? key) : key;
                    const typeText = info ? (info.isLocal ? '[ローカル]' : '[グローバル]') : '[不明]';
                    optionsHtml += `<option value="${key}">${typeText} ${disp}</option>`;
                }

                // ⚡️【修正箇所】 ${optionsHtml} の前の「\\」を消去したよ！
                dialog.innerHTML = `
                    <div style="height:3rem;background-color:#ff4c4c;color:#ffffff;display:flex;justify-content:center;align-items:center;font-weight:bold;font-size:1rem;">
                        変数の削除
                    </div>
                    <div style="padding:1.5rem;display:flex;flex-direction:column;">
                        <div style="font-size:14px;color:#575e75;margin-bottom:0.75rem;text-align:left;">削除する変数を選択してください:</div>
                        <select id="deleteSelect" style="width:100%;height:2.5rem;border:1px solid #ccc;border-radius:4px;padding:0 0.5rem;font-size:14px;margin-bottom:1.5rem;background:#fff;outline:none;color:#000;">
                            ${optionsHtml}
                        </select>
                        <div style="text-align:right;">
                            <button id="cancelDelBtn" style="padding:0.5rem 1rem;border-radius:4px;background:#fff;color:#333;border:1px solid #ccc;font-weight:600;cursor:pointer;outline:none;">キャンセル</button>
                            <button id="executeDelBtn" style="padding:0.5rem 1rem;border-radius:4px;background:#ff4c4c;color:#fff;border:none;font-weight:600;cursor:pointer;outline:none;margin-left:0.5rem;">削除実行</button>
                        </div>
                    </div>
                `;

                overlay.appendChild(dialog);
                document.body.appendChild(overlay);

                const closeDel = () => {
                    overlay.remove();
                    this.isDelUIOpen = false; 
                };

                document.getElementById('cancelDelBtn').onclick = closeDel;
                overlay.onclick = (e) => { if (e.target === overlay) closeDel(); };

                document.getElementById('executeDelBtn').onclick = () => {
                    const targetKey = document.getElementById('deleteSelect').value;
                    const info = this.boolVariablesinfo[targetKey];
                    const dispName = info ? (info.displayName ?? targetKey) : targetKey;

                    if (confirm(`本当に bool値「${dispName}」を完全に削除しますか？\n(この変数を使用している他のブロックは初期状態に戻ります)`)) {
                        delete this.boolVariables[targetKey];
                        delete this.boolVariablesinfo[targetKey];

                        closeDel();
                        
                        setTimeout(() => {
                            alert(`🎉 bool値「${dispName}」を完全に削除しました！`);
                            if (Scratch.vm && Scratch.vm.runtime) {
                                Scratch.vm.runtime.requestBlocksDisplayUpdate();
                            }
                        }, 100);
                        return;
                    }
                    closeDel();
                };
            }, 100); 
        }

        // ⚡️ セットブロック
        setBool(args, util) { 
            if (args.variable === 'OPEN_DELETE_UI') {
                this.createDeleteUI();
                return;
            }
            if (args.variable === 'IGNORE_CLICK' || args.variable === '(空)') return;

            // 🔥 処理が走る手前で、未知のキーであれば安全に復元する
            this.ensureVariableExists(args.variable);

            const prevalue = this.boolVariables[args.variable];
            this.boolVariables[args.variable] = (args.bool === 'true');
            const data = {
                "variable": args.variable.toString(),
                bool: String(args.bool)
            };
            
            if (prevalue != (args.bool === 'true')) {
                // 変数が確実に作られてから startHats を呼ぶので、イベント処理もバグらない
                Scratch.vm.runtime.startHats("BV_ifBool", data, false);
            }
        }

        // ⚡️ 値取得ブロック
        getBool(args, util) {
            if (args.variable === 'OPEN_DELETE_UI') {
                this.createDeleteUI();
                return false;
            }
            if (args.variable === 'IGNORE_CLICK' || args.variable === '(空)') return false;

            // 🔥 値を読み込む手前でも、未知のキーであれば安全に復元する
            this.ensureVariableExists(args.variable);

            return !!this.boolVariables[args.variable]; 
        }

        // ⚡️ ハットブロック（isEdgeActivated: falseのため、startHatsのフィルタ判定として一瞬だけ動く）
        ifBool(args, util) {
            if (args.variable === 'IGNORE_CLICK' || args.variable === '(空)') return false;
            
            // setBool側ですでに実体が保証されているため、ここでは純粋な一致判定だけを行う
            return args.variable === util.currentBackgroundData.variable && args.bool === util.currentBackgroundData.bool;
        }

        getallBool(args) { return JSON.stringify(this.boolVariables); }
        getallboolinfo(args) { return JSON.stringify(this.boolVariablesinfo); }

        reversebool(args,util){ return !args.bool; }
        andbool(args,util){ return !!(args.bool1 && args.bool2); }
        orbool(args,util){ return !!(args.bool1 || args.bool2); }
        xorbool(args,util){ return (args.bool1 !== args.bool2); }
        async waitFrames(args, util) {
            // frames分 * deltaTime(秒) で待機時間(ミリ秒)を算出
            // ※deltaTimeはBEFORE_EXECUTEで秒単位で計算されている前提
            //const waitMs = (args.frames * deltaTime) * 1000;
            
            // PromiseでsetTimeoutをラップしてawaitできるようにする
            //await new Promise(resolve => setTimeout(resolve, waitMs));
            
            // イメージ：内部カウンターを使う方法
            const targetFrame = this.frameCount + args.frames - 1;
            while (this.frameCount < targetFrame) {
                await new Promise(resolve => requestAnimationFrame(resolve));
            }
        }
    }

　　 const utakeuchigamesBoolvariableextension = new utakeuchigamesBoolvariable();
    
    vm.runtime.on("BEFORE_EXECUTE", () => {
        utakeuchigamesBoolvariableextension.frameCount++;
        const now = performance.now();

        if (previousTime === 0) {
            // First frame. We used to always return 0 here, but that can break projects that
            // expect delta time to always be non-zero. Instead we'll make our best guess.
            deltaTime = 1 / vm.runtime.frameLoop.framerate;
        } else {
            deltaTime = (now - previousTime) / 1000;
        }

        previousTime = now;
    });

    Scratch.extensions.register(Boolvariableextension);

})(Scratch);
