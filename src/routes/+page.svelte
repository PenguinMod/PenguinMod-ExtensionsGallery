<script>
    import Extension from "$lib/Extension/Component.svelte";
    import Logo from "$lib/Logo/Component.svelte";
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
        <Extension
            image="/images/example.png"
            name="Test Gallery Item"
            url="https://extensions.turbowarp.org/stretch.js"
            creator="JeremyGamer13"
        >
            A basic gallery item. Use this as a base for adding extensions to
            this list.
        </Extension>
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
</style>
