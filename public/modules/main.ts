import { setProvider, getProvider, type ProviderName } from './providers/providerManager.js';
import { Game } from './game.js';

// global functions

// step 1, select the provider, this happens automatically when someone clicks on the select element
// this is done in the setupProviderSelector function
function setupProviderSelector(): void {
    const select = document.getElementById('provider-select') as HTMLSelectElement;
    select.addEventListener('change', async () => {
        setProvider(select.value as ProviderName);
    });
}

// step 2, get the images from the provider
export async function getImageUrls(limit: number = 10): Promise<string[]> {
    const provider = getProvider();
    const images = await provider.getImages(limit);
    const urls = images.map((img: any) => provider.getImageUrl(img));
    return urls;
}

// step 3, create the memory cards
function updateBoardEventHandler(game: Game): void {
    const board_size_input = document.querySelector('#board-size-input') as HTMLInputElement;
    if(Number(board_size_input.value) <= 1) {
        board_size_input.value = "1";
    }
    game.restartGame(Number(board_size_input.value)); // setup the game
}

// global setup
// change all default values here as needed

const game = new Game();

const new_game_button = document.querySelector('#new-game-button') as HTMLButtonElement;
new_game_button.addEventListener('click', async () => {
    updateBoardEventHandler(game);
});

// register the event handler for the board size input and setup the game when the page loads
window.onload = () => { 
    setupProviderSelector(); // setup the provider selector
    setProvider("cataas" as ProviderName); // setup the game with cataas as default
    game.setupGame(8); // setup the game with 8 pairs of cards as default
};
