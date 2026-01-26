<script>
    import { onMount } from 'svelte';
    import { page } from '$app/stores';

    // Components
    import Extension from "$lib/Extension/Component.svelte";
    import Footer from "$lib/Footer/Component.svelte";
    import Logo from "$lib/Logo/Component.svelte";

    import stateSearchBar from '$lib/state/searchBar.svelte.js';
    import { Tags, makeDefaultTag } from "$lib/extension-tags.js";
    import extensions from "$lib/extensions.js";

    const origin = $page.url.origin;
    const searchable = (text = '') => {
        text = String(text);
        return text.toLowerCase().trim();
    };
    const createExtUrl = (relativeUrl) => {
        return `${origin}/extensions/${relativeUrl}`;
    };

    // create the tag groups for the filter menu
    const tagGrouping = {};
    const tagsListShown = $state([]);
    onMount(() => {
        // first fill tagGrouping so we can group them together properly & sort them
        let usedTags = [];
        for (const extension of extensions) {
            if (extension.tags) {
                usedTags = [].concat(usedTags, extension.tags);
            }
        }
        usedTags = [...new Set(usedTags)];
        
        // format them to be an object like extension-tags
        const formattedTags = [];
        for (const tag of usedTags) {
            const extensionTag = Tags.find(extTag => extTag.name === tag);
            const newTag = {
                ...(makeDefaultTag()),
                ...(extensionTag ? extensionTag : {}),
                name: tag,
            };
            if (!newTag.alias) {
                // make their alias just be the name with first letter capitalized
                const fillerAlias = newTag.name.charAt(0).toUpperCase() + newTag.name.slice(1);
                newTag.alias = fillerAlias;
            }

            formattedTags.push(newTag);
        }
        formattedTags.sort((a, b) => a.alias.localeCompare(b.alias));

        // now group them
        for (const tag of formattedTags) {
            if (!tagGrouping[tag.group]) tagGrouping[tag.group] = [];
            tagGrouping[tag.group].push(tag);
        }

        // now fill the list we catually render (use separator for splits between groups)
        for (const group in tagGrouping) {
            for (const tag of tagGrouping[group]) {
                tagsListShown.push(tag);
            }

            const separator = makeDefaultTag();
            separator.name = "separator";
            tagsListShown.push(separator);
        }
        tagsListShown.pop();
    });

    // searching & filtering
    let filterBarOpened = $state(false);
    let showNoExtensionsFound = $state(false);
    $effect(() => {
        const matchingExts = extensions
            .filter(extension => searchable(extension.name).includes(stateSearchBar.query));
        showNoExtensionsFound = matchingExts.length <= 0;

        stateSearchBar.recommendations = [];
        if (matchingExts.length <= 5 && !showNoExtensionsFound) {
            stateSearchBar.recommendations = matchingExts.slice(0, 2);
        }
        
        const event = new CustomEvent("penguinmod-recommendations-updated");
        document.dispatchEvent(event);
    });
</script>

<div class="top">
    <div class="header">
        <Logo />
        <h1>PenguinMod Extra Extensions</h1>
    </div>
</div>
<div class="buffer">
    <p>See some cool extensions made by other people here.</p>
    <p>
        To use some of these extensions in your projects, click the "Copy Link"
        button on an extension and
        <a href="/load" target="_blank">load it into PenguinMod,</a>
        or click the "Try it out" button to create a new project with the extension.
    </p>
</div>

<div class="extension-list-controls">
    <button onclick={() => { filterBarOpened = !filterBarOpened; }}>
        <img
            src="/icons/filter.svg"
            alt="Filters"
        >
    </button>
    <div class="extension-list-controls-sorting-selector-image-container-div">
        <img
            src="/icons/sort.svg"
            alt="Sort"
        >
    </div>
    <label>
        <select>
            <option>recommended order</option>
            <option>reversed recommended order</option>
            <option>names A-Z</option>
            <option>names Z-A</option>
            <option>creators A-Z</option>
            <option>creators Z-A</option>
        </select>
    </label>
