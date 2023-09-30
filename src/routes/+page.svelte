<script>
    import { onMount } from "svelte";

    import Extension from "$lib/Extension/Component.svelte";
    import Footer from "$lib/Footer/Component.svelte";
    import Logo from "$lib/Logo/Component.svelte";

    import extensions from "$lib/extensions.js";

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
        <!-- This list can be modified in "src/lib/extensions.js" -->
        {#each extensions as extension}
            <Extension
                image={`/images/${extension.banner}`}
                name={extension.name}
                url={`${origin}/extensions/${extension.code}`}
                creator={extension.creator}
                documentation={extension.documentation}
                isGitHub={String(extension.isGitHub) === "true"}
            >
                {extension.description}
            </Extension>
        {/each}
    </div>

    <p style="text-align: center;">
        Note: Some extensions may be added to the Extension Gallery in
        PenguinMod Studio.<br />If you cannot find an extension that was
        previously listed here, check there.
    </p>

    <Footer />
    <div style="height: 64px" />
</div>

<style>
    :global(body.dark-mode) {
        color: white;
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
