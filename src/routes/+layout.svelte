<script>
    import { page } from '$app/stores';

    import NavigationBar from "$lib/NavigationBar/Component.svelte";
    import { searchQuery } from '$lib/stores.js';

    const onSearch = (event) => {
        const query = event.detail;
        $searchQuery = query;
    };
</script>

<NavigationBar
    displaySearchBar={$page.url.pathname === '/'}
    on:search={onSearch}
/>
<div style="height: 3rem;" />

<slot />
