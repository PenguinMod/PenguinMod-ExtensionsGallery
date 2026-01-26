<script>
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { Tags } from "../extension-tags";
    import stateApplication from '$lib/state/app.svelte.js';
    import stateSearchBar from '$lib/state/searchBar.svelte.js';
    import ExtensionLoader from "$lib/extension-loader.js";

    let props = $props();
    let name = $derived(props.name || "Test");
    let image = $derived(props.image || "/images/example.avif");
    let tags = $derived(props.tags || []);
    let url = $derived(props.url || "");
    let notes = $derived(props.notes || "");
    let creator = $derived(props.creator || "");
    let creatorAlias = $derived(props.creatorAlias);
    let documentation = $derived(props.documentation || "");
    let example = $derived(props.example || "");
    let isGitHub = $derived(props.isGitHub || false);
    let unstable = $derived(props.unstable || false);
    let unstableReason = $derived(props.unstableReason || "This extension is unstable. Use at your own risk.");

    // used for search
    let relUrl = $derived(props.relUrl);
    const baseUrl = "https://studio.penguinmod.com/editor.html?extension=";

    /**
     * The button to copy the URL
     * @type {HTMLButtonElement}
     */
    let copyButton = $state(null);
    /**
     * The button to add the extension to the project
     * @type {HTMLButtonElement?}
     */
    let addToProjectButton = $state(null);
    /**
     * The bubble with the copy message
     * @type {HTMLDivElement}
     */
    let copyPrompt;
    /**
     * The bubble with the "added to project" message
     * @type {HTMLDivElement}
     */
    let addToProjectPrompt;

    const displayBubbleMessage = (bubble, x, y) => {
        let button = copyButton;
        if (bubble === addToProjectPrompt) button = addToProjectButton;

        if (!(bubble && button)) return;
        if ((typeof x !== 'number' || typeof y !== 'number')) {
            const scrollAmount = document.documentElement.scrollTop;
            const rectButton = button.getBoundingClientRect();
            const rectPrompt = bubble.getBoundingClientRect();
            if (typeof x !== 'number') {
                x = rectButton.left + rectButton.width / 2 - rectPrompt.width / 2;
            }
            if (typeof y !== 'number') {
                y = rectButton.top + scrollAmount - (rectPrompt.height + 10);
            }
        }
        bubble.style.left = `${x}px`;
        bubble.style.top = `${y}px`;

        const animationDuration = 80;
        bubble.animate(
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
            bubble.animate(
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
            displayBubbleMessage(copyPrompt, ...args);
        });
    };
    const loadIntoEditor = (url) => {
        try {
            ExtensionLoader.tryLoadExtension(url);
        } catch (err) {
            handleEditorLoadFail(err);
        }
    };
    const handleEditorLoadFail = (err) => {
        const event = new CustomEvent("penguinmod-editor-extension-load-failed", { detail: err });
        document.dispatchEvent(event);
    };

    // tags that have banners
    let displayedTags = $derived.by(() => {
        const displayedTags = [];
        for (const tag of tags) {
            const extensionTag = Tags.find(extTag => extTag.name === tag);
            if (!extensionTag) continue;

            if (extensionTag.banner) {
                displayedTags.push(extensionTag);
            }
        }
        return displayedTags;
    });
    onMount(() => {
        document.addEventListener("penguinmod-recommendation-clicked", (event) => {
            const extCodeUrl = event.detail;
            if (!extCodeUrl) return;
            if (extCodeUrl === relUrl) {
                copyToClipboard(url);
                stateSearchBar.recommendations = [];
                
                const event = new CustomEvent("penguinmod-recommendations-updated");
                document.dispatchEvent(event);
            }
        });
    });
</script>

<div bind:this={copyPrompt} class="copied" style="opacity: 0;">
    <p>Copied to Clipboard!</p>
</div>
<div bind:this={addToProjectPrompt} class="copied" style="opacity: 0;">
    <p>Added to project!</p>
