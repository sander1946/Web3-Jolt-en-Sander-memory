import { API } from "./api.js";
import type { playerPreferencesUpdate } from "./interfaces.js";
import { showPopup } from "./main.js";
import { setProvider, type ProviderName } from "./providers/providerManager.js";

function setupSavePreferencesButton(): void {
    const saveButton = document.getElementById('save-preferences') as HTMLButtonElement;
    saveButton.addEventListener('click', async () => {
        const api = new API();
        const providerSelect = document.getElementById('provider-select') as HTMLSelectElement;
        const preferredApi = providerSelect.value as ProviderName;

        try {
            await api.playerUpdatePreferences({
                api: preferredApi,
                color_found: (document.querySelector('input.legend-color-input[data-card-status="found"]') as HTMLInputElement).value,
                color_closed: (document.querySelector('input.legend-color-input[data-card-status="closed"]') as HTMLInputElement).value,
            } as playerPreferencesUpdate);
            showPopup(`<h2>Preferences saved successfully!</h2>
                <p>Start a new game to see the changes.</p>
                <p><a href="/">Start a new game</a></p>`);
        } catch (error) {
            console.error('Error saving preferences:', error);
            showPopup("There was an error saving your preferences.");
        }
    });
}

function updateCardColor(colorInput: HTMLInputElement): void {
    const colorInputType = colorInput.getAttribute('data-card-status');
    switch (colorInputType) {
        case "closed":
            document.documentElement.style.setProperty('--card-closed-color', colorInput.value);
            break;
        case "open":
            document.documentElement.style.setProperty('--card-open-color', colorInput.value);
            break;
        case "found":
            document.documentElement.style.setProperty('--card-found-color', colorInput.value);
            break;
        default:
            break;
    }
}

const api = new API();

window.onload = async () => { 
    api.playerGetPlayerData(); // login check
    let prefecensed = await api.playerGetPreferences(); // get the preferences
    // TODO: set this up in localStorage to load preferences faster, then update with the actual preferences from the API
    let colorFoundInput = document.querySelector('input.legend-color-input[data-card-status="found"]') as HTMLInputElement;
    let colorClosedInput = document.querySelector('input.legend-color-input[data-card-status="closed"]') as HTMLInputElement;
    if (prefecensed) {
        try {
            if (prefecensed.color_found !== '') {
                colorFoundInput.value = prefecensed.color_found;
            } else {
                colorFoundInput.value = '#722c80';
            }
            if (prefecensed.color_closed !== '') {
                colorClosedInput.value = prefecensed.color_closed;
            } else {
                colorClosedInput.value = '#8ff357';
            }
            if (prefecensed.preferred_api !== '') {
                setProvider(prefecensed.preferred_api as ProviderName); // setup the game with the provider from preferences
            } else {
                setProvider("cataas" as ProviderName); // setup the game with cataas as default
            }
        } catch (error) {
            setProvider("cataas" as ProviderName); // setup the game with cataas as default
            colorFoundInput.value = '#722c80';
            colorClosedInput.value = '#8ff357'
            console.error('Error setting preferences:', error);
        }
    } else {
        setProvider("cataas" as ProviderName); // setup the game with cataas as default
        colorFoundInput.value = '#722c80';
        colorClosedInput.value = '#8ff357'
    }
    setupSavePreferencesButton(); // setup the save preferences button
};
