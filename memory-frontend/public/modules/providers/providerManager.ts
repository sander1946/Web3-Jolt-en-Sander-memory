import * as cataas from './cataas.js';
import * as dogapi from './dogapi.js';
import * as lorempicsum from './lorempicsum.js';


export type ProviderName = 'cataas' | 'dogapi' | 'lorempicsum';

const providers: Record<ProviderName, any> = {
    cataas,
    dogapi,
    lorempicsum
};

let currentProvider: ProviderName = 'cataas';

export function setProvider(name: ProviderName) {
    if (name === currentProvider) return; // No change
    if (!providers[name]) throw new Error(`Provider ${name} not found`);
    currentProvider = name;
}

export function getProvider() {
    return providers[currentProvider];
}
