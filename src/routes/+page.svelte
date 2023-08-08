<script>
    import { onMount } from "svelte";

    import Extension from "$lib/Extension/Component.svelte";
    import Footer from "$lib/Footer/Component.svelte";
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
        <Extension
            image="/images/Gen1x/placeholder-cats.png"
            name="CATS"
            url={origin + "/extensions/Gen1x/CATS.js"}
            creator="G1nX"
        >
            Blocks related to cats.
        </Extension>

        <Extension
            image="/images/ObviousAlexC/penplus.png"
            name="Pen+"
            url={origin + "/extensions/ObviousAlexC/PenPlus.js"}
            creator="pinksheep2917"
        >
            Extended pen section!
        </Extension>
    </div>

    <Footer />
    <div style="height: 64px" />
</div>

<style>
    :global(body.dark-mode) {
        color: white;
    }
    :global(body.dark-mode) a {
        color: dodgerblue;
    }

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
</style>
