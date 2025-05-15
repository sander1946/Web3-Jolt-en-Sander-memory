// configuration
let view_time = 30; // this is the time in seconds, this will be the max time to view the cards

// score variables, these are used to calculate/show the score
let score = 0; // this is the score
let past_time  = 0; // this is the time in seconds that has passed
let left_time = 0; // this is the time in seconds that is left when viewing a card
let pares_found = 0; // this is the number of pairs found

// game variables, these are used to control the game
let started = false; // this is a boolean that tells if the game has started
let selected_card = null; // this is an div element
let left_timer = null; // this is an interval
let past_timer = null; // this is an interval

let open_cards = [] // this is an array that contains intervals of the open cards
var card_containers = []; // this is an array that contains the cards, these are the final shuffeld cards that will be shown on the board

async function updateBoardSize(inputSelector) {
    if(inputSelector.value <= 1) {
        inputSelector.value = 1;
    }
    await createMemoryCards(inputSelector.value);
}

async function createMemoryCards(pairs_count) {
    // preparing variables
    selected_card = null;
    const board = document.querySelector('#game-board');

    // setting input to one if it's lower then one
    if(pairs_count<=1) {
        pairs_count = 1;
    }

    board.innerHTML = ''; // Clear the board before updating
    const catJson = await getCatImages(pairs_count);

    if (!catJson || catJson.length === 0) {
        console.error('No cat images found');
        return;
    }

    var cards_unshuffled = [];
    for (let i = 0; i < catJson.length; i++) {
        cards_unshuffled.push(catJson[i].id);
        cards_unshuffled.push(catJson[i].id); // Duplicate each image ID for the matching game
    }

    let cards = cards_unshuffled
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value)

    cards.forEach(function (cardId, index) {
        const imgUrl = `https://cataas.com/cat/${cardId}?width=500&height=500`;

        const cardContainer = document.createElement('div');
        cardContainer.classList.add('card-container');
        cardContainer.setAttribute('data-card-id', cardId);
        cardContainer.setAttribute('data-card-index', index);
        cardContainer.setAttribute('data-card-status', 'closed');
        cardContainer.setAttribute('imgurl', imgUrl);

        const cardInner = document.createElement('div');
        cardInner.classList.add('card-inner');

        const cardFront = document.createElement('div');
        cardFront.classList.add('card-front');
        cardFront.classList.add('card-image');
        cardFront.setAttribute('style', `background-image: var(--card-img-closed-background-img);`);

        const cardBack = document.createElement('div');
        cardBack.classList.add('card-back');
        cardBack.classList.add('card-image');
        cardBack.setAttribute('style', `background-image: url('${imgUrl}');`);

        board.appendChild(cardContainer);
        cardContainer.appendChild(cardInner);
        cardInner.appendChild(cardFront);
        cardInner.appendChild(cardBack);

        // Add the card to the array of card containers
        card_containers.push(cardContainer);

        cardContainer.addEventListener('click', function() {
            // If the game has not started yet, start it
            if (!started) {
                startGame();
            }

            const cardStatus = cardContainer.getAttribute('data-card-status');
            if (cardStatus !== 'closed') {
                // If the card is already open or found, do nothing
                return;
            }

            cardContainer.setAttribute('data-card-status', 'open');

            if (selected_card === null) {
                // If no card is selected, set the current card as selected
                selected_card = cardContainer;
                return;
            }

            const selectedCardId = selected_card.getAttribute('data-card-id');
            const currentCardId = cardContainer.getAttribute('data-card-id');
            if (selectedCardId === currentCardId) {
                setTimeout(() => {
                    selected_card.setAttribute('data-card-status', 'found');
                    cardContainer.setAttribute('data-card-status', 'found');
                    foundPair();
                    selected_card = null;
                }, 500);
            } else {
                setTimeout(() => {
                    selected_card.setAttribute('data-card-status', 'closed');
                    cardContainer.setAttribute('data-card-status', 'closed');
                    selected_card = null;
                }, 750);
            }
        });
    });
}

const board_size_input = document.querySelector('#board-size-input');
window.onload = updateBoardSize(board_size_input);

async function getCatImages(limit, skip, tags) {
    if (!limit) return Promise.reject('Limit is required');
    const skipParam = skip ? `&skip=${skip}`: ``;
    const tagsParam = tags ? `&tags=${tags}`: ``;

    const url = `https://cataas.com/api/cats?limit=${limit}${skipParam}${tagsParam}`;
    try {
        const response = await fetch(url, {
            credentials: 'omit'
        });
        return await response.json();
    } catch (error) {
        console.error('Error fetching cat images:', error);
        return Promise.reject('Error fetching cat images:', error);
    }
}

function updateCardColor(colorInput) {
    const colorInputType = colorInput.getAttribute('data-card-status');
    switch (colorInputType) {
        case "closed": document.documentElement.style.setProperty('--card-closed-color', colorInput.value);
        case "open": document.documentElement.style.setProperty('--card-open-color', colorInput.value);
        case "found": document.documentElement.style.setProperty('--card-found-color', colorInput.value);
    }
}

function startGame() {
    started = true;
    selected_card = null;
    open_cards = [];
    score = 0;
    left_time = 0;
    past_time  = 0;
    pares_found = 0;
    past_timer = updatePastTimer();
    left_timer = updateLeftTimer();
}

function stopGame() {
    started = false;
    clearInterval(left_timer);
    clearInterval(past_timer);
}

function foundPair() {
    pares_found++;
    score += 10;
    const pairs_counter = document.querySelector('#pairs-count');
    pairs_counter.innerText = `${pares_found}`;
    if (pares_found >= card_containers.length / 2) {
        stopGame();
        console.log('You found all pairs!');
        alert('You found all pairs! Your score is: ' + score);
    }
}

function updatePastTimer() {
    const timerElement = document.querySelector('#time-past-time');
    let seconds = 0;
    let minutes = 0;
    let hours = 0;
    let time = 0;
    timerElement.innerText = `0 seconden`;
    return setInterval(() => {
        time++;
        past_time = time;
        seconds = time % 60;
        minutes = Math.floor(time / 60) % 60;
        hours = Math.floor(time / 3600);
        if (seconds < 10) {
            seconds = '0' + seconds;
        }
        if (minutes < 10) {
            minutes = '0' + minutes;
        }
        if (hours < 10) {
            hours = '0' + hours;
        }
        if (time >= 3600) {
            // If the time is more than 1 hour, show hours
            timerElement.innerText = `${hours}:${minutes}:${seconds}`;
            return;
        }
        timerElement.innerText = `${minutes}:${seconds}`;

    }, 1000);
}

function updateLeftTimer() {
    var progress = document.querySelector('#time-left-progress');
    let time = 0; // the elapsed time in seconds
    let start_time = view_time-2; // the start time in seconds, its lower to make the progress bar look better
    progress.setAttribute("style", `width: 100%`); // set the progress bar to 100%
    let value = start_time; // the current vabarlue of the progress 
    
    return setInterval(() => {
        value = 100 - (time / start_time) * 100; // the value of the progress bar
        time++;
        if( value >= 0 && value <= 100) {
            progress.setAttribute("style", `width: ${value}%`);
        }
    }, 1000);
}