<script>
    import { createEventDispatcher } from "svelte";
    import { searchRecommendations } from '$lib/stores.js';
    import {onMount} from 'svelte';

    // Components
    import BarPage from "./Page.svelte";
    import BarButton from "./Button.svelte";
    import SearchSVG from "./SearchIcon.svelte";

    const toggleTheme = () => {
        if (localStorage.getItem("pm:dark") !== "true") {
            localStorage.setItem("pm:dark", true);
            return;
        }
        localStorage.setItem("pm:dark", false);
    };

    export let displaySearchBar = false;
    const dispatch = createEventDispatcher();
    let searchInput;

    const searchExtensions = () => {
        if (!searchInput) return;
        const searchTerm = String(searchInput.value)
            .trim().toLowerCase();

        dispatch("search", searchTerm);
    };
    searchRecommendations.subscribe(() => {
        if (!searchInput) return;
        searchInput.focus();
    });

    onMount(() => {
        searchInput.placeholder = (window.innerWidth<=850 ? "Extension search" : "Search for an extension...")
    });

</script>

<div class="bar">
    <a class="logo" href="/">
        <img class="logo-image" src="/navicon.png" alt="PenguinMod" />
    </a>
    <div style="margin-right: 12px;"></div>
    <BarPage style="padding:0.5rem" on:click={toggleTheme}>
        <img src="/icons/moon.svg" alt="Theme" />
    </BarPage>
    <BarPage link={"/docs"}>Documentation</BarPage>

    {#if displaySearchBar}
        <div class="search">
            <button class="search-button" on:click={searchExtensions}>
                <SearchSVG
                    width="30px"
                    height="20px"
                    color="#ffffff"
                    scale="2px"
                    style="margin-bottom:5px; margin-top: 5px;"
                />
            </button>
            <input
                type="text"
                class="search-bar"
                placeholder="Search for an extension..."
                on:input={searchExtensions}
                bind:this={searchInput}
            />
            {#each $searchRecommendations as searchRecommendation, idx}
                <button
                    class="search-recommendation"
                    style="margin-top: {idx * 3}em;
                    {idx === 0 ? ' border-top: 0;' : ''}
                    {idx === ($searchRecommendations.length - 1) ? ' border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;' : ''}"
                    on:click={searchRecommendation.callback}
                >
                    <p>{searchRecommendation.name}</p>
                </button>
            {/each}
        </div>
    {/if}
</div>

<style>
    :root {
        --penguinmod-color: #00c3ff;
    }
    :global(body.dark-mode) {
        --penguinmod-color: #009ccc;
    }

    .bar {
        position: fixed;
        width: 100%;
        left: 0px;
        top: 0px;
        background: var(--penguinmod-color);
        height: 3rem;
        color: white;
        display: flex;
        flex-direction: row;
        align-items: center;
        flex-wrap: nowrap;
        box-sizing: border-box;
        font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
        font-size: 0.75rem;
        font-weight: bold;
        min-width: 1000px;
        z-index: 1000;
    }
    @media only screen and (min-width: 850px) {
        .bar {
            justify-content: center;
        }
    }

    .logo {
        height: 100%;
    }
    .logo-image {
        margin-top: 10%;
        height: 80%;
        transition: 0.15s ease all;
    }
    .logo-image:hover {
        margin-top: 5%;
        height: 90%;
        transition: 0.15s ease all;
    }

    .search {
        position: relative;
        margin-left: 0.25rem;
        margin-right: 0.25rem;
        padding: 0px 0.25rem;
        font-weight: 600;
        font-size: 0.85rem;
        border: 0px;
        border-radius: 4px;
        outline: 0px;
        background-color: #00000026;
        color: #fff;
        display: flex;
        flex-direction: row;
        align-items: center;
    }
    @media only screen and (max-width: 850px) {
        .search{
            width:16%;
        }
    }
    .search-button {
        cursor: pointer;
        height: 100%;
        background: transparent;
        border: 0;
        padding: 0.2rem;
        display: flex;
        align-items: center;
        flex-direction: row;
    }
    .search-bar {
        cursor: text;
        width: 16rem;
        height: 30px;
        background: transparent;
        border: 0;
        color: white;
        font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
        outline: 0;
    }

    /* dont use <selector>, because browsers will ignore it if one of the selectors is unknown */
    ::placeholder {
        color: white;
        opacity: 0.75;
    }
    :-ms-input-placeholder {
        color: white;
        opacity: 0.75;
    }
    ::-ms-input-placeholder {
        color: white;
        opacity: 0.75;
    }

    .search-recommendation {
        position: absolute;
        left: 0;
        top: calc(3rem - 0.4rem);
        width: 100%;
        padding: 0 8px;
        background: var(--penguinmod-color);
        border: 1px solid #00000026;
        border-radius: 0;
        color: white;
        text-align: left;
        font-weight: bold;
        cursor: pointer;
    }
    .search-recommendation:active {
        filter: brightness(0.8);
    }
</style>
