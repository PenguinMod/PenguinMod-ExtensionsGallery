<script>
    let props = $props();
    let highlighted = $derived(props.highlighted || false);
    let link = $derived(props.link);
    let label = $derived(props.label || "");
    let noredirect = $derived(props.noredirect || false);
    let classActor = $derived(props.classActor);
    let id = $derived(props.id);
</script>

{#if link}
    <a
        href={link}
        target={noredirect ? "_blank" : "_self"}
        style="text-decoration: none;"
        class={`${classActor ? ` ca-${classActor}` : ""}`}
    >
        <button class={highlighted ? "button button-highlight" : "button"} {id}>
            {@html label}
            {@render props.children?.()}
        </button>
    </a>
{:else}
    <button
        class={(highlighted ? "button button-highlight" : "button") +
            (classActor ? ` ca-${classActor}` : "")}
        {id}
    >
        {@html label}
        {@render props.children?.()}
    </button>
{/if}

<style>
    .button {
        margin-left: 0.25rem;
        margin-right: 0.25rem;
        padding: 0.75rem 1rem;
        font-weight: 600;
        font-size: 0.85rem;
        border: 0px;
        border-radius: 4px;
        outline-width: 1px;
        outline-style: solid;
        outline-color: rgba(0, 0, 0, 0.15);
        color: white;
        background-color: transparent;
        cursor: pointer;
    }
    .button-highlight {
        outline: 0px;
        background-color: white;
        color: #00c3ff;
    }
    :global(body.dark-mode) .button-highlight {
        color: #009ccc;
    }
</style>
