<script>
    import { browser } from "$app/environment";

    let themeSwitcher;
    let displayedTheme = "light";
    function themeUpdate() {
        const isDark = themeSwitcher.value === "dark";
        localStorage.setItem("pm:dark", isDark);
    }

    if (browser) {
        const darkTheme = String(localStorage.getItem("pm:dark")) === "true";
        displayedTheme = darkTheme ? "dark" : "light";
    }
</script>

<div style="height: 24px" />
<div class="footer">
    PenguinMod is not affiliated with TurboWarp, Scratch, the Scratch Team, or
    the Scratch Foundation.
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
<div style="height: 12px" />
<div class="footer">
    <div>
        <slot />
    </div>
</div>
<div style="height: 12px" />
<div class="footer">
    <select
        bind:this={themeSwitcher}
        on:change={themeUpdate}
        value={displayedTheme}
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
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 4px;
    }
</style>