</div>
<div class="block">
    {#each displayedTags as tag}
        <div class="block-tag-banner">
            <img
                src={tag.banner}
                alt={tag.alias || tag.name}
                class="block-tag-banner-image"
                loading="lazy"
                data-pmelement="extimagetagbanner"
            />
        </div>
    {/each}

    <div>
        <div class="image-container">
            {#if stateApplication.fromEditor}
                <button
                    class="image-copy"
                    onclick={() => loadIntoEditor(url)}
                    data-pmelement="imageaddtoproject"
                >
                    Add to Project
                </button>
            {:else}
                <button
                    class="image-copy"
                    onclick={() => copyToClipboard(url)}
                    data-pmelement="imagecopy"
                >
                    Copy Link
                </button>
            {/if}
            <img
                src={image}
                alt={name}
                class="image"
                loading="lazy"
                data-pmelement="extimage"
            />
        </div>
        <div class="title">
            {name}
            {#if unstable}
                <button class="unstable-warning">
                    <div class="unstable-message">{unstableReason}</div>
                </button>
            {/if}
        </div>
        <p class="description">
            {@render props.children?.()}
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
        {#if example}
            <p>
                <a href={`https://studio.penguinmod.com/editor.html?project_url=${encodeURIComponent(`${$page.url.origin}/examples/projects/${example}`)}`}>
                    Example Project
                </a>
            </p>
        {/if}
        {#if documentation}
            <p>
                <a href={`/docs/${documentation}`}>Extension Documentation</a>
            </p>
        {/if}
    </div>
    <div class="block-buttons">
        <div>
            {#if stateApplication.fromEditor}
                <button
                    bind:this={addToProjectButton}
                    onclick={() => loadIntoEditor(url)}
                    class="blue"
                >
                    Add to Project
                </button>
                <button
                    bind:this={copyButton}
                    onclick={() => copyToClipboard(url)}
                    class="purple"
                >
                    Copy
                </button>
            {:else}
                <button
                    bind:this={copyButton}
                    onclick={() => copyToClipboard(url)}
                    class="blue"
                >
                    Copy Link
                </button>
                <a
                    href={baseUrl + url}
                    target="_blank"
                >
                    <button class="purple">Try it out</button>
                </a>
            {/if}
        </div>
    </div>
</div>

<style>
    button {
        border: 1px solid rgba(0, 0, 0, 0.35);
        padding: 4px 8px;
        margin-left: 6px;
        margin-right: 6px;

        font-size: 24px;
        border-radius: 4px;
        color: white;
        font-weight: bold;

        cursor: pointer;
    }
    button:hover {
        filter: brightness(1.1);
    }
    button:active {
        filter: brightness(0.7);
    }

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
        position: absolute;
        top: 100%;
        left: calc(50% - 5px);
        width: 0;
        border-top: 5px solid #23a559;
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;

        content: "";
    }
    .copied p {
        margin-block: 0;
    }

    .block {
        position: relative;
        border: 1px solid rgba(0, 0, 0, 0.25);
        max-width: calc(600px / 1.85);
        padding: 8px;
        margin: 4px;

        display: flex;
        flex-direction: column;
        justify-content: space-between;
        
        border-radius: 6px;
    }
    :global(body.dark-mode) .block {
        border-color: rgba(255, 255, 255, 0.75);
    }
    .block-buttons {
        display: flex;
        flex-direction: row;
        align-items: center;
    }
    .block-tag-banner {
        position: absolute;
        right: 0;
        top: 0;

        width: 72px;
        height: 72px;

        pointer-events: none;
        user-select: none;
        z-index: 52;
    }
    .block-tag-banner-image {
        width: 100%;
        height: 100%;
    }

    .image-container {
        position: relative;
        width: calc(600px / 1.85);
        height: calc(300px / 1.85);

        border-radius: 4px;
    }
    .image {
        width: 100%;
        height: 100%;

        object-fit: cover;
    }
    .image-copy {
        position: absolute;
        width: 100%;
        height: 100%;
        border: 0;
        margin: 0;
        padding: 0;

        background: #11111166;
        text-shadow: 2px 2px 10px black,
            2px 2px 10px black,
            2px 2px 10px black;
        transition: opacity 0.1s;
        opacity: 0;

        user-select: none;
        cursor: pointer;
        z-index: 50;
    }
    .image-copy:hover {
        opacity: 1;
    }

    .title {
        margin-block: 6px;

        display: block;

        font-size: 2em;
        font-weight: bold;
    }
    .description {
        width: calc(600px / 1.85);
        margin-block: 6px;
        white-space: pre-wrap;
    }
    .notes {
        white-space: pre-wrap;
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
        width: 250px;
        padding: 8px;

        background: #000000de;
        font-size: medium;
        font-weight: normal;
        border-radius: 8px;
        white-space: pre-wrap;

        z-index: 60;
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
