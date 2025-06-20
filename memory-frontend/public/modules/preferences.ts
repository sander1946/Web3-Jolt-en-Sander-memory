import { API } from "./api.js";
import type { playerPreferences, playerPreferencesUpdate } from "./interfaces.js";
import { showPopup } from "./main.js";
import { setProvider, type ProviderName } from "./providers/providerManager.js";

function setupSavePreferencesButton(): void {
    let saveButton = document.getElementById('save-preferences') as HTMLButtonElement;
    saveButton.addEventListener('click', async () => {
        let api = new API();
        let providerSelect = document.getElementById('provider-select') as HTMLSelectElement;
        let preferredApi = providerSelect.value as ProviderName;
        let colorFoundInput = document.querySelector('input.legend-color-input[data-card-status="found"]') as HTMLInputElement;
        let colorClosedInput = document.querySelector('input.legend-color-input[data-card-status="closed"]') as HTMLInputElement;

        try {
            await api.playerUpdatePreferences({
                api: preferredApi,
                color_found: colorFoundInput.value,
                color_closed: colorClosedInput.value,
            } as playerPreferencesUpdate);
            localStorage.setItem('preferences', JSON.stringify({
                color_found: colorFoundInput.value,
                color_closed: colorClosedInput.value,
                preferred_api: providerSelect.value,
            } as playerPreferences)); // save the preferences to localStorage
            showPopup(`<h2>Preferences saved successfully!</h2>
                <p>Start a new game to see the changes.</p>
                <p><a href="/">Start a new game</a></p>`);
        } catch (error) {
            console.error('Error saving preferences:', error);
            showPopup("There was an error saving your preferences.");
        }
    });
}

const api = new API();

window.onload = async () => { 
    let colorFoundInput = document.querySelector('input.legend-color-input[data-card-status="found"]') as HTMLInputElement;
    let colorClosedInput = document.querySelector('input.legend-color-input[data-card-status="closed"]') as HTMLInputElement;
    let providerSelect = document.getElementById('provider-select') as HTMLSelectElement;
    if (!colorFoundInput || !colorClosedInput || !providerSelect) {
        console.error('Required elements not found in the DOM');
        return;
    }

    let preferencesString = localStorage.getItem('preferences');
    let preferences: playerPreferences | null = null;

    if (!preferencesString) { // if preferences are not in localStorage, get them from the API
        preferences = await api.playerGetPreferences(); // get the preferences
    } else {
        try {
            preferences = JSON.parse(preferencesString) as playerPreferences; // parse the preferences from localStorage
        }
        catch (error) {
            console.error('Error parsing preferences from localStorage:', error);
            preferences = null; // reset preferences if parsing fails
        }
    }

    if (preferences) {
        try {
            if (preferences.color_found !== '') {
                colorFoundInput.value = preferences.color_found;
            } else {
                colorFoundInput.value = '#722c80';
            }
            if (preferences.color_closed !== '') {
                colorClosedInput.value = preferences.color_closed;
            } else {
                colorClosedInput.value = '#8ff357';
            }
            if (preferences.preferred_api !== '') {
                setProvider(preferences.preferred_api as ProviderName); // setup the game with the provider from preferences
                providerSelect.value = preferences.preferred_api; // set the provider select to the preferred API
            } else {
                setProvider("cataas" as ProviderName); // setup the game with cataas as default
                providerSelect.value = "cataas"; // set the provider select to cataas as default
            }
        } catch (error) {
            setProvider("cataas" as ProviderName); // setup the game with cataas as default
            providerSelect.value = "cataas"; // set the provider select to cataas as default
            colorFoundInput.value = '#722c80';
            colorClosedInput.value = '#8ff357'
            console.error('Error setting preferences:', error);
        }
    } else {
        setProvider("cataas" as ProviderName); // setup the game with cataas as default
        providerSelect.value = "cataas"; // set the provider select to cataas as default
        colorFoundInput.value = '#722c80';
        colorClosedInput.value = '#8ff357'
    }
    // localStorage.setItem('preferences', preferences as unknown as string); // save the preferences to localStorage
    localStorage.setItem('preferences', JSON.stringify({
        color_found: colorFoundInput.value,
        color_closed: colorClosedInput.value,
        preferred_api: providerSelect.value,
    } as playerPreferences)); // save the preferences to localStorage
    setupSavePreferencesButton(); // setup the save preferences button
};
