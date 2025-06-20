import { Card, Status } from './card.js';
import { Board } from './board.js';
import { getImageUrls } from './memory.js';
import { API } from './api.js';
import { showPopup } from './main.js';

export class Game {
    // game variables
    board: Board;
    started: boolean = false;
    view_timer: NodeJS.Timeout | null = null;
    elapsed_timer: NodeJS.Timeout | null = null;
    open_cards: Card[] = [];

    // score variables
    score: number = 0;
    pares_found: number = 0;
    elapsed_time: number = 0;

    // config variables
    public static view_time: number = 5; // this is the time in seconds, this will be the max time to view the cards

    public static selected_card: Card | null = null;

    constructor() {
        let div = document.querySelector('#game-board');
        if (div) {
            div.innerHTML = '';
        } else {
            div = document.createElement('div') as HTMLElement;
            div.id = 'game-board';
            div.classList.add('game-board');
        }
        this.board = new Board(div as HTMLElement);
    }

    // This function is used to setup the game, it will load the images from the provider and create the memory cards
    setupGame(numberOfPares: number):void {
        getImageUrls(numberOfPares).then((urls: string[]) => {
            this.createMemoryCards(urls);
        });
    }

    // This function is used to restart the game, it will load the images from the provider and create the memory cards
    // it will also reset the score and the timer
    restartGame(numberOfPares: number): void {
        // reset the game
        this.setupGame(numberOfPares);
        this.started = false;
        Game.selected_card = null;
        this.open_cards = [];
        this.stopElapsedTimer();
        this.resetViewTimer();
        const pairs_counter: HTMLElement | null = document.querySelector('#pairs-count');

        // reset the score and the timer
        this.score = 0;
        this.pares_found = 0;
        this.elapsed_time = 0;
    }

    startGame(): void {
        this.started = true;
        this.startElapsedTimer();
    }

    stopGame(): void {
        this.started = false;
        this.stopElapsedTimer();
        this.stopViewTimer();
        Game.selected_card = null;
        this.open_cards = [];
    }

    startElapsedTimer(): void {
        const timerElement: HTMLElement | null = document.querySelector('#time-past-time');
        let seconds: number | string = 0;
        let minutes: number | string = 0;
        let hours: number | string = 0;
        this.elapsed_time = 0;
        if (timerElement === null) {
            console.error('Timer element not found');
            return;
        }
        timerElement.innerText = `0 seconden`;
        this.elapsed_timer = setInterval(() => {
            this.elapsed_time++;
            seconds = this.elapsed_time % 60;
            minutes = Math.floor(this.elapsed_time / 60) % 60;
            hours = Math.floor(this.elapsed_time / 3600);
            if (seconds < 10) {
                seconds = '0' + seconds;
            }
            if (minutes < 10) {
                minutes = '0' + minutes;
            }
            if (hours < 10) {
                hours = '0' + hours;
            }
            if (this.elapsed_time >= 3600) {
                // If the time is more than 1 hour, show hours
                timerElement.innerText = `${hours}:${minutes}:${seconds}`;
                return;
            }
            timerElement.innerText = `${minutes}:${seconds}`;

        }, 1000);
    }

    startViewTimer(): void {
        var progress: HTMLElement | null = document.querySelector('#time-left-progress');
        if (progress === null) {
            console.error('Progress element not found');
            return;
        }
        progress.setAttribute("style", `width: 100%`); // set the progress bar to 100%
        let time = 0.1; // the elapsed time in seconds
        let start_time: number = Game.view_time - 0.1; // the start time in seconds, its lower to make the progress bar look better
        let value: number = start_time; // the current vabarlue of the progress 

        this.view_timer = setInterval(() => {
            value = 100 - (time / (start_time * 9)) * 100; // the value of the progress bar
            time++;
            if (value <= 0) {
                value = 0;
            } else if (value >= 100) {
                value = 100;
            }
            if (progress !== null) {
                progress.setAttribute('style', `width: ${value}%`);
            }
        }, 100);
    }

    stopElapsedTimer(): void {
        if (this.elapsed_timer !== null) {
            clearInterval(this.elapsed_timer);
            this.elapsed_timer = null;
        }
    }

    stopViewTimer(): void {
        if (this.view_timer !== null) {
            clearInterval(this.view_timer);
            this.view_timer = null;
        }
    }

