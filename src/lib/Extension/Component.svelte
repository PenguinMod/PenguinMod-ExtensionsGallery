<script>
    export let image = "/images/example.png";
    export let url = "";

    const baseUrl = "https://studio.penguinmod.site/editor.html?extension=";
</script>

<div>
    <img src={image} alt="Thumb" />
    <!-- name -->
    <p><slot /></p>
    <button
        on:click={() => {
            navigator.clipboard.writeText(url);
        }}
    >
        Copy URL
    </button>
    <a href={baseUrl + url} target="_blank">
        <button>View</button>
    </a>
</div>
