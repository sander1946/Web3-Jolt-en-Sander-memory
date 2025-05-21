import { setProvider, getProvider, type ProviderName } from './providers/providerManager.js';
import { createMemoryCards } from './board.js';

async function loadImages(limit: number = 10): Promise<string[]> {
    const provider = getProvider();
    const images = await provider.getImages(limit);
    const urls = images.map((img: any) => provider.getImageUrl(img));
    return urls;
}

async function setupProviderSelector(): Promise<void> {
    const select = document.getElementById('provider-select') as HTMLSelectElement;
    select.addEventListener('change', async () => {
        setProvider(select.value as ProviderName);
    });
}

async function updateBoard(): Promise<void> {
    const board_size_input = document.querySelector('#board-size-input') as HTMLInputElement;
    if(Number(board_size_input.value) <= 1) {
        board_size_input.value = "1";
    }
    await setupProviderSelector();
    const urls = await loadImages(Number(board_size_input.value));
    await createMemoryCards(urls);
}

const new_game_button = document.querySelector('#new-game-button') as HTMLButtonElement;
new_game_button.addEventListener('click', async () => {
    await updateBoard();
});

window.onload = async () => { await updateBoard(); };
