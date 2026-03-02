<script>
    import { onMount } from 'svelte';
    import { page } from '$app/stores';

    import IconEnabled from './icon-enabled.svg';
    
    let {
        checked = $bindable(),
        onclick,
        onchange,
        oninput,
    } = $props();
    const onClick = (event) => {
        if (onclick) onclick(event);

        // oninput comes first before checked change
        if (oninput) oninput(checked);

        // change the checked
        checked = !checked;
        // onchange goes after
        if (onchange) onchange(checked);
    };
</script>

<!-- TODO: Add this to svelteui -->
<button
    class="checkbox"
    data-checked={checked}
    data-penguinmodsvelteui-checkbox="true"
    onclick={onClick}
>
    {#if checked}
        <img src={IconEnabled} alt="√" />
    {/if}
</button>

<style>
    .checkbox {
        position: relative;
        display: block;
        width: 20px;
        height: 20px;
        margin: 2px 0;

        flex-shrink: 0;

        background: transparent;
        border: 1px solid rgba(0, 0, 0, 0.5);
        border-radius: 3px;

        cursor: pointer;
    }
    .checkbox img {
        position: absolute;
        width: calc(20px - 4px);
        height: calc(20px - 4px);
        left: 1px;
        top: 1px;

        filter: brightness(0.25);

        pointer-events: none;
    }
    :global(body.dark-mode) .checkbox {
        border-color: rgba(255, 255, 255, 0.5);
    }
    :global(body.dark-mode) .checkbox img {
        filter: brightness(1);
    }

    .checkbox[data-checked="true"] {
        background: dodgerblue;
    }
    .checkbox[data-checked="true"] img {
        filter: brightness(1);
    }
</style>