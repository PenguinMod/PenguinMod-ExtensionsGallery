<script>
    let clicks = 0;
    let logoElement;
    function click() {
        clicks += 1;
        if (clicks >= 5) {
            logoElement.style.display = "none";
            window.open("/icons/05-02-1998_test_screenshot.png");
        }
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<img
    bind:this={logoElement}
    src="/favicon.ico"
    alt="PenguinMod Logo"
    class="logo"
    on:click={click}
/>

<style>
    .logo {
        height: 3em;
        margin-right: 6px;
        cursor: pointer;
    }
</style>
