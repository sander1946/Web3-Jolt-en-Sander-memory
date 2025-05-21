// configuration
var view_time: number = 30; // this is the time in seconds, this will be the max time to view the cards

// score variables, these are used to calculate/show the score
var score: number = 0; // this is the score
var score_time: number = 0; // this is the time in seconds that has passed
var look_time: number = 0; // this is the time in seconds that is left when viewing a card
var pares_found: number = 0; // this is the number of pairs found

// game variables, these are used to control the game
var started: boolean = false; // this is a boolean that tells if the game has started
var selected_card: HTMLElement | null = null; // this is an div element
var look_timer: NodeJS.Timeout | null = null; // this is an interval
var score_timer: NodeJS.Timeout | null = null; // this is an interval

var open_cards: HTMLElement[] = []; // this is an array that contains intervals of the open cards
var card_containers: HTMLElement[] = []; // this is an array that contains the cards, these are the final shuffeld cards that will be shown on the board

var open_cards: HTMLElement[] = []; // this is an array that contains the open cards, these are the cards that are currently open

export function getSelectedCard(): HTMLElement | null {
    return selected_card;
}

export function setSelectedCard(card: HTMLElement | null): void {
    selected_card = card;
}

export function getCardContainers(): HTMLElement[] {
    return card_containers;
}

export function setCardContainers(containers: HTMLElement[]): void {
    card_containers = containers;
}

export function startGame(): void {
    started = true;
    selected_card = null;
    open_cards = [];
    score = 0;
    look_time = 0;
    score_time = 0;
    pares_found = 0;
    score_timer = updateScoreTimer();
    // look_timer = updateLookTimer();
}

export function stopGame(): void {
    started = false;
    stopLookTimer(look_timer);
    if (score_timer !== null) {
        clearInterval(score_timer);
    }
}

export function foundPair(): void {
    pares_found++;
    score += 10;
    const pairs_counter: HTMLElement | null = document.querySelector('#pairs-count');
    if (pairs_counter === null) {
        console.error('Pairs counter element not found');
        return;
    }
    pairs_counter.innerText = `${pares_found}`;
    if (pares_found >= card_containers.length / 2) {
        // TODO: show a better message/popup
        stopGame();
        console.log('You found all pairs!');
        alert('You found all pairs! Your score is: ' + score);
    }
}

export function updateScoreTimer(): NodeJS.Timeout {
    const timerElement: HTMLElement | null = document.querySelector('#time-past-time');
    let seconds: number | string = 0;
    let minutes: number | string = 0;
    let hours: number | string = 0;
    let time: number = 0;
    if (timerElement === null) {
        console.error('Timer element not found');
        return setInterval(() => { }, 1000);
    }
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

export function stopLookTimer(interval: NodeJS.Timeout | null): void {
    if (interval !== null) {
        clearInterval(interval);;
    }
}

export function updateLookTimer(): NodeJS.Timeout {
    var progress: HTMLElement | null = document.querySelector('#time-left-progress');
    if (progress === null) {
        console.error('Progress element not found');
        return setInterval(() => { }, 1000);
    }
    progress.setAttribute("style", `width: 100%`); // set the progress bar to 100%
    let time: number = 1; // the elapsed time in seconds
    let start_time: number = view_time - 1; // the start time in seconds, its lower to make the progress bar look better
    let value: number = start_time; // the current vabarlue of the progress 

    return setInterval(() => {
        value = 100 - (time / start_time) * 100; // the value of the progress bar
        time++;
        if (value >= 0 && value <= 100) {
            if (progress !== null) {
                progress.setAttribute('style', `width: ${value}%`);
            }
        }
    }, 1000);
}

export function cardClickEventHandler(event: Event): void {
    const cardContainer = event.currentTarget as HTMLElement;
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

function closeOpenCards(found: boolean = false): void {
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

function removeItemOnce(arr: any[], value: any): any[] {
    var index = arr.indexOf(value);
    if (index > -1) {
        arr.splice(index, 1);
    }
    return arr;
}

function removeItemAll(arr: any[], value: any): any[] {
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