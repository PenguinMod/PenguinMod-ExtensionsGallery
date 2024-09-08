<script>
    import { page } from '$app/stores';

    import Extension from "$lib/Extension/Component.svelte";
    import Footer from "$lib/Footer/Component.svelte";
    import Logo from "$lib/Logo/Component.svelte";

    import extensions from "$lib/extensions.js";
    import { searchQuery, searchRecommendations, selectedRecommendedExt } from '$lib/stores.js';

    const origin = $page.url.origin;
    const searchable = (text = '') => {
        text = String(text);
        return text.toLowerCase().trim();
    };
    const createExtUrl = (relativeUrl) => {
        return `${origin}/extensions/${relativeUrl}`;
    };

    let recommendedExtensions = [];
    let showNoExtensionsFound = false;
    searchQuery.subscribe((query) => {
        const matchingExts = extensions
            .filter(extension => searchable(extension.name).includes(query));
        showNoExtensionsFound = matchingExts.length <= 0;

        $searchRecommendations = [];
        if (matchingExts.length > 5 || showNoExtensionsFound) {
            recommendedExtensions = [];
            return;
        }
        recommendedExtensions = matchingExts.slice(0, 2);
        $searchRecommendations = recommendedExtensions.map(ext => ({
            name: `Copy ${ext.name} to clipboard`,
            callback: () => {
                $selectedRecommendedExt = ''; // reset first
                $selectedRecommendedExt = ext.code;
            }
        }));
    });
</script>

<div class="top">
    <div class="header">
        <Logo />
        <h1>PenguinMod Extra Extensions</h1>
    </div>
</div>
<div class="main">
    <p>See some cool extensions made by other people here.</p>
    <p>
        To use some of these extensions in your projects, click the "Copy URL"
        button on an extension and
        <a href="/load" target="_blank">load it into PenguinMod,</a>
        or click the "View" button to create a new project with the extension.
    </p>

    <div class="extension-list">
        <!-- This list can be modified in "src/lib/extensions.js" -->
        {#each extensions as extension}
            {#if searchable(extension.name).includes($searchQuery)}
                <Extension
                    name={extension.name}
                    image={`/images/${extension.banner}`}
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
            <p class="no-exts">No extensions found under that search query.</p>
        {/if}
    </div>

    <p style="text-align: center;">
        Note: Some extensions may be added to the Extension Gallery in
        PenguinMod Studio.<br />If you cannot find an extension that was
        previously listed here, check there.
    </p>

    <Footer />
    <div style="height: 64px" />
</div>

<style>
    :global(body.dark-mode) {
        color: white;
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

    .main {
        width: 80%;
        margin-left: 10%;
        display: flex;
        flex-direction: column;
    }

    .extension-list {
        width: 100%;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
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
