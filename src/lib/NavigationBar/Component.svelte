<script>
    // Components
    import BarPage from "./Page.svelte";
    import BarButton from "./Button.svelte";
</script>

<div class="bar">
    <a class="logo" href="/">
        <img class="logo-image" src="/navicon.png" alt="PenguinMod" />
    </a>
    <div style="margin-right: 12px;" />
    <BarPage link={"/docs"}>Documentation</BarPage>
    <BarButton
        highlighted="true"
        link={"https://discord.gg/NZ9MBMYTZh"}
        noredirect="true"
    >
        Join our Discord!
    </BarButton>
</div>

<style>
    :root {
        --penguinmod-color: #00c3ff;
    }
    :global(body.dark-mode) {
        --penguinmod-color: #009ccc;
    }

    .bar {
        position: fixed;
        width: 100%;
        left: 0px;
        top: 0px;
        background: var(--penguinmod-color);
        height: 3rem;
        color: white;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        flex-wrap: nowrap;
        box-sizing: border-box;
        font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
        font-size: 0.75rem;
        font-weight: bold;
        min-width: 1000px;
        z-index: 1000;
    }

    .logo {
        height: 100%;
    }
    .logo-image {
        margin-top: 10%;
        height: 80%;
        transition: 0.15s ease all;
    }
    .logo-image:hover {
        margin-top: 5%;
        height: 90%;
        transition: 0.15s ease all;
    }
</style>
