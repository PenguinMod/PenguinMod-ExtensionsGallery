(function(Scratch) {
  'use strict';

  class ThreeDExtension {
    constructor() {
      this.scene = null;
      this.camera = null;
      this.renderer = null;
      this.objects = new Map();
      this.nextObjectId = 1;
      this.isInitialized = false;
      this.container = null;
      this.positionUpdateInterval = null;
      this.stageElement = null;
      this.stageCanvas = null;
      this.compositeCanvas = null;
      this.compositeContext = null;
      this.renderOrder = 'overlay';
      this.currentBlendMode = 'source-over';
      this.current3DOpacity = 0.9;
      // 「スプライトの後ろ」モード: Scratch 2D背景色除去
      this.bgRemovalEnabled = false;
      this.bgRemovalColors = []; // { r, g, b, tol, feather } の配列
      // 後方互換用（単色時のデフォルト）
      this.bgRemovalTolerance = 30;
      this.bgRemovalFeather = 15;
      this._bgRemovalCanvas = null;
      this._bgRemovalContext = null;
      // requestSnapshot で取得したScratch画面
      this._scratchSnapshotImg = null;
      this._snapshotPending = false;
      
      // liteから移植: 最終表示用2Dキャンバス
      this.replacementCanvas = null;
      this.replacementContext = null;
      
      // 「後ろ」モード時に3Dの背面に敷く真っ白レイヤー
      this.whiteLayerCanvas = null;

      // 空（グラデーション背景）設定
      this.skyEnabled = false;
      this.skyColor = '#87CEEB';       // 空の色（上部）
      this.skyGradientStrength = 1.0;  // グラデーション強さ (0〜1)
      this.skyGradientSize = 1.0;      // グラデーションのかかる範囲 (0〜1)
      
      this.lights = new Map();
      this.nextLightId = 1;
      this.animationId = null;
      this._boundAnimate = this.animate.bind(this);
      this._cameraFollow = null;
      this._shadowFollowLights = undefined; // 旧追従方式は廃止
      // CSM関連
      this.csm = null;
      this.csmLoaded = false;
      this.csmEnabled = false;
      this.CSMClass = null;
      this.threeJSLoaded = false;
      this.gltfLoaderLoaded = false;
      this.GLTFLoader = null;
      this.initPromise = null;
      this.zIndexMode = 'auto';
      this.enable3D = true;
      this.resizeObserver = null;
      
      // 物理エンジン関連 (Rapier)
      this.rapierLoaded = false;
      this.RAPIER = null;           // Rapier モジュール参照
      this.world = null;
      // objectId -> { rigidBody, collider, mesh, _originalMass }
      this.physicsBodies = new Map();
      this.physicsEnabled = false;
      this.timeStep = 1/60;
      this.debugMeshes = new Map();
      // コリジョンイベント用ハンドル→objectId マップ
      this.colliderHandleToId = new Map();
      
      // 当たり判定関連
      this.collisionPairs = new Set();
      this.collisionHistory = new Map();
      this.lastCollisionPartner = new Map();
      
      // 3Dモデルアセット管理
      this.modelAssets = new Map();
      this.nextAssetId = 1;

      // 車コントローラー管理 objectId -> carState
      this.carControllers = new Map();
      this._boundCarUpdate = this._updateAllCars.bind(this);
      this._carUpdateInterval = null;

      // ホイールセット管理 objectId -> { FL, FR, RL, RR, rotAxis, rotScale, steerMaxDeg, ... }
      this.wheelSets = new Map();

      // 子メッシュワイヤーフレーム管理 `${objectId}::${meshName}` -> THREE.Mesh (ワイヤー)
      this.meshWireframes = new Map();
      
      // WebGPU / WebGL バックエンド管理
      this.usingWebGPU = false;       // 実際に WebGPU で動いているか
      this.webgpuAvailable = null;    // null=未検査, true/false

      this.loadThreeJS();
      this.loadRapier();
    }

    async loadThreeJS() {
      if (typeof THREE !== 'undefined') {
        this.threeJSLoaded = true;
        return Promise.resolve();
      }
      
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
        script.onload = () => {
          console.log('Three.js loaded successfully');
          this.threeJSLoaded = true;
          resolve();
        };
        script.onerror = () => {
          console.error('Failed to load Three.js');
          reject(new Error('Three.js failed to load'));
        };
        document.head.appendChild(script);
      });
    }

    async loadRapier() {
      if (this.rapierLoaded) return;
      try {
        // rapier3d-compat: WASM base64 インライン済み ESM パッケージ
        const RAPIER = await import('https://cdn.jsdelivr.net/npm/@dimforge/rapier3d-compat@0.12.0/rapier.es.js');
        await RAPIER.init();
        this.RAPIER = RAPIER;
        this.rapierLoaded = true;
        console.log('Rapier loaded successfully');
      } catch (err) {
        console.error('Failed to load Rapier:', err);
        throw err;
      }
    }

    /**
     * WebGPU が利用可能かどうかを検査し、利用可能なら THREE.WebGPURenderer を
     * 非同期で初期化して返す。利用不可・失敗のときは null を返す。
     *
     * Three.js r128 には WebGPURenderer が同梱されていないため、
     * three-webgpu-renderer (@unofficial shim) を動的に読み込む。
     * ただし現実的に安定している公開 CDN が存在しないため、
     * ここでは「WebGPU ネイティブ API の有無だけ確認し、
     * 実レンダラは THREE.WebGLRenderer を WebGPU context で動かす」
     * アプローチを採用する。
     *
     * 具体的には：
     *   1. navigator.gpu が存在する → WebGPU 対応ブラウザ
     *   2. THREE.WebGLRenderer に { powerPreference:'high-performance' } を渡して生成
     *   3. renderer.domElement のコンテキストを webgpu で取得試行
     *      → 成功 → WebGPU モード (this.usingWebGPU = true)
     *      → 失敗 → WebGL モードのまま継続 (透過フォールバック)
     *
     * Three.js が WebGPU バックエンドを公式サポートするのは r163+ のため、
     * r128 ベースのこのプロジェクトでは上記の「WebGPU コンテキスト優先取得」
     * + WebGL フォールバックが最も安全な実装となる。
     */
    async _detectWebGPU() {
      if (this.webgpuAvailable !== null) return this.webgpuAvailable;

      // Step1: API 存在チェック
      if (!navigator.gpu) {
        console.log('[WebGPU] navigator.gpu not found → WebGL fallback');
        this.webgpuAvailable = false;
        return false;
      }

      // Step2: アダプタ取得試行
      try {
        const adapter = await navigator.gpu.requestAdapter({ powerPreference: 'high-performance' });
        if (!adapter) {
          console.log('[WebGPU] No adapter available → WebGL fallback');
          this.webgpuAvailable = false;
          return false;
        }
        // Step3: デバイス取得試行
        await adapter.requestDevice();
        this.webgpuAvailable = true;
        console.log('[WebGPU] WebGPU available ✓');
        return true;
      } catch (e) {
        console.warn('[WebGPU] Adapter/Device request failed → WebGL fallback', e);
        this.webgpuAvailable = false;
        return false;
      }
    }

    /**
     * レンダラを生成する。WebGPU が使えるなら WebGPU コンテキストを優先し、
     * 使えなければ通常の WebGL レンダラにシームレスにフォールバックする。
     *
     * Three.js r128 の WebGLRenderer は内部で canvas.getContext('webgl2') を
     * 試みるが、WebGPU 対応ブラウザ（Chrome 113+）では canvas に
     * 'webgpu' コンテキストを先に確保することで GPU 側の最適パスを使わせる。
     */
    async _createRenderer() {
      const gpuOk = await this._detectWebGPU();

      let canvas = document.createElement('canvas');

      if (gpuOk) {
        // WebGPU コンテキストを先取りして WebGL が同じ canvas を使えないようにする。
        // Three.js r128 の WebGLRenderer は canvas オプションを受け付けるので、
        // 既存 canvas を渡すことでコンテキスト競合を起こさずに済む。
        try {
          // WebGPU デバイスを canvas に関連付け
          const adapter = await navigator.gpu.requestAdapter({ powerPreference: 'high-performance' });
          const device  = await adapter.requestDevice();
          const gpuCtx  = canvas.getContext('webgpu');

          if (gpuCtx) {
            const format = navigator.gpu.getPreferredCanvasFormat();
            gpuCtx.configure({ device, format, alphaMode: 'premultiplied' });

            // Three.js r128 WebGLRenderer には WebGPU context を直接渡せないため、
            // ここで WebGPU ネイティブ描画ループ用の最小ラッパを構築する。
            // ラッパは Three.js の renderer インタフェース（setSize / render / domElement
            // / shadowMap / setClearColor / dispose）を模倣する。
            const renderer = this._buildWebGPURendererShim(canvas, device, gpuCtx, format);
            this.usingWebGPU = true;
            console.log('[WebGPU] Using WebGPU renderer shim ✓');
            return renderer;
          }
        } catch (e) {
          console.warn('[WebGPU] WebGPU context setup failed, falling back to WebGL', e);
        }
      }

      // --- WebGL フォールバック ---
      const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        preserveDrawingBuffer: true,
        powerPreference: 'high-performance',
      });
      this.usingWebGPU = false;
      console.log('[WebGPU] Using WebGLRenderer (fallback)');
      return renderer;
    }

    /**
     * WebGPU ネイティブ描画ラッパ。
     *
     * Three.js r128 のシーングラフをそのまま使い続けながら、
     * 最終的なフレームバッファを WebGPU で合成する「ハイブリッド」方式を採る。
     *
     * 実装方針：
     *  - Three.js の描画は WebGL オフスクリーンキャンバスで行う（既存コードを無変更で流用）
     *  - 完成フレームを ImageBitmap に変換し、WebGPU の copyExternalImageToTexture で転写
     *  - WebGPU の render pass で最終出力キャンバスに blit（コピー描画）する
     *
     * これにより：
     *  - Three.js r128 の全機能（シャドウ・CSM・物理等）をそのまま利用できる
     *  - 将来 Three.js を r163+ に上げたとき WebGPURenderer への置き換えが容易
     *  - WebGPU 非対応環境では _createRenderer() のフォールバックで WebGL のみになる
     */
    _buildWebGPURendererShim(outputCanvas, device, gpuCtx, format) {
      // --- オフスクリーン WebGL レンダラ（Three.js 描画用）---
      const offscreenCanvas = document.createElement('canvas');
      const glRenderer = new THREE.WebGLRenderer({
        canvas: offscreenCanvas,
        antialias: true,
        alpha: true,
        preserveDrawingBuffer: true,
        powerPreference: 'high-performance',
      });

      // --- WebGPU blit パイプライン ---
      // フラグメントシェーダで sampler2D テクスチャを画面に貼るだけのシンプルな構成
      const shaderModule = device.createShaderModule({ code: `
        @group(0) @binding(0) var s: sampler;
        @group(0) @binding(1) var t: texture_2d<f32>;

        struct Vert { @builtin(position) pos: vec4f, @location(0) uv: vec2f };

        @vertex fn vs(@builtin(vertex_index) vi: u32) -> Vert {
          // フルスクリーン triangle strip (4頂点)
          var xy = array<vec2f,4>(
            vec2f(-1.0,  1.0), vec2f( 1.0,  1.0),
            vec2f(-1.0, -1.0), vec2f( 1.0, -1.0)
          );
          var uv = array<vec2f,4>(
            vec2f(0.0, 0.0), vec2f(1.0, 0.0),
            vec2f(0.0, 1.0), vec2f(1.0, 1.0)
          );
          var o: Vert;
          o.pos = vec4f(xy[vi], 0.0, 1.0);
          o.uv  = uv[vi];
          return o;
        }

        @fragment fn fs(v: Vert) -> @location(0) vec4f {
          return textureSample(t, s, v.uv);
        }
      `});

      const sampler = device.createSampler({
        magFilter: 'linear', minFilter: 'linear'
      });

      const bindGroupLayout = device.createBindGroupLayout({
        entries: [
          { binding: 0, visibility: GPUShaderStage.FRAGMENT, sampler: {} },
          { binding: 1, visibility: GPUShaderStage.FRAGMENT, texture: {} },
        ]
      });

      const pipeline = device.createRenderPipeline({
        layout: device.createPipelineLayout({ bindGroupLayouts: [bindGroupLayout] }),
        vertex:   { module: shaderModule, entryPoint: 'vs' },
        fragment: {
          module: shaderModule, entryPoint: 'fs',
          targets: [{ format,
            blend: {
              color: { srcFactor: 'src-alpha', dstFactor: 'one-minus-src-alpha', operation: 'add' },
              alpha: { srcFactor: 'one',       dstFactor: 'one-minus-src-alpha', operation: 'add' },
            }
          }]
        },
        primitive: { topology: 'triangle-strip' },
      });

      let _gpuTexture = null;
      let _bindGroup  = null;
      let _texW = 0, _texH = 0;

      // Three.js renderer インタフェースを模倣するラッパオブジェクト
      const shim = {
        domElement: outputCanvas,
        shadowMap: glRenderer.shadowMap,   // Three.js の shadowMap 設定をそのまま露出

        setSize(w, h, updateStyle = true) {
          glRenderer.setSize(w, h, updateStyle);
          outputCanvas.width  = glRenderer.domElement.width;
          outputCanvas.height = glRenderer.domElement.height;
          if (updateStyle) {
            outputCanvas.style.width  = glRenderer.domElement.style.width;
            outputCanvas.style.height = glRenderer.domElement.style.height;
          }
        },

        setPixelRatio(r) { glRenderer.setPixelRatio(r); },

        setClearColor(color, alpha) { glRenderer.setClearColor(color, alpha); },

        render(scene, camera) {
          // 1. Three.js でオフスクリーン描画
          glRenderer.render(scene, camera);

          // 2. オフスクリーンキャンバスを WebGPU テクスチャにアップロード
          const src = glRenderer.domElement;
          const w = src.width, h = src.height;

          if (w === 0 || h === 0) return;

          // テクスチャサイズが変わったら再生成
          if (!_gpuTexture || _texW !== w || _texH !== h) {
            if (_gpuTexture) _gpuTexture.destroy();
            _gpuTexture = device.createTexture({
              size: [w, h],
              format: 'rgba8unorm',
              usage: GPUTextureUsage.TEXTURE_BINDING |
                     GPUTextureUsage.COPY_DST |
                     GPUTextureUsage.RENDER_ATTACHMENT,
            });
            _bindGroup = device.createBindGroup({
              layout: bindGroupLayout,
              entries: [
                { binding: 0, resource: sampler },
                { binding: 1, resource: _gpuTexture.createView() },
              ]
            });
            _texW = w; _texH = h;
          }

          // copyExternalImageToTexture はブラウザが canvas → GPU を最適転写する
          device.queue.copyExternalImageToTexture(
            { source: src, flipY: false },
            { texture: _gpuTexture },
            [w, h]
          );

          // 3. WebGPU blit：テクスチャを出力キャンバスに描画
          const encoder = device.createCommandEncoder();
          const pass = encoder.beginRenderPass({
            colorAttachments: [{
              view:       gpuCtx.getCurrentTexture().createView(),
              loadOp:     'clear',
              clearValue: { r: 0, g: 0, b: 0, a: 0 },
              storeOp:    'store',
            }]
          });
          pass.setPipeline(pipeline);
          pass.setBindGroup(0, _bindGroup);
          pass.draw(4);
          pass.end();
          device.queue.submit([encoder.finish()]);
        },

        dispose() {
          glRenderer.dispose();
          if (_gpuTexture) _gpuTexture.destroy();
        },

        // Three.js が参照するプロパティ群
        get capabilities() { return glRenderer.capabilities; },
        get info()         { return glRenderer.info; },
        getPixelRatio()    { return glRenderer.getPixelRatio(); },
        getSize(v)         { return glRenderer.getSize(v); },
      };

      return shim;
    }

    async loadGLTFLoader() {
      if (this.gltfLoaderLoaded) return Promise.resolve();
      
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js';
        script.onload = () => {
          console.log('GLTFLoader loaded successfully');
          this.GLTFLoader = THREE.GLTFLoader;
          this.gltfLoaderLoaded = true;
          resolve();
        };
        script.onerror = () => {
          console.error('Failed to load GLTFLoader');
          reject(new Error('GLTFLoader failed to load'));
        };
        document.head.appendChild(script);
      });
    }

    async waitForThreeJS() {
      if (this.threeJSLoaded) return;
      
      let attempts = 0;
      while (!this.threeJSLoaded && attempts < 100) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
        if (typeof THREE !== 'undefined') {
          this.threeJSLoaded = true;
          break;
        }
      }
      
      if (!this.threeJSLoaded) {
        throw new Error('Three.js loading timeout');
      }
    }

    async waitForRapier() {
      if (this.rapierLoaded) return;
      let attempts = 0;
      while (!this.rapierLoaded && attempts < 100) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
      }
      if (!this.rapierLoaded) throw new Error('Rapier loading timeout');
    }

    async waitForGLTFLoader() {
      if (this.gltfLoaderLoaded) return;
      
      let attempts = 0;
      while (!this.gltfLoaderLoaded && attempts < 100) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
        if (typeof THREE.GLTFLoader !== 'undefined') {
          this.gltfLoaderLoaded = true;
          break;
        }
      }
      
      if (!this.gltfLoaderLoaded) {
        throw new Error('GLTFLoader loading timeout');
      }
    }

    getInfo() {
      return {
        id: 'threedee',
        name: 'e3oT-GTpro',
        color1: '#FF6B6B',
        color2: '#FF5252',
        blocks: [
          {
            opcode: 'init',
            blockType: Scratch.BlockType.COMMAND,
            text: '3Dを初期化する'
          },
          '---',
          {
            opcode: 'addCube',
            blockType: Scratch.BlockType.COMMAND,
            text: '立方体を追加 サイズ [SIZE] 色 [COLOR]',
            arguments: {
              SIZE: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              },
              COLOR: {
                type: Scratch.ArgumentType.COLOR,
                defaultValue: '#ff0000'
              }
            }
          },
          {
            opcode: 'addSphere',
            blockType: Scratch.BlockType.COMMAND,
            text: '球体を追加 半径 [RADIUS] 色 [COLOR]',
            arguments: {
              RADIUS: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              },
              COLOR: {
                type: Scratch.ArgumentType.COLOR,
                defaultValue: '#00ff00'
              }
            }
          },
          {
            opcode: 'addCylinder',
            blockType: Scratch.BlockType.COMMAND,
            text: '円柱を追加 半径 [RADIUS] 高さ [HEIGHT] 色 [COLOR]',
            arguments: {
              RADIUS: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              },
              HEIGHT: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 2
              },
              COLOR: {
                type: Scratch.ArgumentType.COLOR,
                defaultValue: '#0000ff'
              }
            }
          },
          {
            opcode: 'addPlane',
            blockType: Scratch.BlockType.COMMAND,
            text: '平面を追加 幅 [WIDTH] 高さ [HEIGHT] 色 [COLOR]',
            arguments: {
              WIDTH: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 2
              },
              HEIGHT: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 2
              },
              COLOR: {
                type: Scratch.ArgumentType.COLOR,
                defaultValue: '#ffff00'
              }
            }
          },
          '---',
          {
            opcode: 'loadModelFile',
            blockType: Scratch.BlockType.COMMAND,
            text: '3Dモデルファイルを読み込み 名前 [NAME]',
            arguments: {
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'mymodel'
              }
            }
          },
          {
            opcode: 'addModelFromAsset',
            blockType: Scratch.BlockType.COMMAND,
            text: 'アセット [ASSET_ID] からモデルを追加 スケール [SCALE] 色 [COLOR] 透明度 [OPACITY] 明るさ [BRIGHTNESS]',
            arguments: {
              ASSET_ID: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              },
              SCALE: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              },
              COLOR: {
                type: Scratch.ArgumentType.STRING,
                menu: 'colorOptions',
                defaultValue: 'default'
              },
              OPACITY: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              },
              BRIGHTNESS: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              }
            }
          },
          {
            opcode: 'addModel',
            blockType: Scratch.BlockType.COMMAND,
            text: 'URLからモデルを追加 URL [URL] スケール [SCALE] 色 [COLOR] 透明度 [OPACITY] 明るさ [BRIGHTNESS]',
            arguments: {
              URL: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'https://example.com/model.gltf'
              },
              SCALE: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              },
              COLOR: {
                type: Scratch.ArgumentType.STRING,
                menu: 'colorOptions',
                defaultValue: 'default'
              },
              OPACITY: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              },
              BRIGHTNESS: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              }
            }
          },
          '---',
          {
            opcode: 'enablePhysics',
            blockType: Scratch.BlockType.COMMAND,
            text: '物理エンジンを [ENABLE] にする',
            arguments: {
              ENABLE: {
                type: Scratch.ArgumentType.STRING,
                menu: 'enableOptions',
                defaultValue: 'on'
              }
            }
          },
          {
            opcode: 'setGravity',
            blockType: Scratch.BlockType.COMMAND,
            text: '重力を x:[X] y:[Y] z:[Z] にする',
            arguments: {
              X: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              },
              Y: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: -9.82
              },
              Z: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              }
            }
          },
          {
            opcode: 'addPhysicsToObject',
            blockType: Scratch.BlockType.COMMAND,
            text: 'オブジェクト [ID] に物理を追加 種類 [TYPE] 質量 [MASS] 形状 [SHAPE]',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              },
              TYPE: {
                type: Scratch.ArgumentType.STRING,
                menu: 'physicsTypes',
                defaultValue: 'dynamic'
              },
              MASS: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              },
              SHAPE: {
                type: Scratch.ArgumentType.STRING,
                menu: 'physicsShapes',
                defaultValue: 'box'
              }
            }
          },
          {
            opcode: 'setObjectPhysicsType',
            blockType: Scratch.BlockType.COMMAND,
            text: 'オブジェクト [ID] の物理タイプを [TYPE] にする',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              },
              TYPE: {
                type: Scratch.ArgumentType.STRING,
                menu: 'physicsTypes',
                defaultValue: 'dynamic'
              }
            }
          },
          {
            opcode: 'removePhysicsFromObject',
            blockType: Scratch.BlockType.COMMAND,
            text: 'オブジェクト [ID] から物理を削除',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              }
            }
          },
          {
            opcode: 'setObjectRotationY',
            blockType: Scratch.BlockType.COMMAND,
            text: 'オブジェクト [ID] のY向きを [Y] 度にする',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              },
              Y: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              }
            }
          },
          {
            opcode: 'lockRotation',
            blockType: Scratch.BlockType.COMMAND,
            text: 'オブジェクト [ID] の向きの慣性を [ENABLE] にする',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              },
              ENABLE: {
                type: Scratch.ArgumentType.STRING,
                menu: 'enableOptions',
                defaultValue: 'off'
              }
            }
          },
          {
            opcode: 'setObjectVelocity',
            blockType: Scratch.BlockType.COMMAND,
            text: 'オブジェクト [ID] の速度を x:[X] y:[Y] z:[Z] にする',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              },
              X: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              },
              Y: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              },
              Z: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              }
            }
          },
          {
            opcode: 'setObjectPositionXZ',
            blockType: Scratch.BlockType.COMMAND,
            text: 'オブジェクト [ID] のXZ位置を x:[X] z:[Z] にする (Y位置を維持)',
            arguments: {
              ID: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 },
              X:  { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              Z:  { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }
            }
          },
          {
            opcode: 'setObjectVelocityXZ',
            blockType: Scratch.BlockType.COMMAND,
            text: 'オブジェクト [ID] のXZ速度を x:[X] z:[Z] にする (Y速度を維持)',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              },
              X: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              },
              Z: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              }
            }
          },
          {
            opcode: 'applyForce',
            blockType: Scratch.BlockType.COMMAND,
            text: 'オブジェクト [ID] に力を加える x:[X] y:[Y] z:[Z]',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              },
              X: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              },
              Y: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 10
              },
              Z: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              }
            }
          },
          {
            opcode: 'applyImpulse',
            blockType: Scratch.BlockType.COMMAND,
            text: 'オブジェクト [ID] に衝撃を加える x:[X] y:[Y] z:[Z]',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              },
              X: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              },
              Y: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 5
              },
              Z: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              }
            }
          },
          {
            opcode: 'setObjectMass',
            blockType: Scratch.BlockType.COMMAND,
            text: 'オブジェクト [ID] の質量を [MASS] にする',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              },
              MASS: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              }
            }
          },
          {
            opcode: 'setObjectFriction',
            blockType: Scratch.BlockType.COMMAND,
            text: 'オブジェクト [ID] の摩擦を [FRICTION] にする',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              },
              FRICTION: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0.3
              }
            }
          },
          {
            opcode: 'setObjectRestitution',
            blockType: Scratch.BlockType.COMMAND,
            text: 'オブジェクト [ID] の反発係数を [RESTITUTION] にする',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              },
              RESTITUTION: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0.3
              }
            }
          },
          {
            opcode: 'setColliderOffset',
            blockType: Scratch.BlockType.COMMAND,
            text: 'オブジェクト [ID] の当たり判定位置オフセットを x:[X] y:[Y] z:[Z] にする',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              },
              X: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              },
              Y: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              },
              Z: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              }
            }
          },
          {
            opcode: 'getColliderOffset',
            blockType: Scratch.BlockType.REPORTER,
            text: 'オブジェクト [ID] の当たり判定オフセット [AXIS]',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              },
              AXIS: {
                type: Scratch.ArgumentType.STRING,
                menu: 'axes',
                defaultValue: 'y'
              }
            }
          },
          {
            opcode: 'setCollisionSize',
            blockType: Scratch.BlockType.COMMAND,
            text: 'オブジェクト [ID] の当たり判定サイズを x:[X] y:[Y] z:[Z] にする',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              },
              X: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              },
              Y: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              },
              Z: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              }
            }
          },
          {
            opcode: 'getCollisionSize',
            blockType: Scratch.BlockType.REPORTER,
            text: 'オブジェクト [ID] の当たり判定サイズ [AXIS]',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              },
              AXIS: {
                type: Scratch.ArgumentType.STRING,
                menu: 'axes',
                defaultValue: 'x'
              }
            }
          },
          {
            opcode: 'setRoundRadius',
            blockType: Scratch.BlockType.COMMAND,
            text: 'オブジェクト [ID] の角丸半径を [RADIUS] にする (0〜0.5)',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              },
              RADIUS: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0.1
              }
            }
          },
          {
            opcode: 'getRoundRadius',
            blockType: Scratch.BlockType.REPORTER,
            text: 'オブジェクト [ID] の角丸半径',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              }
            }
          },
          {
            opcode: 'showCollisionBox',
            blockType: Scratch.BlockType.COMMAND,
            text: 'オブジェクト [ID] の当たり判定を表示 [SHOW]',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              },
              SHOW: {
                type: Scratch.ArgumentType.STRING,
                menu: 'enableOptions',
                defaultValue: 'on'
              }
            }
          },
          '---',
          {
            opcode: 'isColliding',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'オブジェクト [ID1] と [ID2] が衝突している',
            arguments: {
              ID1: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              },
              ID2: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 2
              }
            }
          },
          {
            opcode: 'isCollidingWithAny',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'オブジェクト [ID] が何かと衝突している',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              }
            }
          },
          {
            opcode: 'getLastCollisionPartner',
            blockType: Scratch.BlockType.REPORTER,
            text: 'オブジェクト [ID] が最後に衝突した相手のID',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              }
            }
          },
          {
            opcode: 'clearCollisionHistory',
            blockType: Scratch.BlockType.COMMAND,
            text: '衝突リストをクリア'
          },
          '---',
          {
            opcode: 'setObjectPosition',
            blockType: Scratch.BlockType.COMMAND,
            text: 'オブジェクト [ID] の位置を x:[X] y:[Y] z:[Z] にする',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              },
              X: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              },
              Y: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              },
              Z: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              }
            }
          },
          {
            opcode: 'moveObject',
            blockType: Scratch.BlockType.COMMAND,
            text: 'オブジェクト [ID] を x:[X] y:[Y] z:[Z] だけ移動',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              },
              X: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              },
              Y: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              },
              Z: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              }
            }
          },
          {
            opcode: 'setObjectRotation',
            blockType: Scratch.BlockType.COMMAND,
            text: 'オブジェクト [ID] の向きを x:[X] y:[Y] z:[Z] 度にする',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              },
              X: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              },
              Y: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              },
              Z: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              }
            }
          },
          {
            opcode: 'rotateObject',
            blockType: Scratch.BlockType.COMMAND,
            text: 'オブジェクト [ID] を x:[X] y:[Y] z:[Z] 度回転',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              },
              X: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              },
              Y: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              },
              Z: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              }
            }
          },
          {
            opcode: 'setObjectScale',
            blockType: Scratch.BlockType.COMMAND,
            text: 'オブジェクト [ID] の大きさを x:[X] y:[Y] z:[Z] 倍にする',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              },
              X: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              },
              Y: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              },
              Z: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              }
            }
          },
          {
            opcode: 'setObjectColor',
            blockType: Scratch.BlockType.COMMAND,
            text: 'オブジェクト [ID] の色を [COLOR] にする',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              },
              COLOR: {
                type: Scratch.ArgumentType.COLOR,
                defaultValue: '#ff0000'
              }
            }
          },
          {
            opcode: 'setObjectOpacity',
            blockType: Scratch.BlockType.COMMAND,
            text: 'オブジェクト [ID] の透明度を [OPACITY] にする',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              },
              OPACITY: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              }
            }
          },
          {
            opcode: 'setObjectBrightness',
            blockType: Scratch.BlockType.COMMAND,
            text: 'オブジェクト [ID] の明るさを [BRIGHTNESS] にする',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              },
              BRIGHTNESS: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              }
            }
          },
          {
            opcode: 'removeObject',
            blockType: Scratch.BlockType.COMMAND,
            text: 'オブジェクト [ID] を削除',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              }
            }
          },
          '---',
          {
            opcode: 'followObjectWithCamera',
            blockType: Scratch.BlockType.COMMAND,
            text: 'カメラでオブジェクト [ID] を 向きオフセット +x [ANGLE] 度で x:[X] y:[Y] z:[Z] のオフセットで追尾',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              },
              ANGLE: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              },
              X: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              },
              Y: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 3
              },
              Z: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 5
              }
            }
          },
          {
            opcode: 'setCameraPosition',
            blockType: Scratch.BlockType.COMMAND,
            text: 'カメラの位置を x:[X] y:[Y] z:[Z] にする',
            arguments: {
              X: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              },
              Y: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              },
              Z: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 5
              }
            }
          },
          {
            opcode: 'moveCamera',
            blockType: Scratch.BlockType.COMMAND,
            text: 'カメラを x:[X] y:[Y] z:[Z] だけ移動',
            arguments: {
              X: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              },
              Y: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              },
              Z: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              }
            }
          },
          {
            opcode: 'setCameraRotation',
            blockType: Scratch.BlockType.COMMAND,
            text: 'カメラの向きを x:[X] y:[Y] z:[Z] 度にする',
            arguments: {
              X: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              },
              Y: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              },
              Z: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              }
            }
          },
          {
            opcode: 'lookAtObject',
            blockType: Scratch.BlockType.COMMAND,
            text: 'カメラでオブジェクト [ID] を見る',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              }
            }
          },
          {
            opcode: 'lookAtPosition',
            blockType: Scratch.BlockType.COMMAND,
            text: 'カメラで位置 x:[X] y:[Y] z:[Z] を見る',
            arguments: {
              X: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              },
              Y: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              },
              Z: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              }
            }
          },
          '---',
          {
            opcode: 'set3DDepth',
            blockType: Scratch.BlockType.COMMAND,
            text: '3Dの表示位置を [DEPTH] にする',
            arguments: {
              DEPTH: {
                type: Scratch.ArgumentType.STRING,
                menu: 'depthModes',
                defaultValue: 'front'
              }
            }
          },
          {
            opcode: 'setSkyColor',
            blockType: Scratch.BlockType.COMMAND,
            text: '空の色を [COLOR] グラデーション強さ [STRENGTH] 範囲 [SIZE] にする',
            arguments: {
              COLOR: {
                type: Scratch.ArgumentType.COLOR,
                defaultValue: '#87CEEB'
              },
              STRENGTH: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1.0
              },
              SIZE: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1.0
              }
            }
          },
          {
            opcode: 'setSkyEnabled',
            blockType: Scratch.BlockType.COMMAND,
            text: '空の表示を [STATE] にする',
            arguments: {
              STATE: {
                type: Scratch.ArgumentType.STRING,
                menu: 'enableOptions',
                defaultValue: 'on'
              }
            }
          },
          {
            opcode: 'setBgRemoval',
            blockType: Scratch.BlockType.COMMAND,
            text: '背景除去を [STATE] にする',
            arguments: {
              STATE: {
                type: Scratch.ArgumentType.STRING,
                menu: 'enableOptions',
                defaultValue: 'on'
              }
            }
          },
          {
            opcode: 'addBgRemovalColor',
            blockType: Scratch.BlockType.COMMAND,
            text: '背景除去色を追加 色: [COLOR] 許容値: [TOL] フェード: [FEATHER]',
            arguments: {
              COLOR: {
                type: Scratch.ArgumentType.COLOR,
                defaultValue: '#ffffff'
              },
              TOL: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 30
              },
              FEATHER: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 15
              }
            }
          },
          {
            opcode: 'clearBgRemovalColors',
            blockType: Scratch.BlockType.COMMAND,
            text: '背景除去色をすべてクリア'
          },
          {
            opcode: 'set3DOpacity',
            blockType: Scratch.BlockType.COMMAND,
            text: '3Dの透明度を [OPACITY] にする',
            arguments: {
              OPACITY: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0.9
              }
            }
          },
          {
            opcode: 'setBlendMode',
            blockType: Scratch.BlockType.COMMAND,
            text: '3Dの合成モードを [MODE] にする',
            arguments: {
              MODE: {
                type: Scratch.ArgumentType.STRING,
                menu: 'blendModes',
                defaultValue: 'normal'
              }
            }
          },
          {
            opcode: 'enable3DRendering',
            blockType: Scratch.BlockType.COMMAND,
            text: '3D描画を [ENABLE] にする',
            arguments: {
              ENABLE: {
                type: Scratch.ArgumentType.STRING,
                menu: 'enableOptions',
                defaultValue: 'on'
              }
            }
          },
          '---',
          {
            opcode: 'addLight',
            blockType: Scratch.BlockType.COMMAND,
            text: '[TYPE] ライトを追加 色 [COLOR] 強度 [INTENSITY]',
            arguments: {
              TYPE: {
                type: Scratch.ArgumentType.STRING,
                menu: 'lightTypes',
                defaultValue: 'directional'
              },
              COLOR: {
                type: Scratch.ArgumentType.COLOR,
                defaultValue: '#ffffff'
              },
              INTENSITY: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              }
            }
          },
          {
            opcode: 'setLightPosition',
            blockType: Scratch.BlockType.COMMAND,
            text: 'ライト [ID] の位置を x:[X] y:[Y] z:[Z] にする',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 3
              },
              X: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              },
              Y: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              },
              Z: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              }
            }
          },
          {
            opcode: 'setupCSM',
            blockType: Scratch.BlockType.COMMAND,
            text: 'CSM影を設定する カスケード数:[CASCADES] 最大距離:[DISTANCE] 解像度:[MAPSIZE]',
            arguments: {
              CASCADES: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 3
              },
              DISTANCE: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 100
              },
              MAPSIZE: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1024
              }
            }
          },
          {
            opcode: 'enableCSM',
            blockType: Scratch.BlockType.COMMAND,
            text: 'CSM影を [ENABLE] にする',
            arguments: {
              ENABLE: {
                type: Scratch.ArgumentType.STRING,
                menu: 'enableOptions',
                defaultValue: 'on'
              }
            }
          },
          '---',
          {
            opcode: 'removeModelAsset',
            blockType: Scratch.BlockType.COMMAND,
            text: 'アセット [ASSET_ID] を削除',
            arguments: {
              // 変更: menu: 'modelAssets'を削除し、typeをNUMBERに変更
              ASSET_ID: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              }
            }
          },
          {
            opcode: 'listModelAssets',
            blockType: Scratch.BlockType.REPORTER,
            text: 'モデルアセット一覧'
          },
          {
            opcode: 'getModelAssetName',
            blockType: Scratch.BlockType.REPORTER,
            text: 'アセット [ASSET_ID] の名前',
            arguments: {
              // 変更: menu: 'modelAssets'を削除し、typeをNUMBERに変更
              ASSET_ID: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              }
            }
          },
          {
            opcode: 'exportProjectData',
            blockType: Scratch.BlockType.REPORTER,
            text: 'プロジェクトデータを書き出し'
          },
          {
            opcode: 'importProjectData',
            blockType: Scratch.BlockType.COMMAND,
            text: 'プロジェクトデータを読み込み [DATA]',
            arguments: {
              DATA: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: ''
              }
            }
          },
          '---',
          {
            opcode: 'getRendererBackend',
            blockType: Scratch.BlockType.REPORTER,
            text: '描画バックエンド'
          },
          {
            opcode: 'getObjectCount',
            blockType: Scratch.BlockType.REPORTER,
            text: 'オブジェクト数'
          },
          {
            opcode: 'getLastObjectId',
            blockType: Scratch.BlockType.REPORTER,
            text: '最後に作成したオブジェクトのID'
          },
          {
            opcode: 'getObjectPosition',
            blockType: Scratch.BlockType.REPORTER,
            text: 'オブジェクト [ID] の [AXIS] 座標',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              },
              AXIS: {
                type: Scratch.ArgumentType.STRING,
                menu: 'axes',
                defaultValue: 'x'
              }
            }
          },
          {
            opcode: 'getObjectVelocity',
            blockType: Scratch.BlockType.REPORTER,
            text: 'オブジェクト [ID] の [AXIS] 速度',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              },
              AXIS: {
                type: Scratch.ArgumentType.STRING,
                menu: 'axes',
                defaultValue: 'x'
              }
            }
          },
          {
            opcode: 'getCameraPosition',
            blockType: Scratch.BlockType.REPORTER,
            text: 'カメラの [AXIS] 座標',
            arguments: {
              AXIS: {
                type: Scratch.ArgumentType.STRING,
                menu: 'axes',
                defaultValue: 'x'
              }
            }
          },
          '---',
          {
            opcode: 'setupCar',
            blockType: Scratch.BlockType.COMMAND,
            text: 'オブジェクト [ID] を車として設定 ギア [GEARS] 段 [GEARMODE] 回転速度 [STEER_SPEED] 速度倍率 [SPEED_SCALE] RPMリミット [RPM_LIMIT]',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              },
              GEARS: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 6
              },
              GEARMODE: {
                type: Scratch.ArgumentType.STRING,
                menu: 'gearModes',
                defaultValue: 'auto'
              },
              STEER_SPEED: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 3
              },
              SPEED_SCALE: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              },
              RPM_LIMIT: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1000
              }
            }
          },
          {
            opcode: 'removeCar',
            blockType: Scratch.BlockType.COMMAND,
            text: 'オブジェクト [ID] の車設定を解除',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              }
            }
          },
          {
            opcode: 'setCarInput',
            blockType: Scratch.BlockType.COMMAND,
            text: 'オブジェクト [ID] を [ACTION] 強さ [VALUE]',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              },
              ACTION: {
                type: Scratch.ArgumentType.STRING,
                menu: 'carInputActions',
                defaultValue: 'accel'
              },
              VALUE: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              }
            }
          },
          {
            opcode: 'clearCarInput',
            blockType: Scratch.BlockType.COMMAND,
            text: 'オブジェクト [ID] の入力をリセット',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              }
            }
          },
          {
            opcode: 'getCarSpeed',
            blockType: Scratch.BlockType.REPORTER,
            text: 'オブジェクト [ID] の速度',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              }
            }
          },
          {
            opcode: 'getCarRPM',
            blockType: Scratch.BlockType.REPORTER,
            text: 'オブジェクト [ID] の現在RPM',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              }
            }
          },
          {
            opcode: 'getCarGear',
            blockType: Scratch.BlockType.REPORTER,
            text: 'オブジェクト [ID] の現在ギア',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              }
            }
          },
          {
            opcode: 'setLowSpeedTurnBoost',
            blockType: Scratch.BlockType.COMMAND,
            text: 'オブジェクト [ID] の低速旋回倍率を [BOOST] にする',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              },
              BOOST: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 3
              }
            }
          },
          {
            opcode: 'setBrakePower',
            blockType: Scratch.BlockType.COMMAND,
            text: 'オブジェクト [ID] のブレーキ力を [POWER] にする',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              },
              POWER: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 15
              }
            }
          },
          '---',
          {
            opcode: 'getChildMeshNames',
            blockType: Scratch.BlockType.REPORTER,
            text: 'オブジェクト [ID] の子メッシュ名一覧',
            arguments: {
              ID: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 }
            }
          },
          {
            opcode: 'showMeshWireframe',
            blockType: Scratch.BlockType.COMMAND,
            text: 'オブジェクト [ID] のメッシュ [MESH_NAME] をワイヤーフレームで表示 [ENABLE]',
            arguments: {
              ID:        { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 },
              MESH_NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'Object_5' },
              ENABLE:    { type: Scratch.ArgumentType.STRING, menu: 'enableOptions', defaultValue: 'on' }
            }
          },
          {
            opcode: 'assignWheelMesh',
            blockType: Scratch.BlockType.COMMAND,
            text: 'オブジェクト [ID] のメッシュ [MESH_NAME] をタイヤ [WHEEL_POS] に割り当て',
            arguments: {
              ID:        { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 },
              MESH_NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'Wheel_FL' },
              WHEEL_POS: { type: Scratch.ArgumentType.STRING, menu: 'wheelPositions', defaultValue: 'FL' }
            }
          },
          {
            opcode: 'setWheelRotationAxis',
            blockType: Scratch.BlockType.COMMAND,
            text: 'オブジェクト [ID] のタイヤ回転軸を [AXIS] にする',
            arguments: {
              ID:   { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 },
              AXIS: { type: Scratch.ArgumentType.STRING, menu: 'wheelAxes', defaultValue: 'x' }
            }
          },
          {
            opcode: 'setWheelRotationScale',
            blockType: Scratch.BlockType.COMMAND,
            text: 'オブジェクト [ID] のタイヤ回転係数を [SCALE] にする',
            arguments: {
              ID:    { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 },
              SCALE: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 }
            }
          },
          {
            opcode: 'setSteeringMeshAngle',
            blockType: Scratch.BlockType.COMMAND,
            text: 'オブジェクト [ID] の前輪ステアリング最大角を [DEGREES] 度にする',
            arguments: {
              ID:      { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 },
              DEGREES: { type: Scratch.ArgumentType.NUMBER, defaultValue: 30 }
            }
          },
          {
            opcode: 'setLateralFriction',
            blockType: Scratch.BlockType.COMMAND,
            text: 'オブジェクト [ID] の横摩擦を [FRICTION] にする (0=氷 / 1=グリップ)',
            arguments: {
              ID:      { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 },
              FRICTION: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 }
            }
          },
          '---',
          {
            opcode: 'setGearShiftPoint',
            blockType: Scratch.BlockType.COMMAND,
            text: '[GEAR] 速を [PERCENT] %で [DIRECTION]',
            arguments: {
              GEAR: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              },
              PERCENT: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 90
              },
              DIRECTION: {
                type: Scratch.ArgumentType.STRING,
                menu: 'shiftDirections',
                defaultValue: 'up'
              }
            }
          },
          {
            opcode: 'shiftGear',
            blockType: Scratch.BlockType.COMMAND,
            text: 'オブジェクト [ID] のギアを [DIRECTION]',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              },
              DIRECTION: {
                type: Scratch.ArgumentType.STRING,
                menu: 'shiftDirections',
                defaultValue: 'up'
              }
            }
          },
          {
            opcode: 'setCarGear',
            blockType: Scratch.BlockType.COMMAND,
            text: 'オブジェクト [ID] のギアを [GEAR] にする (0=N)',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              },
              GEAR: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              }
            }
          },
          '---',
          {
            opcode: 'clearScene',
            blockType: Scratch.BlockType.COMMAND,
            text: 'すべての3Dオブジェクトを削除'
          },
          {
            opcode: 'pause3D',
            blockType: Scratch.BlockType.COMMAND,
            text: '3D描画を一時停止'
          },
          {
            opcode: 'resume3D',
            blockType: Scratch.BlockType.COMMAND,
            text: '3D描画を再開'
          }
        ],
        menus: {
          depthModes: {
            acceptReporters: false,
            items: [
              { text: '最前面', value: 'front' },
              { text: '最背面', value: 'back' },
              { text: 'スプライトの後ろ', value: 'behind' }
            ]
          },
          blendModes: {
            acceptReporters: false,
            items: [
              { text: '通常', value: 'normal' },
              { text: '乗算', value: 'multiply' },
              { text: 'スクリーン', value: 'screen' },
              { text: 'オーバーレイ', value: 'overlay' },
              { text: 'ソフトライト', value: 'soft-light' },
              { text: 'ハードライト', value: 'hard-light' },
              { text: '差', value: 'difference' },
              { text: '除外', value: 'exclusion' }
            ]
          },
          enableOptions: {
            acceptReporters: false,
            items: [
              { text: 'オン', value: 'on' },
              { text: 'オフ', value: 'off' }
            ]
          },
          lightTypes: {
            acceptReporters: false,
            items: [
              { text: '平行光源', value: 'directional' },
              { text: '点光源', value: 'point' },
              { text: '環境光', value: 'ambient' }
            ]
          },
          axes: {
            acceptReporters: false,
            items: [
              { text: 'x', value: 'x' },
              { text: 'y', value: 'y' },
              { text: 'z', value: 'z' }
            ]
          },
          colorOptions: {
            acceptReporters: true,
            items: [
              { text: '元の色', value: 'default' },
              { text: 'カスタム', value: 'custom' }
            ]
          },
          physicsShapes: {
            acceptReporters: false,
            items: [
              { text: '箱型', value: 'box' },
              { text: '角丸箱型', value: 'roundedBox' },
              { text: '球型', value: 'sphere' },
              { text: '円柱型', value: 'cylinder' },
              { text: '凸包 (GLTFモデル向け)', value: 'convexHull' },
              { text: '平面型', value: 'plane' },
              { text: 'メッシュ (静的)', value: 'trimesh' }
            ]
          },
          physicsTypes: {
            acceptReporters: false,
            items: [
              { text: '動的', value: 'dynamic' },
              { text: '静的', value: 'static' }
            ]
          },
          gearModes: {
            acceptReporters: false,
            items: [
              { text: 'オート', value: 'auto' },
              { text: 'セミオート', value: 'semiauto' }
            ]
          },
          carInputActions: {
            acceptReporters: false,
            items: [
              { text: '加速する', value: 'accel' },
              { text: 'ブレーキする', value: 'brake' },
              { text: '右旋回する', value: 'right' },
              { text: '左旋回する', value: 'left' }
            ]
          },
          shiftDirections: {
            acceptReporters: false,
            items: [
              { text: 'あげる', value: 'up' },
              { text: 'さげる', value: 'down' }
            ]
          },
          wheelPositions: {
            acceptReporters: false,
            items: [
              { text: '前左 (FL)', value: 'FL' },
              { text: '前右 (FR)', value: 'FR' },
              { text: '後左 (RL)', value: 'RL' },
              { text: '後右 (RR)', value: 'RR' }
            ]
          },
          wheelAxes: {
            acceptReporters: false,
            items: [
              { text: 'X軸', value: 'x' },
              { text: 'Y軸', value: 'y' },
              { text: 'Z軸', value: 'z' }
            ]
          }
        }
      };
    }

    // 削除: _getModelAssetItems() メソッドは使用されなくなったため削除しました

    initPhysicsWorld() {
      if (this.world) return;
      const RAPIER = this.RAPIER;

      const gravity = { x: 0.0, y: -9.82, z: 0.0 };
      this.world = new RAPIER.World(gravity);

      // Rapier のイベントキューで衝突開始・終了を検出
      this.eventQueue = new RAPIER.EventQueue(true);

      console.log('Physics world initialized with Rapier');
    }

    // Rapier のコリジョンイベントは updatePhysics() 内の drainCollisionEvents で処理
    _processCollisionEvent(handle1, handle2, started) {
      const idA = this.colliderHandleToId.get(handle1);
      const idB = this.colliderHandleToId.get(handle2);
      if (idA == null || idB == null) return;

      const pairKey = idA < idB ? `${idA}-${idB}` : `${idB}-${idA}`;
      if (started) {
        this.collisionPairs.add(pairKey);
        if (!this.collisionHistory.has(idA)) this.collisionHistory.set(idA, []);
        if (!this.collisionHistory.has(idB)) this.collisionHistory.set(idB, []);
        if (!this.collisionHistory.get(idA).includes(idB)) this.collisionHistory.get(idA).push(idB);
        if (!this.collisionHistory.get(idB).includes(idA)) this.collisionHistory.get(idB).push(idA);
        this.lastCollisionPartner.set(idA, idB);
        this.lastCollisionPartner.set(idB, idA);
        console.log(`Collision started: Object ${idA} <-> Object ${idB}`);
      } else {
        this.collisionPairs.delete(pairKey);
        console.log(`Collision ended: Object ${idA} <-> Object ${idB}`);
      }
    }

    isColliding(args) {
      const id1 = Scratch.Cast.toNumber(args.ID1);
      const id2 = Scratch.Cast.toNumber(args.ID2);
      
      const pairKey = id1 < id2 ? `${id1}-${id2}` : `${id2}-${id1}`;
      return this.collisionPairs.has(pairKey);
    }

    isCollidingWithAny(args) {
      const id = Scratch.Cast.toNumber(args.ID);
      
      const history = this.collisionHistory.get(id);
      if (!history || history.length === 0) return false;
      
      for (const pairKey of this.collisionPairs) {
        const [id1, id2] = pairKey.split('-').map(Number);
        if (id1 === id || id2 === id) {
          return true;
        }
      }
      
      return false;
    }

    getLastCollisionPartner(args) {
      const id = Scratch.Cast.toNumber(args.ID);
      return this.lastCollisionPartner.get(id) || 0;
    }

    clearCollisionHistory() {
      this.collisionPairs.clear();
      this.collisionHistory.clear();
      this.lastCollisionPartner.clear();
      console.log('Collision history cleared');
    }

    enablePhysics(args) {
      const enable = args.ENABLE === 'on';
      this.physicsEnabled = enable;
      
      if (enable && !this.world) {
        this.initPhysicsWorld();
      }
      
      console.log('Physics engine:', enable ? 'ON' : 'OFF');
    }

    setGravity(args) {
      if (!this.world) this.initPhysicsWorld();
      this.world.gravity = {
        x: Scratch.Cast.toNumber(args.X),
        y: Scratch.Cast.toNumber(args.Y),
        z: Scratch.Cast.toNumber(args.Z)
      };
      console.log('Gravity set to:', this.world.gravity);
    }

    // Rapier 対応版
    addPhysicsToObject(args) {
        if (!this.isInitialized || !this.world) return;
        const RAPIER = this.RAPIER;

        const id    = Scratch.Cast.toNumber(args.ID);
        const type  = args.TYPE;          // 'dynamic' | 'static'
        const mass  = type === 'static' ? 0 : Math.max(Scratch.Cast.toNumber(args.MASS), 1);
        const shapeType = args.SHAPE;

        const mesh = this.objects.get(id);
        if (!mesh) { console.warn('Object not found:', id); return; }

        // 既存の物理を削除してから再登録
        if (this.physicsBodies.has(id)) this.removePhysicsFromObject({ ID: id });

        // THREE.js のバウンディングボックスからサイズを取得
        const box3 = new THREE.Box3().setFromObject(mesh);
        const size = new THREE.Vector3(); box3.getSize(size);
        const sphereBounds = new THREE.Sphere(); box3.getBoundingSphere(sphereBounds);

        // --- Rapier コライダー記述子を形状に応じて生成 ---
        let colliderDesc;
        if (shapeType === 'box') {
            colliderDesc = RAPIER.ColliderDesc.cuboid(size.x/2, size.y/2, size.z/2);

        } else if (shapeType === 'roundedBox') {
            // borderRadius = 外形短辺の25%。Rapier の roundCuboid は
            // 「innerHalf + borderRadius = outerHalf」なので、
            // innerHalf = outerHalf - borderRadius で渡す。
            // 10%だと体感しにくいため25%に変更。
            const shortSide = Math.min(size.x, size.y, size.z);
            const borderRadius = shortSide * 0.25;
            colliderDesc = RAPIER.ColliderDesc.roundCuboid(
                Math.max(0.001, size.x/2 - borderRadius),
                Math.max(0.001, size.y/2 - borderRadius),
                Math.max(0.001, size.z/2 - borderRadius),
                borderRadius
            );

        } else if (shapeType === 'sphere') {
            colliderDesc = RAPIER.ColliderDesc.ball(sphereBounds.radius);

        } else if (shapeType === 'cylinder') {
            const radius = Math.max(size.x, size.z) / 2;
            colliderDesc = RAPIER.ColliderDesc.cylinder(size.y/2, radius);

        } else if (shapeType === 'plane') {
            // Rapier の halfspace（無限平面）は静的のみ
            colliderDesc = RAPIER.ColliderDesc.halfspace({ x:0, y:1, z:0 });

        } else if (shapeType === 'convexHull') {
            try {
                const points = this._collectConvexPoints(mesh, 256);
                if (points && points.length >= 9) {
                    colliderDesc = RAPIER.ColliderDesc.convexHull(points) ||
                                   RAPIER.ColliderDesc.cuboid(size.x/2, size.y/2, size.z/2);
                } else {
                    colliderDesc = RAPIER.ColliderDesc.cuboid(size.x/2, size.y/2, size.z/2);
                }
            } catch (e) {
                console.warn('convexHull failed, falling back to Box:', e);
                colliderDesc = RAPIER.ColliderDesc.cuboid(size.x/2, size.y/2, size.z/2);
            }

        } else if (shapeType === 'trimesh') {
            // ★ Rapier は Box/Sphere vs Trimesh(静的) を完全サポート
            // 静的Trimeshは頂点をワールド座標で渡し、RigidBodyは原点に置く
            // こうすることでボディのtranslation/rotationによる二重オフセットを防ぐ
            const { verts, indices } = this._collectMeshGeometryWorld(mesh);
            if (verts && indices) {
                colliderDesc = RAPIER.ColliderDesc.trimesh(verts, indices);
            } else {
                console.warn('Trimesh geometry not found, falling back to Box');
                colliderDesc = RAPIER.ColliderDesc.cuboid(size.x/2, size.y/2, size.z/2);
            }

        } else {
            colliderDesc = RAPIER.ColliderDesc.cuboid(size.x/2, size.y/2, size.z/2);
        }

        // コリジョンイベントを有効化
        colliderDesc.setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS);

        // --- RigidBody 記述子 ---
        const rbDesc = type === 'static'
            ? RAPIER.RigidBodyDesc.fixed()
            : RAPIER.RigidBodyDesc.dynamic();

        if (type === 'static' && shapeType === 'trimesh') {
            // Trimeshの頂点がワールド座標なのでRigidBodyは原点に固定
            rbDesc.setTranslation(0, 0, 0);
            rbDesc.setRotation({ x: 0, y: 0, z: 0, w: 1 });
        } else {
            rbDesc.setTranslation(mesh.position.x, mesh.position.y, mesh.position.z);
            rbDesc.setRotation({
                x: mesh.quaternion.x, y: mesh.quaternion.y,
                z: mesh.quaternion.z, w: mesh.quaternion.w
            });
        }

        if (type === 'dynamic') {
            rbDesc.setAngularDamping(0.9);
            rbDesc.setLinearDamping(0.01);
        }

        const rigidBody = this.world.createRigidBody(rbDesc);
        const collider  = this.world.createCollider(colliderDesc, rigidBody);

        // handle → objectId マッピング（衝突イベント解決用）
        this.colliderHandleToId.set(collider.handle, id);

        this.physicsBodies.set(id, {
            rigidBody, collider, mesh,
            _originalMass: mass,
            _offset: { x: 0, y: 0, z: 0 },
            _isTrimeshStatic: (shapeType === 'trimesh' && type === 'static'),
            _roundRadiusRatio: (shapeType === 'roundedBox') ? 0.25 : 0,
            _roundBorderRadius: (shapeType === 'roundedBox')
                ? Math.min(size.x, size.y, size.z) * 0.25
                : 0
        });

        console.log(`Physics added (Rapier) to object ${id}. Type: ${type}, Shape: ${shapeType}`);
    }

    /**
     * メッシュから凸包用の頂点配列を収集し、maxVerts 以下に間引いて返す。
     * 間引きは「等間隔サンプリング」で実装。凸包の精度より生成速度を優先。
     * 戻り値: Float32Array (x,y,z, x,y,z, ...) ローカル座標
     */
    _collectConvexPoints(mesh, maxVerts = 256) {
        const allVerts = [];

        try {
        // Three.js のワールド行列を先に全部確定させる。
        // これをしないと traverse 中に updateMatrixWorld が走り、
        // Rapier の WASM ステップ中に呼ばれると再入エラーになる。
        mesh.updateMatrixWorld(true, true);

        const meshWorldPos  = new THREE.Vector3();  mesh.getWorldPosition(meshWorldPos);
        const meshWorldQuat = new THREE.Quaternion(); mesh.getWorldQuaternion(meshWorldQuat);
        const meshWorldQuatInv = meshWorldQuat.clone().invert();

        const collect = (tm) => {
            const geo = tm.geometry;
            if (!geo || !geo.attributes.position) return;

            const worldScale = new THREE.Vector3(); tm.getWorldScale(worldScale);
            const tmPos  = new THREE.Vector3();  tm.getWorldPosition(tmPos);
            const tmQuat = new THREE.Quaternion(); tm.getWorldQuaternion(tmQuat);
            const relPos  = new THREE.Vector3().subVectors(tmPos, meshWorldPos).applyQuaternion(meshWorldQuatInv);
            const relQuat = meshWorldQuatInv.clone().multiply(tmQuat);

            const pos = geo.attributes.position.array;
            for (let i = 0; i < pos.length; i += 3) {
                const v = new THREE.Vector3(
                    pos[i]   * worldScale.x,
                    pos[i+1] * worldScale.y,
                    pos[i+2] * worldScale.z
                ).applyQuaternion(relQuat).add(relPos);
                allVerts.push(v.x, v.y, v.z);
            }
        };

        if (mesh instanceof THREE.Mesh) {
            collect(mesh);
        } else {
            mesh.traverse(child => { if (child instanceof THREE.Mesh) collect(child); });
        }
        } catch (e) {
            console.warn('_collectConvexPoints error:', e);
            return null;
        }

        if (allVerts.length < 9) return null;

        const totalVerts = allVerts.length / 3;
        if (totalVerts <= maxVerts) {
            return new Float32Array(allVerts);
        }

        // 等間隔サンプリングで maxVerts 頂点に間引く
        const step = totalVerts / maxVerts;
        const sampled = [];
        for (let i = 0; i < maxVerts; i++) {
            const idx = Math.floor(i * step) * 3;
            sampled.push(allVerts[idx], allVerts[idx + 1], allVerts[idx + 2]);
        }
        console.log(`convexHull: ${totalVerts} verts → sampled ${maxVerts}`);
        return new Float32Array(sampled);
    }

    // GLB の全子メッシュ頂点・インデックスをボディローカル座標で統合する
    _collectMeshGeometry(mesh) {
        const allVerts   = [];
        const allIndices = [];
        let vertOffset   = 0;

        const meshWorldPos  = new THREE.Vector3();  mesh.getWorldPosition(meshWorldPos);
        const meshWorldQuat = new THREE.Quaternion(); mesh.getWorldQuaternion(meshWorldQuat);
        const meshWorldQuatInv = meshWorldQuat.clone().invert();

        const collect = (tm) => {
            const geo = tm.geometry;
            if (!geo || !geo.attributes.position) return;

            const worldScale = new THREE.Vector3(); tm.getWorldScale(worldScale);
            const tmPos  = new THREE.Vector3();  tm.getWorldPosition(tmPos);
            const tmQuat = new THREE.Quaternion(); tm.getWorldQuaternion(tmQuat);

            const relPos  = new THREE.Vector3().subVectors(tmPos, meshWorldPos).applyQuaternion(meshWorldQuatInv);
            const relQuat = meshWorldQuatInv.clone().multiply(tmQuat);

            const pos = geo.attributes.position.array;
            const vCount = pos.length / 3;

            for (let i = 0; i < pos.length; i += 3) {
                const v = new THREE.Vector3(
                    pos[i]   * worldScale.x,
                    pos[i+1] * worldScale.y,
                    pos[i+2] * worldScale.z
                ).applyQuaternion(relQuat).add(relPos);
                allVerts.push(v.x, v.y, v.z);
            }

            if (geo.index) {
                for (const idx of geo.index.array) allIndices.push(idx + vertOffset);
            } else {
                for (let i = 0; i < vCount; i++) allIndices.push(i + vertOffset);
            }
            vertOffset += vCount;
        };

        if (mesh instanceof THREE.Mesh) {
            collect(mesh);
        } else {
            mesh.traverse(child => { if (child instanceof THREE.Mesh) collect(child); });
        }

        if (allVerts.length < 9) return { verts: null, indices: null };
        return {
            verts:   new Float32Array(allVerts),
            indices: new Uint32Array(allIndices)
        };
    }

    // 静的Trimesh用：頂点をワールド座標で収集する
    // RigidBodyを原点に置き、頂点座標にワールド変換を焼き込むことで
    // translation/rotationの二重適用を防ぐ
    _collectMeshGeometryWorld(mesh) {
        const allVerts   = [];
        const allIndices = [];
        let vertOffset   = 0;

        const collect = (tm) => {
            const geo = tm.geometry;
            if (!geo || !geo.attributes.position) return;

            // 頂点をワールド座標に変換するマトリクス
            tm.updateWorldMatrix(true, false);
            const mat = tm.matrixWorld;

            const pos = geo.attributes.position.array;
            const vCount = pos.length / 3;

            for (let i = 0; i < pos.length; i += 3) {
                const v = new THREE.Vector3(pos[i], pos[i+1], pos[i+2]).applyMatrix4(mat);
                allVerts.push(v.x, v.y, v.z);
            }

            if (geo.index) {
                for (const idx of geo.index.array) allIndices.push(idx + vertOffset);
            } else {
                for (let i = 0; i < vCount; i++) allIndices.push(i + vertOffset);
            }
            vertOffset += vCount;
        };

        if (mesh instanceof THREE.Mesh) {
            collect(mesh);
        } else {
            mesh.traverse(child => { if (child instanceof THREE.Mesh) collect(child); });
        }

        if (allVerts.length < 9) return { verts: null, indices: null };
        return {
            verts:   new Float32Array(allVerts),
            indices: new Uint32Array(allIndices)
        };
    }

    setObjectPhysicsType(args) {
        if (!this.isInitialized || !this.world) return;
        const id = Scratch.Cast.toNumber(args.ID);
        const type = args.TYPE;
        const physicsData = this.physicsBodies.get(id);
        if (!physicsData) { console.warn('No physics body found for object:', id); return; }

        // Rapier では RigidBody の種別変更は remove → re-create が確実
        // ここでは簡易的に bodyType を切り替える
        if (type === 'static') {
            physicsData.rigidBody.setBodyType(this.RAPIER.RigidBodyType.Fixed);
        } else {
            physicsData.rigidBody.setBodyType(this.RAPIER.RigidBodyType.Dynamic);
        }
        console.log(`Object ${id} physics type set to: ${type}`);
    }

    removePhysicsFromObject(args) {
        if (!this.isInitialized || !this.world) return;
        const id = Scratch.Cast.toNumber(args.ID);
        const physicsData = this.physicsBodies.get(id);
        if (!physicsData) { console.warn('No physics body found for object:', id); return; }

        // colliderHandleToId からも削除
        this.colliderHandleToId.delete(physicsData.collider.handle);
        this.world.removeRigidBody(physicsData.rigidBody); // collider も同時に解放される
        this.physicsBodies.delete(id);
        this.collisionHistory.delete(id);
        this.lastCollisionPartner.delete(id);

        const pairsToDelete = [];
        for (const pairKey of this.collisionPairs) {
            const [id1, id2] = pairKey.split('-').map(Number);
            if (id1 === id || id2 === id) pairsToDelete.push(pairKey);
        }
        pairsToDelete.forEach(key => this.collisionPairs.delete(key));

        const debugMesh = this.debugMeshes.get(id);
        if (debugMesh) { this.scene.remove(debugMesh); this.debugMeshes.delete(id); }

        console.log(`Physics removed from object ${id}`);
    }

    lockRotation(args) {
        const id = Scratch.Cast.toNumber(args.ID);
        const physicsData = this.physicsBodies.get(id);
        if (!physicsData) { console.warn('No physics body found for object:', id); return; }

        // off = 慣性なし（Scratchが向きを完全管理）、on = 通常の物理慣性あり
        const enable = args.ENABLE === 'on';
        physicsData._scratchControlledRot = !enable;
        if (!enable) {
            // 即座に角速度もリセット
            physicsData.rigidBody.setAngvel({ x: 0, y: 0, z: 0 }, true);
        }
        console.log(`Object ${id} rotation inertia: ${enable ? 'ON' : 'OFF'}`);
    }

    setObjectVelocity(args) {
        const id = Scratch.Cast.toNumber(args.ID);
        const physicsData = this.physicsBodies.get(id);
        if (!physicsData) { console.warn('No physics body found for object:', id); return; }
        physicsData.rigidBody.setLinvel(
            { x: Scratch.Cast.toNumber(args.X),
              y: Scratch.Cast.toNumber(args.Y),
              z: Scratch.Cast.toNumber(args.Z) }, true);
    }

    setObjectPositionXZ(args) {
        const id = Scratch.Cast.toNumber(args.ID);
        const obj = this.objects.get(id);
        if (!obj) return;
        const x = Scratch.Cast.toNumber(args.X);
        const z = Scratch.Cast.toNumber(args.Z);
        obj.position.x = x;
        obj.position.z = z;
        const physicsData = this.physicsBodies.get(id);
        if (physicsData) {
            const rb = physicsData.rigidBody;
            const cur = rb.translation();
            rb.setTranslation({ x, y: cur.y, z }, true);
        }
    }

    setObjectVelocityXZ(args) {
        const id = Scratch.Cast.toNumber(args.ID);
        const physicsData = this.physicsBodies.get(id);
        if (!physicsData) { console.warn('No physics body found for object:', id); return; }
        // 現在のY速度を取得して維持する
        const currentVel = physicsData.rigidBody.linvel();
        physicsData.rigidBody.setLinvel({
            x: Scratch.Cast.toNumber(args.X),
            y: currentVel.y,
            z: Scratch.Cast.toNumber(args.Z)
        }, true);
    }

    applyForce(args) {
        const id = Scratch.Cast.toNumber(args.ID);
        const physicsData = this.physicsBodies.get(id);
        if (!physicsData) { console.warn('No physics body found for object:', id); return; }
        physicsData.rigidBody.addForce(
            { x: Scratch.Cast.toNumber(args.X),
              y: Scratch.Cast.toNumber(args.Y),
              z: Scratch.Cast.toNumber(args.Z) }, true);
    }

    applyImpulse(args) {
        const id = Scratch.Cast.toNumber(args.ID);
        const physicsData = this.physicsBodies.get(id);
        if (!physicsData) { console.warn('No physics body found for object:', id); return; }
        physicsData.rigidBody.applyImpulse(
            { x: Scratch.Cast.toNumber(args.X),
              y: Scratch.Cast.toNumber(args.Y),
              z: Scratch.Cast.toNumber(args.Z) }, true);
    }

    setObjectMass(args) {
        const id = Scratch.Cast.toNumber(args.ID);
        const mass = Scratch.Cast.toNumber(args.MASS);
        const physicsData = this.physicsBodies.get(id);
        if (!physicsData) { console.warn('No physics body found for object:', id); return; }

        physicsData._originalMass = mass;
        const rb = physicsData.rigidBody;
        if (rb.isFixed()) {
            console.warn('Cannot set mass for a static body.');
            return;
        }
        // Rapier は MassProperties で質量を上書きできる
        rb.setAdditionalMass(Math.max(mass, 0.01), true);
        console.log(`Object ${id} mass set to: ${mass}`);
    }

    setObjectFriction(args) {
        const id = Scratch.Cast.toNumber(args.ID);
        const friction = Scratch.Cast.toNumber(args.FRICTION);
        const physicsData = this.physicsBodies.get(id);
        
        if (!physicsData) {
            console.warn('No physics body found for object:', id);
            return;
        }

        physicsData.collider.setFriction(friction);
        console.log(`Object ${id} friction set to: ${friction}`);
    }

    setObjectRestitution(args) {
        const id = Scratch.Cast.toNumber(args.ID);
        const restitution = Scratch.Cast.toNumber(args.RESTITUTION);
        const physicsData = this.physicsBodies.get(id);
        
        if (!physicsData) {
            console.warn('No physics body found for object:', id);
            return;
        }

        physicsData.collider.setRestitution(restitution);
        console.log(`Object ${id} restitution set to: ${restitution}`);
    }

    setColliderOffset(args) {
        const id = Scratch.Cast.toNumber(args.ID);
        const physicsData = this.physicsBodies.get(id);
        if (!physicsData) { console.warn('No physics body found for object:', id); return; }

        const ox = Scratch.Cast.toNumber(args.X);
        const oy = Scratch.Cast.toNumber(args.Y);
        const oz = Scratch.Cast.toNumber(args.Z);

        // Rapier ではコライダーの translation を rigidBody ローカル座標で設定できる
        physicsData.collider.setTranslationWrtParent({ x: ox, y: oy, z: oz });
        physicsData._offset = { x: ox, y: oy, z: oz };

        console.log(`Object ${id} collider offset set to (${ox}, ${oy}, ${oz})`);
    }

    getColliderOffset(args) {
        const id = Scratch.Cast.toNumber(args.ID);
        const physicsData = this.physicsBodies.get(id);
        if (!physicsData) return 0;
        const offset = physicsData._offset || { x: 0, y: 0, z: 0 };
        switch (args.AXIS) {
            case 'x': return offset.x;
            case 'y': return offset.y;
            case 'z': return offset.z;
            default:  return 0;
        }
    }

        setCollisionSize(args) {
        const id = Scratch.Cast.toNumber(args.ID);
        const physicsData = this.physicsBodies.get(id);
        if (!physicsData) { console.warn('No physics body found for object:', id); return; }

        const x = Scratch.Cast.toNumber(args.X);
        const y = Scratch.Cast.toNumber(args.Y);
        const z = Scratch.Cast.toNumber(args.Z);
        const RAPIER = this.RAPIER;
        const rb = physicsData.rigidBody;

        // Rapier ではコライダーを削除して新しいサイズで再作成する
        const oldCollider = physicsData.collider;
        const shapeType = oldCollider.shapeType();

        this.colliderHandleToId.delete(oldCollider.handle);
        this.world.removeCollider(oldCollider, false);

        let newDesc;
        if (shapeType === RAPIER.ShapeType.Cuboid) {
            newDesc = RAPIER.ColliderDesc.cuboid(x/2, y/2, z/2);
        } else if (shapeType === RAPIER.ShapeType.RoundCuboid) {
            const ratio = physicsData._roundRadiusRatio || 0.25;
            const borderRadius = Math.min(x, y, z) * ratio;
            newDesc = RAPIER.ColliderDesc.roundCuboid(
                Math.max(0.001, x/2 - borderRadius),
                Math.max(0.001, y/2 - borderRadius),
                Math.max(0.001, z/2 - borderRadius),
                borderRadius
            );
            physicsData._roundBorderRadius = borderRadius;
        } else if (shapeType === RAPIER.ShapeType.Ball) {
            newDesc = RAPIER.ColliderDesc.ball(Math.max(x,y,z)/2);
        } else if (shapeType === RAPIER.ShapeType.Cylinder) {
            newDesc = RAPIER.ColliderDesc.cylinder(y/2, Math.max(x,z)/2);
        } else {
            console.warn('Cannot resize this shape type at runtime. Remove and re-add physics.');
            return;
        }
        newDesc.setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS);
        const newCollider = this.world.createCollider(newDesc, rb);
        physicsData.collider = newCollider;
        this.colliderHandleToId.set(newCollider.handle, id);
        console.log(`Object ${id} collision size updated`);
    }

    getCollisionSize(args) {
        const id = Scratch.Cast.toNumber(args.ID);
        const physicsData = this.physicsBodies.get(id);
        if (!physicsData) return 0;

        const collider = physicsData.collider;
        const RAPIER = this.RAPIER;
        const axis = args.AXIS;
        const st = collider.shapeType();

        if (st === RAPIER.ShapeType.Cuboid) {
            const he = collider.halfExtents();
            switch (axis) {
                case 'x': return he.x * 2;
                case 'y': return he.y * 2;
                case 'z': return he.z * 2;
            }
        } else if (st === RAPIER.ShapeType.Ball) {
            return collider.radius();
        } else if (st === RAPIER.ShapeType.Cylinder) {
            switch (axis) {
                case 'x': return collider.radius() * 2;
                case 'y': return collider.halfHeight() * 2;
                case 'z': return collider.radius() * 2;
            }
        }
        return 0;
    }

    setRoundRadius(args) {
        const id = Scratch.Cast.toNumber(args.ID);
        const ratio = Math.max(0, Math.min(0.5, Scratch.Cast.toNumber(args.RADIUS)));
        const physicsData = this.physicsBodies.get(id);
        if (!physicsData) { console.warn('No physics body found for object:', id); return; }

        const RAPIER = this.RAPIER;
        const rb = physicsData.rigidBody;
        const oldCollider = physicsData.collider;

        // RoundCuboid 以外の形状には適用しない
        if (oldCollider.shapeType() !== RAPIER.ShapeType.RoundCuboid) {
            console.warn(`Object ${id} is not a roundedBox shape. setRoundRadius is only for 角丸箱型.`);
            return;
        }

        // 現在の innerHalf + 保存済み borderRadius から外形を正確に復元
        const he = oldCollider.halfExtents(); // inner half extents
        const oldBorderRadius = physicsData._roundBorderRadius || 0;
        // outerHalf = innerHalf + oldBorderRadius
        const outerHalfX = he.x + oldBorderRadius;
        const outerHalfY = he.y + oldBorderRadius;
        const outerHalfZ = he.z + oldBorderRadius;

        // 新しい borderRadius = 外形短辺 * ratio
        const borderRadius = Math.min(outerHalfX, outerHalfY, outerHalfZ) * 2 * ratio;
        const innerHalfX = Math.max(0.001, outerHalfX - borderRadius);
        const innerHalfY = Math.max(0.001, outerHalfY - borderRadius);
        const innerHalfZ = Math.max(0.001, outerHalfZ - borderRadius);

        this.colliderHandleToId.delete(oldCollider.handle);
        this.world.removeCollider(oldCollider, false);

        const newDesc = RAPIER.ColliderDesc.roundCuboid(
            Math.max(0.001, innerHalfX),
            Math.max(0.001, innerHalfY),
            Math.max(0.001, innerHalfZ),
            Math.max(0.001, borderRadius)
        );
        newDesc.setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS);

        const newCollider = this.world.createCollider(newDesc, rb);
        physicsData.collider = newCollider;
        physicsData._roundRadiusRatio   = ratio;
        physicsData._roundBorderRadius  = borderRadius;
        this.colliderHandleToId.set(newCollider.handle, id);
        console.log(`Object ${id} round radius ratio set to: ${ratio}`);
    }

    getRoundRadius(args) {
        const id = Scratch.Cast.toNumber(args.ID);
        const physicsData = this.physicsBodies.get(id);
        if (!physicsData) return 0;
        return physicsData._roundRadiusRatio || 0;
    }

    showCollisionBox(args) {
        const id = Scratch.Cast.toNumber(args.ID);
        const show = args.SHOW === 'on';
        const physicsData = this.physicsBodies.get(id);
        if (!physicsData) { console.warn('No physics body for object:', id); return; }

        let debugMesh = this.debugMeshes.get(id);

        if (show) {
            if (!debugMesh) {
                const collider = physicsData.collider;
                const RAPIER = this.RAPIER;
                const st = collider.shapeType();
                let geometry;

                if (st === RAPIER.ShapeType.Cuboid) {
                    const he = collider.halfExtents();
                    geometry = new THREE.BoxGeometry(he.x*2, he.y*2, he.z*2);
                } else if (st === RAPIER.ShapeType.RoundCuboid) {
                    // RoundCuboid: innerHalfExtents + borderRadius が外形サイズ
                    const he = collider.halfExtents();
                    const br = (collider.borderRadius && collider.borderRadius()) ||
                               (physicsData._roundRadiusRatio || 0.10) * Math.min(he.x + 0.001, he.y + 0.001, he.z + 0.001);
                    const ox = he.x + br;  // outer half extents
                    const oy = he.y + br;
                    const oz = he.z + br;
                    const mat2 = new THREE.MeshBasicMaterial({
                        color: 0x00ff00, wireframe: true,
                        transparent: true, opacity: 0.5, depthTest: false
                    });
                    const group = new THREE.Group();
                    // 外形ボックス（辺を結ぶガイド）
                    const boxGeo = new THREE.BoxGeometry(ox*2, oy*2, oz*2);
                    group.add(new THREE.Mesh(boxGeo, mat2));
                    // 8つの角にSphereを置いて角丸を表現
                    const sphereGeo = new THREE.SphereGeometry(br, 8, 6);
                    for (let sx of [-1, 1]) for (let sy of [-1, 1]) for (let sz of [-1, 1]) {
                        const s = new THREE.Mesh(sphereGeo, mat2);
                        s.position.set(sx * he.x, sy * he.y, sz * he.z);
                        group.add(s);
                    }
                    debugMesh = group;
                    this.scene.add(debugMesh);
                    this.debugMeshes.set(id, debugMesh);
                    console.log(`Collision debug (RoundCuboid) shown for object ${id}`);
                    geometry = null; // 以降の汎用Mesh生成をスキップ
                } else if (st === RAPIER.ShapeType.Ball) {
                    geometry = new THREE.SphereGeometry(collider.radius(), 16, 16);
                } else if (st === RAPIER.ShapeType.Cylinder) {
                    geometry = new THREE.CylinderGeometry(
                        collider.radius(), collider.radius(), collider.halfHeight()*2, 16);
                } else if (st === RAPIER.ShapeType.TriMesh) {
                    // Trimesh のワイヤーフレーム表示
                    const verts   = collider.vertices();
                    const indices = collider.indices();
                    geometry = new THREE.BufferGeometry();
                    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(verts), 3));
                    geometry.setIndex(new THREE.BufferAttribute(new Uint32Array(indices), 1));
                } else {
                    // HalfSpace など
                    geometry = new THREE.PlaneGeometry(100, 100);
                }

                const mat = new THREE.MeshBasicMaterial({
                    color: 0x00ff00, wireframe: true,
                    transparent: true, opacity: 0.5, depthTest: false
                });
                if (geometry !== null) {
                    debugMesh = new THREE.Mesh(geometry, mat);
                    this.scene.add(debugMesh);
                    this.debugMeshes.set(id, debugMesh);
                }
                console.log(`Collision debug shown for object ${id}`);
            }
            debugMesh.visible = true;
        } else {
            if (debugMesh) { debugMesh.visible = false; }
        }
    }

    getRendererBackend() {
      if (!this.isInitialized) return '未初期化';
      return this.usingWebGPU ? 'WebGPU' : 'WebGL';
    }

    getObjectCount() {
      return this.objects.size;
    }

    getLastObjectId() {
      return this.nextObjectId - 1;
    }

    getObjectPosition(args) {
      if (!this.isInitialized) return 0;
      const id = Scratch.Cast.toNumber(args.ID);
      const obj = this.objects.get(id);
      if (!obj) return 0;
      
      const axis = args.AXIS;
      switch (axis) {
        case 'x': return obj.position.x;
        case 'y': return obj.position.y;
        case 'z': return obj.position.z;
        default: return 0;
      }
    }

    getObjectVelocity(args) {
      if (!this.world) return 0;
      const id = Scratch.Cast.toNumber(args.ID);
      const physicsData = this.physicsBodies.get(id);
      if (!physicsData) return 0;

      const vel = physicsData.rigidBody.linvel();
      const axis = args.AXIS;
      switch (axis) {
        case 'x': return vel.x;
        case 'y': return vel.y;
        case 'z': return vel.z;
        default: return 0;
      }
    }

    getCameraPosition(args) {
      if (!this.isInitialized) return 0;
      const axis = args.AXIS;
      switch (axis) {
        case 'x': return this.camera.position.x;
        case 'y': return this.camera.position.y;
        case 'z': return this.camera.position.z;
        default: return 0;
      }
    }

    // Rapier 対応版
    updatePhysics() {
        if (!this.physicsEnabled || !this.world) return;

        // ステップ前に static ボディ（trimesh以外）の位置を THREE → Rapier へ同期
        for (const [id, physicsData] of this.physicsBodies) {
            const { rigidBody, mesh, _isTrimeshStatic } = physicsData;
            let fixed = false;
            try { fixed = rigidBody.isFixed(); } catch(e) { continue; }
            if (!fixed || _isTrimeshStatic) continue;
            rigidBody.setTranslation(
                { x: mesh.position.x, y: mesh.position.y, z: mesh.position.z }, false
            );
            rigidBody.setRotation(
                { x: mesh.quaternion.x, y: mesh.quaternion.y,
                  z: mesh.quaternion.z, w: mesh.quaternion.w }, false
            );
        }

        // Scratchから向きを直接制御されているオブジェクトは
        // ステップ前に向きを書き戻し角速度をゼロにする（Rapierの慣性と戦わせない）
        for (const [id, physicsData] of this.physicsBodies) {
            if (!physicsData._scratchControlledRot) continue;
            const { rigidBody, mesh } = physicsData;
            try {
                rigidBody.setRotation(
                    { x: mesh.quaternion.x, y: mesh.quaternion.y,
                      z: mesh.quaternion.z, w: mesh.quaternion.w }, false
                );
                rigidBody.setAngvel({ x: 0, y: 0, z: 0 }, false);
            } catch(e) { /* WASM aliasing guard */ }
        }

        try { this.world.step(this.eventQueue); } catch(e) {
            console.warn('Rapier world.step error:', e);
            return;
        }

        // 衝突イベントをドレインして collisionPairs を更新
        this.eventQueue.drainCollisionEvents((handle1, handle2, started) => {
            this._processCollisionEvent(handle1, handle2, started);
        });

        // dynamic ボディの位置・回転を Rapier → THREE へ同期
        for (const [id, physicsData] of this.physicsBodies) {
            const { rigidBody, mesh } = physicsData;
            let fixed = false;
            try { fixed = rigidBody.isFixed(); } catch(e) { continue; }
            if (fixed) continue;

            const pos  = rigidBody.translation();
            const quat = rigidBody.rotation();
            mesh.position.set(pos.x, pos.y, pos.z);
            mesh.quaternion.set(quat.x, quat.y, quat.z, quat.w);

            const debugMesh = this.debugMeshes.get(id);
            if (debugMesh && debugMesh.visible) {
                debugMesh.position.copy(mesh.position);
                debugMesh.quaternion.copy(mesh.quaternion);
            }
        }
    }

    async loadModelFile(args) {
      await this.waitForThreeJS();
      await this.waitForGLTFLoader();
      
      const name = Scratch.Cast.toString(args.NAME) || 'model';
      
      try {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.gltf,.glb';

        input.onchange = async (event) => {
          const file = event.target.files[0];
          if (!file) {
            console.warn('ファイルが選択されていません');
            return;
          }

          try {
            const reader = new FileReader();
            const fileData = await new Promise((resolve, reject) => {
              reader.onload = () => resolve(reader.result);
              reader.onerror = () => reject(new Error('ファイル読み込みエラー'));
              reader.readAsArrayBuffer(file);
            });

            const assetId = this.nextAssetId++;
            const asset = {
              name: name,
              data: fileData,
              type: file.name.endsWith('.glb') ? 'glb' : 'gltf',
              originalName: file.name
            };
            this.modelAssets.set(assetId, asset);
            
            // this._updateModelAssetMenu(); // 削除したため不要
            console.log(`3Dモデルファイル ${file.name} をアセット ${assetId}: ${name} として読み込みました`);

          } catch (error) {
            console.error('ファイルの読み込み中にエラーが発生しました:', error);
          }
        };

        input.click();

      } catch (error) {
        console.error('モデルファイル読み込みブロックでエラーが発生しました:', error);
      }
    }

    async addModelFromAsset(args) {
      await this.init();
      if (!this.isInitialized || typeof THREE === 'undefined' || !this.GLTFLoader) return;

      const assetId = parseInt(Scratch.Cast.toString(args.ASSET_ID)) || 0;
      const asset = this.modelAssets.get(assetId);

      if (!asset) {
        console.warn(`アセットID ${assetId} が見つかりません`);
        return;
      }
      
      const scale = Scratch.Cast.toNumber(args.SCALE);
      const colorOption = Scratch.Cast.toString(args.COLOR);
      const opacity = Scratch.Cast.toNumber(args.OPACITY);
      const brightness = Scratch.Cast.toNumber(args.BRIGHTNESS);

      try {
        const loader = new this.GLTFLoader();
        const arrayBuffer = asset.data;
        
        // ArrayBufferをBlobに変換し、URLを作成して読み込む
        const blob = new Blob([arrayBuffer], { type: asset.type === 'glb' ? 'model/gltf-binary' : 'model/gltf+json' });
        const url = URL.createObjectURL(blob);

        loader.parse(arrayBuffer, url, (gltf) => {
          const model = gltf.scene;
          model.scale.set(scale, scale, scale);
          
          model.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.castShadow = true;
              child.receiveShadow = true;
              
              if (child.material) {
                // マテリアルをクローンして、オブジェクトごとに個別の設定を可能にする
                const originalMaterial = child.material;
                child.material = originalMaterial.clone();
                
                child.material.transparent = opacity < 1;
                child.material.opacity = opacity;
                
                // 明るさ (Emissive) の設定
                if (child.material.emissive) {
                  child.material.emissive.setRGB(brightness, brightness, brightness);
                } else if (child.material.color) {
                   // Emissiveがない場合はAmbientLightとColorの調整で代用 (簡易的)
                   const newColor = child.material.color.clone().multiplyScalar(1 + brightness);
                   child.material.color.set(newColor);
                }
                
                // カスタム色の設定
                if (colorOption === 'custom' && child.material.color) {
                  const color = '#ff0000'; // Fallback color
                  child.material.color.set(color);
                }
              }
            }
          });

          this.scene.add(model);
          const id = this.nextObjectId++;
          this.objects.set(id, model);
          // CSMが有効なら新しいマテリアルにシェーダーチャンクを適用
          if (this.csm && this.csmEnabled) {
            model.traverse(child => {
              if (child.isMesh && child.material) {
                const mats = Array.isArray(child.material) ? child.material : [child.material];
                mats.forEach(m => this.csm.setupMaterial(m));
              }
            });
          }
          console.log(`アセット ${asset.name} からモデルを追加しました (ID: ${id})`);
          URL.revokeObjectURL(url); // オブジェクトURLを解放
        }, undefined, (error) => {
          console.error(`GLTF/GLB parse error for asset: ${asset.name}`, error);
          URL.revokeObjectURL(url);
        });

      } catch (error) {
        console.error(`アセット読み込みエラー: ${asset.name}`, error);
      }
    }

    async addModel(args, util) {
      await this.init();
      if (!this.isInitialized || typeof THREE === 'undefined' || !this.GLTFLoader) return;

      const url = Scratch.Cast.toString(args.URL);
      const scale = Scratch.Cast.toNumber(args.SCALE);
      const colorOption = Scratch.Cast.toString(args.COLOR);
      const opacity = Scratch.Cast.toNumber(args.OPACITY);
      const brightness = Scratch.Cast.toNumber(args.BRIGHTNESS);

      try {
        const loader = new this.GLTFLoader();

        loader.load(url, (gltf) => {
          const model = gltf.scene;
          model.scale.set(scale, scale, scale);
          
          model.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.castShadow = true;
              child.receiveShadow = true;
              
              if (child.material) {
                // マテリアルをクローンして、オブジェクトごとに個別の設定を可能にする
                const originalMaterial = child.material;
                child.material = originalMaterial.clone();
                
                child.material.transparent = opacity < 1;
                child.material.opacity = opacity;
                
                // 明るさ (Emissive) の設定
                if (child.material.emissive) {
                  child.material.emissive.setRGB(brightness, brightness, brightness);
                } else if (child.material.color) {
                   // Emissiveがない場合はAmbientLightとColorの調整で代用 (簡易的)
                   const newColor = child.material.color.clone().multiplyScalar(1 + brightness);
                   child.material.color.set(newColor);
                }

                // カスタム色の設定
                if (colorOption === 'custom' && child.material.color) {
                  const color = util.colorHelper.inputToHexColor(args.COLOR);
                  child.material.color.set(color);
                }
              }
            }
          });
          
          this.scene.add(model);
          const id = this.nextObjectId++;
          this.objects.set(id, model);
          // CSMが有効なら新しいマテリアルにシェーダーチャンクを適用
          if (this.csm && this.csmEnabled) {
            model.traverse(child => {
              if (child.isMesh && child.material) {
                const mats = Array.isArray(child.material) ? child.material : [child.material];
                mats.forEach(m => this.csm.setupMaterial(m));
              }
            });
          }
          console.log(`URLからモデルを追加しました (ID: ${id})`);
        }, undefined, (error) => {
          console.error('GLTF/GLB load error:', error);
        });

      } catch (error) {
        console.error('モデル追加ブロックでエラーが発生しました:', error);
      }
    }

    removeModelAsset(args) {
      const assetId = parseInt(Scratch.Cast.toString(args.ASSET_ID)) || 0;
      if (this.modelAssets.has(assetId)) {
        const asset = this.modelAssets.get(assetId);
        this.modelAssets.delete(assetId);
        console.log(`アセット ${asset.name} (ID: ${assetId}) を削除しました`);
        // this._updateModelAssetMenu(); // 削除したため不要
      } else {
        console.warn(`アセットID ${assetId} が見つかりません`);
      }
    }

    listModelAssets() {
      const assetList = [];
      for (const [id, asset] of this.modelAssets) {
        assetList.push(`${id}: ${asset.name}`);
      }
      return assetList.join(', ') || 'アセットなし';
    }

    getModelAssetName(args) {
      const assetId = parseInt(Scratch.Cast.toString(args.ASSET_ID)) || 0;
      const asset = this.modelAssets.get(assetId);
      return asset ? asset.name : '';
    }

    exportProjectData() {
        const projectData = {
            version: '1.0',
            modelAssets: {},
            nextAssetId: this.nextAssetId
        };

        for (const [id, asset] of this.modelAssets) {
            const uint8Array = new Uint8Array(asset.data);
            const base64Data = this._arrayBufferToBase64(uint8Array);
            
            projectData.modelAssets[id] = {
                name: asset.name,
                data: base64Data,
                type: asset.type,
                originalName: asset.originalName
            };
        }

        return JSON.stringify(projectData);
    }

    importProjectData(args) {
        const dataStr = Scratch.Cast.toString(args.DATA);
        if (!dataStr) {
            console.warn('データが空です');
            return;
        }

        try {
            const projectData = JSON.parse(dataStr);
            if (!projectData.version || !projectData.modelAssets) {
                throw new Error('無効なデータ形式です');
            }

            // 既存のアセットをクリア (オプション)
            this.modelAssets.clear();
            
            for (const idStr in projectData.modelAssets) {
                const id = parseInt(idStr);
                const assetData = projectData.modelAssets[idStr];
                
                const uint8Array = this._base64ToArrayBuffer(assetData.data);
                
                this.modelAssets.set(id, {
                    name: assetData.name,
                    data: uint8Array,
                    type: assetData.type,
                    originalName: assetData.originalName
                });
            }

            this.nextAssetId = projectData.nextAssetId || 1;
            // this._updateModelAssetMenu(); // 削除したため不要
            console.log('プロジェクトデータを正常に読み込みました');

        } catch (error) {
            console.error('プロジェクトデータの読み込み中にエラーが発生しました:', error);
        }
    }

    _arrayBufferToBase64(buffer) {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    }

    _base64ToArrayBuffer(base64) {
        const binary_string = atob(base64);
        const len = binary_string.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binary_string.charCodeAt(i);
        }
        return bytes.buffer;
    }

    async init() {
      if (this.initPromise) return this.initPromise;
      
      this.initPromise = (async () => {
        await this.waitForThreeJS();
        await this.waitForRapier();
        await this.loadGLTFLoader();

        if (this.isInitialized) return;

        try {
          this.scene = new THREE.Scene();
          this.camera = new THREE.PerspectiveCamera(75, 480 / 360, 0.1, 1000);
          this.camera.position.z = 5;

          // WebGPU 優先、非対応ブラウザは自動で WebGL にフォールバック
          this.renderer = await this._createRenderer();
          this.renderer.setSize(480, 360);
          this.renderer.setClearColor(0x000000, 0);
          this.renderer.shadowMap.enabled = true;
          this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

          // デフォルトのライトを追加
          const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
          directionalLight.position.set(1, 1, 1);
          directionalLight.castShadow = true;
          this.scene.add(directionalLight);
          this.lights.set(1, directionalLight);

          const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
          this.scene.add(ambientLight);
          this.lights.set(2, ambientLight);
          this.nextLightId = 3;
          
          this.initPhysicsWorld();

          this.isInitialized = true;
          this.setupImprovedOverlay();
          this.animate();

          console.log('3D extension with physics and collision detection initialized successfully');
        } catch (error) {
          console.error('3D initialization error:', error);
          this.initPromise = null;
          throw error;
        }
      })();
      
      return this.initPromise;
    }

    // フルスクリーン切り替え時に container を正しい親に移動し直す
    _reattachContainer() {
      if (!this.container) return;

      // フルスクリーン中かどうかを判定
      const fsEl = document.fullscreenElement || document.webkitFullscreenElement;

      let newParent = null;
      if (fsEl) {
        // フルスクリーン要素の中に Scratch canvas があるか確認
        if (fsEl.contains(this.stageCanvas)) {
          newParent = this.stageCanvas?.parentElement || fsEl;
        } else {
          // stageCanvas 自身がフルスクリーン要素になった場合
          newParent = fsEl.parentElement || document.body;
        }
      } else {
        // 通常画面に戻った：元の stageCanvas の親に戻す
        newParent = this.stageCanvas?.parentElement || null;
      }

      if (!newParent) return;
      if (this.container.parentNode === newParent) {
        // 親は同じ → サイズ・z-index だけ更新
        this.updateSizeAndPosition();
        // behind モードなら Scratch canvas の z-index を再パッチ
        if (this.renderOrder === 'behind') this._repatchZIndex();
        return;
      }

      newParent.style.position = newParent.style.position || 'relative';
      newParent.appendChild(this.container);
      this.updateSizeAndPosition();
      if (this.renderOrder === 'behind') this._repatchZIndex();
      console.log('[e3ot] container reattached for fullscreen change');
    }

    // Scratch canvas の z-index を behind モード用に再設定する
    _repatchZIndex() {
      const scratchRenderer = Scratch?.vm?.runtime?.renderer;
      const c = scratchRenderer?.canvas;
      if (c) {
        c.style.position = 'relative';
        c.style.zIndex   = '10';
      }
      // container 自体を最背面に
      if (this.container) this.container.style.zIndex = '0';
    }

    setupImprovedOverlay() {
      this.findAndSetupStageElement();

      this.container = document.createElement('div');
      this.container.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:10;overflow:hidden;';

      // 「後ろ」モード時に3Dの背面に敷く真っ白レイヤー（z-index:0 で最背面）
      this.whiteLayerCanvas = document.createElement('canvas');
      this.whiteLayerCanvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;display:none;z-index:0;pointer-events:none;';
      this.container.appendChild(this.whiteLayerCanvas);

      // 最終表示用2Dキャンバス（liteから移植）
      this.replacementCanvas = document.createElement('canvas');
      this.replacementCanvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;display:block;z-index:1;';
      this.replacementContext = this.replacementCanvas.getContext('2d', { willReadFrequently: true, alpha: true });
      this.container.appendChild(this.replacementCanvas);

      // Three.jsレンダラー（非表示だが有効 - replacementCanvasに転写するため）
      this.renderer.domElement.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;opacity:0;pointer-events:none;z-index:0;';
      this.container.appendChild(this.renderer.domElement);

      if (this.stageElement?.parentElement) {
        this.stageElement.parentElement.style.position = 'relative';
        this.stageElement.parentElement.appendChild(this.container);
      } else if (this.stageElement) {
        const parent = this.stageElement.parentElement || this.stageElement.parentNode;
        if (parent) {
          parent.style.position = 'relative';
          parent.appendChild(this.container);
        } else {
          document.body.appendChild(this.container);
        }
      } else {
        document.body.appendChild(this.container);
      }

      this.startImprovedSizeMonitoring();

      // 即時サイズ同期（旗連打対策）
      setTimeout(() => {
        this.updateSizeAndPosition();
      }, 100);

      console.log('Improved overlay setup complete (with replacement canvas)');
    }

    findAndSetupStageElement() {
      // TurboWarp固有のセレクタを優先（liteから移植）
      const selectors = [
        '[class*="stage-wrapper"] canvas',
        '[class*="Stage"] canvas',
        '.stage canvas',
        '#stage canvas',
        'canvas'
      ];
      
      for (const selector of selectors) {
        const elements = document.querySelectorAll(selector);
        for (const el of elements) {
          if (el.tagName === 'CANVAS') {
            const rect = el.getBoundingClientRect();
            const gl = el.getContext('webgl') || el.getContext('webgl2') || el.getContext('webgpu');
            if (rect.width > 200 && rect.height > 150 && gl) {
              this.stageCanvas = el;
              this.stageElement = el;
              console.log('Stage found:', rect.width, 'x', rect.height);
              return;
            }
          }
        }
      }
      
      // フォールバック
      const canvases = document.querySelectorAll('canvas');
      for (const c of canvases) {
        const rect = c.getBoundingClientRect();
        if (rect.width > 200 && rect.height > 150) {
          this.stageCanvas = c;
          this.stageElement = c;
          console.log('Stage fallback:', rect.width, 'x', rect.height);
          return;
        }
      }

      if (!this.stageCanvas) {
        console.warn('Could not find Scratch stage canvas. 3D overlay positioning may be incorrect.');
      }
    }

    startImprovedSizeMonitoring() {
      // 既存の監視をクリア
      if (this.resizeObserver) {
        this.resizeObserver.disconnect();
        this.resizeObserver = null;
      }
      if (this.positionUpdateInterval) {
        clearInterval(this.positionUpdateInterval);
        this.positionUpdateInterval = null;
      }
      // boundメソッドで同じ参照を使ってリスナーを正しく解除（バグ修正）
      if (!this._boundResizeHandler) {
        this._boundResizeHandler = () => { setTimeout(() => this.updateSizeAndPosition(), 50); };
      }
      window.removeEventListener('resize', this._boundResizeHandler);

      if (this.stageCanvas && window.ResizeObserver) {
        this.resizeObserver = new ResizeObserver(() => {
          this.updateSizeAndPosition();
        });
        this.resizeObserver.observe(this.stageCanvas);
        if (this.stageCanvas.parentElement) {
            this.resizeObserver.observe(this.stageCanvas.parentElement);
        }
      }

      this.positionUpdateInterval = setInterval(() => {
        this.updateSizeAndPosition();
        this.refreshLuminanceSource(); // 入力元も再検索（liteから移植）
      }, 500);

      window.addEventListener('resize', this._boundResizeHandler);

      // フルスクリーン切り替え時にcontainerを正しい親に付け直す
      if (!this._boundFullscreenHandler) {
        this._boundFullscreenHandler = () => {
          // 少し待ってDOMが落ち着いてから再配置
          setTimeout(() => this._reattachContainer(), 100);
          setTimeout(() => this._reattachContainer(), 400);
        };
      }
      document.removeEventListener('fullscreenchange',       this._boundFullscreenHandler);
      document.removeEventListener('webkitfullscreenchange', this._boundFullscreenHandler);
      document.addEventListener('fullscreenchange',          this._boundFullscreenHandler);
      document.addEventListener('webkitfullscreenchange',    this._boundFullscreenHandler);

      if (window.MutationObserver) {
          const observer = new MutationObserver((mutations) => {
              let shouldUpdate = false;
              for (const mutation of mutations) {
                  if (mutation.type === 'attributes' && (mutation.attributeName === 'style' || mutation.attributeName === 'class')) {
                      shouldUpdate = true;
                      break;
                  }
              }
              if (shouldUpdate) {
                  setTimeout(() => this.updateSizeAndPosition(), 10);
              }
          });

          if (this.stageCanvas) {
              observer.observe(this.stageCanvas, { attributes: true, attributeFilter: ['style', 'class'] });
              if (this.stageCanvas.parentElement) {
                  observer.observe(this.stageCanvas.parentElement, { attributes: true, attributeFilter: ['style', 'class'] });
              }
          }
      }
      
      setTimeout(() => this.updateSizeAndPosition(), 100);
    }

    updateSizeAndPosition() {
      if (!this.renderer || !this.camera || !this.container) return;
      
      let width = 480;
      let height = 360;
      let rect = null;

      if (this.stageCanvas) {
        rect = this.stageCanvas.getBoundingClientRect();
        width = rect.width;
        height = rect.height;
        
        width = Math.max(width, 100);
        height = Math.max(height, 100);

        const devicePixelRatio = window.devicePixelRatio || 1;
        const internalWidth = Math.floor(width * devicePixelRatio);
        const internalHeight = Math.floor(height * devicePixelRatio);

        this.renderer.setSize(internalWidth, internalHeight, false);
        this.renderer.domElement.style.width = width + 'px';
        this.renderer.domElement.style.height = height + 'px';

        // replacementCanvas / whiteLayerCanvas のサイズ同期
        [this.replacementCanvas, this.whiteLayerCanvas].forEach(c => {
          if (c) {
            c.width = internalWidth;
            c.height = internalHeight;
            c.style.width = width + 'px';
            c.style.height = height + 'px';
          }
        });
      } else {
        this.renderer.setSize(width, height);
        this.renderer.domElement.style.width = width + 'px';
        this.renderer.domElement.style.height = height + 'px';
      }

      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();

      this.container.style.width = width + 'px';
      this.container.style.height = height + 'px';
      
      if (rect && this.stageElement) {
        // フルスクリーン中は container が stageCanvas の直近の親にいるはずなので
        // transform ではなく top/left で合わせる。親が同じなら offset=0 になる。
        const parentRect = this.container.parentElement
          ? this.container.parentElement.getBoundingClientRect()
          : { left: 0, top: 0 };
        const offsetLeft = rect.left - parentRect.left;
        const offsetTop  = rect.top  - parentRect.top;
        this.container.style.transform = `translate(${offsetLeft}px, ${offsetTop}px)`;
        
        // zIndexの調整
        if (this.zIndexMode === 'auto') {
            const zIndex = parseInt(this.stageCanvas.style.zIndex) || 0;
            if (this.renderOrder === 'overlay') {
                this.container.style.zIndex = Math.max(10, zIndex + 1);
            } else if (this.renderOrder === 'behind') {
                // clearColorパッチ方式: 3D canvasはScratch canvasの下
                this.container.style.zIndex = '0';
                // behind モードでは Scratch canvas が必ず上に来るよう保証
                this._repatchZIndex();
            } else { // back
                this.container.style.zIndex = '0';
            }
        }
      }
    }

    _requestScratchSnapshot() {
      if (this._snapshotPending) return;
      const scratchRenderer = Scratch?.vm?.runtime?.renderer;
      if (!scratchRenderer?.requestSnapshot) return;
      this._snapshotPending = true;
      scratchRenderer.requestSnapshot((uri) => {
        this._snapshotPending = false;
        // ImageBitmapが使えればデコードを非同期・キャッシュして高速化
        if (window.createImageBitmap) {
          fetch(uri)
            .then(r => r.blob())
            .then(blob => createImageBitmap(blob))
            .then(bmp => { this._scratchSnapshotImg = bmp; })
            .catch(() => {
              // fallback: 通常のImage
              if (!this._scratchSnapshotImg || this._scratchSnapshotImg instanceof HTMLImageElement === false) {
                this._scratchSnapshotImg = new Image();
              }
              this._scratchSnapshotImg.src = uri;
            });
        } else {
          if (!this._scratchSnapshotImg) this._scratchSnapshotImg = new Image();
          this._scratchSnapshotImg.src = uri;
        }
      });
    }

    _renderBehind() {
      const w = this.replacementCanvas.width;
      const h = this.replacementCanvas.height;
      if (!w || !h) return;

      const ctx = this.replacementContext;

      // 1. 3D を奥に描く
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(this.renderer.domElement, 0, 0, w, h);

      const img = this._scratchSnapshotImg;
      if (!img) return;
      // ImageBitmap か Image かで完了判定が異なる
      if (img instanceof ImageBitmap === false && (!img.complete || !img.naturalWidth)) return;

      // 2. Scratch画面を背景除去してから前面に描く
      if (this.bgRemovalEnabled && this.bgRemovalColors.length > 0) {
        if (!this._bgRemovalCanvas ||
            this._bgRemovalCanvas.width !== w ||
            this._bgRemovalCanvas.height !== h) {
          this._bgRemovalCanvas = document.createElement('canvas');
          this._bgRemovalCanvas.width = w;
          this._bgRemovalCanvas.height = h;
          this._bgRemovalContext = this._bgRemovalCanvas.getContext('2d', { willReadFrequently: true });
        }
        const bCtx = this._bgRemovalContext;
        bCtx.clearRect(0, 0, w, h);
        bCtx.drawImage(img, 0, 0, w, h);

        const imgData = bCtx.getImageData(0, 0, w, h);
        const d = imgData.data;
        const colors = this.bgRemovalColors;

        for (let i = 0; i < d.length; i += 4) {
          const pr = d[i], pg = d[i+1], pb = d[i+2];
          let minAlpha = d[i+3]; // 複数色のうち最も透明にするものを採用

          for (const c of colors) {
            const dist = Math.max(
              Math.abs(pr - c.r),
              Math.abs(pg - c.g),
              Math.abs(pb - c.b)
            );
            const feather = Math.min(c.feather, c.tol);
            let a;
            if (dist <= c.tol - feather) {
              a = 0;
            } else if (dist <= c.tol) {
              const t = (dist - (c.tol - feather)) / feather;
              a = Math.round(d[i+3] * t);
            } else {
              continue; // この色には該当しない
            }
            if (a < minAlpha) minAlpha = a;
          }
          d[i+3] = minAlpha;
        }
        bCtx.putImageData(imgData, 0, 0);
        ctx.drawImage(this._bgRemovalCanvas, 0, 0, w, h);
      } else {
        ctx.drawImage(img, 0, 0, w, h);
      }
    }

    animate(now) {
      if (!this.isInitialized || !this.enable3D) return;

      this.animationId = requestAnimationFrame(this._boundAnimate);

      // デルタタイム計算（初回・復帰後はスパイクしないようリセット）
      if (this._lastFrameTime === undefined) this._lastFrameTime = now;
      const rawDelta = (now - this._lastFrameTime) / 1000;
      this._lastFrameTime = now;
      const clampedDelta = Math.min(rawDelta, this.timeStep * 3);

      // 固定タイムステップ物理（accumulatorパターン）
      if (this.physicsEnabled && this.world) {
        this._physicsAccumulator = (this._physicsAccumulator || 0) + clampedDelta;
        while (this._physicsAccumulator >= this.timeStep) {
          this.updatePhysics();
          this._physicsAccumulator -= this.timeStep;
        }
      }

      // 車コントローラー更新
      if (this.carControllers.size > 0) {
        this._updateAllCars(clampedDelta);
      }

      // カメラフォロー：毎フレーム適用（Scratchティックと非同期でもガタつかない）
      if (this._cameraFollow) {
        const cf  = this._cameraFollow;
        const obj = this.objects.get(cf.id);
        if (obj) {
          // オブジェクトのY軸回転に角度オフセットを加えたQuaternionを計算
          const angleRad  = (cf.angle || 0) * (Math.PI / 180);
          const yawOffset = new THREE.Quaternion().setFromAxisAngle(
            new THREE.Vector3(0, 1, 0), angleRad
          );
          const followQuat = obj.quaternion.clone().multiply(yawOffset);

          const offset = new THREE.Vector3(cf.ox, cf.oy, cf.oz);
          offset.applyQuaternion(followQuat);
          this.camera.position.copy(obj.position).add(offset);
          this.camera.quaternion.copy(followQuat);
        }
      }


      // CSM: カメラ移動に合わせてシャドウ分割を毎フレーム更新
      if (this.csm && this.csmEnabled) {
        this.csm.update();
      }


      this.renderer.render(this.scene, this.camera);

      // replacementCanvasに転写（blend modeに対応）
      if (this.replacementContext && this.replacementCanvas) {
        if (this.renderOrder === 'behind') {
          // clearColorパッチ方式: Scratch canvas が透明になっているので
          // replacementCanvas には 3D だけ描けばよい
          const w = this.replacementCanvas.width;
          const h = this.replacementCanvas.height;
          this.replacementContext.clearRect(0, 0, w, h);
          this.replacementContext.drawImage(this.renderer.domElement, 0, 0, w, h);

          // 3Dレイヤーの背面に背景レイヤーを描画（空グラデーション or 白）
          if (this.whiteLayerCanvas) {
            const wlCtx = this.whiteLayerCanvas.getContext('2d');
            if (wlCtx) {
              this.whiteLayerCanvas.width = w;
              this.whiteLayerCanvas.height = h;
              if (this.skyEnabled) {
                // 空色グラデーション
                // グラデーションがかかる高さ = h * skyGradientSize（0なら全面ベタ）
                const gradH = Math.min(1.0, Math.max(0.0, this.skyGradientSize));
                const stopY  = h * gradH; // ここより下は白
                // skyColor を RGB に分解して白(255,255,255)に向かうグラデを作る
                const hex = this.skyColor.replace('#', '');
                const sr = parseInt(hex.substring(0, 2), 16);
                const sg = parseInt(hex.substring(2, 4), 16);
                const sb = parseInt(hex.substring(4, 6), 16);
                // strength: 0=グラデなし(全面ベタ白) 〜 1=空色から白へフル
                const strength = Math.min(1.0, Math.max(0.0, this.skyGradientStrength));
                // グラデーション: 上端=空色(alpha=strength), 下端(stopY)=白
                const grad = wlCtx.createLinearGradient(0, 0, 0, stopY > 0 ? stopY : h);
                grad.addColorStop(0,   `rgba(${sr},${sg},${sb},1)`);
                grad.addColorStop(1,   `rgba(255,255,255,${1 - strength})`);
                // まず白で塗りつぶし
                wlCtx.fillStyle = '#ffffff';
                wlCtx.fillRect(0, 0, w, h);
                // グラデーションを上からstopYまで重ねる
                wlCtx.fillStyle = grad;
                wlCtx.fillRect(0, 0, w, stopY > 0 ? stopY : h);
              } else {
                wlCtx.fillStyle = '#ffffff';
                wlCtx.fillRect(0, 0, w, h);
              }
            }
          }
        } else {
          const w = this.replacementCanvas.width;
          const h = this.replacementCanvas.height;
          this.replacementContext.clearRect(0, 0, w, h);
          this.replacementContext.drawImage(this.renderer.domElement, 0, 0, w, h);
        }
      }
    }

    async addCube(args) {
      await this.init();
      if (!this.isInitialized || typeof THREE === 'undefined') return;

      const size = Scratch.Cast.toNumber(args.SIZE);
      const color = args.COLOR;

      const geometry = new THREE.BoxGeometry(size, size, size);
      const material = new THREE.MeshPhongMaterial({ 
        color: parseInt(color.slice(1), 16), 
        transparent: true, 
        opacity: 1 
      });
      
      const cube = new THREE.Mesh(geometry, material);
      cube.castShadow = true;
      cube.receiveShadow = true;
      this.scene.add(cube);
      
      const id = this.nextObjectId++;
      this.objects.set(id, cube);
      // CSMが有効なら新しいマテリアルにシェーダーチャンクを適用
      if (this.csm && this.csmEnabled) {
        const mats = Array.isArray(cube.material) ? cube.material : [cube.material];
        mats.forEach(m => this.csm.setupMaterial(m));
      }
      console.log(`立方体を追加しました (ID: ${id})`);
    }

    async addSphere(args) {
      await this.init();
      if (!this.isInitialized || typeof THREE === 'undefined') return;

      const radius = Scratch.Cast.toNumber(args.RADIUS);
      const color = args.COLOR;

      const geometry = new THREE.SphereGeometry(radius, 32, 32);
      const material = new THREE.MeshPhongMaterial({ 
        color: parseInt(color.slice(1), 16), 
        transparent: true, 
        opacity: 1 
      });
      
      const sphere = new THREE.Mesh(geometry, material);
      sphere.castShadow = true;
      sphere.receiveShadow = true;
      this.scene.add(sphere);
      
      const id = this.nextObjectId++;
      this.objects.set(id, sphere);
      // CSMが有効なら新しいマテリアルにシェーダーチャンクを適用
      if (this.csm && this.csmEnabled) {
        const mats = Array.isArray(sphere.material) ? sphere.material : [sphere.material];
        mats.forEach(m => this.csm.setupMaterial(m));
      }
      console.log(`球体を追加しました (ID: ${id})`);
    }

    async addCylinder(args) {
      await this.init();
      if (!this.isInitialized || typeof THREE === 'undefined') return;

      const radius = Scratch.Cast.toNumber(args.RADIUS);
      const height = Scratch.Cast.toNumber(args.HEIGHT);
      const color = args.COLOR;

      const geometry = new THREE.CylinderGeometry(radius, radius, height, 32);
      const material = new THREE.MeshPhongMaterial({ 
        color: parseInt(color.slice(1), 16), 
        transparent: true, 
        opacity: 1 
      });
      
      const cylinder = new THREE.Mesh(geometry, material);
      cylinder.castShadow = true;
      cylinder.receiveShadow = true;
      this.scene.add(cylinder);
      
      const id = this.nextObjectId++;
      this.objects.set(id, cylinder);
      // CSMが有効なら新しいマテリアルにシェーダーチャンクを適用
      if (this.csm && this.csmEnabled) {
        const mats = Array.isArray(cylinder.material) ? cylinder.material : [cylinder.material];
        mats.forEach(m => this.csm.setupMaterial(m));
      }
      console.log(`円柱を追加しました (ID: ${id})`);
    }

    async addPlane(args) {
      await this.init();
      if (!this.isInitialized || typeof THREE === 'undefined') return;

      const width = Scratch.Cast.toNumber(args.WIDTH);
      const height = Scratch.Cast.toNumber(args.HEIGHT);
      const color = args.COLOR;

      const geometry = new THREE.PlaneGeometry(width, height);
      const material = new THREE.MeshPhongMaterial({ 
        color: parseInt(color.slice(1), 16), 
        transparent: true, 
        opacity: 1, 
        side: THREE.DoubleSide 
      });
      
      const plane = new THREE.Mesh(geometry, material);
      plane.castShadow = true;
      plane.receiveShadow = true;
      this.scene.add(plane);
      
      const id = this.nextObjectId++;
      this.objects.set(id, plane);
      // CSMが有効なら新しいマテリアルにシェーダーチャンクを適用
      if (this.csm && this.csmEnabled) {
        const mats = Array.isArray(plane.material) ? plane.material : [plane.material];
        mats.forEach(m => this.csm.setupMaterial(m));
      }
      console.log(`平面を追加しました (ID: ${id})`);
    }

    setObjectPosition(args) {
      if (!this.isInitialized) return;
      const id = Scratch.Cast.toNumber(args.ID);
      const obj = this.objects.get(id);
      if (!obj) return;

      const x = Scratch.Cast.toNumber(args.X);
      const y = Scratch.Cast.toNumber(args.Y);
      const z = Scratch.Cast.toNumber(args.Z);

      obj.position.set(x, y, z);
      
      const physicsData = this.physicsBodies.get(id);
      if (physicsData) {
        const rb = physicsData.rigidBody;
        rb.setTranslation({ x, y, z }, true);
        rb.setLinvel({ x: 0, y: 0, z: 0 }, true);
        rb.setAngvel({ x: 0, y: 0, z: 0 }, true);
      }
    }

    moveObject(args) {
      if (!this.isInitialized) return;
      const id = Scratch.Cast.toNumber(args.ID);
      const obj = this.objects.get(id);
      if (!obj) return;

      obj.position.x += Scratch.Cast.toNumber(args.X);
      obj.position.y += Scratch.Cast.toNumber(args.Y);
      obj.position.z += Scratch.Cast.toNumber(args.Z);
      
      const physicsData = this.physicsBodies.get(id);
      if (physicsData) {
        const p = obj.position;
        physicsData.rigidBody.setTranslation({ x: p.x, y: p.y, z: p.z }, true);
      }
    }

    setObjectRotation(args) {
      if (!this.isInitialized) return;
      const id = Scratch.Cast.toNumber(args.ID);
      const obj = this.objects.get(id);
      if (!obj) return;

      obj.rotation.x = Scratch.Cast.toNumber(args.X) * (Math.PI/180);
      obj.rotation.y = Scratch.Cast.toNumber(args.Y) * (Math.PI/180);
      obj.rotation.z = Scratch.Cast.toNumber(args.Z) * (Math.PI/180);
      
      const physicsData = this.physicsBodies.get(id);
      if (physicsData) {
        const q = obj.quaternion;
        physicsData.rigidBody.setRotation({ x: q.x, y: q.y, z: q.z, w: q.w }, true);
        physicsData.rigidBody.setAngvel({ x: 0, y: 0, z: 0 }, true);
        physicsData._scratchControlledRot = true;
      }
    }

    setObjectRotationY(args) {
      if (!this.isInitialized) return;
      const id = Scratch.Cast.toNumber(args.ID);
      const obj = this.objects.get(id);
      if (!obj) return;

      const yRad = Scratch.Cast.toNumber(args.Y) * (Math.PI / 180);

      // Rapierの現在quaternionを取得してYのみ差し替え
      // YXZ順で分解：Y成分だけ指定値に、X/Z（地形傾き等）はそのまま維持
      const physicsData = this.physicsBodies.get(id);
      if (physicsData) {
        const rq = physicsData.rigidBody.rotation();
        const currentQuat = new THREE.Quaternion(rq.x, rq.y, rq.z, rq.w);
        const euler = new THREE.Euler().setFromQuaternion(currentQuat, 'YXZ');
        euler.y = yRad;
        obj.quaternion.setFromEuler(euler);

        const q = obj.quaternion;
        physicsData.rigidBody.setRotation({ x: q.x, y: q.y, z: q.z, w: q.w }, true);
        physicsData.rigidBody.setAngvel({ x: 0, y: 0, z: 0 }, true);
        physicsData._scratchControlledRot = true;
      } else {
        // 物理なしの場合も同様にYXZ分解でY差し替え
        const euler = new THREE.Euler().setFromQuaternion(obj.quaternion, 'YXZ');
        euler.y = yRad;
        obj.quaternion.setFromEuler(euler);
      }
    }

    rotateObject(args) {
      if (!this.isInitialized) return;
      const id = Scratch.Cast.toNumber(args.ID);
      const obj = this.objects.get(id);
      if (!obj) return;

      obj.rotation.x += Scratch.Cast.toNumber(args.X) * (Math.PI/180);
      obj.rotation.y += Scratch.Cast.toNumber(args.Y) * (Math.PI/180);
      obj.rotation.z += Scratch.Cast.toNumber(args.Z) * (Math.PI/180);
      
      const physicsData = this.physicsBodies.get(id);
      if (physicsData) {
        const q = obj.quaternion;
        physicsData.rigidBody.setRotation({ x: q.x, y: q.y, z: q.z, w: q.w }, true);
        physicsData.rigidBody.setAngvel({ x: 0, y: 0, z: 0 }, true);
        physicsData._scratchControlledRot = true;
      }
    }

    setObjectScale(args) {
      if (!this.isInitialized) return;
      const id = Scratch.Cast.toNumber(args.ID);
      const obj = this.objects.get(id);
      if (!obj) return;

      const x = Scratch.Cast.toNumber(args.X);
      const y = Scratch.Cast.toNumber(args.Y);
      const z = Scratch.Cast.toNumber(args.Z);

      obj.scale.set(x, y, z);
    }

    setObjectColor(args) {
      if (!this.isInitialized) return;
      const id = Scratch.Cast.toNumber(args.ID);
      const obj = this.objects.get(id);
      if (!obj) return;

      const color = parseInt(args.COLOR.slice(1), 16);
      
      obj.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
            // マテリアルをクローン（GroupはmaterialなしなのでTypeError対策）
            child.material = child.material.clone();

            if (child.material.color) {
                child.material.color.set(color);
            }
        }
      });
    }

    setObjectOpacity(args) {
      if (!this.isInitialized) return;
      const id = Scratch.Cast.toNumber(args.ID);
      const obj = this.objects.get(id);
      if (!obj) return;

      const opacity = Scratch.Cast.toNumber(args.OPACITY);
      
      obj.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
            // マテリアルをクローン（GroupはmaterialなしなのでTypeError対策）
            child.material = child.material.clone();

            child.material.transparent = opacity < 1;
            child.material.opacity = opacity;
        }
      });
    }

    setObjectBrightness(args) {
      if (!this.isInitialized) return;
      const id = Scratch.Cast.toNumber(args.ID);
      const obj = this.objects.get(id);
      if (!obj) return;

      const brightness = Scratch.Cast.toNumber(args.BRIGHTNESS);
      
      obj.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
            // マテリアルをクローン（GroupはmaterialなしなのでTypeError対策）
            child.material = child.material.clone();

            if (child.material.emissive) {
                child.material.emissive.setRGB(brightness, brightness, brightness);
            } else if (child.material.color) {
               // Emissiveがない場合はAmbientLightとColorの調整で代用 (簡易的)
               const newColor = child.material.color.clone().multiplyScalar(1 + brightness);
               child.material.color.set(newColor);
            }
        }
      });
    }

    removeObject(args) {
      if (!this.isInitialized) return;
      const id = Scratch.Cast.toNumber(args.ID);
      const obj = this.objects.get(id);
      if (!obj) return;

      // 物理エンジンから削除
      this.removePhysicsFromObject(args); 

      // シーンから削除し、ジオメトリとマテリアルをクリーンアップ
      this.scene.remove(obj);
      obj.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          if (child.geometry) {
            child.geometry.dispose();
          }
          if (Array.isArray(child.material)) {
            child.material.forEach(material => material.dispose());
          } else if (child.material) {
            child.material.dispose();
          }
        }
      });
      this.objects.delete(id);
      
      console.log(`オブジェクト ${id} を削除しました`);
    }

    followObjectWithCamera(args) {
      if (!this.camera) return;
      const id  = Scratch.Cast.toNumber(args.ID);
      const obj = this.objects.get(id);
      if (!obj) return;
      // 追尾先を登録するだけ。実際のカメラ移動はanimate()で毎フレーム行う
      this._cameraFollow = {
        id,
        angle: Scratch.Cast.toNumber(args.ANGLE),
        ox: Scratch.Cast.toNumber(args.X),
        oy: Scratch.Cast.toNumber(args.Y),
        oz: Scratch.Cast.toNumber(args.Z),
      };
    }

    setCameraPosition(args) {
      if (!this.isInitialized) return;
      this.camera.position.set(
        Scratch.Cast.toNumber(args.X),
        Scratch.Cast.toNumber(args.Y),
        Scratch.Cast.toNumber(args.Z)
      );
    }

    moveCamera(args) {
      if (!this.isInitialized) return;
      this.camera.position.x += Scratch.Cast.toNumber(args.X);
      this.camera.position.y += Scratch.Cast.toNumber(args.Y);
      this.camera.position.z += Scratch.Cast.toNumber(args.Z);
    }

    setCameraRotation(args) {
      if (!this.isInitialized) return;
      this.camera.rotation.x = Scratch.Cast.toNumber(args.X) * (Math.PI/180);
      this.camera.rotation.y = Scratch.Cast.toNumber(args.Y) * (Math.PI/180);
      this.camera.rotation.z = Scratch.Cast.toNumber(args.Z) * (Math.PI/180);
    }

    lookAtObject(args) {
      if (!this.isInitialized) return;
      const id = Scratch.Cast.toNumber(args.ID);
      const obj = this.objects.get(id);
      if (!obj) return;
      
      this.camera.lookAt(obj.position);
    }

    lookAtPosition(args) {
      if (!this.isInitialized) return;
      this.camera.lookAt(
        new THREE.Vector3(
          Scratch.Cast.toNumber(args.X),
          Scratch.Cast.toNumber(args.Y),
          Scratch.Cast.toNumber(args.Z)
        )
      );
    }

    set3DDepth(args) {
      const depth = args.DEPTH;
      this.renderOrder = (depth === 'front' ? 'overlay' : (depth === 'behind' ? 'behind' : 'back'));
      this.zIndexMode = 'auto';

      if (this.container) {
        if (depth === 'front') {
          this.container.style.zIndex = '100';
          this._restoreScratchClearColor();
          if (this.whiteLayerCanvas) this.whiteLayerCanvas.style.display = 'none';
        } else if (depth === 'behind') {
          // 3D canvasをScratch canvasの下に置き、ScratchのWebGL背景を透明化
          this.container.style.zIndex = '0';
          this._patchScratchClearColor();
          if (this.whiteLayerCanvas) this.whiteLayerCanvas.style.display = 'block';
        } else { // back
          this.container.style.zIndex = '0';
          this._restoreScratchClearColor();
          this.zIndexMode = 'manual';
          if (this.whiteLayerCanvas) this.whiteLayerCanvas.style.display = 'none';
        }
      }
      this.updateSizeAndPosition();
      console.log('3D depth set to:', depth);
    }

    setSkyColor(args) {
      this.skyColor    = args.COLOR || '#87CEEB';
      this.skyGradientStrength = Math.min(1.0, Math.max(0.0, Scratch.Cast.toNumber(args.STRENGTH)));
      this.skyGradientSize     = Math.min(1.0, Math.max(0.0, Scratch.Cast.toNumber(args.SIZE)));
      // 設定と同時に空を有効化
      this.skyEnabled = true;
      if (this.whiteLayerCanvas) this.whiteLayerCanvas.style.display = 'block';
      console.log(`[sky] color=${this.skyColor} strength=${this.skyGradientStrength} size=${this.skyGradientSize}`);
    }

    setSkyEnabled(args) {
      this.skyEnabled = (args.STATE === 'on');
      if (this.whiteLayerCanvas && this.renderOrder === 'behind') {
        this.whiteLayerCanvas.style.display = this.skyEnabled ? 'block' : 'none';
      }
      console.log(`[sky] enabled=${this.skyEnabled}`);
    }

  _patchScratchClearColor() {
    const scratchRenderer = Scratch?.vm?.runtime?.renderer;
    const gl = scratchRenderer?._gl;
    if (!gl) { console.warn('[e3ot] Scratch _gl not found'); return; }
    if (this._clearColorPatched) return;

    this._origClearColorFn = gl.clearColor.bind(gl);
    gl.clearColor = (r, g, b, a) => { this._origClearColorFn(0, 0, 0, 0); };
    this._origClearFn = gl.clear.bind(gl);
    gl.clear = (mask) => { this._origClearColorFn(0, 0, 0, 0); this._origClearFn(mask); };
    gl.clearColor(0, 0, 0, 0);
    this._clearColorPatched = gl;

    if (scratchRenderer.setBackgroundColor) {
      if (scratchRenderer._backgroundColor4f) {
        this._origBgColor4f = Array.from(scratchRenderer._backgroundColor4f);
      }
      if (scratchRenderer._backgroundColor3b) {
        this._origBgColor3b = Array.from(scratchRenderer._backgroundColor3b);
      }
      scratchRenderer.setBackgroundColor(0, 0, 0, 0);
    } else {
      if (scratchRenderer._backgroundColor4f) {
        this._origBgColor4f = Array.from(scratchRenderer._backgroundColor4f);
        scratchRenderer._backgroundColor4f[0] = 0;
        scratchRenderer._backgroundColor4f[1] = 0;
        scratchRenderer._backgroundColor4f[2] = 0;
        scratchRenderer._backgroundColor4f[3] = 0;
      }
      if (scratchRenderer._backgroundColor3b) {
        this._origBgColor3b = Array.from(scratchRenderer._backgroundColor3b);
        scratchRenderer._backgroundColor3b[0] = 0;
        scratchRenderer._backgroundColor3b[1] = 0;
        scratchRenderer._backgroundColor3b[2] = 0;
      }
    }

    const c = scratchRenderer.canvas;
    if (c) {
      this._origCanvasBg = c.style.background;
      c.style.background = 'transparent';
      this._origCanvasStyle = c.style.cssText;
      c.style.setProperty('background-color', 'transparent', 'important');

      this._origPosition = c.style.position;
      this._origZIndex = c.style.zIndex;
      c.style.position = 'relative';
      c.style.zIndex = '10';
    }

    console.log('[e3ot] bg patched: clearColor + setBackgroundColor + zIndex');
  }

  _restoreScratchClearColor() {
    const scratchRenderer = Scratch?.vm?.runtime?.renderer;
    const gl = scratchRenderer?._gl;
    if (this._clearColorPatched && gl) {
      if (this._origClearColorFn) {
        gl.clearColor = this._origClearColorFn;
        gl.clearColor(1, 1, 1, 1);
        this._origClearColorFn = null;
      }
      if (this._origClearFn) {
        gl.clear = this._origClearFn;
        this._origClearFn = null;
      }
      this._clearColorPatched = null;
    }
    
    if (this._origBgColor4f && scratchRenderer._backgroundColor4f) {
      if (scratchRenderer.setBackgroundColor) {
        const o = this._origBgColor4f[3] || 1;
        scratchRenderer.setBackgroundColor(
          this._origBgColor4f[0] / o,
          this._origBgColor4f[1] / o,
          this._origBgColor4f[2] / o,
          o
        );
      } else {
        this._origBgColor4f.forEach((v, i) => scratchRenderer._backgroundColor4f[i] = v);
      }
      this._origBgColor4f = null;
    }
    if (this._origBgColor3b && scratchRenderer._backgroundColor3b) {
      this._origBgColor3b.forEach((v, i) => scratchRenderer._backgroundColor3b[i] = v);
      this._origBgColor3b = null;
    }

    const c = scratchRenderer?.canvas;
    if (c) {
      if (this._origCanvasStyle !== undefined) {
        c.style.cssText = this._origCanvasStyle;
        this._origCanvasStyle = undefined;
      } else if (this._origCanvasBg !== undefined) {
        c.style.background = this._origCanvasBg;
        this._origCanvasBg = undefined;
      }

      if (this._origPosition !== undefined) {
        c.style.position = this._origPosition;
        this._origPosition = undefined;
      }
      if (this._origZIndex !== undefined) {
        c.style.zIndex = this._origZIndex;
        this._origZIndex = undefined;
      }
    }
    console.log('[e3ot] bg restored');
  }



    setBgRemoval(args) {
      this.bgRemovalEnabled = (args.STATE === 'on');
      console.log(`背景除去: ${this.bgRemovalEnabled}, 登録色数: ${this.bgRemovalColors.length}`);
    }

    addBgRemovalColor(args) {
      const hex = (args.COLOR || '#ffffff').replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16) || 0;
      const g = parseInt(hex.substring(2, 4), 16) || 0;
      const b = parseInt(hex.substring(4, 6), 16) || 0;
      const tol = Math.max(0, Math.min(255, Scratch.Cast.toNumber(args.TOL)));
      const feather = Math.max(0, Math.min(tol, Scratch.Cast.toNumber(args.FEATHER)));
      this.bgRemovalColors.push({ r, g, b, tol, feather });
      console.log(`背景除去色追加: rgb(${r},${g},${b}) tol=${tol} feather=${feather} 合計${this.bgRemovalColors.length}色`);
    }

    clearBgRemovalColors() {
      this.bgRemovalColors = [];
      console.log('背景除去色クリア');
    }

    set3DOpacity(args) {
      const opacity = Scratch.Cast.toNumber(args.OPACITY);
      this.current3DOpacity = Math.max(0, Math.min(1, opacity));
      // liteから移植: containerに適用
      if (this.container) {
        this.container.style.opacity = this.current3DOpacity;
      }
    }

    setBlendMode(args) {
      const mode = args.MODE;
      const blendModeMap = {
        'normal': 'normal',
        'multiply': 'multiply',
        'screen': 'screen',
        'overlay': 'overlay',
        'soft-light': 'soft-light',
        'hard-light': 'hard-light',
        'difference': 'difference',
        'exclusion': 'exclusion'
      };
      
      this.currentBlendMode = blendModeMap[mode] || 'normal';
      if (this.container) {
        this.container.style.mixBlendMode = this.currentBlendMode;
      }
    }

    enable3DRendering(args) {
      const enable = args.ENABLE === 'on';
      this.enable3D = enable;
      
      if (this.container) {
          this.container.style.display = enable ? 'block' : 'none';
      }

      if (enable) {
          this.resume3D();
      } else {
          this.pause3D();
      }
      
      console.log('3D rendering:', enable ? 'ON' : 'OFF');
    }

    addLight(args) {
      if (!this.isInitialized) return;
      
      const type = args.TYPE;
      const color = parseInt(args.COLOR.slice(1), 16);
      const intensity = Scratch.Cast.toNumber(args.INTENSITY);
      
      let light;
      let lightId = this.nextLightId++;

      if (type === 'directional') {
        light = new THREE.DirectionalLight(color, intensity);
        light.position.set(1, 1, 1);
        light.castShadow = true;
      } else if (type === 'point') {
        light = new THREE.PointLight(color, intensity, 100);
        light.position.set(0, 10, 0);
        light.castShadow = true;
      } else if (type === 'ambient') {
        light = new THREE.AmbientLight(color, intensity);
      } else {
        console.warn('Unknown light type:', type);
        this.nextLightId--;
        return;
      }

      this.scene.add(light);
      this.lights.set(lightId, light);
      console.log(`${type} light added (ID: ${lightId})`);
    }

    setLightPosition(args) {
      if (!this.isInitialized) return;
      
      const id = Scratch.Cast.toNumber(args.ID);
      const light = this.lights.get(id);
      
      if (!light || !(light instanceof THREE.PointLight || light instanceof THREE.DirectionalLight)) {
        console.warn(`Light ID ${id} not found or is not a positional light.`);
        return;
      }
      
      light.position.set(
        Scratch.Cast.toNumber(args.X),
        Scratch.Cast.toNumber(args.Y),
        Scratch.Cast.toNumber(args.Z)
      );
    }

    async loadCSM() {
      if (this.csmLoaded) return;
      // three-csm は Three.js r128 と互換性があるバージョンを試みる
      // 失敗した場合は自前の FallbackCSM を使用
      try {
        const mod = await import('https://cdn.jsdelivr.net/npm/three-csm@1.1.2/build/three-csm.module.min.js');
        const Cls = mod.CSM || mod.default;
        if (typeof Cls === 'function') {
          this.CSMClass = Cls;
          this.csmLoaded = true;
          console.log('three-csm (library) loaded');
          return;
        }
      } catch (_) { /* fallthrough */ }
      // ライブラリが使えない環境向け：純粋な自前実装
      this.CSMClass = this._buildFallbackCSM();
      this.csmLoaded = true;
      console.log('three-csm (fallback) loaded');
    }

    /**
     * three-csm が利用できない環境向けの軽量フォールバック実装。
     * DirectionalLight を cascades 個生成し、各カスケードの near/far と
     * シャドウカメラ範囲をカメラの視錐台から毎フレーム計算する。
     */
    _buildFallbackCSM() {
      class FallbackCSM {
        constructor({ camera, parent, cascades, maxFar, shadowMapSize, lightDirection }) {
          this.camera        = camera;
          this.parent        = parent;
          this.cascades      = Math.max(1, Math.min(cascades, 4));
          this.maxFar        = maxFar;
          this.shadowMapSize = shadowMapSize;
          this.lightDir      = lightDirection
            ? lightDirection.clone().normalize()
            : new THREE.Vector3(-1, -2, -1).normalize();
          this.lights        = [];

          for (let i = 0; i < this.cascades; i++) {
            const light = new THREE.DirectionalLight(0xffffff, 1.2);
            light.castShadow = true;
            light.shadow.mapSize.set(this.shadowMapSize, this.shadowMapSize);
            light.shadow.bias = -0.0005;
            parent.add(light);
            parent.add(light.target);
            this.lights.push(light);
          }
          this.update();
        }

        // 毎フレーム呼ぶ：視錐台からカスケード分割を計算してシャドウカメラを更新
        update() {
          const cam    = this.camera;
          const near   = cam.near;
          const far    = Math.min(cam.far, this.maxFar);
          const lambda = 0.85; // 対数分割と均等分割の混合係数

          const splits = [];
          for (let i = 0; i <= this.cascades; i++) {
            const p   = i / this.cascades;
            const log = near * Math.pow(far / near, p);
            const uni = near + (far - near) * p;
            splits.push(lambda * log + (1 - lambda) * uni);
          }

          const getFrustumCorners = (nearD, farD) => {
            const tanHalfFov = Math.tan((cam.fov * Math.PI / 180) / 2);
            const aspect     = cam.aspect;
            const corners    = [];
            for (const z of [nearD, farD]) {
              const h = tanHalfFov * z;
              const w = h * aspect;
              for (const [sx, sy] of [[-1,-1],[1,-1],[-1,1],[1,1]]) {
                const v = new THREE.Vector3(sx * w, sy * h, -z);
                v.applyMatrix4(cam.matrixWorld);
                corners.push(v);
              }
            }
            return corners;
          };

          for (let i = 0; i < this.cascades; i++) {
            const corners = getFrustumCorners(splits[i], splits[i + 1]);
            const center  = new THREE.Vector3();
            corners.forEach(c => center.add(c));
            center.divideScalar(corners.length);

            // テクセルスナッピング（影のちらつき防止）
            let radius = 0;
            corners.forEach(c => { radius = Math.max(radius, center.distanceTo(c)); });
            const texelSize = (radius * 2) / this.shadowMapSize;
            center.x = Math.round(center.x / texelSize) * texelSize;
            center.y = Math.round(center.y / texelSize) * texelSize;
            center.z = Math.round(center.z / texelSize) * texelSize;

            const light = this.lights[i];
            light.position.copy(center).addScaledVector(this.lightDir, -radius * 2);
            light.target.position.copy(center);
            light.target.updateMatrixWorld();

            const sc = light.shadow.camera;
            sc.left = sc.bottom = -radius;
            sc.right = sc.top   =  radius;
            sc.near  = 0.1;
            sc.far   = radius * 6;
            sc.updateProjectionMatrix();
          }
        }

        // setupMaterial は不要（通常のshadow mapで動作）
        setupMaterial(_m) {}

        dispose() {
          this.lights.forEach(l => {
            this.parent.remove(l.target);
            this.parent.remove(l);
            if (l.shadow.map) l.shadow.map.dispose();
          });
          this.lights = [];
        }
      }
      return FallbackCSM;
    }

    async setupCSM(args) {
      await this.init();
      if (!this.isInitialized) return;

      if (!this.csmLoaded) {
        try { await this.loadCSM(); } catch(e) {
          console.error('CSM load failed:', e);
          return;
        }
      }

      const cascades = Math.max(1, Math.min(4, Math.round(Scratch.Cast.toNumber(args.CASCADES))));
      const maxFar   = Scratch.Cast.toNumber(args.DISTANCE);
      const mapSize  = Math.min(4096, Math.max(64,
                         Math.pow(2, Math.round(Math.log2(Scratch.Cast.toNumber(args.MAPSIZE))))));

      // 既存のCSMを破棄
      if (this.csm) {
        this.csm.dispose();
        this.csm = null;
      }

      // デフォルトDirectionalLight(ID:1)のシャドウを無効化（CSMが代替するため）
      const defaultLight = this.lights.get(1);
      if (defaultLight) {
        defaultLight.castShadow = false;
        defaultLight.visible    = false;
      }

      this.csm = new this.CSMClass({
        maxFar,
        cascades,
        shadowMapSize: mapSize,
        lightDirection: new THREE.Vector3(1, -1, 1).normalize(),
        camera:  this.camera,
        parent:  this.scene,
        mode:    'practical',
        shadowBias: 0.0001,
      });

      // 全メッシュにCSMマテリアル設定（ライブラリ版のみ必要、fallbackはno-op）
      this.scene.traverse(obj => {
        if (obj.isMesh && obj.material) {
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
          mats.forEach(m => this.csm.setupMaterial(m));
          obj.castShadow    = true;
          obj.receiveShadow = true;
        }
      });

      this.csmEnabled = true;
      console.log(`CSM initialized: cascades=${cascades}, maxFar=${maxFar}, mapSize=${mapSize}`);
    }

    enableCSM(args) {
      const enable = args.ENABLE === 'on';
      this.csmEnabled = enable;
      if (this.csm) {
        this.csm.lights.forEach(l => { l.visible = enable; });
      }
      // デフォルトDirectionalLight(ID:1)との切り替え
      const defaultLight = this.lights.get(1);
      if (defaultLight) {
        defaultLight.castShadow = !enable;
        defaultLight.visible    = !enable;
      }
      console.log(`CSM ${enable ? 'enabled' : 'disabled'}`);
    }

    clearScene() {
      if (!this.isInitialized) return;
      
      // オブジェクトを削除
      const idsToDelete = Array.from(this.objects.keys());
      for (const id of idsToDelete) {
        this.removeObject({ ID: id });
      }
      this.nextObjectId = 1;
      
      // ライトを削除 (デフォルトライト1, 2は残す)
      const lightsToDelete = Array.from(this.lights.keys());
      for (const id of lightsToDelete) {
        const light = this.lights.get(id);
        if (id > 2) { // Keep default lights
          this.scene.remove(light);
          this.lights.delete(id);
        }
      }
      
      // 車コントローラー・ホイールセットをクリア
      this.carControllers.clear();
      this.wheelSets.clear();

      // 子メッシュワイヤーフレームをクリア
      for (const wire of this.meshWireframes.values()) {
        this.scene.remove(wire);
        wire.geometry.dispose();
      }
      this.meshWireframes.clear();

      // 物理エンジン関連をクリア
      if (this.world) {
          this.world = null;
          this.physicsBodies.clear();
          this.collisionPairs.clear();
          this.collisionHistory.clear();
          this.lastCollisionPartner.clear();
      }
      this.initPhysicsWorld(); // 物理ワールドを再初期化
      
      // デバッグメッシュをクリア
      const debugMeshesToDelete = Array.from(this.debugMeshes.keys());
      for (const id of debugMeshesToDelete) {
          const debugMesh = this.debugMeshes.get(id);
          this.scene.remove(debugMesh);
          this.debugMeshes.delete(id);
      }

      const defaultLights = new Map();
      if (this.lights.has(1)) defaultLights.set(1, this.lights.get(1));
      if (this.lights.has(2)) defaultLights.set(2, this.lights.get(2));
      this.lights = defaultLights;
      this.nextLightId = 3;
      
      console.log('3D scene cleared');
    }

    // ============================================================
    // 車コントローラー
    // ============================================================

    setupCar(args) {
      const id         = Scratch.Cast.toNumber(args.ID);
      const maxGears   = Math.max(1, Math.round(Scratch.Cast.toNumber(args.GEARS)));
      const gearMode   = args.GEARMODE || 'auto';       // 'auto' | 'semiauto'
      const steerSpeed = Scratch.Cast.toNumber(args.STEER_SPEED);
      const speedScale = Scratch.Cast.toNumber(args.SPEED_SCALE);
      const rpmLimit   = Scratch.Cast.toNumber(args.RPM_LIMIT);

      // ギアごとの速度上限テーブル
      // speedScale の絶対値でギア速度上限を生成（符号は進行方向に使う）
      const absScale = Math.abs(speedScale);
      const direction = speedScale >= 0 ? 1 : -1;  // 前進/後退方向
      // speedScale=1 のとき 1速≒3m/s、最終速≒20m/s 相当
      const gearSpeedLimits = [];
      for (let g = 1; g <= maxGears; g++) {
        const t = maxGears === 1 ? 1 : (g - 1) / (maxGears - 1);
        gearSpeedLimits.push(absScale * (3 + t * 17));
      }

      // 入力状態追跡用
      this._initKeyListeners();

      this.carControllers.set(id, {
        id,
        maxGears,
        gearMode,
        steerSpeed,
        speedScale,
        direction,   // +1=前進方向, -1=後退方向
        rpmLimit,
        gearSpeedLimits,
        // 動的状態
        gear: 1,
        speed: 0,
        steering: 0,
        rpm: 0,
        // セミオート用シフトアップ/ダウン待機
        _shiftUpPrev: false,
        _shiftDownPrev: false,
        manualShift: true,
        _input: { accel: 0, brake: 0, steer: 0 },
        lowSpeedTurnBoost: 3,
        brakePower: 15,
        _velY: 0,  // 自前管理するY速度
      });

      // 車のrigidbodyの重力をオフ（Y速度を自前で管理して壁反発を制御する）
      const physicsData = this.physicsBodies.get(id);
      if (physicsData?.rigidBody) {
        physicsData.rigidBody.setGravityScale(0.0, true);
      }

      console.log(`Car controller set on object ${id}: ${maxGears} gears, mode=${gearMode}`);
    }

    removeCar(args) {
      const id = Scratch.Cast.toNumber(args.ID);
      this.carControllers.delete(id);
      this.wheelSets.delete(id);
      console.log(`Car controller removed from object ${id}`);
    }

    // ============================================================
    // ホイールメッシュ管理
    // ============================================================

    /** オブジェクト配下の全 Mesh 名をカンマ区切りで返す */
    getChildMeshNames(args) {
      const id  = Scratch.Cast.toNumber(args.ID);
      const obj = this.objects.get(id);
      if (!obj) return '';
      const names = [];
      obj.traverse(child => {
        if (child.isMesh && child.name) names.push(child.name);
      });
      return names.join(', ');
    }

    /**
     * 指定した子メッシュの上に緑ワイヤーフレームをオーバーレイ表示する
     * ENABLE='on'  → ワイヤー生成（既存なら再利用）して表示
     * ENABLE='off' → 非表示
     */
    showMeshWireframe(args) {
      const id       = Scratch.Cast.toNumber(args.ID);
      const meshName = Scratch.Cast.toString(args.MESH_NAME).trim();
      const enable   = args.ENABLE === 'on';
      const key      = `${id}::${meshName}`;
      const obj      = this.objects.get(id);
      if (!obj) { console.warn(`showMeshWireframe: object ${id} not found`); return; }

      if (!enable) {
        // 非表示
        const wire = this.meshWireframes.get(key);
        if (wire) wire.visible = false;
        return;
      }

      // 既に存在すれば再表示して終了
      if (this.meshWireframes.has(key)) {
        this.meshWireframes.get(key).visible = true;
        return;
      }

      // 対象メッシュを名前で検索
      let targetMesh = null;
      obj.traverse(child => {
        if (child.isMesh && child.name === meshName) targetMesh = child;
      });
      if (!targetMesh) { console.warn(`showMeshWireframe: mesh "${meshName}" not found in object ${id}`); return; }

      // ワイヤーフレームメッシュを生成（ターゲットの子として追加することで位置・回転が自動追従）
      const wireMat  = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        wireframe: true,
        transparent: true,
        opacity: 0.8,
        depthTest: false,
      });
      const wireMesh = new THREE.Mesh(targetMesh.geometry, wireMat);
      wireMesh.renderOrder = 999; // 常に最前面

      // ターゲットメッシュの子として追加 → 位置・回転・スケールが自動追従
      targetMesh.add(wireMesh);
      this.meshWireframes.set(key, wireMesh);
      console.log(`Wireframe ON: object ${id} / mesh "${meshName}"`);
    }

    /** 指定メッシュをタイヤポジション (FL/FR/RL/RR) に割り当てる */
    assignWheelMesh(args) {
      const id       = Scratch.Cast.toNumber(args.ID);
      const meshName = Scratch.Cast.toString(args.MESH_NAME).trim();
      const pos      = args.WHEEL_POS; // 'FL'|'FR'|'RL'|'RR'
      const obj      = this.objects.get(id);
      if (!obj) { console.warn(`assignWheelMesh: object ${id} not found`); return; }

      let found = null;
      obj.traverse(child => {
        if (child.isMesh && child.name === meshName) found = child;
      });
      if (!found) { console.warn(`assignWheelMesh: mesh "${meshName}" not found in object ${id}`); return; }

      if (!this.wheelSets.has(id)) {
        this.wheelSets.set(id, {
          FL: [], FR: [], RL: [], RR: [],  // 複数メッシュ対応（配列）
          rotAxis: 'x',
          rotScale: 1,
          steerMaxDeg: 30,
          _rotFL: 0, _rotFR: 0, _rotRL: 0, _rotRR: 0,
          _initQuatFL: [], _initQuatFR: [],  // 各メッシュの初期クォータニオンも配列
        });
      }
      const ws = this.wheelSets.get(id);

      // 同じメッシュの重複追加を防ぐ
      if (!ws[pos].includes(found)) {
        ws[pos].push(found);
      }

      // 前輪の初期クォータニオンを保存（ステアリング計算のベース）
      if (pos === 'FL') ws._initQuatFL.push(found.quaternion.clone());
      if (pos === 'FR') ws._initQuatFR.push(found.quaternion.clone());

      console.log(`Wheel ${pos} assigned: "${meshName}" on object ${id} (total: ${ws[pos].length})`);
    }

    /** タイヤの回転軸を設定する ('x'|'y'|'z') */
    setWheelRotationAxis(args) {
      const id   = Scratch.Cast.toNumber(args.ID);
      const axis = args.AXIS;
      if (!this.wheelSets.has(id)) { console.warn(`setWheelRotationAxis: no wheel set for object ${id}`); return; }
      this.wheelSets.get(id).rotAxis = axis;
    }

    /** タイヤ回転係数を設定する（大きいほど速く回る、デフォルト1） */
    setWheelRotationScale(args) {
      const id    = Scratch.Cast.toNumber(args.ID);
      const scale = Scratch.Cast.toNumber(args.SCALE);
      if (!this.wheelSets.has(id)) { console.warn(`setWheelRotationScale: no wheel set for object ${id}`); return; }
      this.wheelSets.get(id).rotScale = scale;
    }

    /** 前輪のステアリング最大角 (度) を設定する */
    setSteeringMeshAngle(args) {
      const id      = Scratch.Cast.toNumber(args.ID);
      const degrees = Scratch.Cast.toNumber(args.DEGREES);
      if (!this.wheelSets.has(id)) { console.warn(`setSteeringMeshAngle: no wheel set for object ${id}`); return; }
      this.wheelSets.get(id).steerMaxDeg = degrees;
    }

    /** 横摩擦係数を設定する（0=氷・完全スライド / 1=グリップ） */
    setLateralFriction(args) {
      const id       = Scratch.Cast.toNumber(args.ID);
      const friction = Math.max(0, Math.min(1, Scratch.Cast.toNumber(args.FRICTION)));
      const car      = this.carControllers.get(id);
      if (!car) { console.warn(`setLateralFriction: no car controller for object ${id}`); return; }
      car.lateralFriction = friction;
      console.log(`Object ${id} lateral friction: ${friction}`);
    }

    /**
     * 毎フレーム呼ばれるホイールアニメーション更新
     * _updateAllCars() の末尾から呼ばれる
     */
    _updateWheelAnimations(dt) {
      for (const [id, ws] of this.wheelSets) {
        const car = this.carControllers.get(id);
        if (!car) continue;

        const axis  = ws.rotAxis || 'x';
        const scale = ws.rotScale ?? 1;
        const dRot  = car.speed * scale * dt * 5;

        const axisVec = new THREE.Vector3(
          axis === 'x' ? 1 : 0,
          axis === 'y' ? 1 : 0,
          axis === 'z' ? 1 : 0
        );

        const steerMaxRad = (ws.steerMaxDeg ?? 30) * Math.PI / 180;
        const steerRad    = car.steering * steerMaxRad; // 速度ゼロでも有効

        for (const pos of ['FL', 'FR', 'RL', 'RR']) {
          const meshes = ws[pos];
          if (!meshes || meshes.length === 0) continue;

          ws[`_rot${pos}`] = (ws[`_rot${pos}`] || 0) + dRot;
          const totalRot = ws[`_rot${pos}`];

          const isFront = pos === 'FL' || pos === 'FR';
          const initQuats = isFront ? ws[`_initQuat${pos}`] : null;

          meshes.forEach((mesh, i) => {
            if (isFront && initQuats && initQuats[i]) {
              // 前輪：速度ゼロでもステアリングは常に反映
              const steerQ = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), steerRad);
              const rollQ  = new THREE.Quaternion().setFromAxisAngle(axisVec, totalRot);
              mesh.quaternion.copy(initQuats[i]).multiply(steerQ).multiply(rollQ);
            } else {
              // 後輪：ローリングのみ
              mesh.rotation[axis] += dRot;
            }
          });
        }
      }
    }

    setCarInput(args) {
      const id     = Scratch.Cast.toNumber(args.ID);
      const action = args.ACTION;
      const value  = Math.max(0, Math.min(1, Scratch.Cast.toNumber(args.VALUE)));
      const car    = this.carControllers.get(id);
      if (!car) return;
      if (!car._input) car._input = { accel: 0, brake: 0, steer: 0 };
      switch (action) {
        case 'accel': car._input.accel = value; break;
        case 'brake': car._input.brake = value; break;
        case 'right': car._input.steer = Math.min(1,  value); break;
        case 'left':  car._input.steer = Math.max(-1, -value); break;
      }
    }

    clearCarInput(args) {
      const id  = Scratch.Cast.toNumber(args.ID);
      const car = this.carControllers.get(id);
      if (!car) return;
      car._input = { accel: 0, brake: 0, steer: 0 };
    }

    getCarSpeed(args) {
      const id = Scratch.Cast.toNumber(args.ID);
      const car = this.carControllers.get(id);
      return car ? car.speed : 0;
    }

    shiftGear(args) {
      const id  = Scratch.Cast.toNumber(args.ID);
      const dir = args.DIRECTION;
      const car = this.carControllers.get(id);
      if (!car) return;

      // このブロックを使ったらキー入力によるシフトを無効化
      car.manualShift = true;

      if (dir === 'up' && car.gear < car.maxGears) {
        car.gear++;
        const newLimit = car.gearSpeedLimits[car.gear - 1];
        car.rpm = (Math.abs(car.speed) / Math.max(newLimit, 0.001)) * car.rpmLimit;
      } else if (dir === 'down' && car.gear > 1) {
        car.gear--;
        const newLimit = car.gearSpeedLimits[car.gear - 1];
        car.rpm = (Math.abs(car.speed) / Math.max(newLimit, 0.001)) * car.rpmLimit;
      }
    }

    setCarGear(args) {
      const id   = Scratch.Cast.toNumber(args.ID);
      const gear = Math.round(Scratch.Cast.toNumber(args.GEAR));
      const car  = this.carControllers.get(id);
      if (!car) return;
      car.manualShift = true;
      // 0 = ニュートラル、1〜maxGears = 通常ギア
      car.gear = Math.max(0, Math.min(car.maxGears, gear));
      if (car.gear >= 1) {
        const newLimit = car.gearSpeedLimits[car.gear - 1];
        car.rpm = (Math.abs(car.speed) / Math.max(newLimit, 0.001)) * car.rpmLimit;
      }
      // gear=0(N)のときはRPMはアクセル踏み量で上がるが駆動力は伝わらない（_updateAllCarsで制御）
    }

    setGearShiftPoint(args) {
      const gear    = Math.round(Scratch.Cast.toNumber(args.GEAR));
      const percent = Scratch.Cast.toNumber(args.PERCENT) / 100;
      const dir     = args.DIRECTION; // 'up' | 'down'

      // 全車コントローラーに適用（どの車IDにも反映）
      // ※ setupCar後に呼ぶ想定なので全コントローラーに設定する
      for (const car of this.carControllers.values()) {
        if (!car.shiftPoints) car.shiftPoints = {};
        // キー例: "3_up" → 3速でのシフトアップ閾値
        car.shiftPoints[`${gear}_${dir}`] = Math.max(0, Math.min(1, percent));
      }
      console.log(`Shift point set: gear ${gear} ${dir} at ${Math.round(percent*100)}%`);
    }

    getCarRPM(args) {
      const id = Scratch.Cast.toNumber(args.ID);
      const car = this.carControllers.get(id);
      return car ? Math.round(car.rpm) : 0;
    }

    getCarGear(args) {
      const id = Scratch.Cast.toNumber(args.ID);
      const car = this.carControllers.get(id);
      return car ? car.gear : 0;
    }

    setLowSpeedTurnBoost(args) {
      const id    = Scratch.Cast.toNumber(args.ID);
      const boost = Math.max(1, Scratch.Cast.toNumber(args.BOOST));
      const car   = this.carControllers.get(id);
      if (!car) { console.warn('No car controller found for object:', id); return; }
      car.lowSpeedTurnBoost = boost;
      console.log(`Object ${id} lowSpeedTurnBoost set to: ${boost}`);
    }

    setBrakePower(args) {
      const id    = Scratch.Cast.toNumber(args.ID);
      const power = Math.max(0, Scratch.Cast.toNumber(args.POWER));
      const car   = this.carControllers.get(id);
      if (!car) { console.warn('No car controller found for object:', id); return; }
      car.brakePower = power;
      console.log(`Object ${id} brakePower set to: ${power}`);
    }

    // キーの押下状態をグローバルに追跡（一度だけ登録）
    _initKeyListeners() {
      if (this._keysTracked) return;
      this._keys = {};
      window.addEventListener('keydown', e => { this._keys[e.code] = true; });
      window.addEventListener('keyup',   e => { this._keys[e.code] = false; });
      this._keysTracked = true;

    }

    _isKeyDown(code) {
      return !!(this._keys && this._keys[code]);
    }

    _updateAllCars(dt) {
      if (!dt || dt <= 0) return;

      for (const [id, car] of this.carControllers) {
        const obj = this.objects.get(id);
        if (!obj) continue;
        const physicsData = this.physicsBodies.get(id);

        // --- ブロック入力のみ（全入力はコード側で制御）---
        const blockAccel = car._input ? car._input.accel : 0;
        const blockBrake = car._input ? car._input.brake : 0;
        const blockSteer = car._input ? car._input.steer : 0;

        const accelClamped = Math.min(blockAccel, 1);
        const brakeClamped = Math.min(blockBrake, 1);

        // --- ステアリング ---
        const steerInput = blockSteer;


        // ステアリングを滑らかに変化・センタリング（dt正規化）
        const steerRate = car.steerSpeed * dt * 60;
        if (Math.abs(steerInput) > 0.01) {
          car.steering += steerInput * steerRate * 0.1;
        } else {
          // 入力なし → 自動センタリング
          car.steering *= Math.pow(0.85, dt * 60);
        }
        car.steering = Math.max(-1, Math.min(1, car.steering));


        // --- 速度計算 ---
        // ニュートラル(gear=0)は駆動力なし・RPMのみアクセルに反応
        if (car.gear === 0) {
          const targetRpm = accelClamped * car.rpmLimit;
          const followSpeed = targetRpm > (car.rpm || 0) ? 4 : 1.5; // 上がりは速く、下がりはゆっくり
          car.rpm = (car.rpm || 0) + (targetRpm - (car.rpm || 0)) * Math.min(dt * followSpeed, 1);
          // レブリミッター：上限付近で少し落とす
          if (car.rpm > car.rpmLimit * 0.95) {
            car.rpm = car.rpmLimit * 0.95 + Math.sin(Date.now() * 0.02) * car.rpmLimit * 0.03;
          }
          // ブレーキは効く、自然減衰のみ
          const brakeForce = (car.brakePower ?? 15) * brakeClamped * dt;
          if (car.speed > 0) car.speed = Math.max(0, car.speed - brakeForce);
          else               car.speed = Math.min(0, car.speed + brakeForce);
          car.speed *= Math.pow(0.998, dt * 60);
        } else {

        const currentLimit = car.gearSpeedLimits[car.gear - 1];

        // ギア比：1速は加速力が強く、高速ギアほど弱くなる（逆数で計算）
        // 1速=最大トルク、最終速=1速の1/maxGears のトルク
        const gearRatio = car.maxGears / car.gear;  // 1速=6, 6速=1 (6段の場合)

        // RPMを先に計算（速度/ギア速度上限 × RPMリミット）
        car.rpm = (Math.abs(car.speed) / Math.max(currentLimit, 0.001)) * car.rpmLimit;

        // トルク係数：RPMが低いと加速力も弱い（エンジンのトルクカーブを模倣）
        // 0〜30%RPMは弱め、30〜80%が最大、80%以上で頭打ち感
        const rpmRatio = car.rpm / car.rpmLimit;
        const torqueCurve = rpmRatio < 0.3
          ? rpmRatio / 0.3 * 0.7 + 0.3          // 低RPM：0.3〜1.0
          : rpmRatio < 0.8
            ? 1.0                                 // 中RPM：最大
            : 1.0 - (rpmRatio - 0.8) / 0.2 * 0.3; // 高RPM：1.0〜0.7

        // 加速力 = ベース × ギア比 × トルクカーブ × speedScale
        const accelForce = 8.0 * Math.abs(car.speedScale) * accelClamped * dt
                         * gearRatio * torqueCurve / car.maxGears;
        const brakeForce = (car.brakePower ?? 15) * brakeClamped * dt;

        car.speed += accelForce;
        // ブレーキは速度を0に近づける
        if (car.speed > 0) {
          car.speed = Math.max(0, car.speed - brakeForce);
        } else {
          car.speed = Math.min(0, car.speed + brakeForce);
        }
        // 自然減衰
        car.speed *= Math.pow(0.998, dt * 60);

        // ギアによる速度上限
        if (car.speed > currentLimit) car.speed = currentLimit;
        if (car.speed < -currentLimit * 0.3) car.speed = -currentLimit * 0.3;

        // RPMを速度上限クランプ後に再計算
        car.rpm = (Math.abs(car.speed) / Math.max(currentLimit, 0.001)) * car.rpmLimit;

        } // end of gear !== 0 block

        // --- ギアチェンジ ---
        if (car.gear !== 0 && car.gearMode === 'auto') {
          const sp = car.shiftPoints || {};
          // シフトアップ閾値：カスタム設定があればそれを使う、なければデフォルト92%
          const upThresh   = sp[`${car.gear}_up`]   ?? 0.92;
          // シフトダウン閾値：カスタム設定があればそれを使う、なければデフォルト60%
          const downThresh = sp[`${car.gear}_down`] ?? 0.60;
          // rpmRatioはgear !== 0ブロックの外でも参照できるよう再計算（バグ修正）
          const currentGearLimit = car.gearSpeedLimits[car.gear - 1];
          const rpmRatio = (Math.abs(car.speed) / Math.max(currentGearLimit, 0.001));

          if (car.gear < car.maxGears && rpmRatio >= upThresh && car.speed > 0) {
            car.gear++;
            const newLimit = car.gearSpeedLimits[car.gear - 1];
            car.rpm = (Math.abs(car.speed) / Math.max(newLimit, 0.001)) * car.rpmLimit;
          } else if (car.gear > 1) {
            const prevLimit = car.gearSpeedLimits[car.gear - 2];
            if (car.speed < prevLimit * downThresh) {
              car.gear--;
              const newLimit = car.gearSpeedLimits[car.gear - 1];
              car.rpm = (Math.abs(car.speed) / Math.max(newLimit, 0.001)) * car.rpmLimit;
            }
          }
        } else {
          // manualShift=true のときはブロック入力を無視
          if (!car.manualShift) {
            const shiftUpNow  = false;
            const shiftDnNow  = false;
            if (shiftUpNow && !car._shiftUpPrev && car.gear < car.maxGears) {
              car.gear++;
              const newLimit = car.gearSpeedLimits[car.gear - 1];
              car.rpm = (Math.abs(car.speed) / Math.max(newLimit, 0.001)) * car.rpmLimit;
            }
            if (shiftDnNow && !car._shiftDownPrev && car.gear > 1) {
              car.gear--;
              const newLimit = car.gearSpeedLimits[car.gear - 1];
              car.rpm = (Math.abs(car.speed) / Math.max(newLimit, 0.001)) * car.rpmLimit;
            }
            car._shiftUpPrev   = shiftUpNow;
            car._shiftDownPrev = shiftDnNow;
          }
        }

        // --- 向きの更新（クォータニオンでY軸だけ回転）---
        // rotation.y 直接操作はEuler干渉でおかしくなるのでQuaternionを使う
        if (Math.abs(car.speed) > 0.001) {
          const speedFactor = Math.min(Math.abs(car.speed) / (car.gearSpeedLimits[car.maxGears - 1] * 0.3), 1.0);
          // 低速時は lowSpeedTurnBoost 倍まで旋回力を補強（高速では等倍に近づく）
          const boost = car.lowSpeedTurnBoost ?? 3;
          const turnBoost = 1.0 + (boost - 1.0) * (1.0 - speedFactor);
          const turnRad = car.steering * car.steerSpeed * dt * 0.25 * speedFactor * turnBoost;
          // Y軸まわりの差分クォータニオンを左から掛ける（ワールドY軸で回す）
          const deltaQ = new THREE.Quaternion().setFromAxisAngle(
            new THREE.Vector3(0, 1, 0), -turnRad
          );
          obj.quaternion.premultiply(deltaQ);
        }

        // --- 進行方向ベクトルをQuaternionから取得 ---
        // car.direction が -1 のとき逆方向に進む（speedScaleをマイナスにすると後退）
        const forward = new THREE.Vector3(0, 0, 1).applyQuaternion(obj.quaternion);
        const right   = new THREE.Vector3(1, 0, 0).applyQuaternion(obj.quaternion);

        // --- 横摩擦（ドリフト）処理 ---
        // 横方向の速度成分を摩擦係数で減衰させる（0=氷 1=グリップ）
        let vx = forward.x * car.speed * car.direction;
        let vz = forward.z * car.speed * car.direction;

        const friction = car.lateralFriction ?? 1.0;
        if (friction < 1.0 && physicsData) {
          const currentVel = physicsData.rigidBody.linvel();
          // 現在の水平速度の横成分を取得
          const velX   = currentVel.x;
          const velZ   = currentVel.z;
          const latVel = right.x * velX + right.z * velZ; // 横方向射影
          // 横速度を摩擦分だけ残してブレンド
          const slideX = right.x * latVel;
          const slideZ = right.z * latVel;
          vx = vx + slideX * (1.0 - friction);
          vz = vz + slideZ * (1.0 - friction);
        }

        if (physicsData) {
          const currentVel = physicsData.rigidBody.linvel();

          // --- レイキャストサスペンション（WheelCollider相当） ---
          // 車体の4隅から真下にレイを飛ばし、地面との距離でY速度を補正する
          let groundNormal = new THREE.Vector3(0, 1, 0); // デフォルトは水平
          if (this.world && this.RAPIER) {
            const bodyPos   = physicsData.rigidBody.translation();
            const bodyQuat  = physicsData.rigidBody.rotation();
            const threeQuat = new THREE.Quaternion(bodyQuat.x, bodyQuat.y, bodyQuat.z, bodyQuat.w);

            // コライダーのAABBから車体サイズを推定（なければデフォルト値）
            let halfW = 0.8, halfL = 1.4, suspNatural = 0.35, suspRange = 0.5;
            try {
              const aabb = physicsData.collider.computeAabb();
              halfW = (aabb.maxs.x - aabb.mins.x) * 0.5 * 0.85;
              halfL = (aabb.maxs.z - aabb.mins.z) * 0.5 * 0.85;
              const halfH = (aabb.maxs.y - aabb.mins.y) * 0.5;
              suspNatural = halfH * 0.6;
              suspRange   = halfH * 0.8;
            } catch(e) {}

            // 4輪のローカルオフセット
            const wheelOffsets = [
              new THREE.Vector3( halfW, 0,  halfL), // FL
              new THREE.Vector3(-halfW, 0,  halfL), // FR
              new THREE.Vector3( halfW, 0, -halfL), // RL
              new THREE.Vector3(-halfW, 0, -halfL), // RR
            ];

            const rayDir    = { x: 0, y: -1, z: 0 };
            const rayLen    = suspNatural + suspRange;
            const stiffness = 18;
            const damping   = 6;

            let hitCount    = 0;
            let totalPush   = 0;
            const normalSum = new THREE.Vector3();

            for (const offset of wheelOffsets) {
              const worldOffset = offset.clone().applyQuaternion(threeQuat);
              const rayOrigin = {
                x: bodyPos.x + worldOffset.x,
                y: bodyPos.y + worldOffset.y,
                z: bodyPos.z + worldOffset.z,
              };

              // castRayAndGetNormal で法線も同時取得
              const hit = this.world.castRayAndGetNormal(
                new this.RAPIER.Ray(rayOrigin, rayDir),
                rayLen,
                true,
                undefined,
                undefined,
                physicsData.collider
              );

              if (hit) {
                const dist     = hit.timeOfImpact;
                const compress = suspNatural - dist;
                if (compress > -suspRange) {
                  const spring = compress * stiffness;
                  const damp   = -currentVel.y * damping;
                  totalPush += spring + damp;
                  hitCount++;
                  // 法線を累積（平均を取るため）
                  normalSum.add(new THREE.Vector3(hit.normal.x, hit.normal.y, hit.normal.z));
                }
              }
            }
          } // if (this.world && this.RAPIER)

          // --- Y速度を自前管理（重力オフの代わりに手動で重力・サスペンション適用）---
          const gravity = this.world?.gravity?.y ?? -9.82;
          let velY = car._velY ?? 0;

          if (hitCount > 0) {
            // 接地中：サスペンションのみ、壁反発は無視
            const avgPush = totalPush / hitCount;
            velY += avgPush * dt;
            velY = Math.max(-15, Math.min(4, velY)); // 接地中は上昇を4m/sまでに抑える
            groundNormal = normalSum.divideScalar(hitCount).normalize();
          } else {
            // 空中：重力のみ加算（ジャンプ・バンク頂点など）
            velY += gravity * dt;
            velY = Math.max(-20, velY);
          }
          car._velY = velY;

          physicsData.rigidBody.setLinvel({ x: vx, y: velY, z: vz }, true);

          // THREE の向きを Rapier に書き込む（物理がヨーを上書きしないよう）
          physicsData.rigidBody.setRotation(
            { x: obj.quaternion.x, y: obj.quaternion.y, z: obj.quaternion.z, w: obj.quaternion.w }, false
          );

          // Rapierの位置・向きをTHREEに反映
          const pos = physicsData.rigidBody.translation();
          obj.position.set(pos.x, pos.y, pos.z);
          const rot = physicsData.rigidBody.rotation();
          obj.quaternion.set(rot.x, rot.y, rot.z, rot.w);
        } else {
          // 物理なし：直接座標移動
          obj.position.x += vx * dt;
          obj.position.z += vz * dt;
        }
      }

      // ホイールメッシュアニメーション（全車共通）
      this._updateWheelAnimations(dt);
    }

    pause3D() {
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
        this.animationId = null;
      }
    }

    resume3D() {
      if (!this.animationId && this.isInitialized && this.enable3D) {
        this._lastFrameTime = undefined;
        this._physicsAccumulator = 0;
        this.animate();
      }
    }

    dispose() {
      this.pause3D();
      
      if (this.resizeObserver) {
        this.resizeObserver.disconnect();
        this.resizeObserver = null;
      }
      
      if (this.positionUpdateInterval) {
        clearInterval(this.positionUpdateInterval);
        this.positionUpdateInterval = null;
      }
      
      this.clearScene();
      
      if (this.renderer) {
        this.renderer.dispose();
      }
      
      if (this.container && this.container.parentNode) {
        this.container.parentNode.removeChild(this.container);
      }
      
      this.modelAssets.clear();
      this.world = null;
    }
  }

  Scratch.extensions.register(new ThreeDExtension());
})(Scratch);
