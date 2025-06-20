import { setProvider, getProvider, type ProviderName } from './providers/providerManager.js';
import { Game } from './game.js';
import { API } from './api.js';

// global functions

// step 1, select the provider, this happens automatically when someone clicks on the select element
// this is done in the setupProviderSelector function


// step 2, get the images from the provider
export async function getImageUrls(limit: number = 10): Promise<string[]> {
    const provider = getProvider();
    const images = await provider.getImages(limit);
    const urls = images.map((img: any) => provider.getImageUrl(img));
    return urls;
}

export function showPopup(content: string): void {
    var popup = document.getElementById("popup");
    popup!.style.display = "block";
    var popup_content =  document.querySelector('.popup-content') as HTMLElement;
    popup_content.innerHTML = content;
}

// step 3, create the memory cards
function updateBoardEventHandler(game: Game): void {
    const board_size_input = document.querySelector('#board-size-input') as HTMLInputElement;
    if(Number(board_size_input.value) <= 1) {
        board_size_input.value = "1";
    }
    game.restartGame(Number(board_size_input.value)); // setup the game
}

function setTopScores(): void {
    const top_scores_list = document.querySelector('.leaderboard-list') as HTMLOListElement;
    top_scores_list.innerHTML = ''; // clear the top scores div
    const api = new API();
    api.publicGetTopScores().then((scores) => {
        if (!Array.isArray(scores) || scores.length === 0) {
            // Fill all 5 with placeholders if no scores
            for (let i = 0; i < 5; i++) {
                const li = document.createElement('li');
                li.innerHTML = `<span class="leaderboard-item">-----</span><span class="leaderboard-score"></span>`;
                top_scores_list.appendChild(li);
            }
            return;
        }
        // Ensure scores is at least 5 items, filling with placeholders if needed
        const filledScores = [...scores];
        while (filledScores.length < 5) {
            filledScores.push({ username: "-----", score: 0 });
        }
        filledScores.slice(0, 5).forEach((score) => {
            const li = document.createElement('li');
            const name_span = document.createElement('span');
            name_span.className = 'leaderboard-item';
            name_span.innerText = score.username;

            const score_span = document.createElement('span');
            score_span.className = 'leaderboard-score';
            if (score.score === 0 && score.username === "-----") {
                score_span.innerText = "";
                li.innerHTML = name_span.outerHTML + score_span.outerHTML;
            } else {
                score_span.innerText = score.score.toString();
                li.innerHTML = name_span.outerHTML + ' : ' + score_span.outerHTML;
            }
            top_scores_list.appendChild(li);
        });
    }).catch((error) => {
        console.error('Error fetching top scores:', error);
        top_scores_list.innerText = '<span class="error">Error fetching top scores</span>';
    });
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
    const api = new API();
    api.playerGetPlayerData().then((data) => {
        if (data && data.name) {
            
        }
    }).catch((error) => {
        console.error('Error fetching player data:', error);
    });
    setProvider("cataas" as ProviderName); // setup the game with cataas as default
    game.setupGame(8); // setup the game with 8 pairs of cards as default
    setTopScores(); // get the top scores from the server and display them
};
