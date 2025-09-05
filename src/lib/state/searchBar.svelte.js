const stateSearchBar = $state({
    // The search bar search query
    query: "",

    // Extensions that match the search query
    recommendations: [],

    // The extension URL of a recommendation that was clicked
    selectedRecommendation: "",
});

export default stateSearchBar;