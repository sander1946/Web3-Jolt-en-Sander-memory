import { cardClickEventHandler, setSelectedCard, getCardContainers, setCardContainers } from './game.js';

export async function createMemoryCards(urls) {
    // preparing variables
    setSelectedCard(null);
    const board = document.querySelector('#game-board');

    board.innerHTML = ''; // Clear the board before updating

    var cards_unshuffled = [];
    for (let i = 0; i < urls.length; i++) {
        cards_unshuffled.push(urls[i]);
        cards_unshuffled.push(urls[i]); // Duplicate each image ID for the matching game
    }

    let cards = cards_unshuffled
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value)

    cards.forEach(function (url, index) {
        const cardContainer = document.createElement('div');
        cardContainer.classList.add('card-container');
        cardContainer.setAttribute('data-card-index', index);
        cardContainer.setAttribute('data-card-status', 'closed');
        cardContainer.setAttribute('data-card-imgurl', url);

        const cardInner = document.createElement('div');
        cardInner.classList.add('card-inner');

        const cardFront = document.createElement('div');
        cardFront.classList.add('card-front');
        cardFront.classList.add('card-image');
        cardFront.setAttribute('style', `background-image: var(--card-img-closed-background-img);`);

        const cardBack = document.createElement('div');
        cardBack.classList.add('card-back');
        cardBack.classList.add('card-image');
        cardBack.setAttribute('style', `background-image: url('${url}');`);

        board.appendChild(cardContainer);
        cardContainer.appendChild(cardInner);
        cardInner.appendChild(cardFront);
        cardInner.appendChild(cardBack);

        // Add the card to the array of card containers
        let card_containers = getCardContainers()
        card_containers.push(cardContainer);
        setCardContainers(card_containers);

        cardContainer.addEventListener('click', cardClickEventHandler);

        // TODO: add hover effect in css
        cardContainer.addEventListener('mouseover', function () {
            cardContainer.classList.add('card-hover');
        });
    });
}