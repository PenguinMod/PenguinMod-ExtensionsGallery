import { writable } from "svelte/store";

export const searchQuery = writable("");
export const searchRecommendations = writable([]);
export const selectedRecommendedExt = writable("");