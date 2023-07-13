<script>
    export let name = "Test";
    export let image = "/images/example.png";
    export let url = "";
    export let creator = "";

    const baseUrl = "https://studio.penguinmod.site/editor.html?extension=";
</script>

<div class="block">
    <img src={image} alt="Thumb" class="image" />
    <p class="title">{name}</p>
    <p class="description">
        <slot />
        {#if creator}
            <p>
                Created by
                <a
                    href={`https://scratch.mit.edu/users/${creator}/`}
                    target="_blank"
                >
                    {creator}.
                </a>
            </p>
        {/if}
    </p>
    <button
        on:click={() => {
            navigator.clipboard.writeText(url);
        }}
        class="green"
    >
        Copy URL
    </button>
    <a href={baseUrl + url} target="_blank">
        <button class="blue">View</button>
    </a>
</div>

<style>
    .block {
        border: 2px solid rgba(0, 0, 0, 0.25);
        border-radius: 6px;
        padding: 8px;
        margin: 4px;
    }
    .image {
        width: calc(600px / 1.85);
        height: calc(372px / 1.85);
        border-radius: 4px;
    }
    .title {
        font-size: 2em;
        font-weight: bold;
        margin-block: 6px;
    }
    .description {
        width: calc(600px / 1.85);
        margin-block: 6px;
    }

    button {
        cursor: pointer;
        font-size: 24px;
        margin-left: 6px;
        margin-right: 6px;
        border: 2px solid rgba(0, 0, 0, 0.25);
        border-radius: 8px;
        padding: 4px 8px;
        color: white;
        font-weight: bold;
    }
    button:hover {
        filter: brightness(1.1);
    }
    button:active {
        filter: brightness(0.7);
    }

    .blue {
        background-color: rgb(0, 153, 255);
    }
    .green {
        background-color: rgb(0, 163, 0);
    }
</style>