</div>
<div class="extension-list-container" data-filteropen={filterBarOpened}>
    <div class="extension-list-bars" data-filteropen={filterBarOpened}>
        <div class="extension-list-filters" data-filteropen={filterBarOpened}>
            <h1>Filters</h1>
            
            <h2 style="margin-block-end:4px">Tags</h2>
            {#each tagsListShown as extensionTag}
                {#if extensionTag.name === "separator"}
                    <hr>
                {:else}
                    <label>
                        <input type="checkbox">
                        {extensionTag.alias}
                    </label>
                {/if}
            {/each}

            <h2 style="margin-block-end:4px">Features</h2>
            <span class="extension-list-filters-label">Documentation</span>
            <label>
                <input name="pm-filters-features-documentation" type="radio">
                Show extensions with documentation
            </label>
            <label>
                <input name="pm-filters-features-documentation" type="radio">
                Only show extensions with documentation
            </label>
            <label>
                <input name="pm-filters-features-documentation" type="radio">
                Hide extensions with documentation
            </label>

            <span class="extension-list-filters-label">Example projects</span>
            <label>
                <input name="pm-filters-features-exampleprojects" type="radio">
                Show extensions with example projects
            </label>
            <label>
                <input name="pm-filters-features-exampleprojects" type="radio">
                Only show extensions with example projects
            </label>
            <label>
                <input name="pm-filters-features-exampleprojects" type="radio">
                Hide extensions with example projects
            </label>
            
            <span class="extension-list-filters-label">Warnings</span>
            <label>
                <input name="pm-filters-features-warnings" type="radio">
                Show extensions with warnings
            </label>
            <label>
                <input name="pm-filters-features-warnings" type="radio">
                Only show extensions with warnings
            </label>
            <label>
                <input name="pm-filters-features-warnings" type="radio">
                Hide extensions with warnings
            </label>
        </div>
        <div class="extension-list" data-filteropen={filterBarOpened}>
            <!-- This list can be modified in "src/lib/extensions.js" -->
            {#each extensions as extension}
                {#if searchable(extension.name).includes(stateSearchBar.query)}
                    <Extension
                        name={extension.name}
                        image={`/images/${extension.banner}`}
                        tags={extension.tags}
                        creator={extension.creator}
                        creatorAlias={extension.creatorAlias}
                        url={createExtUrl(extension.code)}
                        relUrl={extension.code}
                        notes={extension.notes}
                        documentation={extension.documentation}
                        isGitHub={String(extension.isGitHub) === "true"}
                        unstable={String(extension.unstable) === "true"}
                        unstableReason={extension.unstableReason}
                    >
                        {extension.description}
                    </Extension>
                {/if}
            {/each}
            {#if showNoExtensionsFound}
                <p class="no-exts">No extensions match your selected filters.</p>
            {/if}
        </div>
    </div>
</div>

<div class="buffer">
    <p style="text-align: center;">
        Note: Some extensions may be added to the Extension Gallery in
        PenguinMod Studio.
        <br />
        If you cannot find an extension that was
        previously listed here, check there.
    </p>

    <Footer />
    <div style="height: 64px"></div>
</div>

<style>
    :global(body.dark-mode) {
        color: white;
    }

    label {
        display: block;

        user-select: none;
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

    .buffer {
        width: 80%;
        margin-left: 10%;

        display: flex;
        flex-direction: column;
    }

    .extension-list-controls {
        width: 80%;
        height: 40px;
        margin-left: 10%;

        display: flex;
        flex-direction: row;
        align-items: center;
    }
    .extension-list-controls-sorting-selector-image-container-div,
    .extension-list-controls button {
        display: block;
        width: 40px;
        height: 40px;
        border: 0;

        border-radius: 8px;
        background: transparent;

        cursor: pointer;
    }
    .extension-list-controls button:active {
        background-color: rgba(0, 0, 0, 0.125);
    }
    :global(body.dark-mode) .extension-list-controls button:active {
        background-color: rgba(255, 255, 255, 0.125);
    }
    .extension-list-controls img {
        width: 100%;
        height: 100%;
        
        filter: brightness(0.2);
    }
    :global(body.dark-mode) .extension-list-controls img {
        filter: brightness(1);
    }
    .extension-list-controls select {
        height: 32px;
        margin: 0 8px;

        border-radius: 4px;
    }

    .extension-list-container {
        width: 80%;
        margin-left: 10%;

        display: flex;
        flex-direction: column;
    }
    .extension-list-container[data-filteropen="true"] {
        width: 100%;
        margin-left: initial;
    }
    .extension-list-bars {
        width: 100%;

        display: flex;
        flex-direction: row;
    }
    .extension-list-filters {
        display: none;
        width: calc(20% - (16px + 16px + 2px));
        border: 1px solid rgba(0, 0, 0, 0.25);
        margin: 8px;
        padding: 0px 8px;

        border-radius: 16px;
    }
    :global(body.dark-mode) .extension-list-filters {
        border-color: rgba(255, 255, 255, 0.75);
    }
    .extension-list-filters[data-filteropen="true"] {
        display: initial;
    }
    .extension-list-filters-label {
        display: block;
        margin-top: 8px;

        font-style: italic;
        opacity: 0.7;
    }
    .extension-list {
        width: 100%;

        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
    }
    .extension-list[data-filteropen="true"] {
        width: calc(100% - 20%);
    }

    .no-exts {
        padding: 8px 32px;
        border: 1px solid rgba(0, 0, 0, 0.25);

        border-radius: 4px;
    }
    :global(body.dark-mode) .no-exts {
        border-color: rgba(255, 255, 255, 0.25);
    }
</style>
