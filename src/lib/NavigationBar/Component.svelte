<script>
    // Components
    import BarPage from "./Page.svelte";
    import BarButton from "./Button.svelte";

    const toggleTheme = () => {
        if (localStorage.getItem("pm:dark") !== "true") {
            localStorage.setItem("pm:dark", true);
            return;
        }
        localStorage.setItem("pm:dark", false);
    };

    const searchExtensions = () => {
        const extensions = document.querySelectorAll('.block');
        const searchTerm = document.getElementById('searchInput').value.trim().toLowerCase();

        extensions.forEach(extension => {
            const title = extension.querySelector('.title').textContent.toLowerCase();
            const description = extension.querySelector('.description').textContent.toLowerCase();
            const matchesTitle = title.includes(searchTerm);
            const matchesDescription = description.includes(searchTerm);

            if (matchesTitle || matchesDescription) {
                extension.style.display = 'block';
            } else {
                extension.style.display = 'none';
            }
        });
    };
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
    <input type="text" id="searchInput" placeholder="Search..." style="background: var(--penguinmod-color); color: white; border: 1px solid white; border-radius: 5px; padding: 0.5rem; margin-right: 12px;" on:input={searchExtensions} />
    <BarButton
        highlighted="true"
        link={"https://discord.gg/NZ9MBMYTZh"}
        noredirect="true"
    >
        Join our Discord!
    </BarButton>
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
        justify-content: center;
        align-items: center;
        flex-wrap: nowrap;
        box-sizing: border-box;
        font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
        font-size: 0.75rem;
        font-weight: bold;
        min-width: 1000px;
        z-index: 1000;
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
</style>
