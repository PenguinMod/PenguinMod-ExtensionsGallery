/*
NOTE: This file manages aliases & groupings for tags.
To make a new tag or list it, add it to an extension in `extensions.js`
*/
export const Tags = [
    // reserved tags (dont add these to an extension)
    {
        name: "separator",
    },

    // extensiontypes
    {
        name: "new",
        banner: "/icons/tag-banners/new.svg",
        group: "extensiontypes",
    },
    {
        name: "addons",
        alias: "Editor Addons",
        group: "extensiontypes",
    },
    {
        name: "expansion",
        alias: "Category Expansions",
        group: "extensiontypes",
    },
    {
        name: "collection",
        alias: "Extension Collections",
        group: "extensiontypes",
    },
    {
        name: "customtype",
        alias: "New Block Type",
        group: "extensiontypes",
    },

    // any other misc ones that just need aliases
    {
        name: "genai",
        alias: "Generative AI",
    },
    {
        name: "api",
        alias: "API / Other websites",
    },
    {
        name: "ai",
        alias: "Algorithms and AI",
    },
    {
        name: "large",
        alias: "Large Extensions",
    },
    {
        name: "small",
        alias: "Small Extensions",
    },
];

export function makeDefaultTag() {
    return {
        name: "",
        // alias: "",
        // banner: "/icons/tag-banners/new.svg",
        group: "ungrouped",
    };
};