import { cardClickEventHandler, setSelectedCard, getCardContainers, setCardContainers } from './game.js';
import { Card } from './card.js';

export async function createMemoryCards(urls: string[]): Promise<void> {
    setSelectedCard(null);
    const board = document.querySelector('#game-board') as HTMLElement;
    board.innerHTML = '';

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

    setCardContainers([]);

    cards.forEach(function (url: string, index: number) {
        const card = new Card(url, index.toString());
        card.addEventListener('click', cardClickEventHandler);
        card.addEventListener('mouseover', function () {
            card.element.classList.add('card-hover');
        });
        board.appendChild(card.element);
    });
}
