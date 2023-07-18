<script>
    import { onMount } from "svelte";

    import Extension from "$lib/Extension/Component.svelte";
    import Logo from "$lib/Logo/Component.svelte";

    let origin = "";
    onMount(() => {
        origin = window.origin;
    });
</script>

<div class="top">
    <div class="header">
        <Logo />
        <h1>PenguinMod Extra Extensions</h1>
    </div>
</div>
<div class="main">
    <p>See some cool extensions made by other people here.</p>
    <p>
        To use some of these extensions in your projects, click the "Copy URL"
        button on an extension and
        <a href="/load" target="_blank">load it into PenguinMod,</a>
        or click the "View" button to create a new project with the extension.
    </p>

    <div class="extension-list">
        <!--
        <Extension
            image="/images/example.png"
            name="Test Gallery Item"
            url="https://extensions.turbowarp.org/JeremyGamer13/tween.js"
            creator="JeremyGamer13"
        >
            A basic gallery item. Use this as a base for adding extensions to
            this list.
        </Extension>
        -->
        <Extension
            image="/images/NamelessCat/placeholder-corsproxy.png"
            name="CORS Proxy"
            url={origin + "/extensions/NamelessCat/corsproxy.js"}
            creator="NamelessCat"
        >
            Accessible CORS Proxies for fetching information
        </Extension>
    </div>

    <div style="height: 24px" />
    <div class="footer">
        PenguinMod is not affiliated with TurboWarp, Scratch, the Scratch Team,
        or the Scratch Foundation.
    </div>
    <div class="links">
        <a
            target="_blank"
            href="https://github.com/PenguinMod/PenguinMod-ExtensionsGallery"
        >
            GitHub
        </a>
        <span style="margin: 0px 6px;">-</span>
        <a target="_blank" href="https://studio.penguinmod.site/editor.html">
            Editor
        </a>
        <span style="margin: 0px 6px;">-</span>
        <a
            target="_blank"
            href="https://github.com/PenguinMod/PenguinMod-ExtensionsGallery/blob/main/README.md"
        >
            Submitting an extension
        </a>
    </div>
    <div style="height: 64px" />
</div>

<style>
    .top {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .header {
        display: flex;
        align-items: center;
        flex-direction: row;
        font-size: 1.35em;
    }

    .main {
        width: 60%;
        margin-left: 20%;
        display: flex;
        flex-direction: column;
    }

    .extension-list {
        width: 100%;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
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