    resetViewTimer(): void {
        this.stopViewTimer();
        var progress: HTMLElement | null = document.querySelector('#time-left-progress');
        if (progress === null) {
            console.error('Progress element not found');
            return;
        }
        progress.setAttribute("style", `width: 100%`); // set the progress bar to 100%
    }

    // This function is used to create the memory cards, it will load the images from the provider and create the memory cards
    // it will add the cards to the board
    createMemoryCards(urls: string[]): void {
        this.board.clear();

        const cards_unshuffled: string[] = [];
        for (let i = 0; i < urls.length; i++) {
            const url = urls[i];
            if (typeof url === 'string' && url !== undefined) {
                cards_unshuffled.push(url);
                cards_unshuffled.push(url);
            }
        }

        const cards: string[] = cards_unshuffled
            .map(value => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value);

        cards.forEach( (url: string, index: number) => {
            // create the card
            const card = new Card(url, index.toString());
            card.addEventListener('click', () => {
                this.cardClickEventHandler(card);
            });
            card.addEventListener('mouseover', () => {
                this.cardHoverEventHandler(card);
            }); 

            // pair the card with its pair
            const pairedCard = this.board.getCardByImageUrl(url);
            if (pairedCard !== null) {
                card.setPairedCard(pairedCard);
                pairedCard.setPairedCard(card);
            };

            this.board.addCard(card);
        });
    }

    cardHoverEventHandler(card: Card): void {
        card.element.classList.add('card-hover');
    }

    cardClickEventHandler(card: Card): void {
        if (!this.started) {
            this.startGame();
        }

        if (!card.isClosed()) {
            // TODO: allow selecting of an open card to select it again for the next turn if it is not a pair and there are two cards open
            return;
        }

        if (this.open_cards.length >= 2) {
            // if there are two cards open, close them
            for (const open_card of this.open_cards) {
                open_card.triggerCloseNow();
            }
            this.open_cards = []; // reset the open cards
            this.stopViewTimer();
        }

        // if no card is selected, set the current card as selected
        if (Game.selected_card === null) {
            // If no card is selected, set the current card as selected
            card.open();
            Game.selected_card = card;
            this.open_cards.push(card);
            return;
        }

        // if a card is selected, check if its the paired card
        card.open();
        this.open_cards.push(card);

        // if the selected card is the pair of the current card, set both cards as found
        if (card.isLinked(Game.selected_card)) {
            this.foundCard(card);
            return;
        }

        // if the selected card is not the pair of the current card, close both cards
        this.startViewTimer();
        card.close();
        Game.selected_card.close();
        Game.selected_card = null; // reset the selected card
    }

    foundCard(card: Card): void {
        card.found(); // found handles itself and the paired card
        Game.selected_card = null; // reset the selected card
        this.open_cards = []; // reset the open cards
        this.stopViewTimer();

        this.pares_found++;
        this.score += 10;
        const pairs_counter: HTMLElement | null = document.querySelector('#pairs-count');
        if (pairs_counter === null) {
            console.error('Pairs counter element not found');
            return;
        }
        pairs_counter.innerText = `${this.pares_found}`;
        if (this.pares_found >= this.board.getCards().length / 2) {
            // TODO: show a better message/popup
            this.stopGame();
            console.log('You found all pairs!');
            // Get the modal
            showPopup(`<h2>Game Over</h2>
                <p>You found all pairs!</p>
                <p>Your score is: ${this.score}</p>
                <p>Your time is: ${this.elapsed_time} seconds</p>
                <button id="save-score-button">Save Score</button>
            `);

            // Add event listener to the save score button
            document.getElementById('save-score-button')!.addEventListener('click', async () => {
                const api = new API();
                let player = await api.playerGetPlayerData();
                let preferences = await api.playerGetPreferences();
                if (player !== null) {
                    if (preferences === null) {
                        preferences = { 
                            preferred_api: '', 
                            color_closed: '', 
                            color_found: ''
                        }; // default provider if no preferences are set
                    }
                    api.publicSaveGame({
                        id: player.id,
                        score: this.score,
                        api: preferences.preferred_api,
                        color_closed: preferences.color_closed,
                        color_found: preferences.color_found,
                    });
                }
            });
        }
    }
}