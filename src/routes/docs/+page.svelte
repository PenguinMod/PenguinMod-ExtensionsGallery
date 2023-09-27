<script>
    import DocsPages from "$lib/Documentation/pages.js";
    const pages = Object.keys(DocsPages);
    const amount = pages.length;
</script>

<h1>Documentation</h1>
<p>
    Extension creators might have written some explanations on how to use their
    extensions.
    <br />
    This page contains a list of those explanations below.
</p>
<br />
<p class="lil-guy">
    <b>{amount} documentation page{amount > 1 ? "s" : ""} written</b>
</p>

{#each pages as page}
    <a href={`/docs/${page}`}>{page}</a>
{/each}

<div style="height: 32px;" />

<style>
    .lil-guy {
        font-size: small;
    }
    :global(body.dark-mode) {
        color: white;
    }
    :global(body.dark-mode) a {
        color: dodgerblue;
    }
</style>
