<script>
    import Logo from "$lib/Logo/Component.svelte";
    import Footer from "$lib/Footer/Component.svelte";
</script>

<div class="top">
    <div class="header">
        <Logo />
        <h1>PenguinMod Extra Extensions</h1>
    </div>
</div>
<div class="main">
    <p class="subtitle"><i>How to: Load Extensions</i></p>
    <br />

    <p>
        <b>Step 1:</b>
        <br />
        • Open the Extensions Menu at the bottom left of the Editor.
    </p>
    <img
        src="/examples/loadextensions/1.png"
        alt="Opening Extension Menu"
        style="width: 345px"
    />

    <br />

    <p>
        <b>Step 2:</b>
        <br />
        • Scroll to the bottom of the list and click on "Custom Extension" You can
        also click the "Load Custom Extension" button on the left.
        <br />
    </p>
    <img
        src="/examples/loadextensions/2.png"
        alt="Opening the custom extension screen"
        style="width: 345px"
    />
    <img
        src="/examples/loadextensions/2-alt.png"
        alt="Opening the custom extension screen on the sidebar"
        style="width: 345px"
    />

    <br />

    <p>
        <b>Step 3:</b>
        <br />
        • Paste in any extension URL you have copied from this website here.
    </p>
    <img
        src="/examples/loadextensions/3.png"
        alt="Entering an extension URL to load a custom extension"
        style="width: 600px"
    />

    <div style="height: 32px" />

    <p style="width: 100%; text-align: center">
        If you did it correctly, the extension should appear in the category
        list.
        <br />
        If you have questions, feel free to join our Discord.
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
    .subtitle {
        width: 100%;
        text-align: center;
    }

    .main {
        width: 60%;
        margin-left: 20%;
        display: flex;
        flex-direction: column;
    }
</style>
