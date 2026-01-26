<script>
    import { page } from '$app/stores';

    // Components
    import Extension from "$lib/Extension/Component.svelte";
    import Footer from "$lib/Footer/Component.svelte";
    import Logo from "$lib/Logo/Component.svelte";

    import stateSearchBar from '$lib/state/searchBar.svelte.js';
    import extensions from "$lib/extensions.js";

    const origin = $page.url.origin;
    const searchable = (text = '') => {
        text = String(text);
        return text.toLowerCase().trim();
    };
    const createExtUrl = (relativeUrl) => {
        return `${origin}/extensions/${relativeUrl}`;
    };

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
    <button onclick={() => { filterBarOpened = !filterBarOpened; }}>Show filters</button>
    <label>
        Sort by
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
            <!-- TODO: Make these based on whats in the extensions list, can use capital version of the name by default or the tag can be added to another list to give it an alias -->
            <label>
                <input type="checkbox">
                Graphics
            </label>
            <label>
                <input type="checkbox">
                Sound
            </label>
            <label>
                <input type="checkbox">
                Math
            </label>
            <label>
                <input type="checkbox">
                Jokes
            </label>
            <hr>
            <label>
                <input type="checkbox">
                Editor Addons
            </label>

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
        height: 24px;
        margin-left: 10%;

        display: flex;
        flex-direction: row;
        align-items: center;
    }
    .extension-list-controls button {
        height: 100%;
        border: 0;

        cursor: pointer;
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
        border: 1px solid black;
        margin: 8px;
        padding: 0px 8px;

        border-radius: 16px;
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
