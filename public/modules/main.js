import { setProvider, getProvider } from './providers/providerManager.js';
import { createMemoryCards } from './board.js';

async function loadImages(limit = 10) {
    const provider = getProvider();
    const images = await provider.getImages(limit);
    const urls = images.map(img => provider.getImageUrl(img));
    return urls;
}

async function setupProviderSelector() {
    const select = document.getElementById('provider-select');
    select.addEventListener('change', async () => {
        setProvider(select.value);
    });
}

async function updateBoard() {
    const board_size_input = document.querySelector('#board-size-input');
    if(board_size_input.value <= 1) {
        board_size_input.value = 1;
    }
    await setupProviderSelector()
    const urls = await loadImages(board_size_input.value)
    await createMemoryCards(urls);
}

const new_game_button = document.querySelector('#new-game-button');
new_game_button.addEventListener('click', async () => {
    await updateBoard();
});

window.onload = await updateBoard();