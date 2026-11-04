<script>
    import { onMount } from 'svelte';
    import { page } from '$app/stores';

    import IconEnabled from './icon-enabled.svg';
    import IconThird from './icon-third.svg';
    
    let {
        value = $bindable(),
        onclick,
        onchange,
        oninput,
    } = $props();
    const onClick = (event) => {
        if (onclick) onclick(event);

        // oninput comes first before value change
        if (oninput) oninput(value);

        // change the value
        if (value === 0) { value = 1; }         // 1
        else if (value === 1) { value = 2; }    // 2
        else { value = 0; }                     // 0
        // onchange goes after
        if (onchange) onchange(value);
    };
</script>

<!-- TODO: Add this to svelteui -->
<button
    class="checkbox"
    data-value={value}
    data-penguinmodsvelteui-threestatecheckbox="true"
    onclick={onClick}
>
    {#if value === 1}
        <img src={IconEnabled} alt="√" />
    {:else if value === 2}
        <img src={IconThird} alt="-" />
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

    .checkbox[data-value="1"] {
        background: dodgerblue;
    }
    .checkbox[data-value="1"] img {
        filter: brightness(1);
    }
</style>