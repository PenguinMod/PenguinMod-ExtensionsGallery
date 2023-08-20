<script>
    export let name = "Test";
    export let image = "/images/example.png";
    export let url = "";
    export let creator = "";
    export let isGitHub = false;

    const baseUrl = "https://studio.penguinmod.site/editor.html?extension=";

    /**
     * The button to copy the URL
     * @type {HTMLButtonElement}
     */
    let copyButton;
    /**
     * The bubble with the copy message
     * @type {HTMLDivElement}
     */
    let copyPrompt;

    function copiedToClipboard() {
        const rectButton = copyButton.getBoundingClientRect();
        const rectPrompt = copyPrompt.getBoundingClientRect();
        const x = rectButton.left + rectButton.width / 2 - rectPrompt.width / 2;
        copyPrompt.style.left = `${x}px`;
        copyPrompt.style.top = `${rectButton.top - (rectPrompt.height + 10)}px`;

        const animationDuration = 80;
        copyPrompt.animate(
            [
                {
                    opacity: 0,
                },
                {
                    opacity: 1,
                },
            ],
            {
                duration: animationDuration,
                fill: "forwards",
            }
        );

        setTimeout(() => {
            copyPrompt.animate(
                [
                    {
                        opacity: 1,
                    },
                    {
                        opacity: 0,
                    },
                ],
                {
                    duration: animationDuration,
                    fill: "forwards",
                }
            );
        }, 1500);
    }
</script>

<div bind:this={copyPrompt} class="copied" style="opacity: 0;">
    <p>Copied to Clipboard!</p>
</div>
<div class="block">
    <img src={image} alt="Thumb" class="image" />
    <p class="title">{name}</p>
    <p class="description">
        <slot />
        {#if creator}
            <p>
                Created by
                <a
                    href={!isGitHub
                        ? `https://scratch.mit.edu/users/${creator}/`
                        : `https://github.com/${creator}/`}
                    target="_blank"
                >
                    {creator}.
                </a>
            </p>
        {/if}
    </p>
    <button
        on:click={() => {
            navigator.clipboard.writeText(url).then(() => {
                copiedToClipboard();
            });
        }}
        bind:this={copyButton}
        class="green"
    >
        Copy URL
    </button>
    <a href={baseUrl + url} target="_blank">
        <button class="blue">View</button>
    </a>
</div>

<style>
    .copied {
        position: absolute;
        pointer-events: none;

        background-color: #23a559;
        border-radius: 6px;
        color: white;
        padding: 6px;

        z-index: 9000;
    }
    .copied:before {
        content: "";
        position: absolute;
        top: 100%;
        left: calc(50% - 5px);
        width: 0;
        border-top: 5px solid #23a559;
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
    }
    .copied p {
        margin-block: 0;
    }

    .block {
        border: 2px solid rgba(0, 0, 0, 0.25);
        border-radius: 6px;
        padding: 8px;
        margin: 4px;
    }
    :global(body.dark-mode) .block {
        border-color: rgba(255, 255, 255, 0.75);
    }

    .image {
        width: calc(600px / 1.85);
        height: calc(300px / 1.85);
        object-fit: cover;
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

    :global(body.dark-mode) a {
        color: dodgerblue;
    }
</style>
