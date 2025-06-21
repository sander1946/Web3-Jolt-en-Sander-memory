import { setProvider, getProvider, type ProviderName } from './providers/providerManager.js';
import { Game } from './game.js';
import { API } from './api.js';
import type { playerPreferences } from './interfaces.js';

// global functions

export async function getImageUrls(limit: number = 10): Promise<string[]> {
    let provider = getProvider();
    let images = await provider.getImages(limit);
    let urls = images.map((img: any) => provider.getImageUrl(img));
    return urls;
}

function setTopScores(): void {
    let top_scores_list = document.querySelector('.leaderboard-list') as HTMLOListElement;
    top_scores_list.innerHTML = '<li><span class="leaderboard-item">-----</span><span class="leaderboard-score"></span></li><li><span class="leaderboard-item">-----</span><span class="leaderboard-score"></span></li><li><span class="leaderboard-item">-----</span><span class="leaderboard-score"></span></li><li><span class="leaderboard-item">-----</span><span class="leaderboard-score"></span></li><li><span class="leaderboard-item">-----</span><span class="leaderboard-score"></span></li>'; // clear the top scores div
    let api = new API();
    api.publicGetTopScores().then((scores) => {
        if (!Array.isArray(scores) || scores.length === 0) {
            // Fill all 5 with placeholders if no scores
            for (let i = 0; i < 5; i++) {
                let li = document.createElement('li');
                li.innerHTML = `<span class="leaderboard-item">-----</span><span class="leaderboard-score"></span>`;
                top_scores_list.appendChild(li);
            }
            return;
        }
        // Ensure scores is at least 5 items, filling with placeholders if needed
        let filledScores = [...scores];
        while (filledScores.length < 5) {
            filledScores.push({ username: "-----", score: 0 });
        }
        top_scores_list.innerHTML = ''; // clear the top scores div
        filledScores.slice(0, 5).forEach((score) => {
            let li = document.createElement('li');
            let name_span = document.createElement('span');
            name_span.className = 'leaderboard-item';
            name_span.innerText = score.username;

            let score_span = document.createElement('span');
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

function setAvgTimes(): void {
    let personal_avg_time = document.querySelector('#avg-time-personal') as HTMLSpanElement;
    let personal_avg_time_result = '';
    let global_avg_time = document.querySelector('#avg-time-global') as HTMLSpanElement;
    let global_avg_time_result = '';
    let api = new API();
    api.publicGetScores().then((times) => {
        if (!times || !Array.isArray(times) || times.length === 0) {
            global_avg_time_result = '<span class="error">No global average time available</span>';
            return;
        }

        // Calculate global average time
        let globalAvg = times.reduce((sum, score) => sum + score.score, 0) / times.length;
        global_avg_time_result = `${globalAvg.toFixed(2)} seconds`;
    }).catch((error) => {
        console.error('Error fetching average times:', error);
        personal_avg_time_result = '<span class="error">Error fetching personal average time</span>';
        global_avg_time_result = '<span class="error">Error fetching global average time</span>';
    });

    api.playerGetGames().then((games) => {
        if (!games || !Array.isArray(games) || games.length === 0) {
            personal_avg_time_result = '<span class="error">No personal average time available</span>';
            return;
        }
        // Calculate personal average time
        let personalAvg = games.reduce((sum, game) => sum + game.score, 0) / games.length;
        personal_avg_time_result = `${personalAvg.toFixed(2)} seconds`;
        personal_avg_time.innerHTML = personal_avg_time_result;
        global_avg_time.innerHTML = global_avg_time_result;
    }).catch((error) => {
        console.error('Error fetching personal average times:', error);
        personal_avg_time_result = '<span class="error">Error fetching personal average time</span>';
        personal_avg_time.innerHTML = personal_avg_time_result;
        global_avg_time.innerHTML = global_avg_time_result;
    });
}

const game = new Game();

const new_game_button = document.querySelector('#new-game-button') as HTMLButtonElement;
new_game_button.addEventListener('click', async () => {
    game.restartGame(15); // setup the game with 15 pairs of cards as default
});

// register the event handler for the board size input and setup the game when the page loads
window.onload = async () => { 
    let api = new API();
    api.playerGetPlayerData() // login check
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
                document.documentElement.style.setProperty('--card-found-color', preferences.color_found);
            } else {
                document.documentElement.style.setProperty('--card-found-color', '#722c80');
            }
            if (preferences.color_closed !== '') {
                document.documentElement.style.setProperty('--card-closed-color', preferences.color_closed);
            } else {
                document.documentElement.style.setProperty('--card-closed-color', '#8ff357');
            }
            if (preferences.preferred_api !== '') {
                setProvider(preferences.preferred_api as ProviderName); // setup the game with the provider from preferences
            } else {
                setProvider("cataas" as ProviderName); // setup the game with cataas as default
            }
        } catch (error) {
            setProvider("cataas" as ProviderName); // setup the game with cataas as default
            document.documentElement.style.setProperty('--card-found-color', '#722c80');
            document.documentElement.style.setProperty('--card-closed-color', '#8ff357');
            console.error('Error setting preferences:', error);
        }
    } else {
        setProvider("cataas" as ProviderName); // setup the game with cataas as default
        document.documentElement.style.setProperty('--card-found-color', '#722c80');
        document.documentElement.style.setProperty('--card-closed-color', '#8ff357');
    }
    game.setupGame(15); // setup the game with 15 pairs of cards as default
    setTopScores(); // get the top scores from the server and display them
    setAvgTimes(); // get the average times from the server and display them
};