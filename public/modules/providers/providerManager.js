import * as cataas from './cataas.js';
import * as dogapi from './dogapi.js';
import * as lorempicsum from './lorempicsum.js';


const providers = {
    cataas,
    dogapi,
    lorempicsum
};

let currentProvider = 'cataas';

export function setProvider(name) {
    if (!providers[name]) throw new Error(`Provider ${name} not found`);
    currentProvider = name;
}

export function getProvider() {
    return providers[currentProvider];
}
