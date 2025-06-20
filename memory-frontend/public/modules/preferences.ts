import { setProvider, type ProviderName } from "./providers/providerManager.js";

function setupProviderSelector(): void {
    const select = document.getElementById('provider-select') as HTMLSelectElement;
    select.addEventListener('change', async () => {
        setProvider(select.value as ProviderName);
    });
}

window.onload = () => { 
    setupProviderSelector(); // setup the provider selector
};
