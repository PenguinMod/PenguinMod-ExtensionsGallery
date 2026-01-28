<script>
    import { page } from "$app/state";

    // Components
    import NavigationBar from "$lib/NavigationBar/Component.svelte";
    
    import stateApplication from '$lib/state/app.svelte.js';
    import stateSearchBar from '$lib/state/searchBar.svelte.js';

    let props = $props();
    const onSearch = (query) => {
        stateSearchBar.query = query;
    };

    $effect(() => {
        stateApplication.fromEditor = String(page.url.searchParams.get("editor")) === "true";
    });
</script>

<NavigationBar
    displaySearchBar={page.url.pathname === '/'}
    onsearch={onSearch}
/>
<div style="height: 3rem;"></div>

{@render props.children?.()}
