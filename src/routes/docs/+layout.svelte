<script>
    let props = $props();

    // Components
    import Footer from "$lib/Footer/Component.svelte";
</script>

{@render props.children?.()}

<Footer>
    <br />
    You can help contribute to documentation
    <a
        href="https://github.com/PenguinMod/PenguinMod-ExtensionsGallery/tree/main/src/lib/Documentation"
    >
        here</a
    >.
    <br />
    <br />
    Blocks are rendered with
    <a href="https://scratchblocks.github.io/">scratchblocks</a>.
    <br />
</Footer>
<div style="height: 32px"></div>

<style>
    :global(body.dark-mode) {
        color: white;
    }
</style>
