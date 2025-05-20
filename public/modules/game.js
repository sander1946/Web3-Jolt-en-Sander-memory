// configuration
var view_time = 30; // this is the time in seconds, this will be the max time to view the cards

// score variables, these are used to calculate/show the score
var score = 0; // this is the score
var score_time  = 0; // this is the time in seconds that has passed
var look_time = 0; // this is the time in seconds that is left when viewing a card
var pares_found = 0; // this is the number of pairs found

// game variables, these are used to control the game
var started = false; // this is a boolean that tells if the game has started
var selected_card = null; // this is an div element
var look_timer = null; // this is an interval
var score_timer = null; // this is an interval

var open_cards = [] // this is an array that contains intervals of the open cards
var card_containers = []; // this is an array that contains the cards, these are the final shuffeld cards that will be shown on the board

var open_cards = []; // this is an array that contains the open cards, these are the cards that are currently open

export function getSelectedCard() {
    return selected_card;
}

export function setSelectedCard(card) {
    selected_card = card;
}

export function getCardContainers() {
    return card_containers;
}

export function setCardContainers(containers) {
    card_containers = containers;
}

export function startGame() {
    started = true;
    selected_card = null;
    open_cards = [];
    score = 0;
    look_time = 0;
    score_time  = 0;
    pares_found = 0;
    score_timer = updateScoreTimer();
    // look_timer = updateLookTimer();
}

export function stopGame() {
    started = false;
    stopLookTimer(look_timer);
    clearInterval(score_timer);
}

export function foundPair() {
    pares_found++;
    score += 10;
    const pairs_counter = document.querySelector('#pairs-count');
    pairs_counter.innerText = `${pares_found}`;
    if (pares_found >= card_containers.length / 2) {
        // TODO: show a better message/popup
        stopGame();
        console.log('You found all pairs!');
        alert('You found all pairs! Your score is: ' + score);
    }
}

export function updateScoreTimer() {
    const timerElement = document.querySelector('#time-past-time');
    let seconds = 0;
    let minutes = 0;
    let hours = 0;
    let time = 0;
    timerElement.innerText = `0 seconden`;
    return setInterval(() => {
        time++;
        score_time = time;
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

export function stopLookTimer(interval) {
    clearInterval(interval);
    var progress = document.querySelector('#time-left-progress');
}

export function updateLookTimer() {
    var progress = document.querySelector('#time-left-progress');
    progress.setAttribute("style", `width: 100%`); // set the progress bar to 100%
    let time = 1; // the elapsed time in seconds
    let start_time = view_time-1; // the start time in seconds, its lower to make the progress bar look better
    let value = start_time; // the current vabarlue of the progress 
    
    return setInterval(() => {
        value = 100 - (time / start_time) * 100; // the value of the progress bar
        time++;
        if( value >= 0 && value <= 100) {
            progress.setAttribute("style", `width: ${value}%`);
        }
    }, 1000);
}

export function cardClickEventHandler(event) {
    const cardContainer = event.currentTarget;
    // If the game has not started yet, start it
    if (!started) {
        startGame();
    }

    const cardStatus = cardContainer.getAttribute('data-card-status');
    if (cardStatus !== 'closed') {
        // If the card is already open or found, do nothing
        return;
    }

    if (selected_card === null) {
        if (open_cards.length > 0) {
            closeOpenCards();
            // setTimeout(() => {
            //     cardContainer.setAttribute('data-card-status', 'open');
            // }, 200);
        }
        // If no card is selected, set the current card as selected
        cardContainer.setAttribute('data-card-status', 'open');
        selected_card = cardContainer;
        open_cards.push(selected_card);
        return;
    }

    cardContainer.setAttribute('data-card-status', 'open');

    const selectedCardId = selected_card.getAttribute('data-card-imgurl');
    const currentCardId = cardContainer.getAttribute('data-card-imgurl');
    if (selectedCardId === currentCardId) {
        setTimeout(() => {
            open_cards.push(cardContainer);
            closeOpenCards(true);
            selected_card = null;
        }, 500);
        foundPair();
    } else {
        // selected_card.setAttribute('data-card-status', 'closed');
        // cardContainer.setAttribute('data-card-status', 'closed');
        open_cards.push(cardContainer);
        look_timer = updateLookTimer();
        selected_card = null;
    }
}

function closeOpenCards(found = false) {
    stopLookTimer(look_timer);
    if (found) {
        open_cards.forEach(function (card) {
            card.setAttribute('data-card-status', 'found');
        });
    } else {
        open_cards.forEach(function (card) {
            card.setAttribute('data-card-status', 'closed');
        });
    }
    open_cards = [];
}

function removeItemOnce(arr, value) {
    var index = arr.indexOf(value);
    if (index > -1) {
        arr.splice(index, 1);
    }
    return arr;
}

function removeItemAll(arr, value) {
    var i = 0;
    while (i < arr.length) {
        if (arr[i] === value) {
        arr.splice(i, 1);
        } else {
        ++i;
        }
    }
    return arr;
}