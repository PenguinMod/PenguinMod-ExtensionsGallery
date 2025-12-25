// Name: Shovel Debugger
// By: TheShovel <https://github.com/TheShovel>
// License: MIT

(function (Scratch) {
  "use strict";
  if (!Scratch.extensions.unsandboxed)
    throw new Error("Debugger extension must be run unsandboxed");
  if (!vm.runtime.ext_pen)
    vm.runtime.extensionManager.loadExtensionIdSync("pen");

  const oldStamp = vm.runtime.ext_pen._stamp;
  let stampsPerFrame = 0;
  vm.runtime.ext_pen._stamp = function (target) {
    stampsPerFrame += 1;
    oldStamp.call(this, target);
  };

  const oldSetTarget = vm.runtime.setEditingTarget;
  vm.runtime.setEditingTarget = function (editingTarget) {
    if (
      typeof vm.runtime.ext_DebuggerExtensionTS._updateThreadViewer ===
      "function"
    ) {
      vm.runtime.ext_DebuggerExtensionTS._updateThreadViewer(true);
    }

    oldSetTarget.call(this, editingTarget);
  };

  const COLOR_TOKEN_PREFIX = "[__COLOR:";
  const COLOR_TOKEN_SUFFIX = "__]";
  const COLOR_TOKEN_END = "[__END__]";

  const SVG_PAUSE = `
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style="width: 16px; height: 16px;">
        <rect x="6" y="5" width="4" height="14" />
        <rect x="14" y="5" width="4" height="14" />
    </svg>`;

  const SVG_PLAY = `
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style="width: 16px; height: 16px;">
        <path d="M8 5v14l11-7z" />
    </svg>`;

  const SVG_SCROLL_DOWN = `
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style="width: 16px; height: 16px;">
        <path d="M12 16.59l4.59-4.59L18 13l-6 6-6-6 1.41-1.41L12 16.59z" />
    </svg>`;

  const SVG_EXPORT = `
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style="width: 16px; height: 16px;">
        <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
    </svg>`;

  const SVG_CLOSE = `
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style="width: 16px; height: 16px;">
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
    </svg>`;

  class DebuggerExtensionTS {
    runtime = Scratch.vm.runtime;

    debuggerWindow = null;
    logContentArea = null;
    profilerContentArea = null;
    threadContentArea = null;
    variablesContentArea = null;
    variablesTableContainer = null;
    scrollToBottomButton = null;
    pauseButton = null;

    logEntries = [];
    LOG_LIMIT = 10000;
    scrollSizer = null;
    logContainer = null;
    averageEntryHeight = 18;
    renderBufferSize = 50;
    userScrolledUp = false;

    historyLength = 600;
    sampleIntervalMs = 100;
    lastSampleTime = 0;

    fpsHistory = null;
    writeIndex = 0;
    smoothingWindow = 5;

    fpsCanvas = null;
    fpsCtx = null;
    fpsTooltip = null;

    stampsPerFrameHistory = null;
    stampsPerFrameCanvas = null;
    stampsPerFrameCtx = null;
    stampsPerFrameTooltip = null;

    threadsOld = null;
    variablesOld = null;
    performanceMode = false;
    variableSearchQuery = "";

    packaged = typeof scaffolding !== "undefined";

    constructor() {
      this.fpsHistory = new Array(this.historyLength).fill(0);
      this.stampsPerFrameHistory = new Array(this.historyLength).fill(0);
      const oldStep = this.runtime._step;
      let lastFrame = performance.now();

      this.runtime._step = () => {
        oldStep.call(this.runtime);
        const t1 = performance.now();

        const frameDelta = t1 - lastFrame;
        lastFrame = t1;
        const fpsInstant = frameDelta > 0 ? 1000 / frameDelta : 0;

        const lastFps =
          this.fpsHistory[
            (this.writeIndex - 1 + this.historyLength) % this.historyLength
          ] || 0;
        const smoothedFps = lastFps + (fpsInstant - lastFps) * 0.25;

        this._maybeSample(t1, smoothedFps, stampsPerFrame);
        stampsPerFrame = 0;
      };

      if (!this.debuggerWindow) this._createWindow();
    }

    getInfo() {
      return {
        id: "DebuggerExtensionTS",
        name: "Debugger",
        blocks: [
          {
            opcode: "log",
            blockType: Scratch.BlockType.COMMAND,
            text: "log [TEXT]",
            arguments: {
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "Hello",
              },
            },
          },
          {
            opcode: "coloredText",
            blockType: Scratch.BlockType.REPORTER,
            text: "text [TEXT] color [COLOR]",
            arguments: {
              TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: "text" },
              COLOR: {
                type: Scratch.ArgumentType.COLOR,
                defaultValue: "#FF0000",
              },
            },
          },
          {
            opcode: "clear",
            blockType: Scratch.BlockType.COMMAND,
            text: "clear log",
          },

          "---",
          {
            opcode: "commandWasRan",
            blockType: Scratch.BlockType.BOOLEAN,
            text: "ran command?",
            disableMonitor: true,
          },
          {
            opcode: "getCommand",
            blockType: Scratch.BlockType.REPORTER,
            text: "command",
            disableMonitor: true,
          },
          {
            opcode: "pause",
            blockType: Scratch.BlockType.COMMAND,
            text: "pause project",
          },
          "---",
          {
            opcode: "showDebugger",
            blockType: Scratch.BlockType.COMMAND,
            text: "show debugger",
          },
          {
            opcode: "hideDebugger",
            blockType: Scratch.BlockType.COMMAND,
            text: "hide debugger",
          },
        ],
      };
    }

    coloredText({ TEXT, COLOR }) {
      return `${COLOR_TOKEN_PREFIX}${COLOR}${COLOR_TOKEN_SUFFIX}${TEXT}${COLOR_TOKEN_END}`;
    }
    hideDebugger() {
      if (this.debuggerWindow) {
        this.debuggerWindow.style.pointerEvents = "none";
        this.debuggerWindow.style.opacity = "0";
        this.debuggerWindow.style.transform = "scale(0.95)";
        this.debuggerWindow.style.transition = "all 0.2s ease-in-out";
        setTimeout(() => {
          this.debuggerWindow.style.display = "none";
          this.debuggerWindow.style.pointerEvents = "";
          this.debuggerWindow.style.transition = "";
        }, 200);
      }
    }

    showDebugger() {
      if (this.debuggerWindow) {
        this.debuggerWindow.style.display = "flex";
        this.debuggerWindow.style.opacity = "0";
        this.debuggerWindow.style.transform = "scale(0.95)";
        this.debuggerWindow.style.transition = "all 0.2s ease-out";
        this.debuggerWindow.offsetHeight;
        this.debuggerWindow.style.opacity = "1";
        this.debuggerWindow.style.transform = "scale(1)";
        setTimeout(() => {
          this.debuggerWindow.style.transition = "";
        }, 200);
      }
    }
    _createWindow() {
      const checkAndAddButton = () => {
        const container = document.querySelector(
          '[class^="stage-header_stage-size-row_"]',
        );
        if (container && !container.querySelector(".sa-debugger-container")) {
          const buttonContainer = document.createElement("div");
          buttonContainer.className = "sa-debugger-container";
          buttonContainer.dataset.saSharedSpaceOrder = "-1";
          buttonContainer.innerHTML = `
            <div class="button_outlined-button_1bS__ stage-header_stage-button_hkl9B" style="margin-right: .2rem;">
              <div class="button_content_3jdgj">
                <img class="stage-header_stage-button-icon_3zzFK" draggable="false"
                  src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgc3Ryb2tlPSIjNEM5N0ZGIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggc3R5bGU9ImZpbGw6IzU3NWU3NTtmaWxsLW9wYWNpdHk6MTtzdHJva2U6bm9uZTtzdHJva2Utd2lkdGg6MTtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6NDtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLW9wYWNpdHk6MTtwYWludC1vcmRlcjptYXJrZXJzIHN0cm9rZSBmaWxsIiBkPSJNNCAzLjVjLS44MzEgMC0xLjUuNjY5LTEuNSAxLjV2MTBjMCAuODMxLjY2OSAxLjUgMS41IDEuNWgxMmMuODMxIDAgMS41LS42NjkgMS41LTEuNVY1YzAtLjgzMS0uNjY5LTEuNS0xLjUtMS41Wm0wIDFoMTJjLjI3NyAwIC41LjIyMy41LjV2MTBjMCAuMjc3LS4yMjMuNS0uNS41SDRhLjQ5OS40OTkgMCAwIDEtLjUtLjVWNWMwLS4yNzcuMjIzLS41LjUtLjVaIiBzdHJva2U9Im5vbmUiLz48cGF0aCBkPSJtNS40MTcgNy41IDMuNzUgMi41LTMuNzUgMi41bTUgMGg0LjE2NiIgc3R5bGU9ImZpbGw6bm9uZTtzdHJva2U6IzhmOGY4ZjtzdHJva2Utd2lkdGg6MTtzdHJva2UtbWl0ZXJsaW1pdDo0O3N0cm9rZS1kYXNoYXJyYXk6bm9uZTtzdHJva2Utb3BhY2l0eToxIi8+PC9nPjwvc3ZnPg==">
              </div>
            </div>
          `;
          buttonContainer.addEventListener("click", () => {
            if (this.debuggerWindow.style.display === "none") {
              this.showDebugger();
            } else {
              this.hideDebugger();
            }
          });
          container.insertBefore(buttonContainer, container.firstChild);
        }
      };

      checkAndAddButton();

      const observer = new MutationObserver(() => {
        checkAndAddButton();
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });

      const w = (this.debuggerWindow = document.createElement("div"));
      Object.assign(w.style, {
        position: "fixed",
        top: "80px",
        right: "80px",
        width: "420px",
        height: "280px",
        minWidth: "320px",
        minHeight: "240px",
        background: "var(--ui-primary, hsla(215, 100%, 95%, 1))",
        border: "1px solid var(--ui-black-transparent, hsla(0, 0%, 0%, 0.15))",
        borderRadius: "8px",
        //this seems like the perfect number that doesnt overlay over like variable creation screens and stuff
        zIndex: 501,
        display: "flex",
        flexDirection: "column",
        resize: "both",
        overflow: "hidden",
        boxSizing: "border-box",
        boxShadow: "0px 5px 25px 5px hsla(0, 0%, 0%, 0.15)",
      });

      const header = document.createElement("div");
      Object.assign(header.style, {
        background: getComputedStyle(document.documentElement).getPropertyValue(
          "--ui-secondary",
        )
          ? "#009CCC"
          : "hsla(194, 100%, 50%, 1)",
        color: "#fff",
        padding: "6px 10px",
        cursor: "move",
        userSelect: "none",
        fontWeight: "600",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      });
      header.textContent = "Debugger";

      const closeButton = document.createElement("button");

      closeButton.innerHTML = SVG_CLOSE;
      Object.assign(closeButton.style, {
        background: "transparent",
        border: "none",
        color: "#fff",
        cursor: "pointer",
        padding: "0",
        width: "24px",
        height: "24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      });
      closeButton.title = "Close Debugger";
      closeButton.addEventListener("click", () => {
        this.hideDebugger();
      });

      header.appendChild(closeButton);
      w.appendChild(header);

      const tabBar = document.createElement("div");
      Object.assign(tabBar.style, {
        display: "flex",
        background: "var(--ui-secondary, hsla(215, 75%, 95%, 1))",
        borderBottom:
          "1px solid var(--ui-black-transparent, hsla(0, 0%, 0%, 0.15))",
      });
      w.appendChild(tabBar);

      const makeTabButton = (label) => {
        const b = document.createElement("button");
        Object.assign(b.style, {
          background: "transparent",
          border: "none",
          color: "var(--text-primary, hsla(225, 15%, 40%, 1))",
          padding: "8px 12px",
          cursor: "pointer",
          outline: "none",
          flexGrow: 1,
          transition: "background-color 0.3s ease",
        });
        b.textContent = label;

        b.addEventListener("mouseover", () => {
          b.style.backgroundColor = "rgba(0, 156, 204, 0.2)";
        });

        b.addEventListener("mouseout", () => {
          b.style.backgroundColor = "transparent";
        });

        return b;
      };

      const logsTabButton = makeTabButton("Logs");
      const profilerTabButton = makeTabButton("Profiler");
      const threadsTabButton = makeTabButton("Threads");
      const runtimeVarsTabButton = makeTabButton("Variables");
      tabBar.appendChild(logsTabButton);
      tabBar.appendChild(profilerTabButton);
      tabBar.appendChild(threadsTabButton);
      tabBar.appendChild(runtimeVarsTabButton);

      const exportButton = document.createElement("button");
      Object.assign(exportButton.style, {
        background: "transparent",
        border: "none",
        color: getComputedStyle(document.documentElement).getPropertyValue(
          "--ui-secondary",
        )
          ? "#009CCC"
          : "hsla(194, 100%, 50%, 1)",
        padding: "8px",
        fontSize: "16px",
        cursor: "pointer",
        outline: "none",
        marginLeft: "auto",
        display: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      });
      exportButton.innerHTML = SVG_EXPORT;
      exportButton.title = "Export Logs";
      exportButton.addEventListener("click", this._exportLogsToHtml.bind(this));
      tabBar.appendChild(exportButton);

      const tabContent = document.createElement("div");
      Object.assign(tabContent.style, {
        flexGrow: 1,
        position: "relative",
        overflowX: "hidden",
        padding: "15px",
      });
      w.appendChild(tabContent);

      this.logContentArea = document.createElement("div");
      Object.assign(this.logContentArea.style, {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflowY: "auto",
        padding: "8px",
        color: "#eee",
        fontFamily: "monospace",
        fontSize: "12px",
        boxSizing: "border-box",
        display: "block",
      });
      tabContent.appendChild(this.logContentArea);

      this.scrollSizer = document.createElement("div");
      Object.assign(this.scrollSizer.style, {
        position: "absolute",
        top: 0,
        left: 0,
        width: "1px",
        height: "0px",
      });
      this.logContainer = document.createElement("div");
      Object.assign(this.logContainer.style, { position: "relative" });
      this.logContentArea.appendChild(this.scrollSizer);
      this.logContentArea.appendChild(this.logContainer);
      this.logContentArea.addEventListener(
        "scroll",
        this._handleScroll.bind(this),
      );

      const buttonStyles = {
        position: "absolute",
        bottom: "10px",
        width: "30px",
        height: "30px",
        borderRadius: "50%",
        border: "none",
        background: getComputedStyle(document.documentElement).getPropertyValue(
          "--ui-secondary",
        )
          ? getComputedStyle(document.documentElement).getPropertyValue(
              "--ui-secondary",
            )
            ? "#009CCC"
            : "hsla(194, 100%, 50%, 1)"
          : "hsla(194, 100%, 50%, 1)",
        color: "#fff",
        fontSize: "16px",
        cursor: "pointer",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      };

      this.pauseButton = document.createElement("button");
      Object.assign(this.pauseButton.style, buttonStyles, {
        left: "10px",
        display: "none",
      });
      this.pauseButton.title = "Pause Project (Ctrl+Click to Debug)";

      this.pauseButton.addEventListener("mouseover", () => {
        this.pauseButton.style.opacity = 0.5;
      });

      this.pauseButton.addEventListener("mouseout", () => {
        this.pauseButton.style.opacity = 1;
      });

      const updatePauseButton = () => {
        if (this.runtime.paused) {
          this.pauseButton.innerHTML = SVG_PLAY;
          this.pauseButton.title = "Resume Project";
        } else {
          this.pauseButton.innerHTML = SVG_PAUSE;
          this.pauseButton.title = "Pause Project";
        }
      };

      this.pauseButton.addEventListener("click", () => {
        this.pause();
        updatePauseButton();
      });
      tabContent.appendChild(this.pauseButton);
      this.runtime.on("RUNTIME_UNPAUSED", updatePauseButton);
      this.runtime.on("PROJECT_STOP_ALL", updatePauseButton);
      this.runtime.on("RUNTIME_PAUSED", updatePauseButton);
      updatePauseButton();

      this.scrollToBottomButton = document.createElement("button");
      this.scrollToBottomButton.innerHTML = SVG_SCROLL_DOWN;
      Object.assign(this.scrollToBottomButton.style, buttonStyles, {
        right: "10px",
        display: "none",
      });
      this.scrollToBottomButton.title = "Scroll to bottom";
      this.scrollToBottomButton.addEventListener("click", () => {
        this.logContentArea.scrollTop = this.logContentArea.scrollHeight + 20;
        this.userScrolledUp = false;
      });
      tabContent.appendChild(this.scrollToBottomButton);

      this.profilerContentArea = document.createElement("div");
      tabContent.appendChild(this.profilerContentArea);

      this.threadContentArea = document.createElement("div");
      tabContent.appendChild(this.threadContentArea);

      this.variablesContentArea = document.createElement("div");
      Object.assign(this.variablesContentArea.style, {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        color: "var(--text-primary, hsla(225, 15%, 40%, 1))",
        fontFamily: "monospace",
        fontSize: "12px",
        boxSizing: "border-box",
        display: "none",
        flexDirection: "column",
      });
      tabContent.appendChild(this.variablesContentArea);

      const varsSearchContainer = document.createElement("div");
      Object.assign(varsSearchContainer.style, {
        padding: "8px",
        borderBottom: "1px solid var(--ui-secondary, hsl(0, 0%, 100%))",
        background: "var(--ui-secondary, hsl(0, 0%, 100%))",
        flexShrink: 0,
      });

      const varsSearchInput = document.createElement("input");
      Object.assign(varsSearchInput.style, {
        width: "100%",
        padding: "4px 6px",
        boxSizing: "border-box",
        borderRadius: "4px",
        border: "1px solid var(--ui-black-transparent, hsla(0, 0%, 0%, 0.15))",
        background: "var(--ui-primary, #fff)",
        color: "var(--text-primary, #000)",
        fontFamily: "monospace",
        fontSize: "11px",
      });
      varsSearchInput.placeholder = "Search variables...";
      varsSearchInput.addEventListener("input", (e) => {
        this.variableSearchQuery = e.target.value;
        this._updateVariablesViewer();
      });

      varsSearchContainer.appendChild(varsSearchInput);
      this.variablesContentArea.appendChild(varsSearchContainer);

      this.variablesTableContainer = document.createElement("div");
      Object.assign(this.variablesTableContainer.style, {
        flexGrow: 1,
        overflowY: "auto",
        overflowX: "hidden",
        padding: "8px",
      });
      this.variablesContentArea.appendChild(this.variablesTableContainer);

      const threadControls = document.createElement("div");
      Object.assign(threadControls.style, {
        padding: "8px",
        borderBottom: "1px solid var(--ui-secondary, hsl(0, 0%, 100%))",
        marginBottom: "10px",
        background: "var(--ui-secondary, hsl(0, 0%, 100%))",
        borderRadius: "4px",
      });
      this.threadContentArea.appendChild(threadControls);

      const perfModeContainer = document.createElement("div");
      Object.assign(perfModeContainer.style, {
        display: "flex",
        alignItems: "center",
        gap: "8px",
      });

      const perfModeCheckbox = document.createElement("input");
      perfModeCheckbox.type = "checkbox";
      perfModeCheckbox.id = "perfModeCheckbox";
      Object.assign(perfModeCheckbox.style, {
        margin: "0",
        cursor: "pointer",
      });
      perfModeCheckbox.checked = this.performanceMode;

      const perfModeLabel = document.createElement("label");
      perfModeLabel.htmlFor = "perfModeCheckbox";
      Object.assign(perfModeLabel.style, {
        color: "var(--text-primary, hsla(225, 15%, 40%, 1))",
        fontFamily: "monospace",
        fontSize: "10px",
        cursor: "pointer",
        userSelect: "none",
      });
      perfModeLabel.textContent = "Thread previews (experimental)";

      if (!this.packaged) {
        perfModeContainer.appendChild(perfModeCheckbox);
        perfModeContainer.appendChild(perfModeLabel);
        threadControls.appendChild(perfModeContainer);
      }

      perfModeCheckbox.addEventListener("change", (e) => {
        this.performanceMode = e.target.checked;
        this._updateThreadViewer(true);
      });

      this.threadViewerContainer = document.createElement("div");
      Object.assign(this.threadViewerContainer.style, {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
        gap: "10px",
        boxSizing: "border-box",
        color: "#eee",
        fontFamily: "monospace",
        fontSize: "12px",
      });
      this.threadContentArea.appendChild(this.threadViewerContainer);

      this.fpsCanvas = document.createElement("canvas");
      this.fpsCtx = this.fpsCanvas.getContext("2d");
      this.fpsTooltip = this._makeTooltip();
      this.profilerContentArea.appendChild(
        this._wrapCanvas("FPS (last 60s)", this.fpsCanvas, this.fpsTooltip, {
          height: 180,
        }),
      );

      this.stampsPerFrameCanvas = document.createElement("canvas");
      this.stampsPerFrameCtx = this.stampsPerFrameCanvas.getContext("2d");
      this.stampsPerFrameTooltip = this._makeTooltip();
      this.profilerContentArea.appendChild(
        this._wrapCanvas(
          "Pen Stamps Per Frame (last 60s)",
          this.stampsPerFrameCanvas,
          this.stampsPerFrameTooltip,
          { height: 140 },
        ),
      );

      const cmdWrap = document.createElement("div");
      Object.assign(cmdWrap.style, {
        padding: "6px",
        background: "var(--ui-secondary, hsla(215, 75%, 95%, 1))",
      });
      const input = document.createElement("input");
      Object.assign(input.style, {
        width: "100%",
        background: "var(--ui-secondary, hsl(0, 0%, 100%))",
        color: "var(--text-primary, hsla(225, 15%, 40%, 1))",
        border: "1px solid var(--ui-black-transparent, hsla(0, 0%, 0%, 0.15))",
        padding: "6px",
        boxSizing: "border-box",
        fontFamily: "monospace",
        borderRadius: "4px",
      });

      const activateTab = (tabName) => {
        cmdWrap.style.height = "0px";
        logsTabButton.style.borderBottom = "2px solid transparent";
        profilerTabButton.style.borderBottom = "2px solid transparent";
        threadsTabButton.style.borderBottom = "2px solid transparent";
        runtimeVarsTabButton.style.borderBottom = "2px solid transparent";
        this.logContentArea.style.display = "none";
        this.profilerContentArea.style.display = "none";
        this.threadContentArea.style.display = "none";
        this.variablesContentArea.style.display = "none";
        this.scrollToBottomButton.style.display = "none";
        this.pauseButton.style.display = "none";
        exportButton.style.display = "none";
        input.style.visibility = "hidden";
        switch (tabName) {
          case "logs":
            cmdWrap.style.height = "";
            logsTabButton.style.borderBottom = "2px solid #009CCC";
            this.logContentArea.style.display = "block";
            this.pauseButton.style.display = "flex";
            exportButton.style.display = "flex";
            this._updateVirtualScroll();
            input.style.visibility = "";
            break;
          case "profiler":
            profilerTabButton.style.borderBottom = "2px solid #009CCC";
            this.profilerContentArea.style.display = "block";
            this._resizeAllCanvases();
            this._renderAllGraphs();
            break;
          case "threads":
            threadsTabButton.style.borderBottom = "2px solid #009CCC";
            this.threadContentArea.style.display = "block";
            this._updateThreadViewer();
            break;
          case "variables":
            runtimeVarsTabButton.style.borderBottom = "2px solid #009CCC";
            this.variablesContentArea.style.display = "flex";
            this._updateVariablesViewer();
            break;
        }
      };
      runtimeVarsTabButton.addEventListener("click", () =>
        activateTab("variables"),
      );
      logsTabButton.addEventListener("click", () => activateTab("logs"));
      profilerTabButton.addEventListener("click", () =>
        activateTab("profiler"),
      );
      threadsTabButton.addEventListener("click", () => activateTab("threads"));
      activateTab("logs");
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          const command = input.value.trim();
          if (command) {
            this.commandText = command;
            this.log({ TEXT: ">> " + command });
            input.value = "";
            this.ranCommand = true;
          }
        }
      });
      cmdWrap.appendChild(input);
      w.appendChild(cmdWrap);

      document.body.appendChild(w);
      this._drag(header, w);

      this.lastSampleTime = performance.now();
      this._attachCanvasEvents(
        this.fpsCanvas,
        this.fpsTooltip,
        (value) => ({
          label: "FPS",
          value: value.toFixed(1),
        }),
        this.fpsHistory,
      );

      this._attachCanvasEvents(
        this.stampsPerFrameCanvas,
        this.stampsPerFrameTooltip,
        (value) => ({
          label: "Stamps/Frame",
          value: Math.round(value),
        }),
        this.stampsPerFrameHistory,
        { raw: true },
      );

      requestAnimationFrame(() => this._renderLoop());
      this.hideDebugger();
    }

    _constrainWindowToBounds(el) {
      const rect = el.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      if (rect.right > windowWidth) {
        el.style.left = windowWidth - rect.width + "px";
      }

      if (rect.left < 0) {
        el.style.left = "0px";
      }

      if (rect.bottom > windowHeight) {
        el.style.top = windowHeight - rect.height + "px";
      }

      if (rect.top < 0) {
        el.style.top = "0px";
      }
    }

    _drag(header, el) {
      let x = 0,
        y = 0;
      header.onmousedown = (e) => {
        const r = el.getBoundingClientRect();
        x = e.clientX - r.left;
        y = e.clientY - r.top;
        document.onmousemove = (e2) => {
          el.style.left = e2.clientX - x + "px";
          el.style.top = e2.clientY - y + "px";
          this._constrainWindowToBounds(el);
        };
        document.onmouseup = () => {
          document.onmousemove = null;
          document.onmouseup = null;
        };
      };
    }

    _getDynamicMax(arr) {
      const maxVal = arr.reduce((max, current) => Math.max(max, current), 0);

      if (maxVal === 0) return 10;

      const steps = [10, 25, 50, 100, 200, 500, 1000, 2000, 5000, 10000];

      for (const step of steps) {
        if (maxVal <= step) {
          return step;
        }
      }

      const magnitude = Math.pow(10, Math.floor(Math.log10(maxVal)));
      let roundedMax = Math.ceil(maxVal / magnitude) * magnitude;

      if (roundedMax < maxVal * 1.1) {
        roundedMax += magnitude;
      }

      return roundedMax;
    }

    _makeTooltip() {
      const t = document.createElement("div");
      Object.assign(t.style, {
        position: "fixed",
        pointerEvents: "none",
        background: "#141416",
        border: "1px solid var(--ui-black-transparent, hsla(0, 0%, 0%, 0.15))",
        color: "#fff",
        padding: "6px 8px",
        borderRadius: "4px",
        fontFamily: "monospace",
        fontSize: "12px",
        display: "none",
        zIndex: 10050,
      });
      document.body.appendChild(t);
      return t;
    }

    _wrapCanvas(labelText, canvas, tooltip, opts) {
      const wrapper = document.createElement("div");
      wrapper.style.marginBottom = "8px";
      const label = document.createElement("div");
      label.textContent = labelText;
      Object.assign(label.style, {
        color: "var(--text-primary, hsla(225, 15%, 40%, 1))",
        marginBottom: "4px",
        fontSize: "12px",
      });
      canvas.style.width = "100%";
      canvas.style.display = "block";
      canvas.style.border =
        "1px solid var(--ui-black-transparent, hsla(0, 0%, 0%, 0.15))";
      canvas.style.height = (opts && opts.height ? opts.height : 100) + "px";
      canvas.width = 600;
      canvas.height = opts && opts.height ? opts.height : 100;
      wrapper.appendChild(label);
      wrapper.appendChild(canvas);
      return wrapper;
    }

    _attachCanvasEvents(canvas, tooltip, formatFn, historyArr, opts) {
      opts = opts || {};
      canvas.addEventListener("mousemove", (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const idx = Math.floor((x / rect.width) * this.historyLength);
        const realIndex = (this.writeIndex + idx) % this.historyLength;

        const value = opts.raw
          ? historyArr[realIndex] || 0
          : this._smoothedValue(historyArr, realIndex);

        const info = formatFn(value);
        tooltip.style.left = e.clientX + 12 + "px";
        tooltip.style.top = e.clientY + 12 + "px";
        tooltip.textContent = info.label + ": " + info.value;
        tooltip.style.display = "block";
      });
      canvas.addEventListener("mouseleave", () => {
        tooltip.style.display = "none";
      });
    }

    _smoothedValue(arr, idx) {
      let sum = 0,
        cnt = 0;
      const half = Math.floor(this.smoothingWindow / 2);
      for (let i = -half; i <= half; i++) {
        const j = (idx + i + arr.length) % arr.length;
        sum += arr[j] || 0;
        cnt++;
      }
      return sum / Math.max(1, cnt);
    }

    _maybeSample(now, fpsValue, stampsPerFrameCount) {
      if (vm.runtime.paused) return;
      if (now - this.lastSampleTime >= this.sampleIntervalMs) {
        this.fpsHistory[this.writeIndex] = fpsValue;
        this.stampsPerFrameHistory[this.writeIndex] = stampsPerFrameCount;
        this.writeIndex = (this.writeIndex + 1) % this.historyLength;
        this.lastSampleTime = now;
      }
    }

    _resizeAllCanvases() {
      this.fpsCanvas.width = Math.max(
        200,
        Math.floor(this.fpsCanvas.getBoundingClientRect().width),
      );
      this.fpsCanvas.height = Math.max(
        60,
        Math.floor(this.fpsCanvas.getBoundingClientRect().height),
      );
      this.stampsPerFrameCanvas.width = Math.max(
        200,
        Math.floor(this.stampsPerFrameCanvas.getBoundingClientRect().width),
      );
      this.stampsPerFrameCanvas.height = Math.max(
        60,
        Math.floor(this.stampsPerFrameCanvas.getBoundingClientRect().height),
      );
    }

    _renderAllGraphs() {
      this._renderGraph(this.fpsCanvas, this.fpsCtx, this.fpsHistory, {
        color: "#4ee27a",
        maxValue: 250,
        label: "FPS",
      });

      const stampsMax = this._getDynamicMax(this.stampsPerFrameHistory);

      this._renderGraph(
        this.stampsPerFrameCanvas,
        this.stampsPerFrameCtx,
        this.stampsPerFrameHistory,
        {
          color: "#4e7ae2",
          maxValue: stampsMax,
          label: "Stamps/Frame",
          raw: true,
        },
      );
    }

    _renderGraph(canvas, ctx, arr, opts) {
      if (!ctx) ctx = canvas.getContext("2d");
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      if (
        getComputedStyle(document.documentElement).getPropertyValue(
          "--ui-secondary",
        )
      ) {
        ctx.fillStyle = getComputedStyle(
          document.documentElement,
        ).getPropertyValue("--ui-secondary");
      } else {
        ctx.fillStyle = "#FFFFFF";
      }

      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = "#494949";
      ctx.lineWidth = 1;
      const maxValue = opts.maxValue || 1;
      const numLines = 5;
      const step = maxValue / numLines;

      ctx.fillStyle = "#555";
      ctx.font = "10px monospace";
      ctx.textAlign = "right";

      for (let i = 0; i <= numLines; i++) {
        const y = h - (i / numLines) * h;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();

        if (i > 0) {
          const labelText = Math.round(step * i * 10) / 10;
          ctx.fillText(labelText, w - 2, y - 2);
        }
      }

      ctx.strokeStyle = opts.color;
      ctx.lineWidth = 1.5;
      ctx.beginPath();

      for (let i = 0; i < this.historyLength; i++) {
        const idx = (this.writeIndex + i) % this.historyLength;
        const val = opts.raw ? arr[idx] || 0 : this._smoothedValue(arr, idx);
        const x = (i / (this.historyLength - 1)) * w;
        const y = h - (val / maxValue) * h;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    _renderLoop() {
      if (
        this.profilerContentArea &&
        this.profilerContentArea.style.display !== "none"
      ) {
        this._resizeAllCanvases();
        this._renderAllGraphs();
      }

      if (
        this.threadContentArea &&
        this.threadContentArea.style.display !== "none"
      ) {
        this._updateThreadViewer();
      }

      if (
        this.variablesContentArea &&
        this.variablesContentArea.style.display !== "none"
      ) {
        this._updateVariablesViewer();
      }

      if (this.logContentArea && this.logContentArea.style.display !== "none") {
        this.scrollToBottomButton.style.display = this.userScrolledUp
          ? "flex"
          : "none";
      } else if (this.scrollToBottomButton) {
        this.scrollToBottomButton.style.display = "none";
      }
      requestAnimationFrame(() => this._renderLoop());
    }

    _updateVariablesViewer() {
      if (!this.variablesContentArea || !this.variablesTableContainer) return;

      const allEntries = [];
      if (this.runtime.targets) {
        this.runtime.targets.forEach((target) => {
          const variables = target.variables;
          if (!variables) return;
          const targetName = target.getName();
          Object.values(variables).forEach((variable) => {
            allEntries.push({
              id: variable.id || targetName + variable.name,
              key: target.isStage
                ? variable.name
                : `${targetName}: ${variable.name}`,
              value: variable.value,
              ref: variable,
            });
          });
        });
      }

      if (this.runtime.variables) {
        Object.keys(this.runtime.variables).forEach((key) => {
          allEntries.push({
            id: "runtime-" + key,
            key: `[Runtime] ${key}`,
            value: this.runtime.variables[key],
            ref: { type: "runtime", key: key },
          });
        });
      }

      allEntries.sort((a, b) => a.key.localeCompare(b.key));

      const filteredEntries = this.variableSearchQuery
        ? allEntries.filter((entry) =>
            entry.key
              .toLowerCase()
              .includes(this.variableSearchQuery.toLowerCase()),
          )
        : allEntries;

      if (!this.variablesCountLabel) {
        this.variablesCountLabel = document.createElement("div");
        Object.assign(this.variablesCountLabel.style, {
          padding: "8px",
          color: "var(--text-primary, hsla(225, 15%, 40%, 1))",
          fontFamily: "monospace",
          fontSize: "12px",
          fontWeight: "bold",
          borderBottom: "1px solid var(--ui-secondary, hsl(0, 0%, 100%))",
          background: "var(--ui-secondary, hsl(0, 0%, 100%))",
          flexShrink: 0,
        });
        this.variablesContentArea.insertBefore(
          this.variablesCountLabel,
          this.variablesContentArea.children[1],
        );
      }
      this.variablesCountLabel.textContent = `Variables: ${filteredEntries.length}`;

      const container = this.variablesTableContainer;
      const rowHeight = 24;
      const containerHeight = container.clientHeight;
      const scrollTop = container.scrollTop;

      const buffer = 20;

      const startIndex = Math.max(
        0,
        Math.floor(scrollTop / rowHeight) - buffer,
      );
      const endIndex = Math.min(
        filteredEntries.length,
        Math.ceil((scrollTop + containerHeight) / rowHeight) + buffer,
      );

      const structureString =
        filteredEntries.map((e) => e.id).join(",") +
        this.variableSearchQuery +
        `:${startIndex}:${endIndex}:${filteredEntries.length}`;

      if (this.variablesOld !== structureString) {
        this.variablesOld = structureString;

        container.innerHTML = "";
        const table = document.createElement("table");
        Object.assign(table.style, {
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "12px",
          tableLayout: "fixed",
        });

        if (startIndex > 0) {
          const spacerRow = document.createElement("tr");
          spacerRow.style.height = `${startIndex * rowHeight}px`;
          const spacerCell = document.createElement("td");
          spacerCell.colSpan = 2;
          spacerRow.appendChild(spacerCell);
          table.appendChild(spacerRow);
        }

        for (let i = startIndex; i < endIndex; i++) {
          const entry = filteredEntries[i];
          if (!entry) continue;
          const row = document.createElement("tr");
          row.style.background =
            i % 2 === 0 ? "transparent" : "rgba(0,0,0,0.03)";
          row.style.borderBottom =
            "1px solid var(--ui-black-transparent, rgba(0,0,0,0.1))";
          row.style.height = `${rowHeight}px`;

          const keyCell = document.createElement("td");
          keyCell.textContent = entry.key;
          Object.assign(keyCell.style, {
            paddingLeft: "8px",
            fontWeight: "bold",
            width: "40%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            textAlign: "left",
            borderRight:
              "1px solid var(--ui-black-transparent, rgba(0,0,0,0.1))",
          });

          const valCell = document.createElement("td");
          Object.assign(valCell.style, {
            paddingLeft: "8px",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            textAlign: "left",
          });

          const input = document.createElement("input");
          input.dataset.varId = entry.id;
          Object.assign(input.style, {
            width: "100%",
            background: "transparent",
            border: "none",
            color: "var(--text-primary, hsla(225, 15%, 40%, 1))",
            outline: "none",
            fontFamily: "monospace",
            padding: "6px",
          });

          input.value = entry.value;

          input.addEventListener("change", (e) => {
            let val = e.target.value;
            if (val !== "" && !isNaN(val)) val = Number(val);

            if (entry.ref.type === "runtime") {
              this.runtime.variables[entry.ref.key] = val;
            } else {
              entry.ref.value = val;
            }
          });

          valCell.appendChild(input);
          row.appendChild(keyCell);
          row.appendChild(valCell);
          table.appendChild(row);
        }

        if (endIndex < filteredEntries.length) {
          const spacerRow = document.createElement("tr");
          spacerRow.style.height = `${
            (filteredEntries.length - endIndex) * rowHeight
          }px`;
          const spacerCell = document.createElement("td");
          spacerCell.colSpan = 2;
          spacerRow.appendChild(spacerCell);
          table.appendChild(spacerRow);
        }

        container.appendChild(table);
      } else {
        this._syncVariableInputs(filteredEntries);
      }
    }

    _renderVariableTable(entries) {
      this.variablesTableContainer.innerHTML = "";
      const table = document.createElement("table");
      Object.assign(table.style, {
        width: "100%",
        borderCollapse: "collapse",
        fontSize: "12px",
        tableLayout: "fixed",
      });

      entries.forEach((entry, index) => {
        if (
          this.variableSearchQuery &&
          !entry.key
            .toLowerCase()
            .includes(this.variableSearchQuery.toLowerCase())
        )
          return;

        const row = document.createElement("tr");
        row.style.background =
          index % 2 === 0 ? "transparent" : "rgba(0,0,0,0.03)";
        row.style.borderBottom =
          "1px solid var(--ui-black-transparent, rgba(0,0,0,0.1))";

        const keyCell = document.createElement("td");
        keyCell.textContent = entry.key;
        Object.assign(keyCell.style, {
          paddingLeft: "8px",
          fontWeight: "bold",
          width: "40%",
          overflow: "hidden",
          textOverflow: "ellipsis",
          textAlign: "left",
          borderRight: "1px solid var(--ui-black-transparent, rgba(0,0,0,0.1))",
        });

        const valCell = document.createElement("td");
        Object.assign(valCell.style, {
          paddingLeft: "8px",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          textAlign: "left",
        });

        const input = document.createElement("input");
        input.dataset.varId = entry.id;
        Object.assign(input.style, {
          width: "100%",
          background: "transparent",
          border: "none",
          color: "var(--text-primary, hsla(225, 15%, 40%, 1))",
          outline: "none",
          fontFamily: "monospace",
          padding: "6px",
        });

        input.value = entry.value;

        input.addEventListener("change", (e) => {
          let val = e.target.value;
          if (val !== "" && !isNaN(val)) val = Number(val);

          if (entry.ref.type === "runtime") {
            this.runtime.variables[entry.ref.key] = val;
          } else {
            entry.ref.value = val;
          }
        });

        valCell.appendChild(input);
        row.appendChild(keyCell);
        row.appendChild(valCell);
        table.appendChild(row);
      });
      this.variablesTableContainer.appendChild(table);
    }

    _syncVariableInputs(entries) {
      entries.forEach((entry) => {
        const input = this.variablesTableContainer.querySelector(
          `input[data-var-id="${entry.id}"]`,
        );
        if (input && document.activeElement !== input) {
          if (input.value !== String(entry.value)) {
            input.value = entry.value;
          }
        }
      });
    }
    _updateThreadViewer(forceUpdate) {
      if (
        !this.threadContentArea ||
        this.threadContentArea.style.display === "none"
      ) {
        return;
      }

      const currentThreadsSummary = this.runtime.threads.map((thread) => ({
        id: thread.id,
        topBlock: thread.topBlock,
        status: thread.status,
      }));
      const currentThreadsString = JSON.stringify(currentThreadsSummary);
      if (forceUpdate) this.threadsOld = null;
      if (this.threadsOld !== currentThreadsString) {
        const threads = this.runtime.threads;
        const container = this.threadViewerContainer;
        container.innerHTML = "";
        this.threadsOld = currentThreadsString;

        const threadsByTarget = {};
        if (threads && threads.length > 0) {
          threads.forEach((thread) => {
            const targetName = thread.target
              ? thread.target.getName()
              : "Unknown";
            if (!threadsByTarget[targetName]) {
              threadsByTarget[targetName] = [];
            }
            threadsByTarget[targetName].push(thread);
          });
        }

        if (!this.collapsedTargets) {
          this.collapsedTargets = {};
        }

        const targetNames = Object.keys(threadsByTarget);

        container.style.gridTemplateColumns = "1fr";

        if (targetNames.length > 0) {
          targetNames.forEach((targetName) => {
            const targetThreads = threadsByTarget[targetName];

            const headerDiv = document.createElement("div");
            Object.assign(headerDiv.style, {
              background: "var(--ui-secondary, hsl(0, 0%, 100%))",
              color: "var(--text-primary, hsla(225, 15%, 40%, 1))",
              padding: "8px",
              margin: "4px 0",
              borderRadius: "4px",
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              userSelect: "none",
            });

            const headerText = document.createElement("span");
            headerText.textContent = `${targetName} (${targetThreads.length} thread${targetThreads.length !== 1 ? "s" : ""})`;

            const toggleButton = document.createElement("span");
            toggleButton.innerHTML = this.collapsedTargets[targetName]
              ? `
                <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style="width: 16px; height: 16px;">
                  <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                </svg>`
              : `
                <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style="width: 16px; height: 16px;">
                  <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
                </svg>`;
            toggleButton.style.fontSize = "12px";

            headerDiv.appendChild(headerText);
            headerDiv.appendChild(toggleButton);

            headerDiv.addEventListener("click", () => {
              this.collapsedTargets[targetName] =
                !this.collapsedTargets[targetName];
              toggleButton.innerHTML = this.collapsedTargets[targetName]
                ? `
                <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style="width: 16px; height: 16px;">
                  <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                </svg>`
                : `
                <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style="width: 16px; height: 16px;">
                  <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
                </svg>`;
              this._updateThreadViewer(true);
            });

            container.appendChild(headerDiv);

            if (!this.collapsedTargets[targetName]) {
              targetThreads.forEach((thread, index) => {
                let topBlock = null;
                const B =
                  typeof Blockly !== "undefined" ? Blockly : window.Blockly;

                if (B && B.getMainWorkspace && thread.topBlock) {
                  topBlock = B.getMainWorkspace().blockDB_[thread.topBlock];
                }

                if (!this.performanceMode) {
                  const messageDiv = document.createElement("div");
                  Object.assign(messageDiv.style, {
                    paddingBottom: "5px",
                    paddingTop: "5px",
                    color: "var(--text-primary, hsla(225, 15%, 40%, 1))",
                    border: "1px dashed #444",
                    fontFamily: "monospace",
                    fontSize: "10px",
                    width: "100%",
                    marginLeft: "15px",
                    cursor: "pointer",
                  });
                  messageDiv.textContent = `Thread ${index + 1}`;
                  if (!this.packaged) {
                    messageDiv.addEventListener("click", () => {
                      if (B && B.getMainWorkspace && thread.topBlock) {
                        const workspace = B.getMainWorkspace();
                        const block = workspace.getBlockById(thread.topBlock);

                        if (block) {
                          if (typeof workspace.centerOnBlock === "function") {
                            workspace.centerOnBlock(thread.topBlock);
                          } else if (block.scrollIntoView) {
                            block.scrollIntoView();
                          }
                        }
                      }
                    });
                  }

                  container.appendChild(messageDiv);
                  return;
                }

                if (topBlock && topBlock.svgGroup_) {
                  let svgData = topBlock.svgGroup_.outerHTML;
                  svgData = svgData.replace(/ transform="[^"]*"/, "");
                  svgData = svgData.replace(/ filter="[^"]*"/, "");
                  svgData = svgData.replace(/&nbsp;/g, " ");

                  const bbox = topBlock.svgGroup_.getBBox();
                  const w = bbox.width;
                  const h = bbox.height;

                  const cssMatches = svgData.match(
                    /<style[^>]*>[\s\S]*?<\/style>/gi,
                  );
                  let extractedCss = "";
                  if (cssMatches) {
                    extractedCss = cssMatches.join("\n");
                    svgData = svgData.replace(
                      /<style[^>]*>[\s\S]*?<\/style>/gi,
                      "",
                    );
                  }

                  const css = `
                        <style>
                          .blocklyText {
                            fill: #fff;
                            font-family: "Helvetica Neue", Helvetica, sans-serif;
                            font-size: 12pt;
                            font-weight: 500;
                          }
                          .blocklyNonEditableText>text, .blocklyEditableText>text {
                            fill: #575E75;
                          }
                          .blocklyDropdownText {
                            fill: #fff !important;
                          }
                          path { fill-opacity: 1; }
                          ${extractedCss}
                        </style>
                      `;

                  const fullSvg = `
                     <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${w}" height="${h}" viewBox="${bbox.x} ${bbox.y} ${w} ${h}">
                       ${css}
                       ${svgData}
                     </svg>
                   `;

                  const wrapper = document.createElement("div");
                  Object.assign(wrapper.style, {
                    border:
                      "1px solid var(--ui-black-transparent, hsla(0, 0%, 0%, 0.15))",
                    borderRadius: "3px",
                    background: "var(--ui-secondary, hsl(0, 0%, 100%))",
                    minHeight: "40px",
                    width: "100%",
                    height: `${h}px`,
                    position: "relative",
                    marginBottom: "8px",
                  });
                  container.appendChild(wrapper);

                  const label = document.createElement("div");
                  label.textContent = `Thread ${index + 1}`;
                  Object.assign(label.style, {
                    position: "absolute",
                    top: "2px",
                    left: "2px",
                    color: "var(--text-primary, hsla(225, 15%, 40%, 1))",
                    fontSize: "10px",
                    padding: "1px 3px",
                    borderRadius: "2px",
                    zIndex: "10",
                    pointerEvents: "none",
                  });
                  wrapper.appendChild(label);

                  const copyButton = document.createElement("button");
                  copyButton.textContent = "Copy PNG";
                  Object.assign(copyButton.style, {
                    position: "absolute",
                    top: "2px",
                    right: "2px",
                    background: "rgba(0,0,0,0.5)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "2px",
                    fontSize: "10px",
                    padding: "2px 4px",
                    cursor: "pointer",
                    zIndex: "11",
                  });
                  wrapper.appendChild(copyButton);

                  const dynamicContentContainer = document.createElement("div");
                  Object.assign(dynamicContentContainer.style, {
                    position: "absolute",
                    top: "0",
                    left: "0",
                    right: "0",
                    bottom: "0",
                    overflowX: "scroll",
                    overflowY: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "var(--ui-secondary, hsl(0, 0%, 100%))",
                    zIndex: "1",
                  });
                  wrapper.appendChild(dynamicContentContainer);

                  const img = new Image();
                  let hasLoaded = false;
                  let pngImg = null;

                  const handleClick = () => {
                    if (B && B.getMainWorkspace && thread.topBlock) {
                      const workspace = B.getMainWorkspace();
                      const block = workspace.getBlockById(thread.topBlock);

                      if (block) {
                        if (typeof workspace.centerOnBlock === "function") {
                          workspace.centerOnBlock(thread.topBlock);
                        } else if (block.scrollIntoView) {
                          block.scrollIntoView();
                        }
                      }
                    }
                  };

                  const copyToClipboard = (dataUrl) => {
                    fetch(dataUrl)
                      .then((res) => res.blob())
                      .then((blob) => {
                        navigator.clipboard
                          .write([new ClipboardItem({ [blob.type]: blob })])
                          .then(() => {
                            const originalText = copyButton.textContent;
                            copyButton.textContent = "Copied!";
                            setTimeout(() => {
                              copyButton.textContent = originalText;
                            }, 1000);
                          })
                          .catch((err) => {
                            console.error("Failed to copy image: ", err);
                          });
                      });
                  };

                  copyButton.addEventListener("click", (e) => {
                    e.stopPropagation();
                    if (pngImg) {
                      copyToClipboard(pngImg.src);
                    }
                  });

                  wrapper.addEventListener("click", handleClick);

                  const showSvgPreview = () => {
                    if (hasLoaded) return;
                    hasLoaded = true;
                    dynamicContentContainer.innerHTML = "";
                    dynamicContentContainer.innerHTML += fullSvg;
                    const svgEl = dynamicContentContainer.querySelector("svg");
                    if (svgEl) {
                      svgEl.style.maxWidth = "100%";
                      svgEl.style.height = "auto";
                    }
                  };

                  const hideSvgPreview = () => {
                    if (!hasLoaded) return;
                    hasLoaded = false;
                    dynamicContentContainer.innerHTML = "";
                    if (pngImg) {
                      dynamicContentContainer.appendChild(pngImg);
                    }
                  };

                  img.onload = () => {
                    if (hasLoaded) return;
                    const canvas = document.createElement("canvas");
                    const MAX_HEIGHT = 1000;
                    let scale =
                      img.height > MAX_HEIGHT ? MAX_HEIGHT / img.height : 1;

                    canvas.width = img.width * scale;
                    canvas.height = img.height * scale;

                    const ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                    pngImg = document.createElement("img");
                    pngImg.src = canvas.toDataURL("image/png");
                    Object.assign(pngImg.style, {
                      height: "auto",
                      display: "block",
                      width: `${w}px`,
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                    });
                    dynamicContentContainer.appendChild(pngImg);

                    wrapper.addEventListener("mouseenter", showSvgPreview);
                    wrapper.addEventListener("mouseleave", hideSvgPreview);
                  };

                  img.onerror = () => {
                    showSvgPreview();
                  };

                  img.src =
                    "data:image/svg+xml;base64," +
                    btoa(
                      encodeURIComponent(fullSvg).replace(
                        /%([0-9A-F]{2})/g,
                        function toSolidBytes(match, p1) {
                          return String.fromCharCode("0x" + p1);
                        },
                      ),
                    );
                } else {
                  const messageDiv = document.createElement("div");
                  Object.assign(messageDiv.style, {
                    paddingBottom: "5px",
                    paddingTop: "5px",
                    color: "var(--text-primary, hsla(225, 15%, 40%, 1))",
                    border: "1px dashed #444",
                    fontFamily: "monospace",
                    fontSize: "10px",
                    width: "100%",
                    marginLeft: "15px",
                    cursor: "pointer",
                  });
                  messageDiv.textContent = `Thread ${index + 1}`;

                  messageDiv.addEventListener("click", () => {
                    if (B && B.getMainWorkspace && thread.topBlock) {
                      const workspace = B.getMainWorkspace();
                      const block = workspace.getBlockById(thread.topBlock);

                      if (block) {
                        if (typeof workspace.centerOnBlock === "function") {
                          workspace.centerOnBlock(thread.topBlock);
                        } else if (block.scrollIntoView) {
                          block.scrollIntoView();
                        }
                      }
                    }
                  });

                  container.appendChild(messageDiv);
                }
              });
            }
          });
        } else {
          const messageDiv = document.createElement("div");
          Object.assign(messageDiv.style, {
            paddingBottom: "5px",
            paddingTop: "5px",
            color: "#888",
            fontFamily: "monospace",
            fontSize: "10px",
            width: "100%",
          });
          messageDiv.textContent = "No threads running.";
          container.appendChild(messageDiv);
        }
      }
    }
    log({ TEXT }) {
      const entry = { text: TEXT };

      this.logEntries.push(entry);

      if (this.logEntries.length > this.LOG_LIMIT) {
        this.logEntries.shift();
      }

      this._performLogUpdate();
    }

    _formatLogItem(text) {
      if (!text) return "";
      let safeText = text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

      const colorRegex = /\[__COLOR:(#[0-9A-Fa-f]{6})__\](.*?)\[__END__\]/g;
      return safeText.replace(
        colorRegex,
        (match, color, content) =>
          `<span style="color: ${color}">${content}</span>`,
      );
    }

    _exportLogsToHtml() {
      const logHTML = this.logEntries
        .map((entry) => {
          const formatted = this._formatLogItem(entry.text);
          return `<div>${formatted}</div>`;
        })
        .join("\n");

      const fullHTML = `
<!DOCTYPE html>
<html>
<head>
    <title>Debugger Logs Export</title>
    <meta charset="utf-8">
    <style>
        body {
            background: #141416;
            color: #eee;
            font-family: monospace;
            font-size: 14px;
            padding: 10px;
        }
        div {
            white-space: pre-wrap;
            word-break: break-word;
            line-height: 1.2;
            padding: 2px 0;
            color: #ccc;
        }
    </style>
</head>
<body>
${logHTML}
</body>
</html>
        `;

      const blob = new Blob([fullHTML], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `debugger-logs-${new Date().toISOString().slice(0, 10)}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    _performLogUpdate() {
      if (!this.userScrolledUp && this.logContentArea.style.display !== "none")
        this.logContentArea.scrollTop = this.logContentArea.scrollHeight;
      this._updateVirtualScroll();
      this.scrollToBottomButton.click();
    }

    _updateVirtualScroll() {
      if (!this.logContentArea || this.logContentArea.style.display === "none")
        return;
      const totalHeight = this.logEntries.length * this.averageEntryHeight;
      this.scrollSizer.style.height = `${totalHeight}px`;
      const scrollTop = this.logContentArea.scrollTop;
      const clientHeight = this.logContentArea.clientHeight;
      let startIndex = Math.max(
        0,
        Math.floor(scrollTop / this.averageEntryHeight) - this.renderBufferSize,
      );
      let endIndex = Math.min(
        this.logEntries.length,
        Math.ceil((scrollTop + clientHeight) / this.averageEntryHeight) +
          this.renderBufferSize,
      );
      this.logContainer.innerHTML = "";

      for (let i = startIndex; i < endIndex; i++) {
        const entry = this.logEntries[i];
        const div = document.createElement("div");
        Object.assign(div.style, {
          position: "absolute",
          top: `${i * this.averageEntryHeight}px`,
          left: "6px",
          right: "6px",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          color: "var(--text-primary, hsla(225, 15%, 40%, 1))",
        });

        div.innerHTML = this._formatLogItem(entry.text);

        this.logContainer.appendChild(div);
      }
    }

    clear() {
      this.logEntries = [];
      this._updateVirtualScroll();
    }

    pause() {
      if (this.runtime.paused) this.runtime.play();
      else this.runtime.pause();
    }

    commandWasRan() {
      if (this.ranCommand) {
        this.ranCommand = false;
        return true;
      }
      return false;
    }

    getCommand() {
      return this.commandText;
    }

    _handleScroll() {
      if (!this.logContentArea) return;
      const isAtBottom =
        this.logContentArea.scrollTop >=
        this.logContentArea.scrollHeight -
          this.logContentArea.clientHeight -
          10;
      this.userScrolledUp = !isAtBottom;
      this._updateVirtualScroll();
    }

    _drag(header, el) {
      let x = 0,
        y = 0;
      header.onmousedown = (e) => {
        const r = el.getBoundingClientRect();
        x = e.clientX - r.left;
        y = e.clientY - r.top;
        document.onmousemove = (e2) => {
          el.style.left =
            Math.max(
              0,
              Math.min(e2.clientX - x, window.innerWidth - el.offsetWidth),
            ) + "px";
          el.style.top =
            Math.max(
              0,
              Math.min(e2.clientY - y, window.innerHeight - el.offsetHeight),
            ) + "px";
        };
        document.onmouseup = () => {
          document.onmousemove = null;
          document.onmouseup = null;
        };
      };
    }
  }

  Scratch.extensions.register(new DebuggerExtensionTS());
})(Scratch);
