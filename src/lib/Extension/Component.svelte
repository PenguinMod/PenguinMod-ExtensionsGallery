<script>
    import { selectedRecommendedExt, searchRecommendations } from '$lib/stores.js';

    export let name = "Test";
    export let image = "/images/example.png";
    export let url = "";
    export let notes = "";
    export let creator = "";
    export let creatorAlias;
    export let documentation = "";
    export let isGitHub = false;
    export let unstable = false;
    export let unstableReason = "This extension is unstable. Use at your own risk.";

    const baseUrl = "https://studio.penguinmod.com/editor.html?extension=";

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

    // used for search
    export let relUrl = "";

    const displayCopiedToClipboard = (x, y) => {
        if (!(copyButton && copyPrompt)) return;
        if ((typeof x !== 'number' || typeof y !== 'number')) {
            const scrollAmount = document.documentElement.scrollTop;
            const rectButton = copyButton.getBoundingClientRect();
            const rectPrompt = copyPrompt.getBoundingClientRect();
            if (typeof x !== 'number') {
                x = rectButton.left + rectButton.width / 2 - rectPrompt.width / 2;
            }
            if (typeof y !== 'number') {
                y = rectButton.top + scrollAmount - (rectPrompt.height + 10);
            }
        }
        copyPrompt.style.left = `${x}px`;
        copyPrompt.style.top = `${y}px`;

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
    };
    const copyToClipboard = (url, ...args) => {
        navigator.clipboard.writeText(url).then(() => {
            displayCopiedToClipboard(...args);
        });
    };

    selectedRecommendedExt.subscribe((subUrl) => {
        if (!subUrl) return;
        if (subUrl === relUrl) {
            copyToClipboard(url);
            $searchRecommendations = [];
        }
    });
</script>

<div bind:this={copyPrompt} class="copied" style="opacity: 0;">
    <p>Copied to Clipboard!</p>
</div>
<div class="block">
    <div>
        <img src={image} alt="Thumb" class="image" />
        <p class="title">
            {name}
            {#if unstable}
                <button class="unstable-warning">
                    <div class="unstable-message">{unstableReason}</div>
                </button>
            {/if}
        </p>
        <p class="description">
            <slot />
        </p>
        {#if creator}
            <p>
                Created by
                <a
                    href={!isGitHub
                        ? `https://scratch.mit.edu/users/${creator}/`
                        : `https://github.com/${creator}/`}
                    target="_blank"
                >
                    {creatorAlias || creator}.
                </a>
            </p>
        {/if}
        {#if notes && notes !== ""}
            <p class="notes">{notes}</p>
        {/if}
        {#if documentation}
            <p>
                <a href={`/docs/${documentation}`}>Extension Documentation</a>
            </p>
        {/if}
    </div>
    <div class="block-buttons">
        <div>
            <button
                on:click={() => copyToClipboard(url)}
                bind:this={copyButton}
                class="blue"
            >
                Copy URL
            </button>
            <a href={baseUrl + url} target="_blank">
                <button class="purple">View</button>
            </a>
        </div>
    </div>
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
        border: 1px solid rgba(0, 0, 0, 0.25);
        border-radius: 6px;
        padding: 8px;
        margin: 4px;
        max-width: calc(600px / 1.85);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
    :global(body.dark-mode) .block {
        border-color: rgba(255, 255, 255, 0.75);
    }
    .block-buttons {
        display: flex;
        flex-direction: row;
        align-items: center;
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
        white-space: pre-wrap;
    }
    .notes {
        white-space: pre-wrap;
    }

    button {
        cursor: pointer;
        font-size: 24px;
        margin-left: 6px;
        margin-right: 6px;
        border: 1px solid rgba(0, 0, 0, 0.35);
        border-radius: 4px;
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

    .unstable-warning {
        position: relative;
        display: inline;
        width: 1.3em;
        height: 1.3em;
        border: 0;
        margin: 0;

        background: transparent;
        background-image: url('/icons/warning2.png');
        background-position: center;
        background-size: 80%;
        background-repeat: no-repeat;
    }
    .unstable-warning:hover,
    .unstable-warning:active {
        filter: none !important;
    }
    .unstable-message {
        display: none;
        position: absolute;
        background: #000000de;
        font-size: medium;
        font-weight: normal;
        padding: 8px;
        border-radius: 8px;
        white-space: pre-wrap;
        width: 250px;
        user-select: text;
    }
    .unstable-warning:hover .unstable-message {
        display: initial;
    }
    .unstable-message:hover {
        cursor: auto;
    }

    .blue {
        background-color: #00a2ff;
    }
    .purple {
        background-color: #9d52ff;
    }
</style>
