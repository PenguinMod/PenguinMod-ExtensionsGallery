<script>
    import { browser } from "$app/environment";

    let props = $props();

    let displayedTheme = $state("light");
    const themeUpdate = (event) => {
        const isDark = event.target.value === "dark";
        localStorage.setItem("pm:dark", isDark);
        
        const customEvent = new CustomEvent("penguinmod-dark-updated", { detail: isDark });
        document.dispatchEvent(customEvent);
    }
    const updateDisplayedTheme = () => {
        const darkTheme = String(localStorage.getItem("pm:dark")) === "true";
        displayedTheme = darkTheme ? "dark" : "light";
    };

    if (browser) {
        document.addEventListener("penguinmod-dark-updated", () => {
            updateDisplayedTheme();
        });
        updateDisplayedTheme();
    }
</script>

<div style="height: 24px"></div>
<div class="footer">
    <span>
        PenguinMod is not affiliated with TurboWarp, Scratch, the Scratch Team, or
        the Scratch Foundation.
    </span>
    <span>
        Scratch is a project of the Scratch Foundation.
        It is available for free at <a href="https://scratch.org/">https://scratch.org/</a>.
    </span>
</div>
<div class="links">
    <a
        target="_blank"
        href="https://github.com/PenguinMod/PenguinMod-ExtensionsGallery"
    >
        GitHub
    </a>
    <span style="margin: 0px 6px;">-</span>
    <a
        target="_blank"
        href="https://github.com/PenguinMod/PenguinMod-ExtensionsGallery/blob/main/README.md"
    >
        Submitting an extension
    </a>
    <span style="margin: 0px 6px;">-</span>
    <a target="_blank" href="https://discord.gg/NZ9MBMYTZh">Discord</a>
</div>
<div style="height: 12px"></div>
<div class="footer">
    <div>
        {@render props.children?.()}
    </div>
</div>
<div style="height: 12px"></div>
<div class="footer">
    <select
        value={displayedTheme}
        onchange={themeUpdate}
        style="width: 128px; font-size: 16px"
    >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
    </select>
</div>

<style>
    :global(body.dark-mode) {
        color: white;
    }

    .links {
        width: 100%;
        
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }
    .footer {
        width: 100%;
        margin-bottom: 4px;

        display: flex;
        flex-direction: column;
        align-items: center;
    }
</style>
