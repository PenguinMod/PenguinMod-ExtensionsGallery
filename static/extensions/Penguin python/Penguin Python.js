
(function (Scratch) {
  'use strict';

  if (!Scratch.extensions.unsandboxed) {
    throw new Error('Python extension requires unsandboxed mode.');
  }

  // Icon Python SVG từ SVG Repo.
  const ICON = 'https://www.svgrepo.com/show/452091/python.svg';

  const PYODIDE_URL = 'https://cdn.jsdelivr.net/pyodide/v0.28.2/full/';

  let pyodide = null;
  let loading = null;
  let lastOutput = '';
  let lastFileName = '';
  let files = Object.create(null);
  let outputVisible = true;

  let panel = null;
  let outputElement = null;
  let statusElement = null;

  let graphicsWindow = null;
  let graphicsCanvas = null;
  let graphicsCtx = null;
  let graphicsWidth = 480;
  let graphicsHeight = 320;

  function setOutput(value) {
    lastOutput = String(value ?? '');
    if (outputElement) outputElement.textContent = lastOutput;
  }

  function setStatus(value) {
    if (statusElement) statusElement.textContent = value;
  }

  function showPanel() {
    if (panel && panel.isConnected) return panel;

    panel = document.createElement('div');
    panel.id = 'pm-python-output';

    Object.assign(panel.style, {
      position: 'fixed',
      left: '24px',
      top: '80px',
      width: '460px',
      height: '320px',
      minWidth: '260px',
      minHeight: '160px',
      resize: 'both',
      overflow: 'hidden',
      zIndex: '999999',
      background: '#151a22',
      color: '#e6edf3',
      border: '1px solid #526174',
      borderRadius: '9px',
      boxShadow: '0 8px 32px #0008',
      font: '13px Consolas, monospace',
      display: 'flex',
      flexDirection: 'column'
    });

    const header = document.createElement('div');
    Object.assign(header.style, {
      padding: '9px 12px',
      background: '#263548',
      cursor: 'move',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      userSelect: 'none',
      flexShrink: '0'
    });

    const title = document.createElement('strong');
    title.textContent = 'Python · Output';
    title.style.flex = '1';

    statusElement = document.createElement('span');
    statusElement.textContent = 'Not loaded';
    statusElement.style.color = '#a9c7e8';

    const close = document.createElement('button');
    close.textContent = '×';

    Object.assign(close.style, {
      border: '0',
      color: 'white',
      background: 'transparent',
      fontSize: '22px',
      cursor: 'pointer'
    });

    close.onclick = () => {
      panel.style.display = 'none';
    };

    header.append(title, statusElement, close);

    const toolbar = document.createElement('div');
    Object.assign(toolbar.style, {
      display: 'flex',
      gap: '6px',
      padding: '7px',
      background: '#1d2530',
      flexShrink: '0'
    });

    function makeButton(text, callback) {
      const button = document.createElement('button');
      button.textContent = text;

      Object.assign(button.style, {
        color: '#e6edf3',
        background: '#34465c',
        border: '1px solid #526174',
        borderRadius: '4px',
        padding: '4px 9px',
        cursor: 'pointer'
      });

      button.onclick = callback;
      toolbar.appendChild(button);
      return button;
    }

    makeButton('Clear', () => setOutput(''));
    makeButton('Hide', () => {
      panel.style.display = 'none';
    });

    outputElement = document.createElement('pre');
    outputElement.id = 'pm-python-output-text';

    Object.assign(outputElement.style, {
      margin: '0',
      padding: '12px',
      overflow: 'auto',
      whiteSpace: 'pre-wrap',
      overflowWrap: 'anywhere',
      flex: '1',
      minHeight: '0'
    });

    outputElement.textContent = lastOutput;

    panel.append(header, toolbar, outputElement);
    document.body.appendChild(panel);

    makeDraggable(panel, header);
    return panel;
  }

  function makeDraggable(element, handle) {
    let dragging = false;
    let startX = 0;
    let startY = 0;
    let originalX = 0;
    let originalY = 0;

    handle.addEventListener('pointerdown', event => {
      if (event.target.closest('button')) return;

      dragging = true;
      startX = event.clientX;
      startY = event.clientY;

      const rect = element.getBoundingClientRect();
      originalX = rect.left;
      originalY = rect.top;

      handle.setPointerCapture(event.pointerId);
      event.preventDefault();
    });

    handle.addEventListener('pointermove', event => {
      if (!dragging) return;

      element.style.left = Math.max(
        0, originalX + event.clientX - startX
      ) + 'px';

      element.style.top = Math.max(
        0, originalY + event.clientY - startY
      ) + 'px';

      element.style.right = 'auto';
      element.style.bottom = 'auto';
    });

    handle.addEventListener('pointerup', () => {
      dragging = false;
    });

    handle.addEventListener('pointercancel', () => {
      dragging = false;
    });
  }

  function openGraphics(width = 480, height = 320) {
    graphicsWidth = Math.max(
      100, Math.min(2000, Number(width) || 480)
    );

    graphicsHeight = Math.max(
      100, Math.min(1600, Number(height) || 320)
    );

    if (!graphicsWindow || !graphicsWindow.isConnected) {
      graphicsWindow = document.createElement('div');
      graphicsWindow.id = 'pm-python-graphics';

      Object.assign(graphicsWindow.style, {
        position: 'fixed',
        left: '100px',
        top: '100px',
        width: (graphicsWidth + 2) + 'px',
        height: (graphicsHeight + 42) + 'px',
        minWidth: '180px',
        minHeight: '140px',
        resize: 'both',
        overflow: 'auto',
        zIndex: '1000000',
        background: '#151a22',
        border: '1px solid #6b829d',
        borderRadius: '8px',
        boxShadow: '0 8px 32px #0009',
        display: 'flex',
        flexDirection: 'column'
      });

      const header = document.createElement('div');

      Object.assign(header.style, {
        height: '38px',
        minHeight: '38px',
        background: '#263548',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        padding: '0 10px',
        gap: '8px',
        cursor: 'move',
        userSelect: 'none',
        font: '13px Arial'
      });

      const caption = document.createElement('strong');
      caption.textContent = 'Python Graphics';
      caption.style.flex = '1';

      const close = document.createElement('button');
      close.textContent = '×';

      Object.assign(close.style, {
        border: '0',
        background: 'transparent',
        color: 'white',
        fontSize: '22px',
        cursor: 'pointer'
      });

      close.onclick = () => {
        graphicsWindow.style.display = 'none';
      };

      header.append(caption, close);

      graphicsCanvas = document.createElement('canvas');
      graphicsCanvas.id = 'pm-python-graphics-canvas';
      graphicsCanvas.style.display = 'block';
      graphicsCanvas.style.maxWidth = '100%';
      graphicsCanvas.style.flex = '1';
      graphicsCanvas.style.objectFit = 'contain';

      graphicsWindow.append(header, graphicsCanvas);
      document.body.appendChild(graphicsWindow);

      makeDraggable(graphicsWindow, header);
    }

    graphicsCanvas.width = graphicsWidth;
    graphicsCanvas.height = graphicsHeight;
    graphicsCanvas.style.width = graphicsWidth + 'px';
    graphicsCanvas.style.height = graphicsHeight + 'px';

    graphicsWindow.style.width = (graphicsWidth + 2) + 'px';
    graphicsWindow.style.height = (graphicsHeight + 42) + 'px';
    graphicsWindow.style.display = 'flex';

    graphicsCtx = graphicsCanvas.getContext('2d');
    graphicsCtx.fillStyle = '#ffffff';
    graphicsCtx.fillRect(0, 0, graphicsWidth, graphicsHeight);

    return graphicsWindow;
  }

  function graphicsAPI() {
    return {
      open: (w, h) => openGraphics(w, h),

      fill: (r, g, b, a) => {
        if (!graphicsCtx) openGraphics(graphicsWidth, graphicsHeight);

        graphicsCtx.fillStyle =
          `rgba(${r|0},${g|0},${b|0},${(a === undefined ? 255 : a)/255})`;

        graphicsCtx.fillRect(
          0, 0, graphicsCanvas.width, graphicsCanvas.height
        );
      },

      rect: (r, g, b, a, x, y, w, h) => {
        if (!graphicsCtx) openGraphics(graphicsWidth, graphicsHeight);

        graphicsCtx.fillStyle =
          `rgba(${r|0},${g|0},${b|0},${(a === undefined ? 255 : a)/255})`;

        graphicsCtx.fillRect(x, y, w, h);
      },

      circle: (r, g, b, a, x, y, rad) => {
        if (!graphicsCtx) openGraphics(graphicsWidth, graphicsHeight);

        graphicsCtx.fillStyle =
          `rgba(${r|0},${g|0},${b|0},${(a === undefined ? 255 : a)/255})`;

        graphicsCtx.beginPath();
        graphicsCtx.arc(x, y, rad, 0, Math.PI * 2);
        graphicsCtx.fill();
      },

      line: (r, g, b, a, x1, y1, x2, y2, width) => {
        if (!graphicsCtx) openGraphics(graphicsWidth, graphicsHeight);

        graphicsCtx.strokeStyle =
          `rgba(${r|0},${g|0},${b|0},${(a === undefined ? 255 : a)/255})`;

        graphicsCtx.lineWidth = width || 1;
        graphicsCtx.beginPath();
        graphicsCtx.moveTo(x1, y1);
        graphicsCtx.lineTo(x2, y2);
        graphicsCtx.stroke();
      },

      flip: () => {},

      close: () => {
        if (graphicsWindow) graphicsWindow.style.display = 'none';
      },

      size: () => [graphicsWidth, graphicsHeight]
    };
  }

  async function ensurePython() {
    if (pyodide) return pyodide;
    if (loading) return loading;

    showPanel();
    setStatus('Loading Python…');

    loading = (async () => {
      if (!window.loadPyodide) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = PYODIDE_URL + 'pyodide.js';
          script.onload = resolve;
          script.onerror = () => reject(
            new Error('Không tải được Python runtime. Hãy kiểm tra mạng.')
          );

          document.head.appendChild(script);
        });
      }

      pyodide = await window.loadPyodide({
        indexURL: PYODIDE_URL
      });

      window.pm_graphics = graphicsAPI();
      pyodide.globals.set('pm_graphics', window.pm_graphics);

      await pyodide.runPythonAsync(`
import sys, types, io, contextlib, traceback
import js

pm_graphics = js.window.pm_graphics

class _PMSurface:
    def __init__(self, size):
        self._size = tuple(size)

    def get_size(self):
        return self._size

    def fill(self, color):
        c = list(color)
        c = (c + [255])[:4]
        pm_graphics.fill(*[int(x) for x in c])
        return (0, 0, *self._size)

class _PMDisplay:
    def set_mode(self, size, flags=0):
        pm_graphics.open(int(size[0]), int(size[1]))
        return _PMSurface(size)

    def set_caption(self, title):
        pass

    def flip(self):
        pm_graphics.flip()

    def update(self, *args):
        pm_graphics.flip()

    def quit(self):
        pm_graphics.close()

class _PMDraw:
    def rect(self, surface, color, rect, width=0, border_radius=0):
        c = (list(color) + [255])[:4]
        x, y, w, h = [int(v) for v in rect]

        if width:
            pm_graphics.line(*c, x, y, x+w, y, width)
            pm_graphics.line(*c, x, y+h, x+w, y+h, width)
            pm_graphics.line(*c, x, y, x, y+h, width)
            pm_graphics.line(*c, x+w, y, x+w, y+h, width)
        else:
            pm_graphics.rect(*c, x, y, w, h)

    def circle(self, surface, color, center, radius, width=0):
        c = (list(color) + [255])[:4]
        x, y = [int(v) for v in center]

        if width == 0:
            pm_graphics.circle(*c, x, y, int(radius))
        else:
            for r in range(max(1, int(radius)-int(width)), int(radius)+1):
                pm_graphics.circle(*c, x, y, r)

    def line(self, surface, color, start_pos, end_pos, width=1):
        c = (list(color) + [255])[:4]
        pm_graphics.line(
            *c,
            int(start_pos[0]), int(start_pos[1]),
            int(end_pos[0]), int(end_pos[1]),
            int(width)
        )

class _PMEvent:
    def get(self):
        return []

pygame = types.ModuleType('pygame')
pygame.init = lambda: (0, 0)
pygame.quit = lambda: pm_graphics.close()
pygame.display = _PMDisplay()
pygame.draw = _PMDraw()
pygame.event = _PMEvent()
pygame.Rect = lambda x, y, w, h: (x, y, w, h)
pygame.Color = lambda *args: args[0] if len(args) == 1 else args
pygame.SRCALPHA = 1
pygame.QUIT = 256
pygame.KEYDOWN = 768
pygame.K_ESCAPE = 27
pygame.__doc__ = 'Lightweight Canvas compatibility layer, not native Pygame.'
sys.modules['pygame'] = pygame
`);

      setStatus(
        'Ready · Python ' +
        pyodide.runPython('import sys; sys.version.split()[0]')
      );

      return pyodide;
    })().catch(error => {
      loading = null;
      pyodide = null;
      setStatus('Error');
      setOutput('Python runtime error: ' + (error.message || error));
      throw error;
    });

    return loading;
  }

  async function runCode(code) {
    try {
      const py = await ensurePython();
      py.globals.set('pm_user_code', String(code));

      const result = await py.runPythonAsync(`
_pm_stdout = io.StringIO()
_pm_stderr = io.StringIO()

try:
    with contextlib.redirect_stdout(_pm_stdout), contextlib.redirect_stderr(_pm_stderr):
        exec(compile(pm_user_code, '<penguinmod>', 'exec'), globals(), globals())

    _pm_result = _pm_stdout.getvalue() + _pm_stderr.getvalue()

except BaseException:
    _pm_result = (
        _pm_stdout.getvalue()
        + _pm_stderr.getvalue()
        + traceback.format_exc()
    )

_pm_result
`);

      setOutput(result == null ? '' : String(result));
    } catch (error) {
      setOutput('Error: ' + (error.message || error));
    }

    return lastOutput;
  }

  async function installPackage(name) {
    const pkg = String(name || '').trim();

    if (!pkg) {
      setOutput('Hãy nhập tên package.');
      return;
    }

    try {
      const py = await ensurePython();
      await py.loadPackage(['micropip']);
      py.globals.set('pm_package_name', pkg);

      const result = await py.runPythonAsync(`
import micropip, io, contextlib

_pm_install_out = io.StringIO()

try:
    with contextlib.redirect_stdout(_pm_install_out), contextlib.redirect_stderr(_pm_install_out):
        await micropip.install(pm_package_name)

    _pm_install_out.getvalue() or ('Installed: ' + pm_package_name)

except Exception as e:
    'pip install failed: ' + str(e) + '\\\\nOnly Pyodide-compatible packages can be installed.'
`);

      setOutput(String(result));
    } catch (error) {
      setOutput(
        'pip install failed: ' + (error.message || error) +
        '\nChỉ cài được package tương thích Pyodide/WebAssembly.'
      );
    }
  }

  const PythonExtension = {
    getInfo() {
      return {
        id: 'lpjkPython',
        name: 'Python',
        color1: '#3776AB',
        color2: '#2b5b84',
        color3: '#1f4564',
        menuIconURI: ICON,
        blockIconURI: ICON,

        blocks: [
          {
            opcode: 'runCode',
            blockType: Scratch.BlockType.COMMAND,
            text: 'run Python code [CODE]',
            arguments: {
              CODE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'print("Hello from Python!")'
              }
            }
          },
          {
            opcode: 'installPackage',
            blockType: Scratch.BlockType.COMMAND,
            text: 'pip install [PACKAGE]',
            arguments: {
              PACKAGE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'numpy'
              }
            }
          },
          {
            opcode: 'createFile',
            blockType: Scratch.BlockType.COMMAND,
            text: 'create file [NAME] with code [CODE]',
            arguments: {
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'main.py'
              },
              CODE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'print("Hello from file")'
              }
            }
          },
          {
            opcode: 'runFile',
            blockType: Scratch.BlockType.COMMAND,
            text: 'run file [NAME]',
            arguments: {
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'main.py'
              }
            }
          },
          {
            opcode: 'output',
            blockType: Scratch.BlockType.REPORTER,
            text: 'output'
          },
          {
            opcode: 'fileOutput',
            blockType: Scratch.BlockType.REPORTER,
            text: 'output file [NAME]',
            arguments: {
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'main.py'
              }
            }
          },
          {
            opcode: 'openGraphics',
            blockType: Scratch.BlockType.COMMAND,
            text: 'open graphics window width [W] height [H]',
            arguments: {
              W: { type: Scratch.ArgumentType.NUMBER, defaultValue: 480 },
              H: { type: Scratch.ArgumentType.NUMBER, defaultValue: 320 }
            }
          },
          {
            opcode: 'closeGraphics',
            blockType: Scratch.BlockType.COMMAND,
            text: 'close graphics window'
          },
          {
            opcode: 'showConsole',
            blockType: Scratch.BlockType.COMMAND,
            text: 'show Python output window'
          },
          {
            opcode: 'clearOutput',
            blockType: Scratch.BlockType.COMMAND,
            text: 'clear output'
          },
          {
            opcode: 'fileExists',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'file [NAME] exists?',
            arguments: {
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'main.py'
              }
            }
          },
          {
            opcode: 'deleteFile',
            blockType: Scratch.BlockType.COMMAND,
            text: 'delete file [NAME]',
            arguments: {
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'main.py'
              }
            }
          },
          {
            opcode: 'listFiles',
            blockType: Scratch.BlockType.REPORTER,
            text: 'list files'
          },
          {
            opcode: 'runtimeStatus',
            blockType: Scratch.BlockType.REPORTER,
            text: 'Python runtime status'
          }
        ]
      };
    },

    runCode(args) {
      runCode(args.CODE);
    },

    installPackage(args) {
      installPackage(args.PACKAGE);
    },

    createFile(args) {
      const name = String(args.NAME || '').trim();

      if (!name) {
        setOutput('Tên file không được để trống.');
        return;
      }

      files[name] = String(args.CODE || '');
      lastFileName = name;
      setOutput('Created file: ' + name);
    },

    async runFile(args) {
      const name = String(args.NAME || '').trim();

      if (!(name in files)) {
        setOutput('File not found: ' + name);
        return;
      }

      lastFileName = name;
      await runCode(files[name]);
      files[name + '::output'] = lastOutput;
    },

    output() {
      return lastOutput;
    },

    fileOutput(args) {
      const name = String(args.NAME || '').trim();

      if (files[name + '::output'] !== undefined) {
        return files[name + '::output'];
      }

      return name in files
        ? 'File exists, but has not been run.'
        : 'File not found: ' + name;
    },

    openGraphics(args) {
      openGraphics(args.W, args.H);
      setOutput('Graphics window opened.');
    },

    closeGraphics() {
      if (graphicsWindow) graphicsWindow.style.display = 'none';
    },

    showConsole() {
      outputVisible = true;
      showPanel().style.display = 'flex';
    },

    clearOutput() {
      setOutput('');
    },

    fileExists(args) {
      return String(args.NAME || '') in files;
    },

    deleteFile(args) {
      const name = String(args.NAME || '');
      delete files[name];
      delete files[name + '::output'];
      setOutput('Deleted file: ' + name);
    },

    listFiles() {
      return Object.keys(files)
        .filter(name => !name.endsWith('::output'))
        .join('\n');
    },

    runtimeStatus() {
      return pyodide
        ? 'Ready · Pyodide ' + pyodide.version
        : 'Not loaded';
    }
  };

  Scratch.extensions.register(PythonExtension);
})(Scratch);
